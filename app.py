from dotenv import load_dotenv
from backend.read_data import details_produits,liste_produits,liste_banners,liste_produits_une,liste_Nouveaute
import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
from flask_cors import CORS
from flask_login import current_user,LoginManager,login_user
from backend.Models import User
from datetime import timedelta,datetime
import random
load_dotenv()

app = Flask(__name__, template_folder="template")
CORS(app)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

app.permanent_session_lifetime= timedelta(minutes=5)

# login_manager = LoginManager()
# login_manager.init_app(app)
# login_manager.login_view = "login"

# @login_manager.user_loader
# def load_user(id_user):
#     user = get_user_id(int(id_user))
#     return user

# @app.before_request
# def restriction():
#     tab_route = ["home","formcommande","login","login_maquis","api_commandes","livreur","static", "adminHome", "adminPayment"] 
#     if not (current_user.is_authenticated or session.get('connecter')) and request.endpoint not in tab_route:
#         return redirect(url_for("login"))

@app.route('/')
def index():
    """Page d'accueil"""
    return render_template('index.html')

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
                "img":i[3],
            }
            table.append(information)
    return jsonify({"data":table})

@app.route('/produits')
def produits():
    return render_template('produits_list.html')

@app.route('/detail_produit/<id_produits>')
def produits_details(id_produits):
    data=details_produits(id_produits)
    table=[]
    if data:
        for i in data:
            information={
                "id_produits":i[0],
                "nom_produits":i[0],
                "prix_produits":i[0],
                "descriptin_produits":i[0],
                "pourcentage_produits":i[0],
                "pourcentage_produits":i[0],
                "img_produits":i[0],
            }
            table.append(information)
    
    return jsonify({"data":table})



@app.route('/produit/<int:product_id>')
def product(product_id):
    """Page détail d'un produit"""
 

@app.route('/categories')
def categories():
    """Page des catégories"""

@app.route('/categorie/<slug>')
def categorie(slug):
   return 0
@app.route('/marques')
def marques():
    """Page des marques"""
    return render_template('')

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    return 0

@app.route('/api/search', methods=['GET'])
def search():
    """API pour rechercher des produits"""
    return 0

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(error):
    return render_template('500.html'), 500
if __name__ == "__main__":
    app.run(port=5000,debug=True)
