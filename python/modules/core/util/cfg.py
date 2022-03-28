from dotenv import load_dotenv, dotenv_values


def cfg():
	load_dotenv()
	return dotenv_values(".env")
