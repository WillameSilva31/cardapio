docker-compose down

docker build -t cardapio-api:latest ./cardapioB

docker build -t cardapio-front:latest ./cardapioF

docker compose up --build --force-recreate --remove-orphans