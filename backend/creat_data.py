from backend.data_base import connexion
import bcrypt

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