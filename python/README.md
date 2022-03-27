## Start server

1. python3 -m venv .venv/
2. source .venv/bin/activate
3. pip install -r requirements.txt
4. python manage.py migrate
5. python manage.py runserver

## Create admin user
python manage.py createsuperuser --email admin@example.com --username admin

## After install pip package, run:
pip freeze > requirements.txt
