FROM mcr.microsoft.com/devcontainers/python:3.11-bullseye
# Install PostgreSQL client tools (optional, if you want to interact with PostgreSQL from your app container)
RUN apt-get update && apt-get install -y postgresql-client
# Set up your environment (optional)
ENV PYTHONUNBUFFERED 1

# Install NVM, Node.js, and npm
ENV NVM_DIR=/usr/local/share/nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install --lts && \
    nvm use --lts && \
    nvm alias default 'lts/*'
