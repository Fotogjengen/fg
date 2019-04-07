#!/usr/bin/env bash
docker exec -u=postgres postgres sh /scripts/drop_and_recreate_database.sh

# La til disse for å fikse issue #65 relation ("fg_auth_user" does not exist)
docker exec django python manage.py makemigrations fg_auth
docker exec django python manage.py makemigrations api
docker exec django python manage.py migrate


docker exec django bash seed.sh
