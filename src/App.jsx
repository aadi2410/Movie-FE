import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import MovieList from './components/MovieList';
import MovieForm from './components/MovieForm';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4aa',
    },
    secondary: {
      main: '#3282b8',
    },
    background: {
      default: '#0f4c75',
      paper: 'rgba(255, 255, 255, 0.1)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  console.log("App component rendered");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit'
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true);
      setCurrentView('list');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('list');
    setEditingMovie(null);
  };

  const handleCreateMovie = () => {
    setEditingMovie(null);
    setCurrentView('create');
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setCurrentView('edit');
  };

  const handleSaveMovie = async (movieData) => {
    try {
      setCurrentView("list");
      setEditingMovie(null);
    } catch (error) {
      console.error("Error saving movie:", error);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingMovie(null);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {currentView === 'list' && (
        <MovieList
          onCreateMovie={handleCreateMovie}
          onEditMovie={handleEditMovie}
          onLogout={handleLogout}
        />
      )}
      {(currentView === 'create' || currentView === 'edit') && (
        <MovieForm
          movie={editingMovie}
          onSave={handleSaveMovie}
          onCancel={handleCancel}
          isEdit={currentView === 'edit'}
        />
      )}
    </ThemeProvider>
  );
}

export default App;

