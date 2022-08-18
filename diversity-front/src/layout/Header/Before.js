import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Button } from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import Logo from '../../assets/images/logo.png';

const styles = makeStyles(() => ({
    header: {
        height: '15vh',
        paddingTop: '3vh',
        paddingLeft: '13px',
    },
    cadastrar: {
        position: 'absolute',
        right: '15vh'
    },
}));

const Header = (props) => {
    const classes = styles();
    const navigate = useNavigate();
    const { signUp } = props;

    const handleClick = () => {
        navigate('/cadastrar');
    }

    return (
        <Grid container component="header" className={classes.header}>
            <div>
                <a href="/">
                    <img src={Logo} alt="Logo" style={{height: '55px'}} />
                </a>
            </div>
            {!signUp && (
                <div className={classes.cadastrar} >
                    <Button
                        color="secondary"
                        size="large"
                        onClick={() => handleClick()}
                        // variant="outlined"
                    >
                        <b>Cadastre-se agora</b>
                    </Button>
                </div>
            )}
        </Grid>
    )
}

export default React.memo(Header);
