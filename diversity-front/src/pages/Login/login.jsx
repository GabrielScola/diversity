import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthContext';
import { 
    Grid,
    Paper,
    Typography,
    Button,
    TextField,
    Link,
    Box,
    InputAdornment,
    IconButton,
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import { makeStyles } from '@material-ui/styles';
import { styled } from '@mui/material/styles';
import Header from '../../layout/Header/Before';
import Footer from '../../layout/Footer/Footer';
import ImageLogin from '../../assets/images/home_page.jpg';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '85vh',
    },
    paper: {
        margin: theme.spacing(15, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    image: {
        backgroundImage: `url(${ImageLogin})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: '500px'
    },
}));

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn } = useContext(AuthContext)
    const [ ocultar, setOcultar ] = useState(false);
    const classes = useStyles();

    async function handleSignIn(data) {
        await signIn(data);
    }

    return (
        <div>
            <Header />
            <Grid container component="main" className={classes.root}>
                <Grid 
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    component={Paper}
                    elevation={0}
                    square
                >
                    <div className={classes.paper}>
                        <Typography component='h3' variant='h5'>
                            <b>Conheça sua nova comunidade profissional
                            direcionada a diversidade e inclusão</b>
                        </Typography>
                        <br />
                        <form 
                            className={classes.form}
                            onSubmit={handleSubmit(handleSignIn)}
                        >
                            <TextFieldStyled 
                                label="E-mail" 
                                type="email"
                                {...register('email', { required: true })}
                                variant="outlined"
                                color="secondary"
                                margin="normal"
                                fullWidth
                                autoFocus
                                size="small"
                                error={!!errors.email}
                                helperText={ errors.email && <span>Campo obrigatório!</span> }
                            >
                            </TextFieldStyled>
                            <TextFieldStyled 
                                label="Senha" 
                                type={ ocultar ? "text" : "password"}
                                {...register('password', { required: true })}
                                variant="outlined" 
                                color="secondary"
                                margin="dense"
                                fullWidth
                                size="small"
                                error={!!errors.password}
                                helperText={ errors.password && <span>Campo obrigatório!</span> }
                                InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setOcultar((prev) => !prev)}
                                        >
                                            {ocultar ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                            >
                            </TextFieldStyled>
                            <Link
                                href="/esqueci-minha-senha"
                                underline="hover"
                                style={{color: 'black'}}
                            >
                                Esqueceu a senha?
                            </Link>
                            <br />
                            <br />
                            <br />
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                style={{borderRadius: "300px"}}
                                fullWidth
                            >
                                <b>Entrar</b>
                            </Button>
                            <Box mt={5}>
                                <Footer />
                            </Box>
                        </form>
                    </div>
                </Grid>
                <Grid item xs={false} sm={6} md={8} className={classes.image} />
            </Grid>
        </div>
    );
};

export default Login;