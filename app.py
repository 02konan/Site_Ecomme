from dotenv import load_dotenv
from backend.creat_data import create_client,creat_commande
from backend.Auth import Authentification
from backend.MessageApi import Message
from backend.read_data import get_search_results, get_user_id,liste_Nos_produits,details_produits, liste_alaune,liste_produits,liste_produits_categorie,liste_banners,liste_recents,liste_produits_une,liste_Nouveaute,get_categories_with_subcategories
import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
from flask_cors import CORS
from flask_login import current_user,LoginManager,login_user
from backend.Models import User
from datetime import timedelta,datetime
import random
load_dotenv()

app = Flask(__name__, template_folder="template", static_folder="static")
CORS(app)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

app.permanent_session_lifetime= timedelta(minutes=30)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "auth"

@login_manager.user_loader
def load_user(id_user):
    user = get_user_id(int(id_user))
    return user

@app.before_request
def restriction():
    tab_route = [ 
                 "login", 
                 "auth",
                 "search", 
                 "register", 
                 "commande", 
                 "index", 
                 "menu", 
                 "produits_list",
                 "verifcation_auth", 
                 "produit_une",
                 "product",
                 "produits",
                 "nos_produits",
                 "produits_details", 
                 "produit_recents", 
                 "produits_nouveaute", 
                 "banner",
                 "banners_alaune",
                 "categorie_produits",
                 "categorie",
                 "https://divix.alwaysdata.net/uploads/produits/",
                 "https://divix.alwaysdata.net/uploads/bannieres/",
                 "static"   
                ] 
    if not (current_user.is_authenticated or session.get('connecter')) and request.endpoint not in tab_route:
        return redirect(url_for("auth"))
    
#-----------------INDEX---------------------
@app.route('/')
def index():
    return render_template('index.html')

#-----------------AUTHENTIFICATION---------------------
@app.route('/authentification/verifier')
def verifcation_auth():
    if 'user_id' in session:
        return jsonify({"connected": True,
                        "user": {
                            "id": session['user_id'],
                            "nom": session['user_nom'],
                            "email": session['user_email'],
                            "tel": session['user_tel'],
                            "role": session['user_role']
                        }})
    return jsonify({"connected": False})
    
@app.route('/authentification', methods=['GET'])
def auth():
    prefill_email = session.pop('prefill_email', None)  
    prefill_pwd   = session.pop('prefill_pwd', None)
    return render_template('auth_forms.html', prefill_email=prefill_email, prefill_pwd=prefill_pwd)

@app.route('/auth/register', methods=['POST'])
def register():
    try:
        data     = request.get_json()
        nom      = data.get('nom')
        email    = data.get('email')
        tel      = data.get('tel')
        password = data.get('password')

        if not all([nom, email, tel, password]):
            return jsonify({"success": False, "error": "Champs manquants"}), 400
        
        result = create_client(2, nom, email, tel, password)

        if result is True:
                session['prefill_email'] = email
                session['prefill_pwd']   = password
                return jsonify({"success": True})
        else:
            return jsonify({"success": False, "error": str(result) or "Erreur lors de la création du compte"}), 500
        
    except Exception as e:
        print(f"Erreur register: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data     = request.get_json()
        email    = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({"success": False, "error": "Champs manquants"}), 400

        result = Authentification(email, password)
        
        if result :
            session['user_id']    = result['id']
            session['user_nom']   = result['nom']
            session['user_email'] = result['email']
            session['user_tel']   = result['tel']
            session['user_role']  = result['nom_roles']
        else:
            return jsonify({"success": False, "error": "Email ou mot de passe incorrect"}), 401

        return jsonify({"success": True})

    except Exception as e:
        print(f"Erreur login: {e}")
        return jsonify({"success": False, "error": str(e)}), 500 

@app.route('/menu')
def menu():
    data = get_categories_with_subcategories()
    if isinstance(data, dict) and not data.get('success', True):
        return jsonify({"error": data.get('error', 'Erreur inconnue')}), 500
    
    if isinstance(data, list):
        table = []
        for category in data:
            information = {
                "id": category['id'],
                "nom": category['nom'],
                "subcategories": category['subcategories']
            }
            table.append(information)
        return jsonify({"data": table, "success": True})
    
    return jsonify({"error": "Format de données inattendu"}), 500

@app.route('/banner/list')
def banner():
    data=liste_banners()
    table=[]
    if data:
        for i in data:
            information={
                "id":i[0],
                "titre":i[1],
                "description":i[2],
                "img":i[3]
            }
            table.append(information)
    return jsonify({"data":table})

@app.route('/api/alaune/')
def banners_alaune():
    data = liste_alaune()
    produits = {}

    for row in data:
        pid = row[0]
        if pid not in produits:
            produits[pid] = {
                "id":          row[0],
                "titre":       row[1],
                "description": row[2],
                "images":      []
            }
        if row[3]:  # url_image peut être NULL (LEFT JOIN)
            produits[pid]["images"].append(row[3])

    return jsonify({"data": list(produits.values())})
#-----------------PRODUITS---------------------
@app.route('/produits')
def produits():
    return render_template('produits_list.html')

@app.route('/nos_produits')
def nos_produits():
    data=liste_produits()
    table=[]
    if data:
            for i in data:
                information={
                "id_produits":i[0],
                "nom_produits":i[1],
                "descriptin_produits":i[2],
                "prix_produits":i[3],
                "img_produits": i[4],
                "reduction": i[5],
                "type": i[6]
                }
                table.append(information)
            
            
    return jsonify({"data":table})

@app.route('/produit/list')
def produits_list():
    data=liste_Nos_produits()
    table=[]
    if data:
        for i in data:
            information={
                "id_produits":i[0],
                "nom_produits":i[1],
                "descriptin_produits":i[2],
                "prix_produits":i[3],
                "img_produits": i[4],
                "categories": i[5],
                "id_categorie": i[6],
                "reduction": i[7],
                "type": i[8],
            }
            table.append(information)
            
            
    return jsonify({"data":table})

@app.route('/produit_une/list')
def produit_une():
    data=liste_produits_une()
    table=[]
    if data:
        for i in data:
            information={
                "id_produits":i[0],
                "nom_produits":i[1],
                "descriptin_produits":i[2],
                "prix_produits":i[3],
                "img_produits": i[4],
                "reduction": i[5],
                "type": i[6]
            }
            table.append(information)
    return jsonify({"data":table})

@app.route('/produit_nouveaute/list')
def produits_nouveaute():
    data=liste_Nouveaute()
    table=[]
    if data:
        for i in data:
            information={
                "id_produits":i[0],
                "nom_produits":i[1],
                "descriptin_produits":i[2],
                "prix_produits":i[3],
                "img_produits": i[4],
                "reduction": i[5],
                "type": i[6]
            }
            table.append(information)
    return jsonify({"data":table})

@app.route('/produit_recents/list')
def produit_recents():
    data=liste_recents()
    table=[]
    if data:
        for i in data:
            information={
                "id_produits":i[0],
                "nom_produits":i[1],
                "descriptin_produits":i[2],
                "prix_produits":i[3],
                "img_produits": i[4],
                "reduction": i[5],
                "type": i[6]
            }
            table.append(information)
    return jsonify({"data":table})

@app.route('/detail_produit/<int:id_produits>')
def produits_details(id_produits):
    data = details_produits(id_produits)

    if not data:
        return jsonify({"error": "Produit introuvable"}), 404

    produit, caracteristiques, images = data

    img_principale = None
    img_secondaires = []

    for img in images:
        if img[1] == 1 and img_principale is None:
            img_principale = img[0]
        else:
            img_secondaires.append(img[0])

    information = {
        "id":          produit[0],
        "nom":         produit[1],
        "description": produit[2],
        "prix":        str(produit[3]),
        "caracteristiques": [
            {"label": c[0], "valeur": c[1]} for c in caracteristiques
        ],
        "img_principale":  img_principale,
        "img_secondaires": img_secondaires[:3]
    }

    return jsonify({"data": information})
@app.route('/produit/<int:product_id>')
def product(product_id):
    """Page détail d'un produit"""
    return render_template('product_detail.html')

#-----------------COMMANDE---------------------
@app.route('/commande/create', methods=['POST']) 
def commande():
    try:
        data      = request.get_json()
        # id_client = session.get("user_id")
        client    = data.get("client")
        panier    = data.get("panier")
        frais     = data.get("frais_livraison")
        total     = data.get("total")
        # if not id_client:
        #     return jsonify({"success": False, "error": "Non connecté"}), 401

        if not panier:
            return jsonify({"success": False, "error": "Panier vide"}), 400

       
        creat_commande(
                client,
                panier,
                frais
            )
        return jsonify({"success": True})

    except Exception as e:
        print(f"Erreur commande/create: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/categorie_produits/<int:id_categorie>')
def categorie_produits(id_categorie):
    try:
        data = liste_produits_categorie(id_categorie)
        table = []
        if data:
            for i in data:
                table.append({
                    "id_produits":          i[0],
                    "nom_produits":         i[1],
                    "description_produits": i[2],  
                    "prix_produits":        i[3],
                    "img_produits":         i[4],
                    "sous_categorie":       i[5],
                    "reduction":            i[6],
                    "type":                 i[7]
                })
        return jsonify({"data": table})  
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/categorie/<int:id_categorie>')
def categorie(id_categorie):
    return render_template("categorie_list.html")
    

@app.route('/api/search', methods=['GET'])
def search():
    data=get_search_results(request.args.get('query', ''))
    table=[]
    if data:
            for i in data:
                information={
                "id_produits":i[0],
                "nom_produits":i[1],
                "descriptin_produits":i[2],
                "prix_produits":i[3],
                "img_produits": i[4],
                "reduction": i[5],
                "type": i[6]
                }
                table.append(information)
    return jsonify({"data": table})

@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return render_template('auth_forms.html')

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(error):
    return render_template('500.html'), 500
if __name__ == "__main__":
    app.run(port=5000,debug=False)
