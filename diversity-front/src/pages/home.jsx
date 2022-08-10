import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
    const { user, signOut } = useContext(AuthContext);

    return (
        <div>
            <h1>
                Bem-vindo, {user.nome}!
            </h1>
            <br />
            <button onClick={() => signOut()}>Logout</button>
        </div>
    )
};

export default Home;