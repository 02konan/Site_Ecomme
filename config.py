import os

class Config:
    """Configuration de base"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = False
    TESTING = False
    
class DevelopmentConfig(Config):
    """Configuration développement"""
    DEBUG = True
    FLASK_ENV = 'development'
    
class ProductionConfig(Config):
    """Configuration production"""
    DEBUG = False
    FLASK_ENV = 'production'
    
class TestingConfig(Config):
    """Configuration test"""
    TESTING = True
    DEBUG = True

# Configuration par défaut
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
