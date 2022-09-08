import React, { useContext } from 'react';
import { 
    Box,
    Button,
 } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import Header from '../../layout/Header/After.js';
import Footer from '../../layout/Footer/Footer';

const Home = () => {
    const { user, signOut } = useContext(AuthContext);

    return ( 
    <>
        <Header signUp={true}/>
        <Box sx={{ textAlign: 'center', marginTop: '10vh' }}>
            <div>
                <h1>
                    Bem-vindo, {user.nome}!
                </h1>
                <br />
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ borderRadius: 300, width: 450, marginTop: 15 }}
                    onClick={() => signOut()}
                >
                    <b>Logout</b>
                </Button>
            </div>
        </Box>
        <Box mt={50}>
            <Footer />
        </Box>
    </>
    )
};

export default Home;