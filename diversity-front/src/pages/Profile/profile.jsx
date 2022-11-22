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
    CircularProgress,
    Divider
} from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Request from '../../helper/Request';
import Toast from '../../helper/Toast';
import { BusinessCenter, Create, School } from '@mui/icons-material';
import * as moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');

const useStyles = makeStyles((theme) => ({
    capa: {
        height: '30vh',
        width: '100%',
        borderTopLeftRadius: '10mm',
        borderTopRightRadius: '10mm',
        // backgroundColor: '#e6eded'
        backgroundColor: '#fff'
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '100px',
        marginTop: '60px',
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
    const [experiencia, setExperiencia] = useState();
    const [formacao, setFormacao] = useState();
    const [newPic, setNewPic] = useState();
    const [modalAvatar, setModalAvatar] = useState(false);
    const [modalPerfil, setModalPerfil] = useState(false);
    const [modalExp, setModalExp] = useState(false);
    const [modalForm, setModalForm] = useState(false);
    const [addExp, setAddExp] = useState({})
    const [addForm, setAddForm] = useState({})
    const [opcCidades, setOpcCidades] = useState([]);
    const [openOpcCidades, setOpenOpcCidades] = useState(false);
    const loadingOpc = openOpcCidades && opcCidades.length === 0;
    const [opcJobs, setOpcJobs] = useState(null);
    const [openOpcJobs, setOpenOpcJobs] = useState(null);
    const [reload, setReload] = useState(null);
    const loadingJobs = openOpcJobs && opcJobs.length === 0;
    const pathId = window.location.pathname.split('/')[2];
    const userOwner = user.id === parseInt(pathId);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const responseUserInfo = await Request(
                'GET',
                `/user/${pathId}`,
                null,
                null,
                null
            );

            const responseExperiencia = await Request(
                'GET',
                `/user/experiencia/${pathId}`,
                null,
                null,
                null,
            );

            const responseFormacao = await Request(
                'GET',
                `/user/formacao/${pathId}`,
                null,
                null,
                null,
            );

            if (!responseUserInfo.success) {
                navigate('/');
                Toast.error(responseUserInfo.message);
            } else {
                setUserInfo(responseUserInfo.data);
                setNewPic(responseUserInfo.data.imagem_perfil);

                if(responseExperiencia.data)
                    setExperiencia(responseExperiencia.data)

                if (responseFormacao.data)
                    setFormacao(responseFormacao.data)
            }
            setLoading(false);
        }


        fetchData();
    }, [reload]);

    const reloadPage = () => {
        setReload(Math.random());
    }

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

    useEffect(() => {
        let active = true;

        if (!loadingJobs) {
            return undefined;
        }

        const fetchData = async () => {
            const response = await Request(
                'POST',
                '/autocomplete/jobs',
                null,
                null,
                null,
                null
            )

            if (active && response.success && response.data.length > 0)
                setOpcJobs(response.data);
        }

        fetchData();
        return () => {
            active = false
        }
    }, [loadingJobs])

    useEffect(() => {
        if (!openOpcJobs) {
            setOpcJobs([]);
        }
    }, [openOpcJobs]);

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

    const handleOpenExp = () => {
        setAddExp({
            empresa: null,
            codprofissao: null,
            dt_inicio: null,
            dt_fim: null
        })
        setModalExp(true);
    };
    
    const handleCloseExp = () => {        
        setModalExp(false);
    };

    const handleOpenForm = () => {
        setAddForm({
            instituicao: null,
            formacao: null,
            dt_inicio: null,
            dt_fim: null
        })
        setModalForm(true);
    };
    
    const handleCloseForm = () => {
        setModalForm(false);
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

    const handleClickSaveExp = async (event) => {
        event.preventDefault();
        handleCloseExp();
        const id = Toast.loading();

        const response = await Request(
            'POST',
            '/user/add-experiencia',
            null,
            {...addExp, id: user.id},
            null,
            null,
        );

        if(!response.success) {
            Toast.updateError(id, response.message)
        } else {
            Toast.updateSuccess(id, response.message)
            reloadPage();
        }
    }

    const handleClickSaveForm = async (event) => {
        event.preventDefault();
        handleCloseForm();
        const id = Toast.loading();

        const response = await Request(
            'POST',
            '/user/add-formacao',
            null,
            {...addForm, id: user.id},
            null,
            null,
        );

        if(!response.success) {
            Toast.updateError(id, response.message)
        } else {
            Toast.updateSuccess(id, response.message)
            reloadPage();
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
                        marginTop: '3vh',
                        justifyContent: 'center',
                        display: 'flex',
                        '& > :not(style)': {
                            width: '110vh',
                        }
                    }}>
                        <Grid container component={Paper} elevation={3} sx={{ borderRadius: 10 }}>
                            {/* <Grid item className={classes.capa} /> */}
                            <Grid item sx={{ width: '100%' }}>
                                <div className={classes.root}>
                                    <Avatar
                                        alt="avatar"
                                        src={userInfo?.imagem_perfil}
                                        sx={{ height: 200, width: 200, cursor: 'pointer' }}
                                        onClick={() => userOwner ? handleOpenAvatar(true) : null}
                                    />
                                    <Typography variant='h5' sx={{ marginTop: 1, marginLeft: 1 }} >
                                        <b>{userInfo?.nome}</b><br />
                                    </Typography>
                                    <Typography variant='body' sx={{ marginLeft: 1 }} >
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
                                <div style={{ marginTop: 150 }}>
                                    <Divider />
                                    <div style={{ marginLeft: 50, marginTop: 10, marginBottom: 20, marginRight: 50 }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1">
                                                <b>{'Experiência'}</b>
                                            </Typography>
                                            {userOwner && (
                                                <Button 
                                                    color="secondary"
                                                    variant="outlined"
                                                    onClick={handleOpenExp}
                                                >
                                                    <b>+</b><Create />
                                                </Button>
                                            )}
                                        </div>
                                        {experiencia ? (
                                            experiencia.map((exp, index) => (
                                                <div>
                                                    {index !== 0 && (<Divider />)}
                                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                                                        <BusinessCenter sx={{ color: '#696969' }}/>
                                                        <Typography variant="body1" sx={{ marginLeft: 2 }}>
                                                            {exp.empresa}<br />
                                                            {exp.descricao}<br />
                                                            {moment(exp.dt_inicio.replace('T', ' ')).utc().format('ll')}
                                                            {exp.dt_fim ? ` - ${moment(exp.dt_fim.replace('T', ' ')).utc().format('ll')}` : ' até o momento'}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <Typography variant="body2">
                                                {'Nenhuma experiência cadastrada'}
                                            </Typography>
                                        )}
                                    </div>
                                    <Divider />
                                    <div style={{ marginLeft: 50, marginTop: 10, marginBottom: 20, marginRight: 50 }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1">
                                                <b>{'Formação acadêmica'}</b>
                                            </Typography>
                                            {userOwner && (
                                                <Button 
                                                    color="secondary"
                                                    variant="outlined"
                                                    onClick={handleOpenForm}
                                                >
                                                    <b>+</b><Create />
                                                </Button>
                                            )}
                                        </div>
                                        {formacao ? (
                                            formacao.map((form, index) => (
                                                <div>
                                                    {index !== 0 && (<Divider />)}
                                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                                                        <School sx={{ color: '#696969' }}/>
                                                        <Typography variant="body1" sx={{ marginLeft: 2 }}>
                                                            {form.faculdade}<br />
                                                            {form.formacao}<br />
                                                            {moment(form.dt_inicio.replace('T', ' ')).utc().format('ll')}
                                                            {form.dt_fim ? ` - ${moment(form.dt_fim.replace('T', ' ')).utc().format('ll')}` : ' até o momento'}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <Typography variant="body2">
                                                {'Nenhuma formação acadêmica cadastrada'}
                                            </Typography>
                                        )}
                                    </div>
                                </div>
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
                        // hideBackdrop
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
                                        defaultValue={userInfo?.nome}
                                        color='secondary'
                                        margin='normal'
                                        fullWidth
                                        size='small'
                                        error={!!errors.nome}
                                        helperText={errors.nome && <span>Campo obrigatório!</span>}
                                    >
                                    </TextFieldStyled>
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
                                                {...register('localizacao', { required: true })}
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
                    <Modal
                        //hideBackdrop
                        open={modalExp}
                        onClose={handleCloseExp}
                    >
                        <Paper
                            sx={{ ...modalStyle, width: 600, paddingRight: 3 }}
                            elevation={3}
                        >
                            <Typography variant='h6'>
                                <b>Adicionar experiência</b>
                            </Typography>
                            <div style={{ marginTop: 5 }}>
                                <TextFieldStyled
                                    label='Empresa'
                                    type='text'
                                    variant='outlined'
                                    color='secondary'
                                    margin='dense'
                                    fullWidth
                                    required
                                    size='small'
                                    onChange={(e) => setAddExp({...addExp, empresa: e.target.value})}
                                />
                                <Autocomplete
                                    id="combo-box"
                                    sx={{ margin: 'auto' }}
                                    options={opcJobs ?? null}
                                    open={openOpcJobs}
                                    onOpen={() => {
                                        setOpenOpcJobs(true);
                                    }}
                                    onClose={() => {
                                        setOpenOpcJobs(false);
                                    }}
                                    value={addExp.codprofissaoLabel ?? null}
                                    onChange={(_event, newValue) => {
                                        setAddExp({...addExp, codprofissao: newValue.value, codprofissaoLabel: newValue.label})
                                    }}
                                    loading={loadingJobs}
                                    renderInput={(params) => (
                                        <TextFieldStyled
                                            {...params}
                                            label='Cargo'
                                            type='text'
                                            placeholder="Digite para pesquisar"
                                            variant='outlined'
                                            color='secondary'
                                            margin='dense'
                                            required
                                            fullWidth
                                            size='small'
                                        />
                                    )}
                                />
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <TextFieldStyled
                                        // label='Data início'
                                        type='date'
                                        variant='outlined'
                                        color='secondary'
                                        margin='dense'
                                        required
                                        fullWidth
                                        size='small'
                                        onChange={(e) => setAddExp({...addExp, dt_inicio: e.target.value})}
                                    />
                                    <Typography variant="body1" sx={{paddingLeft: 5, paddingRight: 5}}>{' até '}</Typography>
                                    <TextFieldStyled
                                        // label='Data fim'
                                        type='date'
                                        variant='outlined'
                                        color='secondary'
                                        margin='dense'
                                        fullWidth
                                        size='small'
                                        onChange={(e) => setAddExp({...addExp, dt_fim: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 15 }}>
                                <Button
                                    variant="contained"
                                    color="text"
                                    sx={{ borderRadius: 300 }}
                                    onClick={handleCloseExp}
                                >
                                    <b>Cancelar</b>
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    sx={{ borderRadius: 300, marginLeft: 1 }}
                                    onClick={(event) => handleClickSaveExp(event)}
                                >
                                    <b>Salvar</b>
                                </Button>
                            </div>
                        </Paper>
                    </Modal>
                    <Modal
                        //hideBackdrop
                        open={modalForm}
                        onClose={handleCloseForm}
                    >
                        <Paper
                            sx={{ ...modalStyle, width: 600, paddingRight: 3 }}
                            elevation={3}
                        >
                            <Typography variant='h6'>
                                <b>Adicionar formação acadêmica</b>
                            </Typography>
                            <div style={{ marginTop: 5 }}>
                                <TextFieldStyled
                                    label='Instituição'
                                    type='text'
                                    variant='outlined'
                                    color='secondary'
                                    margin='dense'
                                    fullWidth
                                    required
                                    size='small'
                                    onChange={(e) => setAddForm({...addForm, instituicao: e.target.value})}
                                />
                                <TextFieldStyled
                                    label='Formação'
                                    type='text'
                                    variant='outlined'
                                    color='secondary'
                                    margin='dense'
                                    required
                                    fullWidth
                                    size='small'
                                    onChange={(e) => setAddForm({...addForm, formacao: e.target.value})}
                                />
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <TextFieldStyled
                                        // label='Data início'
                                        type='date'
                                        variant='outlined'
                                        color='secondary'
                                        margin='dense'
                                        required
                                        fullWidth
                                        size='small'
                                        onChange={(e) => setAddForm({...addForm, dt_inicio: e.target.value})}
                                    />
                                    <Typography variant="body1" sx={{paddingLeft: 5, paddingRight: 5}}>{' até '}</Typography>
                                    <TextFieldStyled
                                        // label='Data fim'
                                        type='date'
                                        defaultValue={'MM/DD/YYYY'}
                                        variant='outlined'
                                        color='secondary'
                                        margin='dense'
                                        fullWidth
                                        size='small'
                                        onChange={(e) => setAddForm({...addForm, dt_fim: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 15 }}>
                                <Button
                                    variant="contained"
                                    color="text"
                                    sx={{ borderRadius: 300 }}
                                    onClick={handleCloseForm}
                                >
                                    <b>Cancelar</b>
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    sx={{ borderRadius: 300, marginLeft: 1 }}
                                    onClick={(event) => handleClickSaveForm(event)}
                                >
                                    <b>Salvar</b>
                                </Button>
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
                    // hideBackdrop
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

