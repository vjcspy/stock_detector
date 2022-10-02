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
pyenv virtualenv 3.9.11 pystock-env
```

Kích hoạt môi trường ảo vừa tạo cho project của mình, sử dụng pyenv local:

```sh
pyenv local pystock-env
python --version # Test the new env Python 3.9.11 # Bingo
```

## Install packages

1. pip install -r requirements.txt

## After install pip package, run:

```sh
pip freeze > requirements.txt
```

## Active workspace interpreter (VsCode)
1. Make sure installed plugin `Python Environment Manager`
2. Go to python tab and active env

However recommended to use `pycharm`
