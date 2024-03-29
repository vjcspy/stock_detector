"""This module provides the Stock Worker CLI."""
# worker/cli.py

from typing import Optional

import typer

from stock import __app_name__, __version__
from stock.modules.compute.ge.alpha import compute_alpha

app = typer.Typer()


def _version_callback(value: bool) -> None:
    if value:
        typer.echo(f"{__app_name__} v{__version__}")
        raise typer.Exit()


@app.callback()
def main(
        version: Optional[bool] = typer.Option(
            None,
            "--version",
            "-v",
            help="Show the application's version and exit.",
            callback=_version_callback,
            is_eager=True,
        )
):
    return


@app.command("worker:list")
def worker_list():
    print(f"List worker")

