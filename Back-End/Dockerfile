FROM python:3.11-slim
WORKDIR /app
COPY requirement.txt .
RUN pip install -r requirement.txt --no-cache-dir
COPY . .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]