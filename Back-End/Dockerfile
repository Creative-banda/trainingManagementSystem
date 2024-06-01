FROM python:3.11-slim
WORKDIR /app
COPY requirement.txt .
RUN python -m pip install --upgrade pip && pip install -r requirement.txt
COPY . .

# Collect static files
# RUN python manage.py collectstatic --no-input
# Run the Guinocorn server
# CMD [ "gunicorn", "--bind", "0.0.0.0:8000","--workers", "3", "training.wsgi"]

# Run the entrypoint.sh file
CMD ["./entrypoint.sh"]