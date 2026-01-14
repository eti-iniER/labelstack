#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate
python manage.py loaddata fixtures/*.json

echo "Starting Django server..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:80 --workers 4 --access-logfile - --error-logfile - --capture-output
