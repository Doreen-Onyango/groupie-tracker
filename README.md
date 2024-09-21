# Groupie-Tracker

This project is a web application that fetches data from an API and transforms it into data that is easy to read. The data is decoded to a visually appealing information and easy for the client to interact with. The API consists of four parts namely: artists, locations, dates and relations. It clearly shows how data is fetched and decoded. 

# Features
This project consists of:
1. Backend
This is where the data from the API is fetched. 

- [Server](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/cmd/api_server.go) is where the initialization of other structs used in the entire project is done and then configuration of the routes is created. and finally the server that listens to the specific port 4000 is created.

- [APIs]() The Apis type serves as a central point to set up and manage API routes and middleware, using a repository (handlers.Repo) to provide the actual request handling logic.

- [Handlers]() It provides HTTP handler functions for fetching artist data, handling errors, and responding with JSON data using the Repo struct.

- [Cors]() Setting access controls for the project. for example the method allowed is post and options.

- [App_State]() It implements a single pattern for the App struct. The AppState function ensures that only one instance of App is created and shared across the application. The sync.Once type is used to guarantee that the initialization code is executed only once, making the App instance thread-safe and ensuring that subsequent calls to AppState return the same App instance.

- [Fetch_Data]() Data retrieval fro URL is done here and unmarshaling of artist's data and the processing of the dat for easy accesibility.

- [Models]() 

- [Response]()

2. Frontend