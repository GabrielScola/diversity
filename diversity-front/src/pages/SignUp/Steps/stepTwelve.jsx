import React, { useContext } from 'react';
import { 
    Grid,
    Paper,
    Typography,
    Button,
} from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import Imagem from '../../../assets/images/foguete.jpg';
import { AuthContext } from '../../../contexts/AuthContext';

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

const StepTwelve = (props) => {
    const { user } = props;
    const { signIn } = useContext(AuthContext);
    const classes = styles();

    const handleAuthUser = async () => {
        await signIn(user);
    }

    return (
        <div>
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
                            <b>Seu cadastro foi realizado com sucesso!</b>
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
        </div>
    )
}

export default StepTwelve;
