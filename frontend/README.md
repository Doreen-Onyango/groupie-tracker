# Frontend

The frontend of this project is responsible for rendering HTML templates, handling routes, and providing a user-friendly interface. It utilizes Go to serve templates and manage routing logic efficiently, making use of a configuration pattern for application state and rendering logic.

## The packages in this directory are:

1. **Server**

The Server package initializes and manages the web server. It sets up the server to listen on port 8080 and routes requests through a multiplexer to appropriate handlers. Error handling ensures smooth server startup and operations.

Key Functionality include:

    - Initializes a web server on port 8080.
    - Routes HTTP requests using a multiplexer.
    - Handles server startup errors gracefully.

2. **Handlers**

The Handlers package manages data operations and rendering logic through the Repo struct. The NewRepo function helps create instances of Repo, encapsulating the state and rendering resources of the application.

Key Functionality include:

    - Manages rendering and data operations.
    - Uses Repo struct to centralize state management and template rendering logic.
    - Simplifies interaction between application state and rendering.


3. **Models**

The Models package defines the App struct, which contains a pointer to TemplateData. This struct ensures only one instance of App exists throughout the application via a singleton pattern. It provides centralized access to template data and ensures state consistency across the application.

Key Functionality include:

    - Defines the App struct to manage application state.
    - Implements singleton pattern to guarantee only one instance of App.
    - Manages template data via TemplateData pointer.


4. **Renders**

The Renders package is responsible for rendering HTML templates. It interacts with the App state to retrieve cached templates and uses the RenderTemplate method to serve them as HTTP responses. This method gracefully handles errors and simplifies template rendering logic for the web application.

Key Functionality include:

    - Renders HTML templates.
    - Accesses cached templates from models.App.
    - Simplifies serving templates to the client via RenderTemplate.


5. **Routers**

The Routers package manages URL routing within the web application. It uses the Routes struct to link specific URL patterns to their respective handler functions. The RegisterRoutes method sets up routes, including static file serving and home routes, ensuring a clean separation of concerns.

Key Functionality include:

    - Manages URL routing logic.
    - Links URL patterns to appropriate handler functions.
    - Registers static file and home routes.


6. **Views**

The Views directory holds all the images, scripts, styles, and templates used to create the frontend of the application. It ensures that the web application has a visually appealing and user-friendly interface.

Key Functionality include:

    - Contains HTML templates, CSS, JavaScript, and image files.
    - Responsible for creating the user interface and visual aspects of the web application.
    - Enhances user experience through organized and efficient frontend design.