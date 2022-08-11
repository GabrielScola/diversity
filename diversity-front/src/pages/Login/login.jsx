import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthContext';
import { 
    Grid,
    Paper,
    Typography,
    Button,
    TextField,
} from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import { styled } from '@mui/material/styles';
import ImageLogin from '../../assets/images/home_page.jpg';
import Logo from '../../assets/images/logo.png';

const useStyles = makeStyles((theme) => ({
    header: {
        height: '15vh',
        //paddingTop: '7.5vh',
        paddingLeft: '35px',
    },
    root: {
        height: '85vh',
    },
    paper: {
        margin: theme.spacing(8, 4),
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
    const classes = useStyles();

    async function handleSignIn(data) {
        await signIn(data);
    }

    return (
        <div>
        <Grid container component="header" className={classes.header}>
            <div className={classes.logo}>
                <img src={Logo} alt="Logo" />
            </div>
        </Grid>
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
                    <Typography component='h1' variant='h5'>
                        Conheça sua nova comunidade profissional
                        direcionada a diversidade e inclusão
                    </Typography>
                    <h1 className="title">Login</h1>
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
                            type="password"
                            {...register('password', { required: true })}
                            variant="outlined" 
                            color="secondary"
                            margin="dense"
                            fullWidth
                            size="small"
                            error={!!errors.password}
                            helperText={ errors.password && <span>Campo obrigatório!</span> }
                        >
                        </TextFieldStyled>
                        <p>Esqueceu a senha?</p>
                        <br />
                        <br />
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            style={{borderRadius: "300px"}}
                            fullWidth
                        >
                            Entrar
                        </Button>
                    </form>
                </div>
            </Grid>
            <Grid item xs={false} sm={6} md={8} className={classes.image} />
        </Grid>
        </div>
    );
};

export default Login;