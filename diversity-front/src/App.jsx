import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import './App.css';

import Login from './pages/login';
import Home from './pages/home';

function App() {
  const Private = ({children}) => {
    const { isAuthenticated } = useContext(AuthContext);

    if(!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route 
            exact
            path="/login"
            element={ <Login /> }
          />
          <Route 
            exact
            path="/"
            element={ <Private> <Home /> </Private> }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
