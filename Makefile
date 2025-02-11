COMPOSE_FILE ?= docker-compose.local.yml
DOCKER_COMPOSE = docker-compose -f $(COMPOSE_FILE)

.PHONY: help build up down restart logs ps

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build    Build Docker images."
	@echo "  up       Start containers (detached)."
	@echo "  down     Stop and remove containers."
	@echo "  restart  Restart containers."
	@echo "  logs     Tail container logs."
	@echo "  ps       List running containers."

build:   ## Build Docker images
	$(DOCKER_COMPOSE) build

up:      ## Start containers in detached mode
	$(DOCKER_COMPOSE) up -d

down:    ## Stop and remove containers
	$(DOCKER_COMPOSE) down

restart: ## Restart containers
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) up -d

logs:    ## Tail logs of all containers
	$(DOCKER_COMPOSE) logs -f

ps:      ## List running containers
	$(DOCKER_COMPOSE) ps
