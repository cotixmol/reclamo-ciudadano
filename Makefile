# Variables
COMPOSE_FILE=docker-compose.local.yml

# Targets
docker-build:
	docker-compose -f $(COMPOSE_FILE) build

docker-up:
	docker-compose -f $(COMPOSE_FILE) up

docker-down:
	docker-compose -f $(COMPOSE_FILE) down

docker-restart:
	docker-compose -f $(COMPOSE_FILE) down
	docker-compose -f $(COMPOSE_FILE) up

docker-logs:
	docker-compose -f $(COMPOSE_FILE) logs -f

docker-ps:
	docker-compose -f $(COMPOSE_FILE) ps
