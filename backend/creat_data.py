from backend.data_base import connexion
from backend.Auth import verifie_mail
import bcrypt


def generer_code_comande():
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                sql = "SELECT id FROM commandes ORDER BY id DESC LIMIT 1"
                cursor.execute(sql)
                result = cursor.fetchone()
                if result:
                    dernier_id = result[0]
                    nouveau_id = f"C{dernier_id + 1:04d}"
                else:
                    nouveau_id = "C0001"
            return nouveau_id
    except Exception as e:
        print(f"Erreur generer_code_comande: {e}")
        return None

def creat_commande(client, adresse, ville, panier, montant_total, frais_livraisons, notes):
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                code_commande = generer_code_comande()

                sql_client = """
                    INSERT INTO Client (role, nom, adresse, telephone,ville)
                    VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(sql_client, (2, client['nom'],client['adresse'],client['tel'],client['ville'],))

                id_client = cursor.lastrowid
                sql_commande = """
                    INSERT INTO commandes (code_commande, id_client, total, statut)
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql_commande, (code_commande, id_client, montant_total, "en_attente"))
                id_commande = cursor.lastrowid

                sql_ligne = """
                    INSERT INTO ligne_commandes (id_commande, id_produit, prix_unitaire, quantite)
                    VALUES (%s, %s, %s, %s)
                """
                sql_stock = """
                    UPDATE produits SET stock = stock - %s WHERE id = %s AND stock >= %s
                """
                for item in panier:
                    cursor.execute(sql_ligne, (id_commande, item["id_produit"], item["prix"], item["quantite"]))
                    cursor.execute(sql_stock, (item["quantite"], item["id_produit"], item["quantite"]))
                   
                sql_livraison = """
                    INSERT INTO livraisons (id_commande, adresse, commune,quartier,frais_livraison,notes, statut)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(sql_livraison, (id_commande, adresse, ville, client['quartier'], frais_livraisons, notes, "en_preparation"))

            conn.commit()
            return True

    except Exception as e:
        print(f"Erreur creat_commande: {e}")
        return False
  
def create_client(role, nom, adress, telephone, password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                sql_client = """
                    INSERT INTO Client (role, nom, email,telephone, estconnecter, mot_pass)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """
                nouveau_mail=verifie_mail(adress)
                print(nouveau_mail)
                if nouveau_mail is False:
                    return f"Desole, un compte exixte deja avec se Email"
                else:
                    cursor.execute(sql_client, (role, nom, adress, telephone, 0, hashed_password))
                    
            conn.commit()
            return True
    except Exception as e:
        print(f"Erreur create_client: {e}")
        return False  
    
def estactif(actif):
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                sql_actif = """
                    UPDATE Client SET estconnecter =%s
                     WHERE 1
                """
                cursor.execute(sql_actif, (actif))
            conn.commit()
            return True 
    except Exception as e:
        print(f"Erreur create_client: {e}")
        return False  