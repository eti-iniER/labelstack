#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate

echo "Starting Django server..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:80 --workers 4
