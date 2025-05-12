#!/bin/bash

# Remplacer les variables d'environnement dans le template et générer le fichier de config NGINX
envsubst < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Démarrer NGINX en mode non-démon
nginx -g 'daemon off;'
