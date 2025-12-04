// This code initializes the backend server, connects to the database, and starts listening for incoming requests.
// It also handles errors related to the server and database connection.
// The server listens on the port specified in the environment variables or defaults to port 3000 if not specified.
// The dotenv package is used to load environment variables from a .env file.
// The connectDB function is responsible for establishing a connection to the MongoDB database using Mongoose
// and the app is imported from the app.js file, which contains the Express application setup.
// The server listens for incoming requests and logs the port it's running on.
// If there's an error connecting to the database, it logs the error message.
// The app.on('error', ...) handler is used to catch any server errors that may occur during runtime.
// This setup is essential for building a robust backend application that can handle requests and interact with a database.
// The code is structured to ensure that the server starts only after a successful database connection,
// providing a clear separation of concerns between database connectivity and server functionality.
// The use of async/await syntax makes the code cleaner and easier to read, especially when dealing with asynchronous operations like database connections.
