# Groupie-Tracker

This project is a web application that fetches data from an API and transforms it into data that is easy to read. The data is decoded to a visually appealing information and easy for the client to interact with. The API consists of four parts namely: artists, locations, dates and relations. It clearly shows how data is fetched and decoded. 

# Features
This project consists of:
1. Backend
This is where the data from the API is fetched. 

- [Server](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/cmd/api_server.go) is where the initialization of other structs used in the entire project is done and then configuration of the routes is created. and finally the server that listens to the specific port 4000 is created.

- [APIs](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/apis/apis.go) The Apis type serves as a central point to set up and manage API routes and middleware, using a repository (handlers.Repo) to provide the actual request handling logic.

- [Handlers](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/handlers/handlers.go) It provides HTTP handler functions for fetching artist data, handling errors, and responding with JSON data using the Repo struct.

- [Cors](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/middlewares/cors.go) Setting access controls for the project. for example the method allowed is post and options.

- [App_State](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/models/app_state.go) It implements a single pattern for the App struct. The AppState function ensures that only one instance of App is created and shared across the application. The sync.Once type is used to guarantee that the initialization code is executed only once, making the App instance thread-safe and ensuring that subsequent calls to AppState return the same App instance.

- [Fetch_Data](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/models/fetch_data.go) Data retrieval from URL is done here and unmarshaling of artist's data and the processing of the data for easy accesibility.

- [Models](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/models/models.go)  The function ensures that only one instance of App is created throughout the application's lifecycle. the method CreateTemplateCache() is called on it to presumably set up or load template data.

- [Response](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/responses/response.go)  This code defines a utility for handling JSON-based HTTP responses in a structured way. The JSONRes struct encapsulates error handling and message formatting, while methods like ErrJSON, ReadJSON, and WriteJSON provide convenient ways to read JSON requests and send JSON responses, all while managing content types, error handling, and response formatting efficiently. This structure is particularly useful for building APIs where consistent JSON responses are required.

2. Frontend