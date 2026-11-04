# CinéScope — catalogue TMDB

Catalogue responsive de films et séries propulsé par l’API TMDB. Il propose les tendances, les genres, la recherche et des fiches détaillées. **Il ne diffuse pas de vidéos** et ne contient aucun lien vers des flux non autorisés.

## Lancer le site

1. Créez un compte TMDB et demandez une clé API sur [TMDB API](https://www.themoviedb.org/settings/api).
2. Remplacez `YOUR_TMDB_API_KEY` dans `app.js` par votre clé (prototype/développement uniquement).
3. Ouvrez `index.html` via un serveur web local ou publiez les fichiers statiques.

Pour une mise en production, **ne mettez pas la clé dans le JavaScript public** : configurez un backend/proxy qui conserve la clé côté serveur, avec limites de requêtes, validation et protections contre les abus. Respectez les conditions TMDB, notamment l’attribution visible et les conditions de licence applicables à votre usage. La gratuité n’est pas une autorisation automatique pour un usage commercial.

## Attribution

Ce produit utilise l’API TMDB mais n’est ni approuvé ni certifié par TMDB. Métadonnées et images de TMDB, sous réserve de leurs conditions et droits applicables. Toute image d’ambiance externe doit aussi être utilisée conformément à sa licence.

## Héberger gratuitement

Vous pouvez publier les fichiers sur GitHub Pages ou un hébergeur statique. Ne publiez pas de clé privée dans le dépôt. Pour afficher des vidéos, utilisez uniquement des contenus que vous détenez ou pour lesquels vous avez obtenu les droits de diffusion.
