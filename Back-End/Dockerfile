FROM python:3.11-slim
WORKDIR /app
COPY requirement.txt .
RUN python -m pip install --upgrade pip && pip install -r requirement.txt
COPY . .

# Give permissions to entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Run the entrypoint.sh file
CMD ["./entrypoint.sh"]