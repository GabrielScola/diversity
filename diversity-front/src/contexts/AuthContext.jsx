import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Request from '../helper/Request';
import Cookie from '../helper/Cookie';
import Toast from '../helper/Toast';

export const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const isAuthenticated = !!user;
    const lastPage = window.location.pathname;
    useEffect(() => {
        const token = Cookie.get('token');

        if (token) {
            const loggedUser = Cookie.get('user');

            setUser(JSON.parse(loggedUser));            

            navigate(lastPage ?? '/')            
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const fetchDataImage = async () => {
            const response = await Request(
                'GET',
                `/user/image/${user.id}`,
                null,
                null,
                null,
                null,
            );

            setUserImage(response.data.imagem_perfil);
        }

        if(user)
            fetchDataImage();
    }, [user])

    async function signIn(data) {
        const response = await Request(
            'POST',
            '/auth/login',
            null,
            data,
            null,
            null
        );

        if(response.success && response.data) {
            Cookie.set('token', response.data.token);
            Cookie.set('user', JSON.stringify(response.data.user));

            setUser(response.data.user);
            navigate('/')
        } else {
            Toast.error(response.message);
        }
    }

    function signOut() {
        Cookie.remove('token');
        Cookie.remove('user');
        setUser(null);

        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, userImage , signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}