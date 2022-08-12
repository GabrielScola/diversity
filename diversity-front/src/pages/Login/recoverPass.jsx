import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
    Grid,
    Paper,
    Typography,
    Button,
    TextField,
    IconButton,
    // Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { makeStyles } from '@material-ui/styles';
import { styled } from '@mui/material/styles';
import Logo from '../../assets/images/logo.png';
import Toast from '../../helper/Toast';

const styles = makeStyles((theme) => ({
    header: {
        height: '15vh',
        paddingTop: '3vh',
        paddingLeft: '13px',
    },
    root: {
        margin: theme.spacing(15, 10),
        display: 'flex',
        flexDirection: 'column',
    }
}));

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const RecoverPass = () => {
    const { register, handleSubmit, formState: { errors }} = useForm();
    const [ enviado, setEnviado ] = useState();
    const classes = styles();

    const handleRecoverPass = (data) => {
        console.log(enviado);
        if (!enviado) {
            const id = Toast.loading();
            setTimeout(() => Toast.updateSuccess(id, "E-mail para redefinição de senha enviado com sucesso!"), 2000)
        }
        setEnviado(true);
    }

    return (
        <div>
            <Grid container component="header" className={classes.header}>
                <div className={classes.logo}>
                    <a href="/">
                        <img src={Logo} alt="Logo" style={{height: '55px'}} />
                    </a>
                </div>
            </Grid>
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
                    alignItems="center"
                    justifyContent="center"
                >
                    <a href='/'>
                        <IconButton style={{ position: "absolute", }}>
                                <ArrowBackIcon style={{ color: 'grey' }} />
                        </IconButton>
                    </a>
                    <form className={classes.root} onSubmit={handleSubmit(handleRecoverPass)}>
                        <Typography 
                            component="h1" 
                            variant="h5" 
                            color="secondary"
                        >
                            <b>Esqueci minha senha</b>
                        </Typography>
                        <br />
                        <TextFieldStyled
                            label="Informe seu e-mail"
                            type="email"
                            {...register('email', { required: true })}
                            variant="outlined"
                            color="secondary"
                            margin="normal"
                            size="small"
                            fullWidth
                            autoFocus
                            error={!!errors.email}
                            helperText={ errors.email && <span>Campo obrigatório!</span> }
                        />
                        <br />
                        <Button
                            type="submit"
                            color='secondary'
                            variant='contained'
                            className={classes.button}
                            style={{borderRadius: "300px"}}
                            fullWidth
                            disabled={enviado}
                        >
                            <b>Redefinir senha</b>
                        </Button>
                    </form>
                </Grid>
                <Grid item md={4} sm={2} />
            </Grid>
        </div>
    )
}

export default RecoverPass;
