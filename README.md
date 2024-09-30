# Movies API

A full-stack application that allows users to interact with a movie database. The backend provides an API with full CRUD functionality, filtering, and search capabilities, while the frontend provides a clean and interactive interface for users to view and manage movie data. The project also includes advanced features like user authentication, caching, rate-limiting, and pagination.

---

## **Table of Contents**
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Getting Started](#getting-started)
    1. [Backend Setup](#backend-setup)
    2. [Frontend Setup](#frontend-setup)
5. [API Endpoints](#api-endpoints)
6. [Frontend Interface](#frontend-interface)
7. [Bonus Features](#bonus-features)
    1. [User Authentication](#user-authentication)
    2. [Rate Limiting](#rate-limiting)
    3. [Caching with Redis](#caching-with-redis)
    4. [API Versioning](#api-versioning)
8. [References](#references)

---

## **Project Overview**

The RESTful Movies API is a web-based application designed to handle movie data. Users can perform basic CRUD operations on movie records (Create, Read, Update, Delete), filter movies by genre, release date, or rating, and view details. The application is designed using the **MERN stack (MongoDB, Express, React, Node.js)** and supports advanced features like authentication, caching, and API rate limits.

---

## **Features**

- **CRUD Operations**: Add, view, update, and delete movie data.
- **Filtering and Searching**: Query movies by genre, release year, and rating.
- **Frontend Interface**: A React-based user interface for interacting with the API.
- **Authentication**: User login and access control via JWT.
- **Rate Limiting**: API rate limiting to prevent abuse.
- **Caching**: Caching responses using Redis to improve performance.

---

## **Technologies Used**

### **Backend**
- **Node.js** (Express.js for routing)
- **MongoDB Atlas** (Database)
- **JWT & OAuth** (User authentication)
- **Redis** (Caching)
  
### **Frontend**
- **React** (UI framework)
- **Tailwind CSS** (Styling)

### **Additional Tools**
- **Postman** (API testing)
- **Mongoose** (MongoDB ORM)
- **Nginx** (Proxy server)
  
---

## **Getting Started**

### **Backend Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/Om-Saraykar/gdg-backend-task.git
   ```
   ```bash
   cd gdg-backend-task
   ```
   ```bash
   cd backend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file for environment variables:
   ```bash
   MONGO_URI=<MongoDB_Connection_URL>
   JWT_SECRET=<your_jwt_secret>
   REDIS_URL=<Redis_Connection_URL>
   ```
   **NOTE** - .env file is already added in the project so you can skip this step

4. Starting Redis Container
    Before starting the backend server, ensure that **Docker Desktop** is running. Then, use the following command to start a Redis container:
    ```bash
    docker run -d --name redis-container -p 6379:6379 redis
    ```
    This command will run the Redis container in detached mode and expose it on port 6379, which is necessary for the caching functionality in the Movies API.
    Make sure that **Docker Desktop** is up and running to avoid any connection issues.


5. Start the development server:
   ```bash
   node server.js
   ```

5. Use Postman or the frontend to test the API routes.

### **Frontend Setup**

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm run dev
   ```

4. The frontend will be running on `http://localhost:5173`.

---

## **API Endpoints**

Here are the main API routes for the Movies API:

### **Movies**
- `GET /api/v1/movies` – Retrieve a list of all movies, with optional filtering and sorting.
- `POST /api/v1/movies` – Add a new movie (requires authentication).
- `GET /api/v1/movies/:id` – Retrieve the details of a specific movie by its ID.
- `PUT /api/v1/movies/:id` – Update a specific movie by its ID (requires authentication).
- `DELETE /api/v1/movies/:id` – Delete a specific movie by its ID (requires authentication).

### **Filtering and Search**
- `GET /api/v1/movies?genre=<genre>` – Filter movies by genre.
- `GET /api/v1/movies?year=<year>` – Filter movies by release year.
- `GET /api/v1/movies?rating=<rating>` – Filter movies by rating.
- `GET /api/v1/movies?runtime=<runtime>` – Filter movies by runtime.
- `GET /api/v1/movies?sortBy=<field>&order=<asc|desc>` – Sort movies by specific fields such as title, genre, release date, rating, or runtime.

### **User Authentication**
- `POST /api/auth/login` – Login a user using JWT.
- `POST /api/auth/register` – Register a new user.

---

## **Frontend Interface**

The React frontend allows users to:
- View a list of movies.
- Search and filter movies.
- Add new movies to the database.
- Edit or delete existing movies.
- View detailed information for a specific movie.

---

## **Bonus Features**

### **User Authentication**
- Authentication is done using **JWT (JSON Web Tokens)** for stateless sessions.
- Protected routes ensure that only logged-in users can access app features.

### **Rate Limiting**
- **API rate limiting** prevents abuse by limiting the number of requests a user can make in a given time period.
- Implemented using the **express-rate-limit** package.

### **Caching with Redis**
- Redis is used to **cache movie queries**, improving performance by reducing the load on the MongoDB database.
- Cached data is refreshed at configurable intervals or when data is changed.

### **API Versioning**
- Versioning is done by prefixing routes with `/v1`, `/v2`, etc., ensuring backward compatibility for future updates.

---

## **References**

- [Node.js API Documentation](https://nodejs.org/en/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Docker Documentation](https://docs.docker.com/)

---
