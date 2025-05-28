.PHONY: buildnrun bnr help

# The default goal is 'help'
.DEFAULT_GOAL := help

# Main build and run target
buildnrun:
	@$(MAKE) -s _buildnrun CMD=$(filter-out $@,$(MAKECMDGOALS))

# Alias for buildnrun
bnr:
	@$(MAKE) -s _buildnrun CMD=$(filter-out $@,$(MAKECMDGOALS))

# Internal buildnrun target
_buildnrun:
ifeq ($(CMD),app)
	docker build -f apps/app/Dockerfile -t djalon/app --network host .
	docker run -e PORT=8080 --network host djalon/app
else ifeq ($(CMD),landing)
	docker build -f apps/landing/Dockerfile -t djalon/landing --network host .
	docker run -e PORT=8080 --network host djalon/landing
else ifeq ($(CMD),cron)
	docker build -f apps/cron/Dockerfile -t djalon/cron --network host .
	docker run --network host djalon/cron
else
	@echo "Please provide a valid target. List of available targets:"
	@echo "  - app"
	@echo "  - landing"
	@echo "  - cron
endif

# Help message
help:
	@echo "Available commands:"
	@echo "  make buildnrun <target>   - Build and run the Docker container for <targt>"
	@echo "  make bnr <target>         - Alias for buildnrun <target>"
	@echo "  make help                 - Display this help message"