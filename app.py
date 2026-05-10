from dotenv import load_dotenv
from backend.creat_data import create_client
from backend.Auth import Authentification
from backend.read_data import get_user_id,details_produits,liste_produits,liste_banners,liste_produits_une,liste_Nouveaute,get_categories_with_subcategories
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

app.permanent_session_lifetime= timedelta(minutes=5)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "auth"

@login_manager.user_loader
def load_user(id_user):
    user = get_user_id(int(id_user))
    return user

@app.before_request
def restriction():
    tab_route = [ "login", "auth", "register", "index", "menu", "produits_list", "produit_une", "produits_produit_nouveaute", "banner","static"] 
    if not (current_user.is_authenticated or session.get('connecter')) and request.endpoint not in tab_route:
        return redirect(url_for("auth"))
    
@app.route('/authentification', methods=['GET'])
def auth():
    prefill_email = session.pop('prefill_email', None)  # ← pop = supprime après lecture
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

        if result:
                session['prefill_email'] = email
                session['prefill_pwd']   = password
                return jsonify({"success": True})
        else:
            return jsonify({"success": False, "error": "Erreur lors de la création du compte"}), 500
        
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
        if result:
            session['user_id']    = result['id']
            session['user_nom']   = result['nom']
            session['user_email'] = result['email']
            session['user_role']  = result['nom_roles']
        else:
            return jsonify({"success": False, "error": "Email ou mot de passe incorrect"}), 401

        return jsonify({"success": True})

    except Exception as e:
        print(f"Erreur login: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/')
def index():
    """Page d'accueil"""
    return render_template('index.html')

@app.route('/menu')
def menu():
    data = get_categories_with_subcategories()
    # Vérifier si c'est une erreur
    if isinstance(data, dict) and not data.get('success', True):
        return jsonify({"error": data.get('error', 'Erreur inconnue')}), 500
    
    # Si data est une liste (cas de succès)
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
    
    # Si le format est différent
    return jsonify({"error": "Format de données inattendu"}), 500

@app.route('/produit/list')
def produits_list():
    data=liste_produits()
    table=[]
    if data:
        for i in data:
            information={
                "id_produits":i[0],
                "nom_produits":i[1],
                "descriptin_produits":i[2],
                "prix_produits":i[3],
                "img_produits": i[4]
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
                "img_produits": i[4]
            }
            table.append(information)
    return jsonify({"data":table})

@app.route('/produit_nouveaute/list')
def produits_produit_nouveaute():
    data=liste_Nouveaute()
    table=[]
    if data:
        for i in data:
            information={
                "id_produits":i[0],
                "nom_produits":i[1],
                "descriptin_produits":i[2],
                "prix_produits":i[3],
                "img_produits": i[4]
            }
            table.append(information)
    return jsonify({"data":table})
  
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

@app.route('/produits')
def produits():
    return render_template('produits_list.html')

@app.route('/detail_produit/<int:id_produits>')
def produits_details(id_produits):
    data = details_produits(id_produits)

    if not data:
        return jsonify({"error": "Produit introuvable"}), 404

    produit, images = data


    img_principale = None
    img_secondaires = []

    for img in images:
        if img[1] == 1 and img_principale is None:
            img_principale = img[0]
        else:
            img_secondaires.append(img[0])

    information = {
        "id":            produit[0],
        "nom":           produit[1],
        "description":   produit[2],
        "prix":          produit[3],
        "img_principale": img_principale,
        "img_secondaires": img_secondaires[:3]  # max 3 images secondaires
    }

    return jsonify({"data": information})



@app.route('/produit/<int:product_id>')
def product(product_id):
    """Page détail d'un produit"""
    return render_template('product_detail.html')
 

@app.route('/categories')
def categories():
    """Page des catégories"""



@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    return 0

@app.route('/api/search', methods=['GET'])
def search():
    """API pour rechercher des produits"""
    return 0



@app.route('/logout', methods=['GET'])
def logout():
    """Déconnexion de l'utilisateur"""
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
    app.run(port=5000,debug=True)
