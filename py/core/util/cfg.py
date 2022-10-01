from dotenv import load_dotenv, dotenv_values
import json

from core.util.logger import log, log_json


def cfg():
    load_dotenv()
    return dotenv_values(".env")


def print_cfg():
    _cfg = cfg()
    if _cfg != None:
        log("ENV", rule=True)
        log_json(json.dumps(_cfg, indent=4))
