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
import RecoverPass from './pages/Login/recoverPass';
import ChangePass from './pages/Login/changePass';
import SignUp from './pages/SignUp/signUp';
import Home from './pages/Home/home';
import CreateCompany from './pages/MyCompany/createCompany';
import CompanyPage from './pages/MyCompany/companyPage';
import PageAdmins from './pages/MyCompany/pageAdmins';
import Profile from './pages/Profile/profile';
import Vagas from './pages/Vagas/vagas';
import AnunciarVaga from './pages/Vagas/anunciarVaga';
import Premium from './pages/Premium/premium';
import Configurations from './pages/Configurations/configurations';

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
                  path="/esqueci-minha-senha"
                  element={ <RecoverPass /> }
                />
                <Route 
                  exact
                  path="/alterar-senha"
                  element={ <ChangePass /> }
                />
                <Route 
                  exact
                  path="/cadastrar"
                  element={ <SignUp /> }
                />
                <Route 
                  exact
                  path="/"
                  element={ <Private> <Home /> </Private> }
                />
                <Route 
                  exact
                  path="/minha-empresa"
                  element={ <Private> <CreateCompany /> </Private> }
                />
                <Route 
                  exact
                  path="/perfil/:id"
                  element={ <Private> <Profile /> </Private> }
                />
                <Route 
                  exact
                  path="/empresa/:id"
                  element={ <Private> <CompanyPage /> </Private> }
                />
                <Route 
                  exact
                  path="/empresa/gerenciar/administradores"
                  element={ <Private> <PageAdmins /> </Private> }
                />
                <Route 
                  exact
                  path="/vagas"
                  element={ <Private> <Vagas /> </Private> }
                />
                <Route 
                  exact
                  path="/anunciar-vaga"
                  element={ <Private> <AnunciarVaga /> </Private> }
                />
                <Route 
                  exact
                  path="/assinar-premium"
                  element={ <Private> <Premium /> </Private> }
                />
                <Route 
                  exact
                  path="/configuracoes"
                  element={ <Private> <Configurations /> </Private> }
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
