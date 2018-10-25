#!/usr/bin/env bash

docker exec -i django bash remove-migrations.sh
# La til disse for å fikse issue #65 relation ("fg_auth_user" does not exist)
docker exec django python manage.py makemigrations fg_auth
docker exec django python manage.py makemigrations api
docker exec django python manage.py migrate

docker exec -i django python manage.py makemigrations
docker exec -i django python manage.py test
