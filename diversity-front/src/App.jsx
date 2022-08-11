import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@mui/material';
import { ThemeProvider } from '@material-ui/styles';
import { ptBR } from '@mui/material/locale';
import Theme from './layout/Theme';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login/login';
import Home from './pages/Home/home';

const themeConfig = createMuiTheme(Theme, ptBR)

function App() {
  const Private = ({children}) => {
    const { isAuthenticated } = useContext(AuthContext);

    if(!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  }

  return (
    <div>
      <main>
        <Router>
        <ThemeProvider theme={themeConfig}>
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
          </ThemeProvider>
        </Router>
      </main>
      <ToastContainer />
    </div>
    );
}

export default App;
