FROM mcr.microsoft.com/devcontainers/python:3.11-bullseye
# Install PostgreSQL client tools (optional, if you want to interact with PostgreSQL from your app container)
RUN apt-get update && apt-get install -y postgresql-client
# Set up your environment (optional)
ENV PYTHONUNBUFFERED 1