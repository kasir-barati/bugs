.ONESHELL:

PYTHON_VERSION = 3.12
VENV_PATH = .venv
PYTHON = $(shell [ -f $(VENV_PATH)/bin/python3 ] && echo $(VENV_PATH)/bin/python3 || echo python3)

venv: requirements.dev.txt requirements.txt
	@which uv > /dev/null || (echo "Error: uv is not installed. Please install uv: https://docs.astral.sh/uv/getting-started/installation/" && exit 1)
	uv venv $(VENV_PATH) --python=$(PYTHON_VERSION)
	uv pip install -r requirements.dev.txt -r requirements.txt --python=$(PYTHON_VERSION)

init: venv
	. .venv/bin/activate || true
	pre-commit install

lint:
	. .venv/bin/activate
	pre-commit run --all-files

clean:
	rm -rf $(VENV_PATH)

start:
	python src/main.py

.PHONY: venv init lint clean start
