# MineCalc

MineCalc est une application web pédagogique destinée aux étudiants en génie
minier. Elle regroupe des calculateurs simples et des explications de formules
utilisées dans les études minières.

## Fonctionnalités

- Calcul du volume et du tonnage ;
- Calcul de la teneur moyenne pondérée ;
- Conversion d'unités ;
- Calcul de la récupération métallurgique ;
- Calcul du rapport de découverture ;
- Calcul de la productivité ;
- Quiz de révision ;
- Historique local des calculs ;
- Mode sombre.

## Technologies utilisées

- HTML5 ;
- CSS3 ;
- JavaScript ;
- LocalStorage du navigateur.

## Lancer le projet

1. Télécharge ou clone le projet.
2. Ouvre le dossier dans Visual Studio Code.
3. Ouvre `index.html` avec l'extension Live Server.
4. Utilise les calculateurs directement dans le navigateur.

Le projet ne nécessite actuellement ni Node.js, ni base de données, ni serveur
backend.

## Structure du projet

```text
minecalc/
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore
```

## Formules principales

### Tonnage

```text
V = longueur × largeur × hauteur
T = volume × densité
```

### Teneur moyenne pondérée

```text
Gm = Σ(tonnage × teneur) ÷ Σ(tonnage)
```

### Récupération métallurgique

```text
Métal contenu = tonnage × teneur ÷ 100
Métal récupéré = métal contenu × récupération ÷ 100
```

### Rapport de découverture

```text
Rd = tonnage de stérile ÷ tonnage de minerai
```

### Productivité

```text
P = quantité produite ÷ temps de travail
```

## Avertissement

MineCalc est un outil pédagogique. Les résultats sont indicatifs et doivent
être vérifiés avec les données de terrain, les méthodes de calcul des cours et
la validation d'un ingénieur qualifié pour toute étude réelle.

## Auteur

Projet étudiant réalisé pour apprendre le développement web et appliquer des
notions de génie minier.
