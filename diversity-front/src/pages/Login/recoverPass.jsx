import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
    Grid,
    Paper,
    Typography,
    Button,
    TextField,
    IconButton,
    Link,
    Box,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { makeStyles } from '@material-ui/styles';
import { styled } from '@mui/material/styles';
import Toast from '../../helper/Toast';
import Request from '../../helper/Request';
import Header from '../../layout/Header/Before';
import Footer from '../../layout/Footer/Footer';

const styles = makeStyles((theme) => ({
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

    const handleRecoverPass = async (data) => {
        if (!enviado) {
            const id = Toast.loading();

            const response = await Request(
                'POST',
                '/recover-pass',
                null,
                data,
                null,
                null
            )

            if(!response.success) {
                Toast.updateError(id, response.message, true);
            } else {
                Toast.updateSuccess(id, response.message, false);
                setEnviado(true);
            }
        }
    }

    return (
        <div>
            <Header />
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
                    <IconButton style={{ position: "absolute", }} component={Link} href={'/'}>
                            <ArrowBackIcon style={{ color: 'grey' }} />
                    </IconButton>
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
                            helperText={ errors.email && <span>Campo obrigat??rio!</span> }
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
            <Box mt={5}>
                <Footer />
            </Box>
        </div>
    )
}

export default RecoverPass;
