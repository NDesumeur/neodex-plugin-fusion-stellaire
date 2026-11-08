# Fusion stellaire

Un jeu de tuiles qui glissent et fusionnent : à chaque coup, toutes les tuiles glissent du même côté, et deux astres identiques qui se rencontrent fusionnent en l'astre suivant. De la poussière au trou noir, en évitant de remplir la grille.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Flèches**, **ZQSD** ou **glisser à la souris** : toutes les tuiles glissent de ce côté.
- **U** ou **Annuler** : annule le dernier coup.
- **T** ou **Trou de ver** : clique deux tuiles pour les échanger.

## Règles

- Après chaque coup, un nouvel astre apparaît dans une case libre (le plus souvent de la poussière, parfois un caillou).
- Deux astres pareils qui se rencontrent en glissant fusionnent en l'astre suivant, une seule fois par coup.
- L'échelle des astres : poussière → caillou → astéroïde → comète → lune → planète → planète à anneaux → géante gazeuse → étoile → supernova → trou noir.
- Les **débris** ne bougent pas et ne fusionnent pas : ils coupent la ligne en morceaux qui glissent chacun de leur côté, et ils **cassent** quand une fusion se fait juste à côté.
- La partie s'arrête quand plus aucun coup n'est possible.

## Pouvoirs

L'annulation et le trou de ver ont des charges limitées. Tu gagnes une charge de chaque **tous les 150 coups** et à chaque **trou noir** formé.

## Points

Chaque fusion rapporte d'autant plus que l'astre obtenu est gros : 4 points pour un caillou, 8 pour un astéroïde, et le double à chaque étape.

## Modes de jeu

- **Galaxie** (5 × 5) et **Nébuleuse** (4 × 4, plus serré) : parties libres pour le meilleur score. Un débris apparaît tous les 30 coups.
- **15 défis** : atteindre un astre (parfois en un nombre limité de coups), casser un nombre de débris, ou marquer un score. Certains commencent avec des débris en place ou sur une grille de 4 × 4. Un défi réussi rapporte de 1 à 3 étoiles (une pour la réussite, une pour avoir gardé tes pouvoirs, une pour l'avoir fini en peu de coups) et débloque le suivant.

Choisis le mode dans la liste en haut. La partie en cours est sauvegardée : tu la retrouves en revenant, même sur un autre PC.

## Données et synchronisation

Tes records, tes étoiles, le plus grand astre atteint et la partie en cours sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Fusion stellaire → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
