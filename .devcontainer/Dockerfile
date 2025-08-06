FROM mcr.microsoft.com/devcontainers/python:3.11-bullseye

# Install PostgreSQL client tools
USER root
RUN apt-get update && apt-get install -y postgresql-client curl ca-certificates build-essential

# Switch to the vscode user for nvm/node install
USER vscode

# Install NVM, Node.js, and npm (in user home directory)
ENV NVM_DIR=/home/vscode/.nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install --lts && \
    nvm alias default 'lts/*'

# Ensure nvm loads on every terminal session
RUN echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc && \
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc && \
    echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc

# Optional: switch back to root (if needed for post-create commands)
USER root

# Set environment variables
ENV PYTHONUNBUFFERED=1
