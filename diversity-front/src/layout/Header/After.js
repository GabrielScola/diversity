import React, { useContext, useEffect, useState } from 'react';
import { 
    Grid, 
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/styles';
import Logo from '../../assets/images/logo.png';
import { Groups, BusinessCenter, Forum, Notifications, KeyboardArrowDown } from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import Request from '../../helper/Request';

const styles = makeStyles(() => ({
    header: {
        height: '8vh',
    },
}));

const StyledIconButton = styled(IconButton)({    
    '&:hover': {
        color: '#8735C7',
    }
})

const StyledTypography = styled(Typography)({    
    fontSize: 15
})

const Header = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [image, setImage] = useState(null);
    const { signOut, user } = useContext(AuthContext);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const response = await Request(
                'GET',
                `/user/image/${user.id}`,
                null,
                null,
                null,
                null,
            );

            setImage(response.data.imagem_perfil);
        }

        fetchData();
    }, [user])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickProfile = (e) => {
        e.preventDefault();
        navigate(`/perfil/${user.id}`);
        window.location.reload(false);
    }

    const handleClickMyCompany = (e) => {
        e.preventDefault();
        if(!user.empresa) {
            navigate('/minha-empresa');
        } else {
            navigate(`/empresa/${user.empresa}`);
        }
        handleClose();
    }

    const handleClickAnnoucement = (e) => {
        e.preventDefault();
        navigate('/anunciar-vaga');
        handleClose();
    }
    
    const handleClickSignOut = (e) => {    
        e.preventDefault();
        signOut();
    }


    const classes = styles();
    return (
        <Grid 
            container 
            component="header" 
            className={classes.header} 
            sx={{ 
                paddingLeft: '15px',
                display: 'flex',
                alignItems: 'center'
            }}>
            <Grid
                item
                xs={false}
                sm={2}
                md={6}
            >
                <div>
                    <a href="/">
                        <img src={Logo} alt="Logo" style={{height: '30px'}} />
                    </a>
                </div>
            </Grid>
            <Grid
                item
                xs={12}
                sm={10}
                md={6}
                sx={{ textAlign: 'end', paddingRight: 5 }}
            >
                <div>
                    <StyledIconButton disableRipple sx={{ flexDirection: 'column' }}  >
                            <Groups sx={{ fontSize: 35 }} className={classes.icon}/>
                            <StyledTypography>Minha rede</StyledTypography>
                    </StyledIconButton>

                    <StyledIconButton sx={{ marginLeft: 5, flexDirection: 'column' }} disableRipple onClick={() => navigate('/vagas')}>
                            <BusinessCenter sx={{ fontSize: 35 }} className={classes.icon}/>
                            <StyledTypography>Vagas</StyledTypography>
                    </StyledIconButton>

                    <StyledIconButton sx={{ marginLeft: 5, flexDirection: 'column' }} disableRipple >
                            <Forum sx={{ fontSize: 35 }} className={classes.icon}/>
                            <StyledTypography>Mesagens</StyledTypography>
                    </StyledIconButton>

                    <StyledIconButton sx={{ marginLeft: 3, flexDirection: 'column' }} disableRipple>
                            <Notifications sx={{ fontSize: 35 }} className={classes.icon}/>
                            <StyledTypography>Notificações</StyledTypography>
                    </StyledIconButton>

                    <StyledIconButton sx={{ marginLeft: 4}} disableRipple onClick={handleClick}>
                        <Avatar 
                            alt="avatar"
                            src={image}
                        />
                        <KeyboardArrowDown />
                    </StyledIconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        elevation={2}
                    >
                        <MenuItem onClick={(e) => handleClickProfile(e)}>Perfil</MenuItem>
                        <MenuItem onClick={(e) => handleClickMyCompany(e)}>Minha empresa</MenuItem>
                        {user.empresa ? 
                            <MenuItem onClick={(e) => handleClickAnnoucement(e)}>Anunciar vaga</MenuItem> : ''
                        }
                        <Divider />
                        <MenuItem onClick={(e) => handleClickSignOut(e)}>Logout</MenuItem>
                    </Menu>
                </div>
            </Grid>
        </Grid>
    )
}

export default React.memo(Header);
