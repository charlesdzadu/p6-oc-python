# JustStreamIt - Vidéo à la demande

![Logo JustStreamIt](/images/juststreamit.png)

## Présentation 📝

JustStreamIt est une application web inspirée de Netflix qui présente des films classés par catégories. Elle permet aux utilisateurs de découvrir des films, d'afficher leurs informations détaillées et de naviguer à travers différentes catégories de films.

Ce projet a été développé dans le cadre d'une formation en développement web, utilisant des technologies front-end modernes et une API RESTful pour récupérer les données des films.

## Fonctionnalités 🎬

- Affichage du film le mieux noté en section principale
- Affichage de listes de films classés par catégories :
  - Films les mieux notés
  - Films de mystère
  - Films d'action
  - Films dramatiques
  - Autres catégories sélectionnables
- Système de navigation responsive (mobile, tablette, desktop)
- Boutons "Voir plus" pour charger davantage de films dans chaque catégorie
- Fenêtre modale avec animations pour afficher les détails des films
- Gestion des erreurs d'images
- Adaptation dynamique à différentes tailles d'écran

## Technologies utilisées 💻

- **HTML5** : Structure de la page
- **CSS3 / Tailwind CSS** : Mise en page et styles
- **JavaScript (ES6+)** : Interactions et logique côté client
- **API RESTful** : Récupération des données de films
- **Responsive Design** : Adaptation à tous types d'écrans

## Prérequis 📋

- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur API local (voir la section Installation)
- Connexion internet pour charger les ressources externes

## Installation 🚀

### 1. Cloner le dépôt

```bash
git clone https://github.com/charlesdzadu/p6-oc-python.git
cd p6-oc-python
```

### 2. Installation et configuration de l'API

L'application nécessite une API locale pour fonctionner. Suivez ces étapes pour l'installer :

```bash
# Cloner le dépôt de l'API
git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git
cd OCMovies-API-EN-FR

# Créer et activer un environnement virtuel
python -m venv env
source env/bin/activate  # sous Linux/Mac
# ou
env\Scripts\activate  # sous Windows

# Installer les dépendances
pip install -r requirements.txt

# Créer et alimenter la base de données
python manage.py create_db

# Démarrer le serveur
python manage.py runserver
```

L'API sera accessible à l'adresse : http://127.0.0.1:8000/api/v1/

### 3. Lancer l'application JustStreamIt

Vous pouvez simplement ouvrir le fichier `main.html` dans votre navigateur, ou utiliser un serveur local :

```bash
# Avec Python
python -m http.server

# Avec Node.js et npm
npm install -g live-server
live-server
```

## Structure du projet 📂

```
juststreamit/
│
├── main.html        # Page principale de l'application
├── script.js        # Logique JavaScript de l'application
├── style.css        # Styles personnalisés complémentaires
├── README.md        # Documentation du projet
│
└── images/
    └── juststreamit.png  # Logo de l'application
```

## Utilisation 🎮

1. **Navigation** : Parcourez les différentes sections de films sur la page principale.
2. **Voir plus** : Cliquez sur le bouton "Voir plus" pour afficher davantage de films dans chaque catégorie (sur mobile et tablette).
3. **Détails des films** : Cliquez sur un film ou sur le bouton "Détails" pour ouvrir une fenêtre modale contenant des informations détaillées sur le film.
4. **Catégories** : Sélectionnez différentes catégories dans la section "Autres" pour afficher des films selon vos préférences.

## Détails techniques 🔧

### API Endpoints utilisés

- `/api/v1/titles/?sort_by=-imdb_score` : Récupérer les films les mieux notés
- `/api/v1/titles/{id}/` : Récupérer les détails d'un film spécifique
- `/api/v1/titles/?genre={genre}` : Récupérer les films par genre

### Responsive Design

L'application s'adapte à différentes tailles d'écran :
- **Mobile** (<768px) : Affiche 2 films par catégorie initialement
- **Tablette** (768px-1024px) : Affiche 4 films par catégorie initialement
- **Desktop** (>1024px) : Affiche 8 films par catégorie

### Gestion des erreurs

- Gestion des erreurs d'images avec des images par défaut
- Gestion des erreurs API avec des messages appropriés
- Validation des données reçues de l'API

### Validation du code 🔍

#### Validation HTML
Pour valider le code HTML :
1. Visitez [W3C Markup Validator](https://validator.w3.org/#validate_by_input)
2. Copiez le contenu du fichier `main.html`
3. Collez-le dans la zone de texte sous "Validate by Direct Input"
4. Cliquez sur "Check"

#### Validation CSS
Pour valider le code CSS :
1. Visitez [W3C CSS Validator](https://jigsaw.w3.org/css-validator/#validate_by_input)
2. Copiez le contenu du fichier `style.css`
3. Collez-le dans la zone de texte
4. Sélectionnez "CSS Level 3 + SVG" dans le menu déroulant Profile
5. Cliquez sur "Check"

Note : La validation CSS ne prend pas en compte les classes Tailwind car elles sont générées dynamiquement lors de l'exécution.

## Licence 📄

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

## Auteurs 👨‍💻

- Charles K. DZADU - [Voir mon portfolio](https://dzadu.dev)

## Remerciements 🙏

- OpenClassrooms pour le cadre du projet
- L'équipe OCMovies pour l'API de films

---

Développé avec ❤️ pour la communauté cinéphile.