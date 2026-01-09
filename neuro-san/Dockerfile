# Neuro SAN Studio Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Clone Neuro SAN Studio
RUN git clone --depth 1 https://github.com/cognizant-ai-lab/neuro-san-studio.git /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy custom agent registries
COPY registries/ /app/registries/

# Create logs directory
RUN mkdir -p /app/logs

# Set environment variables
ENV PYTHONPATH=/app
ENV AGENT_REGISTRY_PATH=/app/registries

# Expose ports
# 30011 - Agent Server (gRPC)
# 4173 - NSFlow UI
EXPOSE 30011 4173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:30011/health || exit 1

# Start the Neuro SAN server
CMD ["python", "-m", "run"]

