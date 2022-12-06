import React, { useContext, useEffect, useState } from 'react';
import {
    Grid,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Typography,
    Badge,
    Button,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/styles';
import Logo from '../../assets/images/logo.png';
import { Groups, BusinessCenter, Forum, Notifications, KeyboardArrowDown } from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import Request from '../../helper/Request';
import Chat from '../../components/Chat/index';
import Notification from '../../components/Notification/index';

const styles = makeStyles(() => ({
    header: {
        height: '8vh',
        zIndex: 1
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
    const [anchorElNotification, setAnchorElNotification] = useState(null);
    // const [image, setImage] = useState(null);
    const [openChat, setOpenChat] = useState(false);
    const [notification, setNotification] = useState();
    const [notificationLength, setNotificationLength] = useState(0);
    const { signOut, user, userImage } = useContext(AuthContext);
    const open = Boolean(anchorEl);
    const openNotification = Boolean(anchorElNotification);
    const id = open ? 'simple-popover' : undefined;
    const navigate = useNavigate();

    useEffect(() => {        
        const fetchDataNotification = async () => {
            const response = await Request(
                'GET',
                `/notification/${user.id}`,
                null,
                null,
                null,
                null,
            )

            if (response.data && response.data.length > 0) {
                setNotification(response.data);
                setNotificationLength(response.data.length)
            }
        }

        if (!notification)
            fetchDataNotification();
    }, [user, notification])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickNotification = (event) => {
        setAnchorElNotification(event.currentTarget);
        setNotificationLength(0);
    };

    const handleCloseNotification = () => {
        setAnchorElNotification(null);
    };

    const handleClickProfile = (e) => {
        e.preventDefault();
        navigate(`/perfil/${user.id}`);
        window.location.reload(false);
    }

    const handleClickConfigs = (e) => {
        e.preventDefault();
        navigate(`/configuracoes`);
        handleClose();
    }

    const handleClickMyCompany = (e) => {
        e.preventDefault();
        navigate(`/empresa/${user.empresa}`);
        window.location.reload(false);
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

    const handleClickPremium = (e) => {
        e.preventDefault();
        navigate('/assinar-premium');
    }

    const classes = styles();
    return (
        <>
            <Grid
                container
                component={Paper}
                elevation={3}
                className={classes.header}
                sx={{
                    paddingLeft: '15px',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                <Grid
                    item
                    xs={false}
                    sm={2}
                    md={6}
                >
                    <div>
                        <a href="/">
                            <img src={Logo} alt="Logo" style={{ height: '30px' }} />
                        </a>
                    </div>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={10}
                    md={6}
                    sx={{ textAlign: 'end', paddingRight: 2 }}
                >
                    <div>
                        <StyledIconButton disableRipple sx={{ flexDirection: 'column' }} onClick={() => navigate('/minha-rede')} >
                            <Groups sx={{ fontSize: 35 }} className={classes.icon} />
                            <StyledTypography>Minha rede</StyledTypography>
                        </StyledIconButton>

                        <StyledIconButton sx={{ marginLeft: 5, flexDirection: 'column' }} disableRipple onClick={() => navigate('/vagas')}>
                            <BusinessCenter sx={{ fontSize: 35 }} className={classes.icon} />
                            <StyledTypography>Vagas</StyledTypography>
                        </StyledIconButton>

                        <StyledIconButton sx={{ marginLeft: 5, flexDirection: 'column' }} disableRipple onClick={() => setOpenChat(true)}>
                            <Forum sx={{ fontSize: 35 }} className={classes.icon} />
                            <StyledTypography>Mesagens</StyledTypography>
                        </StyledIconButton>

                        <StyledIconButton sx={{ marginLeft: 3, flexDirection: 'column' }} disableRipple onClick={handleClickNotification}>
                            <Badge
                                badgeContent={notificationLength}
                                max={99}
                                color="secondary"
                                sx={{'& .MuiBadge-badge': {right: -3, top: 5}}}
                            >
                                <Notifications sx={{ fontSize: 35 }} className={classes.icon}/>
                            </Badge>
                            <StyledTypography>Notificações</StyledTypography>
                        </StyledIconButton>

                        <StyledIconButton sx={{ marginLeft: 4 }} disableRipple onClick={handleClick}>
                            <Avatar
                                alt="avatar"
                                src={userImage}
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
                            <MenuItem onClick={(e) => handleClickConfigs(e)}>Configurações</MenuItem>
                            {user.empresa && (
                                <>
                                    <Divider />
                                    <MenuItem onClick={(e) => handleClickMyCompany(e)}>Minha empresa</MenuItem>
                                    <MenuItem onClick={(e) => handleClickAnnoucement(e)}>Anunciar vaga</MenuItem>
                                </>
                            )}
                            <Divider />
                            <MenuItem onClick={(e) => handleClickSignOut(e)}>Logout</MenuItem>
                        </Menu>
                        {!user.premium && user.empresa && (
                            <Button 
                                color="secondary"
                                sx={{marginLeft: 2}}
                                onClick={(e) => handleClickPremium(e)}
                            >
                                <b>Experimente o<br /> premium</b>
                            </Button>
                        )}
                    </div>
                </Grid>
            </Grid>
            {openChat && (
                <Chat
                    open={openChat}
                    setOpen={setOpenChat}
                />
            )}
            {anchorElNotification && (
                <Notification
                    id={id}
                    open={openNotification}
                    anchorEl={anchorElNotification}
                    handleClose={handleCloseNotification}
                    setOpenChat={setOpenChat}
                    notifications={notification}
                    userId={user.id}
                />
            )}
        </>
    )
}

export default React.memo(Header);