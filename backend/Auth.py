import bcrypt
from backend.data_base import connexion

def verifier_password(password, hash_bdd):
    password_bytes = password.encode('utf-8')
    hash_bytes = hash_bdd.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hash_bytes)

def verifie_mail(BD_mail):
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                sql = "SELECT adresse FROM Client WHERE adresse=%s"
                cursor.execute(sql,BD_mail)
                result = cursor.fetchone()
                existe_mail=result[0]
                if existe_mail:
                    return False
            return True        
               
    except Exception as e:
        print(f"Erreur : {e}")
        return None

def Authentification(email, pwd):
    try:
        with connexion() as conn:
            with conn.cursor() as cursor:
                sql = """
                SELECT Client.id, role, nom, adresse, telephone,mot_pass
                FROM Client
                JOIN role ON Client.role = role.id
                WHERE adresse = %s
                """
                cursor.execute(sql, (email,))
                row = cursor.fetchone()

                if not row:
                    return False 

                if not verifier_password(pwd, row[5]):
                    return False  

                return {
                    "id":       row[0],
                    "id_role":  row[1],
                    "nom":      row[2],
                    "email":    row[3],
                    "tel":      row[4],
                    "nom_roles": row[5]
                }

    except Exception as e:
        print(f"Erreur Authentification: {e}")
        return None
