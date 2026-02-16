SHELL := bash

############# VARIABLES #############
CLIENT = apps/client
SERVER = apps/server
OPENAPI_JSON     = docs/openapi.json



############# build and start #############
.PHONY: build-server build-client \
		build start-server \
		start-client watch-server

build-server:
# 	dotnet build $(SERVER_SOLUTION)

build-client:
	cd $(CLIENT) && npm run build

# build: build-server build-client

# start-server:
# 	dotnet run --project apps/server/Server.API
# watch-server:
# 	dotnet watch run --project apps/server/Server.API

start-client:
	cd $(CLIENT) && npm run dev




############## Linting and Formatting ##############
.PHONY: lint-check-client lint-fix-client lint-clients lint-fix-client format-fix-client \
# 		format-check-server format-fix-server \
		

format-check: lint-check-client format-check-client format-check-server
format-fix: lint-fix-client format-fix-client format-fix-server	

lint-check-client:
	cd $(CLIENT) && npx eslint . --ext .js,.jsx,.ts,.tsx

lint-fix-client:
	cd $(CLIENT) && npx eslint . --ext .js,.jsx,.ts,.tsx --fix

format-check-client:
	cd $(CLIENT) && npx prettier --check "**/*.{js,jsx,ts,tsx,json,css,md}"

format-fix-client:
	cd $(CLIENT) && npx prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"

# format-check-server:
# 	cd $(SERVER) && dotnet format --verify-no-changes

# format-fix-server:
# 	cd $(SERVER) && dotnet format ./Server.sln

