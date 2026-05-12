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
    
def liste_Nos_produits():
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                SELECT 
                    p.id, 
                    p.nom, 
                    p.description, 
                    p.prix, 
                    pi.url_image AS img_produits,
                    categories.nom AS categorie
                FROM produits p
                JOIN produit_images pi 
                    ON p.id = pi.id_produit
                JOIN sous_categories  
                    ON p.id_sous_categorie = sous_categories.id
                LEFT JOIN categories 
                    ON sous_categories.id_categorie = categories.id
                WHERE pi.est_principale = 1
                ORDER BY categories.nom ASC, RAND();
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

def liste_recents():
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
        print(f"Erreur lors de la récupération des produits: {e}") 
        return []       

def details_produits(id):
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT p.id, p.nom, p.description, p.prix
                    FROM produits p
                    WHERE p.id = %s
                """, (id,))
                produit = cursor.fetchone()

                if not produit:
                    return None

                cursor.execute("""
                    SELECT url_image, est_principale
                    FROM produit_images
                    WHERE id_produit = %s
                    ORDER BY est_principale DESC
                    LIMIT 4
                """, (id,))
                images = cursor.fetchall()

                return produit, images
    except Exception as e:
        print(f"Erreur details_produits: {e}")
        return None
               
    except Exception as e:
        print(f"erreur get_user_id: {e}")
        return None

def get_user_id(user_id):
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                sql = """
                SELECT id, role, nom, email, nom_roles
                FROM Client 
                JOIN role ON Client.role = role.id
                WHERE Client.id = %s;
                """
                cursor.execute(sql, (user_id,))
                row = cursor.fetchone()
                if row:
                    return User(row[0], row[1], row[2], row[3], row[4])
                return None
    except Exception as e:
        return f"erreur get_user_id: {e}"
    
def get_categories_with_subcategories():
   
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                # Récupérer toutes les catégories parentes (niveau 1)
                cursor.execute("""
                    SELECT 
                        c.id, 
                        c.nom 
                    FROM categories c
                    WHERE 1
                    ORDER BY c.nom ASC
                """)
                categories = cursor.fetchall()
                
                result = []
                
                # Pour chaque catégorie parente, récupérer ses sous-catégories
                for cat in categories:
                    # Accès par index car c'est un tuple
                    # cat[0] = id, cat[1] = nom
                    category_data = {
                        'id': cat[0],      # index 0 pour l'id
                        'nom': cat[1],     # index 1 pour le nom
                        'subcategories': []
                    }
                    
                    # Récupérer les sous-catégories (niveau 2)
                    cursor.execute("""
                        SELECT 
                            sc.id, 
                            sc.nom
                        FROM sous_categories sc
                        WHERE sc.id_categorie = %s 
                    """, (cat[0],))  # Utiliser cat[0] pour l'id
                    
                    subcategories = cursor.fetchall()
                    
                    for subcat in subcategories:
                        subcategory_data = {
                            'id': subcat[0],   # index 0 pour l'id
                            'nom': subcat[1],  # index 1 pour le nom
                        }
                        category_data['subcategories'].append(subcategory_data)
                    
                    # Compter les produits (correction de la ligne qui causait l'erreur)
                    category_data['total_products'] = len(category_data['subcategories'])
                    # Ou si vous avez une fonction pour compter les produits:
                    # category_data['total_products'] = get_products_count_by_category(cat[0])
                    
                    result.append(category_data)
                
                return result
                
    except Exception as e:
        return {
            'success': False,
            'error': f"Erreur lors de la récupération des catégories: {str(e)}"
        }