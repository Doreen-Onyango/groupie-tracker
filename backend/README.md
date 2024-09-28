# Backend

The backend of this project is responsible for fetching data from APIs, handling requests, and processing responses. It manages the server, routing, middleware, and data management with a thread-safe singleton pattern for state management.

The packages in this directory include: 

1. **Server**
The Server package initializes the backend server and sets up routes and configurations. The server listens on port 4000 and coordinates various aspects of the backend like struct initialization, route configuration, and server listening.
Key Functionality include:
    - Initializes necessary structs.
    - Configures API routes.
    - Starts the server on port 4000.

2. **APIs**
The APIs package serves as a central point to manage API routes and middleware. It uses a repository pattern (handlers.Repo) to manage the logic for handling incoming API requests.
Key Functionality include:
    - Manages API routes and middleware.
    - Uses a repository (Repo) to handle API request logic.

3. **Handlers**
The Handlers package provides the HTTP handler functions. These functions handle various requests such as fetching artist data, managing errors, and responding with JSON data. The Repo struct is used here to coordinate these operations.
Key Functionality include:
    - Provides HTTP handlers for API requests.
    - Handles artist data fetching.
    - Manages error handling and JSON responses.

4. **CORS**
The CORS package manages the access control policies for cross-origin requests. It controls which HTTP methods are allowed (e.g., POST, OPTIONS) and ensures that the client can safely interact with the server.
Key Functionality include:
    - Sets up cross-origin resource sharing (CORS) rules.
    - Configures allowed HTTP methods (POST, OPTIONS).

5. **App State**
The App State package implements a singleton pattern to ensure that only one instance of the App struct is created and shared across the application. This guarantees that the app state is thread-safe, using sync.Once to prevent multiple instances from being created.
Key Functionality:
    - Singleton pattern for App struct.
    - Ensures thread-safe app state management.

6. **Fetch Data**
7. **Models**
8. **Response**
