# Groupie-Tracker

This project is a web application that fetches data from an API and transforms it into data that is easy to read. The data is decoded to a visually appealing information and easy for the client to interact with. The API consists of four parts namely: artists, locations, dates and relations. It clearly shows how data is fetched and decoded. 

## Features
This project consists of:

**1. Backend.**
This is where the data from the API is fetched. 

- [Server](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/cmd/api_server.go) is where the initialization of other structs used in the entire project is done and then configuration of the routes is created. and finally the server that listens to the specific port 4000 is created.

- [APIs](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/apis/apis.go) The Apis type serves as a central point to set up and manage API routes and middleware, using a repository (handlers.Repo) to provide the actual request handling logic.

- [Handlers](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/handlers/handlers.go) It provides HTTP handler functions for fetching artist data, handling errors, and responding with JSON data using the Repo struct.

- [Cors](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/middlewares/cors.go) Setting access controls for the project. for example the method allowed is post and options.

- [App_State](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/models/app_state.go) It implements a single pattern for the App struct. The AppState function ensures that only one instance of App is created and shared across the application. The sync.Once type is used to guarantee that the initialization code is executed only once, making the App instance thread-safe and ensuring that subsequent calls to AppState return the same App instance.

- [Fetch_Data](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/models/fetch_data.go) Data retrieval from URL is done here and unmarshaling of artist's data and the processing of the data for easy accesibility.

- [Models](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/models/models.go)  The function ensures that only one instance of App is created throughout the application's lifecycle. the method CreateTemplateCache() is called on it to presumably set up or load template data.

- [Response](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/backend/internals/responses/response.go)  This code defines a utility for handling JSON-based HTTP responses in a structured way. The JSONRes struct encapsulates error handling and message formatting, while methods like ErrJSON, ReadJSON, and WriteJSON provide convenient ways to read JSON requests and send JSON responses, all while managing content types, error handling, and response formatting efficiently. This structure is particularly useful for building APIs where consistent JSON responses are required.

**2. Frontend.**

- [server](https://github.com/Doreen-Onyango/groupie-tracker/blob/main/frontend/cmd/server.go) This code initializes a web server in Go, structured using a configuration pattern that encapsulates application state, rendering logic, and routing. It sets up the server to listen on port 8080 and uses a multiplexer to route requests to the appropriate handlers. The server starts listening for incoming connections in the main function, and appropriate error handling is included to manage startup issues. Overall, it serves as a foundational framework for a web application, allowing for further development of request handling and response rendering.

- [handlers](https://github.com/Doreen-Onyango/groupie-tracker/tree/main/frontend/internals/handlers) The Repo struct serves as a repository for managing data operations and rendering logic within the application. The NewRepo function provides a way to create instances of Repo, encapsulating the application's state and rendering resources. This structure allows for organized access to application functionality, making it easier to manage interactions between the application state and rendering processes.

- [models](https://github.com/Doreen-Onyango/groupie-tracker/tree/main/frontend/internals/models) It defines an App struct that contains a pointer to TemplateData, which is responsible for managing HTML templates. It implements the singleton pattern to ensure that only one instance of App exists throughout the application. Defines an App struct that contains a pointer to TemplateData, which is responsible for managing HTML templates. It implements the singleton pattern to ensure that only one instance of App exists throughout the application.

- [renders](https://github.com/Doreen-Onyango/groupie-tracker/tree/main/frontend/internals/renders) The Renders struct provides a mechanism for rendering HTML templates in a web application. It relies on the application state managed by models.App to access cached templates. The RenderTemplate method retrieves the specified template and sends it as an HTTP response, handling errors gracefully and providing contextual error messages. This structure simplifies the process of serving HTML content to clients, enhancing the overall organization of the rendering logic in the application.

- [routers](https://github.com/Doreen-Onyango/groupie-tracker/tree/main/frontend/internals/routers) The Routes struct encapsulates the routing logic for a web application, linking specific URL patterns to handler functions. The NewRoutes function initializes a Routes instance with the necessary repository and application state. The RegisterRoutes method sets up routes for serving static files and defines the home route, facilitating organized and manageable routing in the application. This structure enhances code clarity and separation of concerns by decoupling routing logic from the handling of HTTP requests.

- [views](https://github.com/Doreen-Onyango/groupie-tracker/tree/main/frontend/views) This is where all the images, scripts, styles and templates are created. it ensure the visualization of the web application and user friendly interface is created here.


## Installation

The backend of this project is purely written in Go. Ensure you have Go installed in your machine. To clone this repo: 

```
git clone https://github.com/Doreen-Onyango/groupie-tracker
```




## Usage

Navigate to the project directory and navigate to the backend directory then the cmd directory for you to run the backend.

```
cd groupie-tracker/backend/cmd/
go run .
```
The above command will start the backend server. Take a breath, we are not done yet. Open another terminal and navigate to the cmd directory to run the frontend.By doing this, ensure the backend is also running... boom!!! it dispays data.

```
cd groupie-tracker/frontend/cmd/
go run .
```

## Test
This project has test files that tests the functionality of the functions. To run the tests enter the following command in the backend and frontend directories one at time.
```
go test -v
```


## Implementation
Below is a function that fetches data from the APIs provided. Data retrieval from URL is done here and unmarshaling of artist's data and the processing of the data for easy accesibility.

```go
func (a *MainApi) fetchData(apitype string) ([]byte, error) {
	baseUrl := a.baseUrl
	if apitype != "artists" {
		baseUrl = apitype
	} else {
		baseUrl = fmt.Sprintf("%s%s", baseUrl, apitype)
	}

	res, err := http.Get(baseUrl)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}
{...
}
```

## Contribution
This project is public and open to contributions. Create pull requests if need be. 

## Authours
This project is maintained by:
1. [Adioz Daniel](https://github.com/Adiozdaniel)
2. [Doreen Onyango](https://github.com/Doreen-Onyango)
