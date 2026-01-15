# Backend

## Prerequisites

Install [uv](https://docs.astral.sh/uv/getting-started/installation/) to manage the Python environment and dependencies.

## Setup

1. Install dependencies:

```bash
uv sync
```

2. Run database migrations:

```bash
uv run python manage.py migrate
```

3. Load initial data:

```bash
uv run python manage.py loaddata fixtures/0001_shipping_providers.json
```

4. Start the development server:

```bash
uv run python manage.py runserver
```
