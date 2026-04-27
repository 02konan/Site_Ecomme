from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv
from config import config

# Charger les variables d'environnement depuis .env
load_dotenv()

# Créer l'application Flask
app = Flask(__name__, 
    template_folder='template',
    static_folder='static',
    static_url_path='/static')

# Charger la configuration selon l'environnement
env = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config.get(env, config['default']))

# Mock data for products
PRODUCTS = [
    {
        'id': 1,
        'name': 'Drone Professionnel',
        'category': 'Drones',
        'price': 1200.00,
        'image': '/static/back/product1.jpg',
        'description': 'Drone haute performance pour la capture aérienne'
    },
    {
        'id': 2,
        'name': 'Appareil Photo Mirrorless',
        'category': 'Appareil photo',
        'price': 2500.00,
        'image': '/static/back/product2.jpg',
        'description': 'Captez des moments inoubliables'
    },
    {
        'id': 3,
        'name': 'Caméra 4K',
        'category': 'Caméra',
        'price': 1800.00,
        'image': '/static/back/product3.jpg',
        'description': 'Enregistrement vidéo en ultra haute définition'
    },
    {
        'id': 4,
        'name': 'Trépied Professionnel',
        'category': 'Trépieds',
        'price': 350.00,
        'image': '/satic/back/product4.jpg',
        'description': 'Support stable pour vos appareils'
    },
    {
        'id': 5,
        'name': 'PC Gaming High-End',
        'category': 'PC',
        'price': 3500.00,
        'image': '/satic/back/product5.jpg',
        'description': 'Performance maximale pour le gaming et la création'
    },
    {
        'id': 6,
        'name': 'Moniteur 4K',
        'category': 'Moniteurs',
        'price': 800.00,
        'image': '/satic/back/product6.jpg',
        'description': 'Affichage cristallin en haute résolution'
    },
    {
        'id': 7,
        'name': 'Casque Wireless',
        'category': 'Casques',
        'price': 450.00,
        'image': '/satic/back/product7.jpg',
        'description': 'Audio immersif sans fil'
    },
    {
        'id': 8,
        'name': 'TV Smart 65 pouces',
        'category': 'TV',
        'price': 2000.00,
        'image': '/satic/back/product8.jpg',
        'description': 'Télévision connectée avec technologie avancée'
    }
]

CATEGORIES = [
    {'id': 1, 'name': 'Appareil photo', 'slug': 'appareil-photo'},
    {'id': 2, 'name': 'Caméra', 'slug': 'camera'},
    {'id': 3, 'name': 'Trépieds', 'slug': 'trepied'},
    {'id': 4, 'name': 'Drones', 'slug': 'drones'},
    {'id': 5, 'name': 'PC', 'slug': 'pc'},
    {'id': 6, 'name': 'Moniteurs', 'slug': 'moniteurs'},
    {'id': 7, 'name': 'Casques', 'slug': 'casques'},
    {'id': 8, 'name': 'TV', 'slug': 'tv'}
]

# Routes
@app.route('/')
def index():
    """Page d'accueil"""
    featured_products = PRODUCTS[:4]
    return render_template('index.html', featured_products=featured_products)

@app.route('/produits')
def produits():
    """Page listing des produits"""
    page = request.args.get('page', 1, type=int)
    category = request.args.get('category', None)
    
    filtered_products = PRODUCTS
    if category:
        filtered_products = [p for p in PRODUCTS if p['category'].lower() == category.lower()]
    
    return render_template('produits_list.html', 
                         products=filtered_products,
                         categories=CATEGORIES,
                         current_category=category)

@app.route('/produit/<int:product_id>')
def product(product_id):
    """Page détail d'un produit"""
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    
    if not product:
        return render_template('404.html'), 404
    
    related_products = [p for p in PRODUCTS if p['category'] == product['category'] and p['id'] != product_id][:3]
    
    return render_template('product_detail.html', 
                         product=product,
                         related_products=related_products)

@app.route('/categories')
def categories():
    """Page des catégories"""
    return render_template('categorie_list.html', categories=CATEGORIES)

@app.route('/categorie/<slug>')
def categorie(slug):
    """Page produits par catégorie"""
    category = next((c for c in CATEGORIES if c['slug'] == slug), None)
    
    if not category:
        return render_template('404.html'), 404
    
    products = [p for p in PRODUCTS if p['category'].lower() == category['name'].lower()]
    
    return render_template('produits_list.html',
                         products=products,
                         categories=CATEGORIES,
                         current_category=category['name'])

@app.route('/marques')
def marques():
    """Page des marques"""
    return render_template('marques.html')

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    """API pour ajouter au panier"""
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    
    if not product:
        return jsonify({'error': 'Produit non trouvé'}), 404
    
    return jsonify({
        'success': True,
        'message': f'{product["name"]} ajouté au panier',
        'product': product,
        'quantity': quantity
    })

@app.route('/api/search', methods=['GET'])
def search():
    """API pour rechercher des produits"""
    query = request.args.get('q', '').lower()
    
    results = [p for p in PRODUCTS if query in p['name'].lower() or query in p['description'].lower()]
    
    return jsonify({
        'results': results,
        'count': len(results)
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    env_mode = os.environ.get('FLASK_ENV', 'development')
    print(f"Application démarrée en mode: {env_mode.upper()}")
    print(f"URL: http://localhost:5000")
    print(f"Debug: {app.config['DEBUG']}")
    app.run(debug=app.config['DEBUG'], host='localhost', port=5000)
