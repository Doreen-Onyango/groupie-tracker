FRONT_END_BINARY=frontEndApp
BACK_END_BINARY=backEndApp

# Start all containers in the background without forcing a build
up:
	@echo "Starting Docker containers..."
	docker-compose up -d
	@echo "Docker containers started!"

# Stop containers (if running), build all projects, and start them
up_build: build_backend build_front
	@echo "Stopping Docker containers (if running)..."
	docker-compose down
	@echo "Building and starting Docker containers..."
	docker-compose up --build -d
	@echo "Docker containers built and started!"

# Stop all running containers
down:
	@echo "Stopping Docker containers..."
	docker-compose down
	@echo "Containers stopped!"

# Build the backend binary as a Linux executable
build_backend:
	@echo "Building backend binary..."
	env GOOS=linux CGO_ENABLED=0 go build -o ${BACK_END_BINARY} ./cmd/api
	@echo "Backend binary built!"

# Build the frontend binary
build_front:
	@echo "Building frontend binary..."
	env CGO_ENABLED=0 go build -o ${FRONT_END_BINARY} ./cmd/web
	@echo "Frontend binary built!"

# Start the frontend service
start: build_front
	@echo "Starting frontend service..."
	./${FRONT_END_BINARY} &

# Stop the frontend service
stop:
	@echo "Stopping frontend service..."
	@-pkill -SIGTERM -f "./${FRONT_END_BINARY}"
	@echo "Frontend service stopped!"
