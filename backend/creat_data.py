from backend.data_base import connexion
import bcrypt
def generer_c_commande():
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
        print(f"Erreur generer_c_commande: {e}")
        return None

def creat_commande(id_client, adresse, ville, id_produit, prix, quantite):  # ← sans accent
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                code_commande = generer_c_commande()
                montant_total = float(prix) * int(quantite)  # ← cast pour éviter les erreurs de type

                # Commande principale
                sql_commande = """
                    INSERT INTO commandes (code_commande, id_client, total, statut)
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql_commande, (code_commande, id_client, montant_total, "en_attente"))
                id_commande = cursor.lastrowid

                # Ligne commande
                sql_ligne = """
                    INSERT INTO ligne_commandes (id_commande, id_produit, prix_unitaire, quantite)
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql_ligne, (id_commande, id_produit, float(prix), int(quantite)))

                # Livraison
                sql_livraison = """
                    INSERT INTO livraisons (id_commande, adresse, commune, statut)
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql_livraison, (id_commande, adresse, ville, "en_preparation"))

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
                    INSERT INTO Client (role, nom, adresse, telephone, estconnecter, mot_pass)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """
                cursor.execute(sql_client, (role, nom, adress, telephone, 0, hashed_password))
            conn.commit()
            return True  # ← retourne True si succès
    except Exception as e:
        print(f"Erreur create_client: {e}")
        return False  # ← retourne False si échec
    
def update_commande(id_commande, status, id_utilisateur, active):
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                if active=="1":
                   sql_active = "UPDATE `commandes` SET `Active` = %s,`statut` = %s, `date_modification` = NOW() WHERE `id` = %s"
                   updatecommande=cursor.execute(sql_active, (int(active), f"Annuler",id_commande))
                else:
                    sql_statut = "UPDATE `commandes` SET `statut` = %s,`date_modification` = NOW() WHERE `id` = %s"
                    updatecommande=cursor.execute(sql_statut, (status,id_commande))
                    
                    if(updatecommande and status=="livree" ):
                        sql_valider = "INSERT INTO valider(`id_commande`, `id_utilisateur`) VALUES(%s, %s)"
                        cursor.execute(sql_valider, (id_commande,id_utilisateur))

            conn.commit()
            return {"success": True}
    except Exception as e:
        error_message = str(e)
        return {"success": False, "error": error_message}