## Install env

- Cài đặt pyenv

#### config ~/.zshrc

```sh
alias brew='env PATH="${PATH//$(pyenv root)\/shims:/}" brew'

if command -v pyenv 1>/dev/null 2>&1; then
 eval "$(pyenv init --path)"
 eval "$(pyenv init -)"
 eval "$(pyenv virtualenv-init -)"
fi
```

- Cài đặt virtualenv. Nếu trên mac (brew install pyenv-virtualenv)

Cài đặt phiên bản Python mong muốn sử dụng pyenv:

```sh
pyenv install 3.9.11 && pyenv global 3.9.11
```

Tạo môi trường ảo với virtualenv

```sh
pyenv virtualenv 3.9.11 stock-env
```

Kích hoạt môi trường ảo vừa tạo cho project của mình, sử dụng pyenv local:

```sh
pyenv local stock-env
python --version # Test the new env Python 3.9.7 # Bingo
```

## Start server

1. pip install -r requirements.txt
2. python manage.py migrate
3. python manage.py runserver

## Create admin user

```sh
python manage.py createsuperuser --email admin@example.com --username admin
```

## After install pip package, run:

```sh
pip freeze > requirements.txt
```
