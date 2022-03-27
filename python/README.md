## Install env

Cài đặt pyenv + virtualenv

Cài đặt phiên bản Python mong muốn sử dụng pyenv:

$ pyenv install 3.9.7

Nếu cài đặt bị lỗi, có thể hệ thống của bạn thiếu các thư viện cần thiết cho việc compile, cài đặt các thư việc còn thiếu tại đây https://github.com/pyenv/pyenv/wiki/Common-build-problems

Tạo môi trường ảo với virtualenv

$ pyenv virtualenv 3.9.7 stock-env

Kích hoạt môi trường ảo vừa tạo cho project của mình, sử dụng pyenv local:

$ pyenv local stock-env
$ python --version # Test the new env
Python 3.9.7 # Bingo

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
