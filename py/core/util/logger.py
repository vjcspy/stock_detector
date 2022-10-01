from rich.console import Console
"""https://rich.readthedocs.io/en/stable/console.html#rules"""
console = Console()
error_console = Console(stderr=True, style="bold red")


def log(*obj, **options):
    if options.get("rule") == True:
        console.rule(*obj)
        return

    console.log(*obj)


def log_json(json):
    console.print_json(json)

def error(*obj):
    error_console.log(*obj)
