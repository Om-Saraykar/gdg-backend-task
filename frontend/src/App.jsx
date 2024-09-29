import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import MovieForm from './components/MovieForm';
import UpdateMovie from './components/UpdateMovie';
import NotFound from './components/NotFound';
import Login from './components/Login';      // Import Login component
import Signup from './components/Signupi';    // Import Signup component

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movies/new" element={<MovieForm />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/movies/edit/:id" element={<UpdateMovie />} />
          <Route path="/login" element={<Login />} />       {/* Add Login route */}
          <Route path="/signup" element={<Signup />} />     {/* Add Signup route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
