FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY . .

# HuggingFace Spaces requires port 7860
EXPOSE 7860

CMD ["gunicorn", "isl_api:app", "--bind", "0.0.0.0:7860", "--workers", "1", "--timeout", "120"]
