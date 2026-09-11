# MineCalc

MineCalc est une application web pédagogique destinée aux étudiants en génie
minier. Elle regroupe 50 calculateurs simples et des explications de formules
utilisées dans les études minières.

## Fonctionnalités

- Calcul du volume et du tonnage ;
- Calcul de la teneur moyenne pondérée ;
- Conversion d'unités ;
- Calcul de la récupération métallurgique ;
- Calcul du rapport de découverture ;
- Calcul de la productivité ;
- Calcul du facteur et du volume de foisonnement ;
- Calcul de la densité apparente ;
- Calcul du nombre de godets, de la durée de chargement et de la distance moyenne de transport ;
- Calcul de la ventilation totale, de la puissance mécanique et du métal récupéré après traitement ;
- Calcul de la vitesse moyenne, de la disponibilité mécanique et du taux d'utilisation ;
- Calcul de l'énergie consommée, du coût énergétique et du bilan métal ;
- Calcul des réserves exploitables, de la durée d'exploitation et du coût de forage ;
- Calcul du volume de stérile, de la production annuelle et de la masse d'explosif ;
- Calcul de la consommation et du coût du carburant, ainsi que du revenu net ;
- Calcul du volume d'eau, du coût de maintenance et de la productivité nette ;
- Calcul de la production moyenne par trou et du coût unitaire du transport ;
- Quiz de révision ;
- Recherche et filtrage des calculateurs par domaine ;
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

## Validation pédagogique et limites

Les formules sont contrôlées dans le projet pour la cohérence des définitions,
des unités et des conversions de base. Elles restent des modèles pédagogiques :
les conventions, les rendements, les facteurs de sécurité et les hypothèses de
terrain doivent être confirmés avec le cours et les données du site.

MineCalc ne constitue pas une certification professionnelle. Avant toute
décision réelle d'exploitation, fais relire les calculs par un enseignant ou un
ingénieur minier qualifié.

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

### Foisonnement

```text
Facteur de foisonnement = ((volume foisonné − volume en place) ÷ volume en place) × 100
Volume foisonné = volume en place × (1 + facteur ÷ 100)
```

### Densité apparente

```text
ρa = masse ÷ volume occupé
```

### Chargement et transport

```text
Charge par godet = volume du godet × taux de remplissage × densité
Nombre de godets = plafond(capacité du camion ÷ charge par godet)
Durée de chargement = nombre de godets × temps de cycle ÷ 60
Distance moyenne = Σ(distance × tonnage) ÷ Σ(tonnage)
```

### Ventilation, énergie et récupération

```text
Ventilation totale = nombre de galeries × débit par galerie
P = (m × g × h) ÷ (t × η)
Métal récupéré = tonnage × teneur ÷ 100 × récupération ÷ 100
```

### Performance des équipements

```text
Vitesse moyenne = distance ÷ temps
Disponibilité = ((temps programmé − temps d'arrêt) ÷ temps programmé) × 100
Utilisation = (temps de fonctionnement ÷ temps disponible) × 100
```

### Énergie et bilan métal

```text
Énergie consommée = puissance × durée
Coût énergétique = énergie consommée × tarif
Métal contenu = tonnage alimenté × teneur ÷ 100
Récupération = métal récupéré ÷ métal contenu × 100
```

### Planification et forage

```text
Réserves exploitables = ressource estimée × récupération minière ÷ 100
Durée d'exploitation = réserves exploitables ÷ production journalière
Coût de forage = longueur totale forée × coût par mètre
```

### Exploitation et dynamitage

```text
Stérile à déplacer = tonnage de minerai × rapport de découverture
Production annuelle = production journalière × jours travaillés
Masse d'explosif = volume abattu × charge spécifique
```

### Carburant et économie

```text
Consommation de carburant = consommation horaire × temps de fonctionnement
Coût du carburant = volume consommé × prix unitaire
Revenu net = revenu brut − coût total
```

### Environnement et performance

```text
Volume d'eau consommé = débit horaire × durée
Coût de maintenance = heures de maintenance × tarif horaire
Productivité nette = production ÷ (temps total − temps d'arrêt)
```

### Outils complémentaires

```text
Production par trou = volume total abattu ÷ nombre de trous
Coût unitaire du transport = coût total du transport ÷ tonnage transporté
```

## Avertissement

MineCalc est un outil pédagogique. Les résultats sont indicatifs et doivent
être vérifiés avec les données de terrain, les méthodes de calcul des cours et
la validation d'un ingénieur qualifié pour toute étude réelle.

## Sécurité et confidentialité

- L'application ne possède pas de serveur ni de compte distant ;
- les données personnelles et l'historique restent dans le `localStorage` du navigateur ;
- les sauvegardes JSON importées sont limitées, validées et affichées avec `textContent` ;
- une politique de sécurité du contenu (CSP) limite les scripts, images et ressources aux fichiers du site.

## Auteur

Projet étudiant réalisé pour apprendre le développement web et appliquer des
notions de génie minier.
