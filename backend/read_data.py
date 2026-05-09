from backend.data_base import connexion
from backend.Models import User

def liste_produits():
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                SELECT p.id, p.nom, p.description, p.prix, pi.url_image AS img_produits
                FROM produits p
                LEFT JOIN produit_images pi on p.id = pi.id_produit
                WHERE pi.est_principale = 1
                ORDER BY RAND();
                               """)
                commandes = cursor.fetchall()
                return commandes
    except Exception as e:
        return (f"Erreur lors de la récupération des produits: {e}") 
    
def liste_produits_une():
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                SELECT p.id, p.nom, p.description, p.prix, pi.url_image AS img_produits
                FROM produits p
                LEFT JOIN produit_images pi on p.id = pi.id_produit
                WHERE pi.est_principale = 1
                ORDER BY RAND();
                               """)
                commandes = cursor.fetchall()
                return commandes
    except Exception as e:
        return (f"Erreur lors de la récupération des produits: {e}")       

def liste_Nouveaute():
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                SELECT p.id, p.nom, p.description, p.prix, pi.url_image AS img_produits
                FROM produits p
                LEFT JOIN produit_images pi on p.id = pi.id_produit
                WHERE pi.est_principale = 1
                ORDER BY p.id DESC;
                               """)
                commandes = cursor.fetchall()
                return commandes
    except Exception as e:
        return (f"Erreur lors de la récupération des produits: {e}")       
 
def liste_banners():
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                SELECT id, titre, description, image
                FROM bannieres
                WHERE active = 1
                AND type = 'banner'
                ORDER BY id DESC;
                               """)
                banners = cursor.fetchall()
                return banners
    except Exception as e:
        return (f"Erreur lors de la récupération des produits: {e}")        

def details_produits(id):
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                sql = """
                SELECT p.id, p.nom, p.description, p.prix, pi.url_image AS img_produits
                FROM produits p
                LEFT JOIN produit_images pi on p.id = pi.id_produit
                WHERE p.id =%s
                ORDER BY p.id DESC;
                """
                cursor.execute(sql, (id,))
                row = cursor.fetchall()
            return row    
               
    except Exception as e:
        return f"erreur get_user_id: {e}"

def get_user_id(user_id):
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                sql = """
                SELECT utilisateurs.id, id_role, nom, email, nom_roles
                FROM utilisateurs 
                JOIN role ON utilisateurs.id_role = role.id
                WHERE utilisateurs.id = %s;
                """
                cursor.execute(sql, (user_id,))
                row = cursor.fetchone()
                if row:
                    return User(row[0], row[1], row[2], row[3], row[4])
                return None
    except Exception as e:
        return f"erreur get_user_id: {e}"

    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                sql="""
                 SELECT 
                commandes.id AS id_commande,
                produits.nom AS nom_produit,
                300 * ligne_commandes.quantite AS commission,
                commandes.date_commande,
                ligne_commandes.quantite
            FROM 
                commandes 
            JOIN 
                ligne_commandes ON commandes.id = ligne_commandes.id_commande 
            JOIN 
                produits ON ligne_commandes.id_produit = produits.id
            JOIN 
                maquis ON commandes.code = maquis.code
            WHERE 
                maquis.code = %s
            ORDER BY 
                commandes.date_commande DESC
                """
                
                cursor.execute(sql, (maquis_id,))
                rows = cursor.fetchall()
        return rows
        
    except Exception as e:
        return (f"Erreur lors de la lecture des commissions: {e}")