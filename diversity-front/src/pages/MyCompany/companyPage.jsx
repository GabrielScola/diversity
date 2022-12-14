import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Chip,
    Button,
    Grid,
    Paper,
    Link,
    Avatar,
    TextField,
    Typography,
    CircularProgress,
    Modal,
    InputAdornment,
    IconButton,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tooltip,
    Divider,
} from '@mui/material';
import { Send, KeyboardArrowDown, MoreVert, WorkOutline, Delete, Person } from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import { makeStyles } from '@material-ui/styles';
import { styled } from '@mui/material/styles';
import Header from '../../layout/Header/After';
import Footer from '../../layout/Footer/Footer';
import Request from '../../helper/Request';
import Toast from '../../helper/Toast';

import * as moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');

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
        marginTop: '-235px'
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        marginRight: '25px',
        marginTop: '-150px'
    }
}));

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    paddingLeft: 3,
    paddingTop: 1,
    borderRadius: 5,
    paddingRight: 3,
}

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const StyledIconButton = styled(IconButton)({
    '&:hover': {
        color: '#8735C7',
    }
})

const CompanyPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const pathId = window.location.pathname.split('/')[2];
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [loadingModal, setLoadingModal] = useState(true);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [newPic, setNewPic] = useState();
    const [modalAvatar, setModalAvatar] = useState(false);
    const [modalPerfil, setModalPerfil] = useState(false);
    const [modalVaga, setModalVaga] = useState(false);
    const [modalPremium, setModalPremium] = useState(false);
    const [modalDesativar, setModalDesativar] = useState(false);
    const [modalEditarPublicacao, setModalEditarPublicacao] = useState(false);
    const [publicacao, setPublicacao] = useState(null);
    const [publicacoes, setPublicacoes] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEdit, setAnchorEdit] = useState(null);
    const [companyVagas, setCompanyVagas] = useState();
    const [candidatos, setCandidatos] = useState();
    const [modalCandidatos, setModalCandidatos] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const openMenu = Boolean(anchorEl);
    const openMenuEdit = Boolean(anchorEdit);
    const userOwner = user.empresa === parseInt(pathId);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Request(
                'GET',
                `/my-company/${pathId}`,
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
                setCompanyInfo(response.data);
                setLoading(false);
            }
        }
        if (!companyInfo) {
            fetchData();
        }
    }, [companyInfo, navigate, pathId]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Request(
                'GET',
                `/my-company/posts/${pathId}`,
                null,
                null,
                null,
                null,
            )

            if (response.success && response.data) {
                setPublicacoes(response.data);
            }
        }
        if (!publicacoes) {
            fetchData();
        }
    }, [publicacoes, pathId]);

    const handleOpenAvatar = () => {
        setNewPic(companyInfo.imagem_perfil)
        setModalAvatar(true);
    };
    const handleCloseAvatar = () => {
        setModalAvatar(false);
    };

    const handleClickRemove = (e) => {
        e.preventDefault();
        setNewPic('');
    }

    const handleOpenPerfil = () => {
        setModalPerfil(true);
    };
    const handleClosePerfil = () => {
        setModalPerfil(false);
    };

    const handleOpenVaga = async () => {
        if (!companyVagas) {
            const response = await Request(
                'GET',
                `/jobs/company-jobs/${pathId}`,
                null,
                null,
                null,
                null,
            )

            if (!response.success) {
                Toast.error(response.message);
            } else {
                setCompanyVagas(response.data);
                setModalVaga(true);
            }
        } else {
            setModalVaga(true);
        }


        setLoadingModal(false);
    };

    const handleCloseVaga = () => {
        setModalVaga(false);
    };

    const handleOpenCandidatos = async (codvaga) => {
        if (!candidatos) {
            const response = await Request(
                'GET',
                `/jobs/candidatos/${codvaga}`,
                null,
                null,
                null,
                null,
            )

            if (!response.success) {
                Toast.error(response.message);
            } else {
                setCandidatos(response.data);
                setModalCandidatos(true);
            }
        }
    };

    const handleCloseCandidatos = () => {
        setModalCandidatos(false);
        setCandidatos();
    };

    const handleClickSaveAvatar = async (e) => {
        e.preventDefault();
        const response = await Request(
            'PUT',
            `/my-company/update-avatar`,
            null,
            { id: companyInfo.codempresa, newPic: newPic },
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
                '/my-company/update-perfil',
                null,
                { ...data, id: companyInfo.codempresa },
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

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleOpenDesativar = () => {
        setModalDesativar(true);
    };
    const handleCloseDesativar = () => {
        setModalDesativar(false);
    };

    const handleOpenPremium = () => {
        handleCloseMenu();
        setModalPremium(true);
    };
    const handleClosePremium = () => {
        setModalPremium(false);
    };

    const handleCancelarPremium = (e) => {
        e.preventDefault();
        handleClosePremium();
        Toast.success('Premium cancelado com sucesso, quando o per??odo acabar n??o ser?? mais cobrado.', false)
    }

    const handleDesativar = async (e) => {
        e.preventDefault();

        const response = await Request(
            'DELETE',
            `/my-company/delete-page/${companyInfo.codempresa}`,
            null,
            null,
            null,
            null,
        );

        if (!response.success) {
            Toast.error(response.message);
        } else {
            navigate('/');
            Toast.success(response.message);
        }
    }

    const handlePublicar = async (e) => {
        e.preventDefault();
        const response = await Request(
            'POST',
            '/my-company/publish',
            null,
            { id: companyInfo.codempresa, texto: publicacao },
            null,
            null
        );

        if (!response.success) {
            Toast.error(response.message);
        } else {
            window.location.reload(false);
        }
    }

    const handleOpenMenuEdit = (event, post) => {
        setAnchorEdit(event.currentTarget);
        setSelectedPost(post)
    };

    const handleCloseMenuEdit = () => {
        setAnchorEdit(null);
    };

    const handleDeletePublicacao = async (e) => {
        e.preventDefault();

        const response = await Request(
            'DELETE',
            `/my-company/delete-post/${selectedPost.codpublicacao}`,
            null,
            null,
            null,
            null,
        )

        if (!response.success) {
            Toast.error(response.message);
        } else {
            window.location.reload(false);
        }
    }

    const handleOpenEditarPublicacao = (e) => {
        e.preventDefault();
        handleCloseMenuEdit();
        setModalEditarPublicacao(true);
    };

    const handleCloseEditarPublicacao = () => {
        setModalEditarPublicacao(false);
    };

    const handleEditarPublicacao = async (e) => {
        e.preventDefault();

        const response = await Request(
            'PUT',
            `/my-company/edit-post`,
            null,
            { id: selectedPost.codpublicacao, texto: selectedPost.descricao },
            null,
            null,
        );

        if (!response.success) {
            Toast.error(response.message);
        } else {
            window.location.reload(false);
        }
    }

    const handleRemoveVaga = async (event, ID) => {
        event.preventDefault();
        const response = await Request(
            'DELETE',
            `/jobs/${ID}`,
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
                        sx={{ marginLeft: 55, marginRight: 55 }}
                    >
                        {userOwner && (
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Typography variant='h4'>
                                        <b>{companyInfo.nome}</b>
                                    </Typography>
                                    <Chip label="Vers??o do administrador" color="secondary" sx={{ marginLeft: 2 }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                    {/* <Button
                                        variant='outlined'
                                        color='secondary'
                                        sx={{ borderRadius: 300 }}
                                    >
                                        <b>Visualizar como usu??rio</b>
                                    </Button> */}
                                    <StyledIconButton disableRipple onClick={handleOpenMenu}>
                                        <Typography variant="body2">Configura????es</Typography>
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
                                        <MenuItem onClick={() => navigate(`/empresa/gerenciar/administradores`)}>Gerenciar administradores</MenuItem>
                                        {user.premium && (
                                            <MenuItem onClick={handleOpenPremium}>Cancelar premium</MenuItem>
                                        )}
                                        <MenuItem
                                            onClick={() => {
                                                handleOpenDesativar()
                                                handleCloseMenu()
                                            }}
                                        >
                                            Desativar p??gina
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        )}
                    </Box>
                    <Box sx={{
                        marginTop: '2vh',
                        justifyContent: 'center',
                        display: 'flex',
                        '& > :not(style)': {
                            width: '120vh',
                            height: '60vh'
                        }
                    }}>
                        <Grid container component={Paper} elevation={3} sx={{ borderRadius: 10 }}>
                            <Grid item className={classes.capa} />
                            <Grid item sx={{ width: '100%' }}>
                                <div className={classes.root}>
                                    <Avatar
                                        alt="avatar"
                                        src={companyInfo.imagem_perfil}
                                        sx={{ height: 200, width: 200, cursor: 'pointer' }}
                                        onClick={() => userOwner ? handleOpenAvatar(true) : null}
                                    />
                                    <Typography variant='h5' sx={{ marginTop: 1, marginLeft: 2 }} >
                                        <b>{companyInfo.nome}</b><br />
                                    </Typography>
                                    <Typography variant='body' sx={{ marginLeft: 2 }} >
                                        {companyInfo.setor}
                                    </Typography>
                                    <Link href={`https://${companyInfo.site}`} target="_blank" underline="hover" color="secondary" sx={{ marginLeft: 2 }}>
                                        {companyInfo.site}
                                    </Link>
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
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        {userOwner && (
                            <Box sx={{
                                marginTop: '2vh',
                                display: 'flex',
                                '& > :not(style)': {
                                    width: '40vh',
                                    height: '19vh'
                                }
                            }}>
                                <Grid container component={Paper} elevation={3} sx={{ borderRadius: 5, padding: '20px 40px', display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body" sx={{ fontSize: 20 }}>Gerenciar</Typography>
                                    {/* <div style={{ display: 'flex', flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                                        <Event />
                                        <Link href="#" underline="hover" style={{ color: 'black', marginLeft: 8 }}>Eventos</Link>
                                    </div> */}
                                    <div style={{ display: 'flex', flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                        <WorkOutline />
                                        <Link onClick={handleOpenVaga} underline="hover" style={{ color: 'black', marginLeft: 8, cursor: 'pointer' }}>Vagas</Link>
                                    </div>
                                </Grid>
                            </Box>
                        )}
                        <Box sx={{
                            marginTop: '2vh',
                            marginLeft: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            '& > :not(style)': {
                                width: '78vh',
                                minHeight: '10vh'
                            }
                        }}>
                            {userOwner && (
                                <Grid container component={Paper} elevation={3} sx={{ borderRadius: 5, padding: '20px 40px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                                    <Avatar
                                        alt="avatar"
                                        src={companyInfo.imagem_perfil}
                                    />
                                    <TextField
                                        type="text"
                                        multiline
                                        fullWidth
                                        color="secondary"
                                        rows={5}
                                        placeholder="Come??ar publica????o"
                                        size="small"
                                        sx={{ marginLeft: 1 }}
                                        onChange={(e) => setPublicacao(e.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={(e) => {
                                                            if (publicacao)
                                                                handlePublicar(e)
                                                        }}
                                                    >
                                                        <Send color="secondary" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            )}
                            {publicacoes?.map((data, index) => (
                                <Grid key={`keyPost${index}`} container component={Paper} elevation={3} sx={{ marginTop: 2, borderRadius: 5, padding: '20px 40px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                                    <Avatar
                                        alt="avatar"
                                        src={companyInfo.imagem_perfil}
                                    />
                                    <div style={{ marginLeft: 10, display: 'flex', flexDirection: 'column' }}>
                                        <Typography>
                                            <b>{companyInfo.nome}</b>
                                        </Typography>
                                        <Typography variant="body2" color={'textSecondary'}>
                                            {moment(data.dthr.replace('T', ' ')).format('DD/MM/YYYY HH:mm')}
                                        </Typography>
                                        <Typography variant="body1" sx={{ marginTop: 1, wordWrap: 'break-word', width: '560px' }}>
                                            {data.descricao}
                                        </Typography>
                                    </div>
                                    {userOwner && (
                                        <div style={{ paddingRight: 20 }}>
                                            <IconButton
                                                onClick={(e) => handleOpenMenuEdit(e, data)}
                                            >
                                                <MoreVert />
                                            </IconButton>
                                        </div>
                                    )}
                                </Grid>
                            ))}
                        </Box>
                        <Menu
                            anchorEl={anchorEdit}
                            open={openMenuEdit}
                            onClose={handleCloseMenuEdit}
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
                            <MenuItem onClick={(e) => handleOpenEditarPublicacao(e)}>Editar publica????o</MenuItem>
                            <MenuItem onClick={(e) => handleDeletePublicacao(e)}>Excluir publica????o</MenuItem>
                        </Menu>
                    </div>
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
                        open={modalPerfil}
                        onClose={handleClosePerfil}
                    >
                        <Paper
                            sx={{ ...modalStyle, width: 750 }}
                            elevation={3}
                        >
                            <Typography variant='h6'>
                                <b>Editar perfil da empresa</b>
                            </Typography>
                            <Divider />
                            <div style={{ marginTop: 20 }}>
                                <form className={'form'} onSubmit={handleSubmit(handleClickSaveProfile)}>
                                    <TextFieldStyled
                                        label='Nome da empresa'
                                        type='text'
                                        variant='outlined'
                                        {...register('nome', { required: true })}
                                        defaultValue={companyInfo.nome}
                                        color='secondary'
                                        margin='normal'
                                        fullWidth
                                        size='small'
                                        error={!!errors.nome}
                                        helperText={errors.nome && <span>Campo obrigat??rio!</span>}
                                    />
                                    <TextFieldStyled
                                        label='Setor'
                                        type='text'
                                        variant='outlined'
                                        {...register('setor', { required: true })}
                                        defaultValue={companyInfo.setor}
                                        color='secondary'
                                        margin='normal'
                                        fullWidth
                                        size='small'
                                        error={!!errors.setor}
                                        helperText={errors.setor && <span>Campo obrigat??rio!</span>}
                                    />
                                    <TextFieldStyled
                                        label='Site'
                                        type='text'
                                        variant='outlined'
                                        {...register('site', { required: true })}
                                        defaultValue={companyInfo.site}
                                        color='secondary'
                                        margin='normal'
                                        fullWidth
                                        size='small'
                                        error={!!errors.site}
                                        helperText={errors.site && <span>Campo obrigat??rio!</span>}
                                    />
                                    <TextFieldStyled
                                        label='Tamanho'
                                        type='number'
                                        variant='outlined'
                                        {...register('tamanho', { required: true })}
                                        defaultValue={companyInfo.tamanho}
                                        color='secondary'
                                        margin='normal'
                                        fullWidth
                                        size='small'
                                        error={!!errors.tamanho}
                                        helperText={errors.tamanho && <span>Campo obrigat??rio!</span>}
                                    />
                                    <TextFieldStyled
                                        label='Slogan'
                                        type='text'
                                        variant='outlined'
                                        {...register('slogan', { required: true })}
                                        defaultValue={companyInfo.slogan}
                                        color='secondary'
                                        margin='normal'
                                        fullWidth
                                        rows={2}
                                        size='small'
                                        error={!!errors.slogan}
                                        helperText={errors.slogan && <span>Campo obrigat??rio!</span>}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 30 }}>
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
                    <Modal
                        open={modalPremium}
                        onClose={handleClosePremium}
                    >
                        <Paper
                            sx={{ ...modalStyle, width: 750 }}
                            elevation={3}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant='h6'>
                                    <b>Cancelar premium</b>
                                </Typography>
                                <Divider />
                                <Typography variant='body1' sx={{ marginTop: 1 }}>
                                    {'Ao cancelar o premium, voc?? ainda ter?? os benef??cios do premium at?? que ele expire, por??m, n??o ser?? feito cobran??a autom??tica quando esse per??odo acabar '}
                                    ({moment(companyInfo?.premium?.replace('T', ' ')).utc().format('DD/MM/YYYY HH:mm')}).<br /><br />
                                    {'Voc?? tem certeza que deseja cancelar?'}
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 30 }}>
                                <Button
                                    variant="contained"
                                    color="text"
                                    sx={{ borderRadius: 300 }}
                                    onClick={() => handleClosePremium()}
                                >
                                    <b>Cancelar</b>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ borderRadius: 300, marginLeft: 2 }}
                                    onClick={(e) => handleCancelarPremium(e)}
                                >
                                    <b>Confirmar</b>
                                </Button>
                            </div>
                        </Paper>
                    </Modal>
                    <Modal
                        open={modalDesativar}
                        onClose={handleCloseDesativar}
                    >
                        <Paper
                            sx={{ ...modalStyle, width: 750 }}
                            elevation={3}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant='h6'>
                                    <b>Desativar p??gina</b>
                                </Typography>
                                <Typography variant='h6' color="secondary" sx={{ marginTop: 2 }}>
                                    <b>Lamentamos a exclus??o da sua p??gina</b>
                                </Typography>
                                <Typography variant='body1' sx={{ marginTop: 1 }}>
                                    Ao desativa-la, ela ser?? removida do Diversity. Ap??s ser desativada voc?? e outros usu??rios n??o poder??o
                                    mais acessar essa p??gina.
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 30 }}>
                                <Button
                                    variant="contained"
                                    color="text"
                                    sx={{ borderRadius: 300 }}
                                    onClick={() => handleCloseDesativar()}
                                >
                                    <b>Cancelar</b>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ borderRadius: 300, marginLeft: 2 }}
                                    onClick={(e) => handleDesativar(e)}
                                >
                                    <b>Desativar</b>
                                </Button>
                            </div>
                        </Paper>
                    </Modal>
                    <Modal
                        open={modalEditarPublicacao}
                        onClose={handleCloseEditarPublicacao}
                    >
                        <Paper
                            sx={{ ...modalStyle, width: 750 }}
                            elevation={3}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant='h6'>
                                    <b>Editar publica????o</b>
                                </Typography>
                                <TextField
                                    type="text"
                                    multiline
                                    fullWidth
                                    color="secondary"
                                    rows={5}
                                    size="small"
                                    sx={{ marginTop: 3 }}
                                    onChange={(e) => setSelectedPost({...selectedPost, descricao: e.target.value})}
                                    value={selectedPost?.descricao}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 30 }}>
                                <Button
                                    variant="contained"
                                    color="text"
                                    sx={{ borderRadius: 300 }}
                                    onClick={() => handleCloseEditarPublicacao()}
                                >
                                    <b>Cancelar</b>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ borderRadius: 300, marginLeft: 2 }}
                                    onClick={(e) => handleEditarPublicacao(e)}
                                >
                                    <b>Salvar</b>
                                </Button>
                            </div>
                        </Paper>
                    </Modal>
                    <Modal
                        open={modalVaga}
                        onClose={handleCloseVaga}
                    >
                        <Paper
                            sx={{ ...modalStyle, width: 750 }}
                            elevation={3}
                        >
                            {loadingModal ? (
                                <div style={{ marginTop: 150, display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress color='secondary' size={100} />
                                </div>
                            ) : companyVagas ? (
                                <div>
                                    <Typography variant='h6'>
                                        <b>Vagas criadas</b>
                                    </Typography>
                                    <List sx={{ width: '100%' }}>
                                        {companyVagas?.map((data) => (
                                            <ListItem
                                                key={`key${data.codvaga}`}
                                                // onClick={(e) => handleOpenVaga(e, data)}
                                                secondaryAction={
                                                    <>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="open"
                                                            onClick={() => handleOpenCandidatos(data.codvaga)}
                                                        >
                                                            <Tooltip title="Visualizar candidatos">
                                                                <Person />
                                                            </Tooltip>
                                                        </IconButton>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="open"
                                                            sx={{ marginLeft: 1 }}
                                                            onClick={(e) => handleRemoveVaga(e, data.codvaga)}
                                                        >
                                                            <Tooltip title="Deletar vaga">
                                                                <Delete />
                                                            </Tooltip>
                                                        </IconButton>
                                                    </>
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        alt="avatar"
                                                        src={data.imagem_perfil}
                                                        sx={{ height: 45, width: 45 }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`${data.cargo} ${data.presencial !== 'Remoto' ? `- ${data.cidade} / ${data.uf}` : ''} - Vaga dispon??vel para ${data.disponivel_para} (${data.presencial} - ${data.tempo_trabalho}h)`}
                                                    secondary={data.nome_empresa}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            ) : (
                                <div>
                                    <Typography variant='h6'>
                                        <b>Vagas criadas</b>
                                    </Typography>
                                    <Typography variant='body1' sx={{ marginTop: 2, marginBottom: 2 }}>
                                        Voc?? n??o possui nenhum vaga para esta empresa.
                                    </Typography>
                                </div>
                            )
                            }
                        </Paper>
                    </Modal>
                    <Modal
                        open={modalCandidatos}
                        onClose={handleCloseCandidatos}
                    >
                        <Paper
                            sx={{ ...modalStyle, width: 500 }}
                            elevation={3}
                        >
                            <div>
                                <Typography variant='h6'>
                                    <b>Candidatos da vaga</b>
                                </Typography>
                                <List sx={{ width: '100%' }}>
                                    {candidatos?.map((data) => (
                                        <ListItem
                                            key={`key${data.codvaga}`}
                                            button
                                            onClick={() => navigate(`/perfil/${data.id}`)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt="avatar"
                                                    src={data.imagem_perfil}
                                                    sx={{ height: 45, width: 45 }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={data.nome}
                                                secondary={`${data.localizacao} - ${data.profissao}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
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

export default CompanyPage;