"""Stock entry point script."""
# stock/__main__.py

from core.util.cfg import print_cfg
from core.util.logger import error
from stock import cli, __app_name__


def main():
    print_cfg()
    cli.app(prog_name=__app_name__)


if __name__ == "__main__":
    main()
