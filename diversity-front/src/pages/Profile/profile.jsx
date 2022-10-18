import React, { useEffect, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../../layout/Header/After'
import Footer from '../../layout/Footer/Footer'
import {
    Box,
    Paper,
    Grid,
    Avatar,
    Typography,
    Button,
    Modal,
    TextField,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Request from '../../helper/Request';
import Toast from '../../helper/Toast';

const useStyles = makeStyles((theme) => ({
    capa: {
        height: '30vh',
        width: '100%',
        borderTopLeftRadius: '10mm',
        borderTopRightRadius: '10mm',
        backgroundColor: '#e6eded'
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '100px',
        marginTop: '-330px'
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        marginRight: '25px',
        marginTop: '-150px'
    }
}));

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

const Profile = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState();
    const [newPic, setNewPic] = useState();
    const [modalAvatar, setModalAvatar] = useState(false);
    const [modalPerfil, setModalPerfil] = useState(false);
    const [opcCidades, setOpcCidades] = useState([]);
    const [openOpcCidades, setOpenOpcCidades] = useState(false);
    const loadingOpc = openOpcCidades && opcCidades.length === 0;
    const pathId = window.location.pathname.split('/')[2];
    const userOwner = user.id === parseInt(pathId);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Request(
                'GET',
                `/user/${pathId}`,
                null,
                null,
                null
            );

            if (!response.success) {
                navigate('/');
                Toast.error(response.message);
            } else {
                setUserInfo(response.data);
                setNewPic(response.data.imagem_perfil);
            }
            setLoading(false);
        }

        if (!userInfo)
            fetchData();
    }, [pathId, navigate, userInfo]);

    useEffect(() => {
        let active = true;

        if (!loadingOpc) {
            return undefined;
        }

        const fetchData = async () => {
            const response = await Request(
                'POST',
                '/autocomplete/city',
                null,
                null,
                null,
                null
            )

            if (active && response.success && response.data.length > 0)
                setOpcCidades(response.data);
        }

        fetchData();
        return () => {
            active = false
        }
    }, [loadingOpc])

    useEffect(() => {
        if (!openOpcCidades) {
            setOpcCidades([]);
        }
    }, [openOpcCidades]);

    const handleOpenAvatar = () => {
        setNewPic(userInfo.imagem_perfil)
        setModalAvatar(true);
    };
    const handleCloseAvatar = () => {
        setModalAvatar(false);
    };

    const handleOpenPerfil = () => {
        setModalPerfil(true);
    };
    const handleClosePerfil = () => {
        setModalPerfil(false);
    };

    const handleClickRemove = (e) => {
        e.preventDefault();
        setNewPic('');
    }

    const handleClickSaveAvatar = async (e) => {
        e.preventDefault();
        const response = await Request(
            'PUT',
            `/user/update-avatar`,
            null,
            { id: user.id, newPic: newPic },
            null,
            null
        )

        if (!response.success) {
            Toast.error(response.message);
        } else {
            handleCloseAvatar();
            window.location.reload(false);
        }
    }

    const handleClickSaveProfile = async (data) => {
        if (data) {

            const response = await Request(
                'PUT',
                '/user/update-perfil',
                null,
                { ...data, id: user.id },
                null,
                null
            )

            if (!response.success) {
                Toast.error(response.message);
            } else {
                handleClosePerfil();
                window.location.reload(false);
            }
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
                <>
                    <Box sx={{
                        marginTop: '5vh',
                        justifyContent: 'center',
                        display: 'flex',
                        '& > :not(style)': {
                            width: '120vh',
                            height: '80vh'
                        }
                    }}>
                        <Grid container component={Paper} elevation={3} sx={{ borderRadius: 10 }}>
                            <Grid item className={classes.capa} />
                            <Grid item sx={{ width: '100%' }}>
                                <div className={classes.root}>
                                    <Avatar
                                        alt="avatar"
                                        src={userInfo?.imagem_perfil}
                                        sx={{ height: 200, width: 200, cursor: 'pointer' }}
                                        onClick={() => userOwner ? handleOpenAvatar(true) : null}
                                    />
                                    <Typography variant='h5' sx={{ marginTop: 1, marginLeft: 2 }} >
                                        <b>{userInfo?.nome}</b><br />
                                    </Typography>
                                    <Typography variant='body' sx={{ marginLeft: 2 }} >
                                        {userInfo?.titulo ? userInfo?.titulo : `${userInfo?.profissao} ${userInfo?.empresa ? ` na empresa ${userInfo?.empresa}` : ''}`} <br />
                                        {userInfo?.localizacao}
                                    </Typography>
                                </div>
                                {userOwner && (
                                    <div className={classes.button}>
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            sx={{ borderRadius: '300px' }}
                                            onClick={() => handleOpenPerfil()}
                                        >
                                            <b>Editar Perfil</b>
                                        </Button>
                                    </div>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                    <Modal
                        open={modalAvatar}
                        onClose={handleCloseAvatar}
                    >
                        <Paper sx={{ ...modalStyle, width: 600 }}
                            elevation={3}
                        >
                            <Typography variant='h6'>
                                <b>Editar foto</b>
                            </Typography>
                            <div style={{ marginLeft: 100, marginTop: 100 }}>
                                <Avatar
                                    sx={{ height: 350, width: 350, border: '1px' }}
                                    src={newPic}
                                    variant='rounded'
                                />
                            </div>
                            <div style={{ marginTop: 100, display: 'flex', flexDirection: 'row', justifyContent: 'end', marginBottom: 15 }}>
                                <Button
                                    color='text'
                                    variant='contained'
                                    sx={{ borderRadius: '300px' }}
                                    onClick={(e) => handleClickRemove(e)}
                                >
                                    <b>Remover foto</b>
                                </Button>
                                <Button
                                    component="label"
                                    color='text'
                                    variant='contained'
                                    sx={{ borderRadius: '300px', marginLeft: 1 }}
                                >
                                    <b>Alterar foto</b>
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={(event) => {
                                            event.preventDefault();
                                            const file = event.target.files[0];
                                            if (file && file.type.substr(0, 5) === 'image') {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setNewPic(reader.result);
                                                }
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </Button>
                                <Button
                                    color='secondary'
                                    variant='contained'
                                    sx={{ borderRadius: '300px', marginLeft: 1, marginRight: 2, }}
                                    onClick={(e) => handleClickSaveAvatar(e)}
                                >
                                    <b>Salvar</b>
                                </Button>
                            </div>
                        </Paper>
                    </Modal>
                    <Modal
                        hideBackdrop
                        open={modalPerfil}
                        onClose={handleClosePerfil}
                    >
                        <Paper
                            sx={{ ...modalStyle, width: 750, paddingRight: 3 }}
                            elevation={3}
                        >
                            <Typography variant='h6'>
                                <b>Editar perfil</b>
                            </Typography>
                            <div style={{ marginTop: 65 }}>
                                <form className={'form'} onSubmit={handleSubmit(handleClickSaveProfile)}>
                                    <TextFieldStyled
                                        label='Nome'
                                        type='text'
                                        variant='outlined'
                                        {...register('nome', { required: true })}
                                        defaultValue={userInfo?.nome.split(' ')[0]}
                                        color='secondary'
                                        margin='normal'
                                        fullWidth
                                        size='small'
                                        error={!!errors.nome}
                                        helperText={errors.nome && <span>Campo obrigatório!</span>}
                                    >
                                    </TextFieldStyled>
                                    <TextFieldStyled
                                        label='Sobrenome'
                                        type='text'
                                        variant='outlined'
                                        {...register('sobrenome', { required: true })}
                                        defaultValue={userInfo?.nome.split(' ')[1]}
                                        color='secondary'
                                        margin='normal'
                                        fullWidth
                                        size='small'
                                        error={!!errors.sobrenome}
                                        helperText={errors.sobrenome && <span>Campo obrigatório!</span>}
                                    />
                                    <TextFieldStyled
                                        label='Título'
                                        type='text'
                                        variant='outlined'
                                        {...register('titulo')}
                                        defaultValue={userInfo?.titulo ? userInfo?.titulo : `${userInfo?.profissao}${userInfo?.empresa ? ` na empresa ${userInfo?.empresa}` : ''}`}
                                        color='secondary'
                                        margin='normal'
                                        fullWidth
                                        size='small'
                                    />
                                    <Autocomplete
                                        id="combo-box"
                                        sx={{ margin: 'auto' }}
                                        options={opcCidades}
                                        open={openOpcCidades}
                                        onOpen={() => {
                                            setOpenOpcCidades(true);
                                        }}
                                        onClose={() => {
                                            setOpenOpcCidades(false);
                                        }}
                                        defaultValue={userInfo?.localizacao}
                                        loading={loadingOpc}
                                        renderInput={(params) => (
                                            <TextFieldStyled
                                                {...params}
                                                label='Cidade/Estado'
                                                type='text'
                                                variant='outlined'
                                                {...register('cidade', { required: true })}
                                                color='secondary'
                                                margin='normal'
                                                fullWidth
                                                size='small'

                                            />
                                        )}
                                    />
                                    <ChildModal userInfo={userInfo} register={register} />
                                    <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 65 }}>
                                        <Button
                                            variant="contained"
                                            color="text"
                                            sx={{ borderRadius: 300 }}
                                            onClick={() => handleClosePerfil()}
                                        >
                                            <b>Cancelar</b>
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            sx={{ borderRadius: 300, marginLeft: 1 }}
                                            onClick={() => handleClickSaveProfile()}
                                        >
                                            <b>Salvar</b>
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Paper>
                    </Modal>
                    <Box mt={3}>
                        <Footer />
                    </Box>
                </>
            )}
        </div>
    )
}

function ChildModal(props) {
    const { userInfo, register } = props;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 300, marginTop: 5 }}>
                <Typography variant='body'>
                    Informações de contato
                </Typography>
                <Button
                    onClick={handleOpen}
                    color='secondary'
                >
                    Editar informações de contato
                </Button>
                <Modal
                    hideBackdrop
                    open={open}
                    onClose={handleClose}
                >
                    <Paper
                        sx={{ ...modalStyle, width: 500, paddingRight: 3 }}
                        elevation={3}
                    >
                        <Typography variant='h6'>
                            <b>Editar informações de contato</b>
                        </Typography>
                        <div style={{ marginTop: 40 }}>
                            <TextFieldStyled
                                label='URL do perfil'
                                type='text'
                                variant='outlined'
                                defaultValue={window.location}
                                color='secondary'
                                margin='normal'
                                disabled
                                fullWidth
                                size='small'
                            />
                            <TextFieldStyled
                                label='E-mail'
                                type='text'
                                variant='outlined'
                                defaultValue={userInfo?.email}
                                color='secondary'
                                margin='normal'
                                disabled
                                fullWidth
                                size='small'
                            />
                            <TextFieldStyled
                                label='Telefone'
                                type='text'
                                {...register('telefone')}
                                variant='outlined'
                                defaultValue={userInfo?.telefone}
                                color='secondary'
                                margin='normal'
                                fullWidth
                                size='small'
                            />
                            <TextFieldStyled
                                label='Endereço'
                                type='text'
                                {...register('endereco')}
                                variant='outlined'
                                defaultValue={userInfo?.endereco}
                                color='secondary'
                                margin='normal'
                                fullWidth
                                size='small'
                            />
                            <TextFieldStyled
                                label='Aniversário'
                                type='text'
                                {...register('aniversario')}
                                variant='outlined'
                                defaultValue={`${userInfo?.dt_aniversario.split('-')[2].split('T')[0]}/${userInfo?.dt_aniversario.split('-')[1]}`}
                                color='secondary'
                                margin='normal'
                                fullWidth
                                size='small'
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 40 }}>
                            <Button
                                variant="contained"
                                color="text"
                                sx={{ borderRadius: 300 }}
                                onClick={() => handleClose()}
                            >
                                <b>Cancelar</b>
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ borderRadius: 300, marginLeft: 1 }}
                                onClick={() => handleClose()}
                            >
                                <b>Salvar</b>
                            </Button>
                        </div>
                    </Paper>
                </Modal>
            </div>
        </React.Fragment>
    )
}

export default Profile;

