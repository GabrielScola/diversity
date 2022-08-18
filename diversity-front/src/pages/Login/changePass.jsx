import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { 
    Grid,
    Paper,
    Typography,
    Button,
    TextField,
    Box,
    Zoom,
} from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import { styled } from '@mui/material/styles';
import Toast from '../../helper/Toast';
import Request from '../../helper/Request';
import Header from '../../layout/Header/Before';
import Footer from '../../layout/Footer/Footer';
import Imagem from '../../assets/images/foguete.jpg';
import { AuthContext } from '../../contexts/AuthContext';

const styles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(15, 10),
        display: 'flex',
        flexDirection: 'column',
    },
    root2: {
        margin: theme.spacing(5, 10),
        textAlign: 'center'
    },
    image: {
        backgroundImage: `url(${Imagem})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
    }
}));

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const RecoverPass = (props) => {
    const { register, handleSubmit, formState: { errors }} = useForm();
    const [ user, setUser ] = useState();
    const [ transition, setTransition ] = useState(false);
    const { signIn } = useContext(AuthContext);
    const classes = styles();

    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };

    const handleChangePass = async (data) => {
        if(data.password.length < 6) {
            Toast.error('A senha deve ter no mínimo 6 caracteres!')
        } else if (data.password !== data.confirmPass) {
            Toast.error('As senhas não são iguais.')
        } else {
            const token = await parseJwt(window.location.search);
            const body = { ID: token.id, PASSWORD: data.password };

            const response = await Request(
                'POST',
                `/change-pass`,
                null,
                body,
                null,
                null
            );

            if(response.success) {
                setUser({ email: token.email, password: data.password });
                setTransition(true);
            } else {
                Toast.error(response.message);
            }
        }
    }

    const handleAuthUser = async () => {
        await signIn(user);
    }

    return (
        <div>
            <Header />
            <Zoom in={!transition} mountOnEnter unmountOnExit >
                <Grid
                    container
                    style={{paddingTop: '10vh'}}
                >
                    <Grid item md={4} sm={2}/>
                    <Grid 
                        item
                        xs={12}
                        sm={8}
                        md={4}
                        component={Paper}
                        elevation={3}
                        style={{borderRadius: '15px'}}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <form className={classes.root} onSubmit={handleSubmit(handleChangePass)}>
                            <Typography 
                                component="h1" 
                                variant="h5" 
                                color="secondary"
                            >
                                <b>Alterar minha senha</b>
                            </Typography>
                            <br />
                            <TextFieldStyled
                                label="Nova senha (6 ou mais caracteres)"
                                type="password"
                                {...register('password', { required: true })}
                                variant="outlined"
                                color="secondary"
                                margin="normal"
                                size="small"
                                fullWidth
                                autoFocus
                                error={!!errors.password}
                                helperText={ errors.password && <span>Campo obrigatório!</span> }
                            />
                            <TextFieldStyled
                                label="Confirme nova senha"
                                type="password"
                                {...register('confirmPass', { required: true })}
                                variant="outlined"
                                color="secondary"
                                margin="normal"
                                size="small"
                                fullWidth
                                sx={{ marginTop: 1 }}
                                error={!!errors.confirmPass}
                                helperText={ errors.confirmPass && <span>Campo obrigatório!</span> }
                            />
                            <br />
                            <Button
                                type="submit"
                                color='secondary'
                                variant='contained'
                                className={classes.button}
                                style={{borderRadius: "300px"}}
                                fullWidth
                            >
                                <b>Alterar senha</b>
                            </Button>
                        </form>
                    </Grid>
                    <Grid item md={4} sm={2} />
                </Grid>
            </Zoom>
            <Zoom in={transition} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
            <Grid
                    container
                    style={{paddingTop: '10vh'}}
                >
                    <Grid item md={4} sm={2}/>
                    <Grid 
                        item
                        xs={12}
                        sm={8}
                        md={4}
                        component={Paper}
                        elevation={3}
                        style={{borderRadius: '15px'}}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <div className={classes.root2}>
                            <Typography 
                                component="h1" 
                                variant="h5" 
                                color="secondary"
                            >
                                <b>Sua senha foi alterada com sucesso!</b>
                            </Typography>
                            <img src={Imagem} alt="" style={{width: 250, height: 250}} />
                            <Button
                                color='secondary'
                                variant='contained'
                                className={classes.button}
                                style={{borderRadius: "300px"}}
                                fullWidth
                                onClick={() => handleAuthUser()}
                            >
                                <b>Acessar o Diversity</b>
                            </Button>
                        </div>
                    </Grid>
                    <Grid item md={4} sm={2} />
                </Grid>
            </Zoom>
            <Box mt={5}>
                <Footer />
            </Box>
        </div>
    )
}

export default RecoverPass;
