import React from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Link,
} from '@mui/material';
import placeholder from '../../../assets/images/profile_placeholder.jpg';

const StepTen = (props) => {
    const {
        setStep, 
        nome,
        sobrenome,
        cargo, 
        cidade, 
        image, 
        setImage 
    } = props;

    return (
        <Box sx={{ textAlign: 'center', marginTop: '10vh' }}>
             <Typography component='h3' variant='h4'>
                {'Uma foto ajuda as pessoas a'}< br/>
                {'reconhecerem seu perfil'}
            </Typography>
            <Avatar 
                alt="Avatar"
                src={image ?? placeholder}
                sx={{ width: 200, height: 200, margin: 'auto', marginTop: 3 }}
            />
            <Typography component='h1' variant='body1' style={{ marginTop: 5 }}>
                {nome} {sobrenome}<br />
                {cargo}<br />
                {cidade}
            </Typography>
            {!image && (
                <Button
                    component="label"
                    variant="contained"
                    color="secondary"
                    style={{ borderRadius: 300, width: 450, marginTop: 15 }}
                >
                    <b>Adicionar foto</b>
                    <input 
                        hidden 
                        accept="image/*" 
                        type="file"
                        onChange={(event) => {
                            const file = event.target.files[0];
                            if(file && file.type.substr(0, 5) === 'image') {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setImage(reader.result);
                                }
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                </Button>
            )}
            {image && (
                <Button
                    component="submit"
                    variant="contained"
                    color="secondary"
                    style={{ borderRadius: 300, width: 450, marginTop: 15 }}
                    onClick={() => setStep(11)}
                >
                    <b>Continuar</b>
                </Button>
            )}
            {!image && (
                <div style={{ marginTop: 15 }}>
                    <Link 
                        href="#"
                        underline="hover"
                        style={{ color: '#000', fontSize: 16 }}
                        component="button"
                        onClick={() => setStep(11)}
                    >
                        Pular por enquanto
                    </Link>
                </div>
            )}
            {image && (
                <div style={{ marginTop: 15 }}>
                    <Link 
                        href="#"
                        underline="hover"
                        style={{ color: '#000', fontSize: 16 }}
                        component="button"
                        onClick={() => setImage(null)}
                    >
                        Remover minha foto
                    </Link>
                </div>
            )}
        </Box>
    )
}

export default StepTen;