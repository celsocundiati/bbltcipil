#!/usr/bin/env bash

# set -o errexit

# pip install -r requirements.txt

# python manage.py collectstatic --noinput

# python manage.py migrate

# python manage.py criar_admin


#!/usr/bin/env bash

set -o errexit

pwd
ls -la

python manage.py help | grep collectstatic

python manage.py collectstatic --noinput
python manage.py migrate