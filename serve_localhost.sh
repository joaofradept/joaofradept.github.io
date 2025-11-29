#!/bin/bash
# serve_localhost.sh

# Navega para o diretório onde o script está localizado
cd "$(dirname "$0")"

# Inicia o servidor Python na porta 8000
echo "Starting Python server Python at $(pwd)"
echo "Access it at http://localhost:8000"
echo "Press Ctrl+C to stop the server"

python3 -m http.server 8000
