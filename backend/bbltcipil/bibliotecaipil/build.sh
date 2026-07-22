#!/usr/bin/env bash

# set -o errexit

# pip install -r requirements.txt

# python manage.py collectstatic --noinput

# python manage.py migrate

# python manage.py criar_admin



#!/usr/bin/env bash

set -o errexit

python -m pip install --upgrade pip

pip install -r requirements.txt

python manage.py migrate --no-input

python manage.py collectstatic --no-input