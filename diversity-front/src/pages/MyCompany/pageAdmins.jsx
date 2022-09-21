import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Chip,
    Button,
    Grid,
    Paper,
    Avatar,
    Typography,
    CircularProgress,
    Modal,
    IconButton,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Autocomplete,
    TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import { KeyboardArrowDown, Delete, ArrowBack } from '@mui/icons-material';
import Header from '../../layout/Header/After';
import Footer from '../../layout/Footer/Footer';
import Request from '../../helper/Request';
import Toast from '../../helper/Toast';

const StyledIconButton = styled(IconButton)({    
    '&:hover': {
        color: '#8735C7',
    }
})

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    paddingLeft: 3,
    paddingTop: 1,
    borderRadius: 5,
}

const PageAdmins = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [admins, setAdmins] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [opcUsers, setOpcUsers] = useState(null);
    const [openOpcUsers, setOpenOpcUsers] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [newAdmin, setNewAdmin] = useState(null);
    const [deleteAdmin, setDeleteAdmin] = useState(null);
    const openMenu = Boolean(anchorEl);
    const loadingAutocomplete = openOpcUsers && opcUsers.length === 0;

    useEffect(() => {
        const fetchData = async () => {
            const response = await Request(
                'GET',
                `/my-company/admin/${user.id}`,
                null,
                null,
                null,
                null,
            )

            if (!response.success) {
                navigate('/');
                Toast.error(response.message);
                setLoading(false);
            } else {
                setCompanyInfo(response.data.empresa);
                setAdmins(response.data.admins);
                setLoading(false);                
            }
        }
        if (!companyInfo) {
            fetchData();
        }
    }, [companyInfo, navigate, user]);

    useEffect(() => {
        let active = true;

        if (!loadingAutocomplete) {
            return undefined;
        }

        const fetchData = async () => {
            const response = await Request(
                'POST',
                '/autocomplete/add-admins',
                null,
                null,
                null, 
                null
            )

            if (active && response.success && response.data.length > 0)
                setOpcUsers(response.data);
        }

        fetchData();
        return () => {
            active = false
        }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingAutocomplete])

    useEffect(() => {
        if (!openOpcUsers) {
            setOpcUsers([]);
        }
      }, [openOpcUsers]);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleOpenDelete = (id) => {
        setOpenDelete(true);
        setDeleteAdmin(id);
    }

    const handleCloseDelete = () => {
        setOpenDelete(false);
    }

    const handleDelete = async (e) => {
        e.preventDefault();

        const response = await Request(
            'DELETE',
            `/my-company/admin/${deleteAdmin}`,
            null,
            null,
            null,
            null,
        );

        if (!response.success) {
            Toast.error(response.message);
        } else {
            window.location.reload(false);
        }
    }

    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    

    const handleAddAdmin = async () => {
        const response = await Request(
            'POST',
            `/my-company/add-admin`,
            null,
            {id: newAdmin, codempresa: companyInfo.codempresa},
            null,
            null
        );

        if(!response.success) {
            Toast.error(response.message);
        } else {
            window.location.reload(false);
        }
    }

    return (
        <div>
            <Header />
            {loading ? (
                <div style={{ marginTop: 150, display: 'flex', justifyContent: 'center' }}
                >
                    <CircularProgress color='secondary' size={100} />
                </div>
            ) : (
                <div>
                    <Box
                        mt={'5vh'}
                        sx={{ marginLeft: 75, marginRight: 75 }}
                    >                        
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Typography variant='h4'>
                                    <b>{companyInfo.nome}</b>
                                </Typography>
                                <Chip label="Versão do administrador" color="secondary" sx={{ marginLeft: 2 }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <StyledIconButton disableRipple onClick={handleOpenMenu}>
                                    <Typography variant="body2">Configurações</Typography>
                                    <KeyboardArrowDown />
                                </StyledIconButton>
                                <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleCloseMenu}
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
                                <MenuItem onClick={() => handleCloseMenu()}>Gerenciar administradores</MenuItem>
                                <MenuItem >Cancelar premium</MenuItem>
                                <MenuItem >Desativar página</MenuItem>
                            </Menu>
                            </div>
                        </div>
                    </Box>
                    <Box sx={{
                        marginTop: '2vh',
                        justifyContent: 'center',
                        display: 'flex',
                        '& > :not(style)': {
                            width: '80vh',
                        }
                    }}>
                        <Grid container component={Paper} elevation={3} sx={{ borderRadius: 10 }}>                                
                            <div style={{ paddingLeft: '25px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ justifyContent: 'flex-start' }}>
                                <IconButton
                                    onClick={() => navigate(`/empresa/${companyInfo.codempresa}`)}
                                >
                                    <ArrowBack style={{ color: 'grey' }} />
                                </IconButton>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant='h6'>
                                        <b>Administradores da página</b>
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ borderRadius: 300, marginLeft: 15 }}
                                        onClick={() => handleOpenModal()}
                                    >
                                        <b>+ Adicionar Administradores</b>
                                    </Button>
                                </div>
                                <div style={{ marginLeft: 15 , marginTop: 45, display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1">
                                        Perfil
                                    </Typography>
                                    <Typography variant="body1">
                                        Ações
                                    </Typography>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <List sx={{ width: '100%' }}>
                                        {admins.map((data) => (
                                            <ListItem
                                                secondaryAction={
                                                    data.id !== user.id ? (
                                                    <IconButton 
                                                        edge="end" 
                                                        aria-label="delete"
                                                        onClick={() => handleOpenDelete(data.id)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                    ) : ''
                                                }
                                            >
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt="avatar"
                                                    src={data.imagem_perfil}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={data.nome}
                                                secondary={data.titulo ?? ''}
                                            />
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            </div>
                        </Grid>
                    </Box>
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                    >
                        <Paper
                            sx={{ ...modalStyle, width: 500, paddingRight: 3 }}
                            elevation={3}
                        >
                            <Typography variant='h6'>
                                <b>Adicionar administrador da página</b>
                            </Typography>
                            <Autocomplete 
                                id="combo-box"
                                sx={{ margin: 'auto' }}
                                options={opcUsers}
                                open={openOpcUsers}
                                onOpen={() => {
                                    setOpenOpcUsers(true);
                                }}
                                onClose={() => {
                                    setOpenOpcUsers(false);
                                }}
                                onChange={(_event, newValue) => {
                                    setNewAdmin(newValue.value);
                                }}
                                loading={loading}
                                renderInput={(params) => (
                                    <TextFieldStyled
                                        {...params}
                                        placeholder="Procure um usuário"
                                        fullWidth
                                        required
                                        color="secondary"
                                        size="small"
                                        sx={{ marginTop: 3 }}
                                    />
                                )}
                            />
                            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 30 }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ borderRadius: 300 }}
                                    onClick={() => handleAddAdmin()}
                                >
                                    <b>adicionar</b>
                                </Button>
                            </div>
                        </Paper>
                    </Modal>
                    <Modal
                        open={openDelete}
                        onClose={handleCloseDelete}
                    >
                        <Paper
                            sx={{ ...modalStyle, width: 500, paddingRight: 3 }}
                            elevation={3}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                                <Typography variant='h6'>
                                    <b>Remover administrador</b>
                                </Typography>
                                <Typography variant='body1' sx={{ marginTop: 1 }}>
                                    Você tem certeza que deseja remover esse usuário de administrador da página?
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 15, marginTop: 30 }}>
                                <Button
                                    variant="contained"
                                    color="text"
                                    sx={{ borderRadius: 300 }}
                                    onClick={() => handleCloseDelete()}
                                >
                                    <b>Cancelar</b>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ borderRadius: 300, marginLeft: 2 }}
                                    onClick={(e) => handleDelete(e)}
                                >
                                    <b>Remover</b>
                                </Button>
                            </div>
                        </Paper>
                    </Modal>
                    <Box mt={5}>
                        <Footer />
                    </Box>
                </div>
            )}
        </div>
    )
}

export default PageAdmins;