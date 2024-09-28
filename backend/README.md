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
The Fetch Data package is responsible for data retrieval from a given URL. It also handles the unmarshaling of artist data and processes it for easier access and management.
Key Functionality:
    - Retrieves data from a specified URL.
    - Unmarshals and processes artist data for easier access.

7. **Models**
The Models package defines the application's core data structures. It uses the singleton App instance to manage the application's lifecycle, and calls the CreateTemplateCache() method to set up or load template data.
Key Functionality:
    - Defines core application data structures.
    - Manages application lifecycle using a singleton pattern.
    - Sets up the template cache via CreateTemplateCache().

8. **Response**
he Response package provides utilities for handling JSON-based HTTP responses. It manages error handling, response formatting, and content types using the JSONRes struct and related methods.
Key Functionality include:
    - Handles JSON responses and errors.
    - Provides methods like ErrJSON, ReadJSON, and WriteJSON for request/response management.
