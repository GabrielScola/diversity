import React, { useContext, useState, useEffect } from "react";
import { Box, Grid, Link, List, ListItem, ListItemText, Paper, Typography, Modal, TextField, Autocomplete, Button, CircularProgress, Divider } from "@mui/material";
import Header from '../../layout/Header/After';
import Footer from '../../layout/Footer/Footer';
import { Settings } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import Request from '../../helper/Request';
import Toast from '../../helper/Toast';

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
    paddingRight: 3,
    paddingTop: 1,
    borderRadius: 5,
}

const Configurations = () => {
    const { user, signOut } = useContext(AuthContext);
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [password, setPassword] = useState({
        oldPass: null,
        newPass: null,
        confirmPass: null
    });
    const [email, setEmail] = useState({
        addEmail: false,
        newEmail: null,
    });
    const [phone, setPhone] = useState({
        addPhone: false,
        newPhone: null,
    });

    const [modalPerfil, setModalPerfil] = useState(false);
    const [modalDesativar, setModalDesativar] = useState(false);
    const [modalSenha, setModalSenha] = useState(false);
    const [modalEmail, setModalEmail] = useState(false);
    const [modalPhone, setModalPhone] = useState(false);

    const [opcCidades, setOpcCidades] = useState([]);
    const [openOpcCidades, setOpenOpcCidades] = useState(false);
    const loadingOpc = openOpcCidades && opcCidades.length === 0;

    const navigate = useNavigate();

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

    const handleOpenPerfil = async () => {
        setLoading(true);
        setModalPerfil(true);

        const response = await Request(
            'GET',
            `/user/${user.id}`,
            null,
            null,
            null
        );

        if (!response.success) {
            Toast.error(response.message);
            setLoading(false);
        } else {
            setUserInfo(response.data);
            setLoading(false)
        }
    };

    const handleClosePerfil = () => {
        setModalPerfil(false);
    };

    const handleClickSaveProfile = async (e, data) => {
        e.preventDefault();

        const response = await Request(
            'PUT',
            '/user/update-perfil',
            null,
            { ...userInfo },
            null,
            null
        )

        if (!response.success) {
            Toast.error(response.message);
        } else {
            handleClosePerfil();
            Toast.success(response.message);
        }
    }

    const handleOpenDesativar = () => {
        setModalDesativar(true);
    };
    const handleCloseDesativar = () => {
        setModalDesativar(false);
    };

    const handleDesativar = async (event) => {
        event.preventDefault();
        signOut();

        await Request(
            'DELETE',
            `/user/delete-account/${user.id}`,
            null,
            null,
            null,
            null
        )
    }

    const handleOpenSenha = () => {
        setModalSenha(true);
        setPassword({
            oldPass: null,
            newPass: null,
            confirmPass: null
        })
    };
    const handleCloseSenha = () => {
        setModalSenha(false);
    };

    const handleChangePass = async (event) => {
        event.preventDefault();

        if(password.newPass.length < 8) {
            Toast.error('A senha deve conter no mínimo 8 caracteres.')
        } else if (password.newPass !== password.confirmPass) {
            Toast.error('Confirmação de senha está diferente da sua nova senha.')
        } else if (password.oldPass === password.newPass) {
            Toast.error('A nova senha não pode ser a mesma que a senha atual.') 
        } else {
            const response = await Request(
                'PUT',
                '/user/update-password',
                null,
                {...password, id: user.id},
                null,
                null,
            );

            if(!response.success) {
                Toast.error(response.message);
            } else {
                Toast.success(response.message);
                handleCloseSenha();
            }
        }
    };

    const handleOpenEmail = async () => {
        setLoading(true);
        setModalEmail(true);
        const response = await Request(
            'GET',
            `/user/${user.id}`,
            null,
            null,
            null
        );

        if (!response.success) {
            Toast.error(response.message);
        } else if(!response.data.email_secundario){
            setEmail({newEmail: null, addEmail: false});
        } else {
            setEmail({addEmail: true, secondEmail: response.data.email_secundario})
        }
        
        setLoading(false);
    };
    const handleCloseEmail = () => {
        setModalEmail(false);
    };

    const handleAddEmail = async (event) => {
        event.preventDefault();

        const response = await Request(
            'POST',
            '/user/add-email',
            null,
            {id: user.id, newEmail: email.newEmail},
            null,
            null
        );

        if(!response.success) {
            Toast.error(response.message);
        } else {
            Toast.success(response.message);
            handleCloseEmail();
        }
    };

    const handleOpenPhone = async () => {
        setLoading(true);
        setModalPhone(true);
        const response = await Request(
            'GET',
            `/user/${user.id}`,
            null,
            null,
            null
        );

        if (!response.success) {
            Toast.error(response.message);
        } else if(!response.data.fone_secundario){
            setPhone({newPhone: null, addPhone: false, mainPhone: response.data.telefone});
        } else {
            setPhone({addPhone: true, mainPhone: response.data.telefone, secondPhone: response.data.fone_secundario})
        }
        
        setLoading(false);
    };
    const handleClosePhone = () => {
        setModalPhone(false);
    };

    const handleAddPhone = async (event) => {
        event.preventDefault();

        const response = await Request(
            'POST',
            '/user/add-phone',
            null,
            {id: user.id, newPhone: phone.newPhone},
            null,
            null
        );

        if(!response.success) {
            Toast.error(response.message);
        } else {
            Toast.success(response.message);
            handleClosePhone();
        }
    };

    return (
        <>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Box
                    sx={{
                        marginTop: '5vh',
                        display: 'flex',
                        '& > :not(style)': {
                            width: '40vh',
                        }
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Grid
                            container
                            component={Paper}
                            elevation={3}
                            sx={{
                                borderRadius: 5,
                                padding: '20px 40px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6"><b>Configurações</b></Typography>
                                <Settings sx={{ color: '#696969' }} />
                            </div>
                            <div style={{ marginTop: 25 }}>
                                <Link onClick={() => setStep(0)} underline="hover" color="text" style={{ cursor: 'pointer' }}><li>Preferências da conta</li></Link>
                                <Link onClick={() => setStep(1)} underline="hover" color="text" style={{ cursor: 'pointer' }}><li>Acesso</li></Link>
                                <Link onClick={() => setStep(2)} underline="hover" color="text" style={{ cursor: 'pointer' }}><li>Segurança</li></Link>
                                {!user.empresa && (
                                    <Link onClick={() => navigate('/minha-empresa')} underline="hover" color="text" style={{ cursor: 'pointer' }}><li>Criar página empresarial</li></Link>
                                )}
                            </div>
                        </Grid>
                    </div>
                </Box>
                <Box
                    sx={{
                        marginTop: '5vh',
                        marginLeft: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        '& > :not(style)': {
                            width: '78vh',
                            minHeight: '10vh'
                        }
                    }}
                >
                    <Grid
                        container
                        component={Paper}
                        elevation={3}
                        sx={{
                            borderRadius: 5,
                            padding: '20px 40px',
                            display: 'flex',
                            flexDirection: 'column',
                            flexWrap: 'nowrap'
                        }}
                    >
                        <div hidden={step !== 0}>
                            <Typography variant="h6" >
                                <b>Preferências da conta</b>
                            </Typography>
                            <Divider />
                            <List sx={{ width: '100%' }}>
                                <ListItem
                                    key={`key0`}
                                    button
                                    onClick={handleOpenPerfil}
                                >
                                    <ListItemText
                                        primary="Informações do perfil"
                                        secondary="Nome, localidade"
                                    />
                                </ListItem>
                                <ListItem
                                    key={`key1`}
                                    button
                                // onClick
                                >
                                    <ListItemText
                                        primary="Exibição"
                                        secondary="Modo escuro"
                                    />
                                </ListItem>
                                <ListItem
                                    key={`key2`}
                                    button
                                // onClick
                                >
                                    <ListItemText
                                        primary="Preferências do site"
                                        secondary="Idioma"
                                    />
                                </ListItem>
                                <ListItem
                                    key={`key3`}
                                    button
                                    onClick={handleOpenDesativar}
                                >
                                    <ListItemText
                                        primary="Gerenciamento de conta"
                                        secondary="Encerrar conta"
                                    />
                                </ListItem>
                            </List>
                        </div>
                        <div hidden={step !== 1}>
                            <Typography variant="h6" >
                                <b>Acesso à conta</b>
                            </Typography>
                            <Divider />
                            <List sx={{ width: '100%' }}>
                                <ListItem
                                    key={`key0`}
                                    button
                                    onClick={handleOpenEmail}
                                >
                                    <ListItemText
                                        primary="Endereços de e-mail"
                                        secondary="Adicionar novo endereço de e-mail à conta"
                                    />
                                </ListItem>
                                <ListItem
                                    key={`key1`}
                                    button
                                    onClick={handleOpenPhone}
                                >
                                    <ListItemText
                                        primary="Números de telefone"
                                        secondary="Adicionar novo número de telefone à conta"
                                    />
                                </ListItem>
                                <ListItem
                                    key={`key2`}
                                    button
                                    onClick={handleOpenSenha}
                                >
                                    <ListItemText
                                        primary="Alterar senha"
                                        secondary="Altere sua senha"
                                    />
                                </ListItem>
                            </List>
                        </div>
                        <div hidden={step !== 2}>
                            <Typography variant="h6" >
                                <b>Segurança da conta</b>
                            </Typography>
                            <Divider />
                            <List sx={{ width: '100%' }}>
                                <ListItem
                                    key={`key0`}
                                    button
                                // onClick
                                >
                                    <ListItemText
                                        primary="Verificação de duas etapas"
                                        secondary="Ativar verificação de duas etapas"
                                    />
                                </ListItem>
                            </List>
                        </div>
                    </Grid>
                </Box>
            </div>
            <Modal
                // hideBackdrop
                open={modalPerfil}
                onClose={handleClosePerfil}
            >
                <Paper
                    sx={{ ...modalStyle, width: 750 }}
                    elevation={3}
                >
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }} >
                            <CircularProgress color='secondary' size={100} />
                        </div>
                    ) : (
                        <>
                            <Typography variant='h6'>
                                <b>Editar perfil</b>
                            </Typography>
                            <Divider />
                            <div style={{ marginTop: 20 }}>
                                <TextFieldStyled
                                    label='Nome'
                                    type='text'
                                    variant='outlined'
                                    defaultValue={userInfo?.nome}
                                    color='secondary'
                                    margin='normal'
                                    fullWidth
                                    required
                                    size='small'
                                    onChange={(e) => setUserInfo({ ...userInfo, nome: e.target.value })}
                                >
                                </TextFieldStyled>
                                <TextFieldStyled
                                    label='Título'
                                    type='text'
                                    variant='outlined'
                                    defaultValue={userInfo?.titulo ? userInfo?.titulo : `${userInfo?.profissao}${userInfo?.empresa ? ` na empresa ${userInfo?.empresa}` : ''}`}
                                    color='secondary'
                                    margin='normal'
                                    fullWidth
                                    size='small'
                                    onChange={(e) => setUserInfo({ ...userInfo, titulo: e.target.value })}
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
                                    onChange={(_event, newValue) => {
                                        setUserInfo({ ...userInfo, localizacao: newValue.label })
                                    }}
                                    loading={loadingOpc}
                                    renderInput={(params) => (
                                        <TextFieldStyled
                                            {...params}
                                            label='Cidade/Estado'
                                            type='text'
                                            variant='outlined'
                                            color='secondary'
                                            margin='normal'
                                            required
                                            fullWidth
                                            size='small'

                                        />
                                    )}
                                />
                                <ChildModal userInfo={userInfo} setUserInfo={setUserInfo} />
                                <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 20 }}>
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
                                        onClick={(e) => handleClickSaveProfile(e)}
                                    >
                                        <b>Salvar</b>
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
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
                            <b>Encerrar conta</b>
                        </Typography>
                        <Divider />
                        <Typography variant='h6' color="secondary" sx={{ marginTop: 2 }}>
                            <b>Lamentamos a sua saída</b>
                        </Typography>
                        <Typography variant='body1' sx={{ marginTop: 1 }}>
                            Ao encerrar sua conta, ela será removida do Diversity. Após ser desativada você e outros usuários não poderão
                            mais acessar a sua página.
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
                            <b>Encerrar</b>
                        </Button>
                    </div>
                </Paper>
            </Modal>
            <Modal
                open={modalSenha}
                onClose={handleCloseSenha}
            >
                <Paper
                    sx={{ ...modalStyle, width: 500 }}
                    elevation={3}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h6'>
                            <b>Alterar senha</b>
                        </Typography>
                        <Divider />
                        <Typography variant='body1' sx={{ marginTop: 1 }}>
                            Crie uma senha nova com pelo menos 8 caracteres.
                        </Typography>                        
                        <TextFieldStyled
                            label='Senha atual'
                            type='password'
                            variant='outlined'
                            color='secondary'
                            margin='dense'
                            fullWidth
                            required
                            size='small'
                            sx={{marginTop: 2}}
                            onChange={(e) => setPassword({ ...password, oldPass: e.target.value })}
                        />                    
                        <TextFieldStyled
                            label='Nova senha'
                            type='password'
                            variant='outlined'
                            color='secondary'
                            margin='dense'
                            fullWidth
                            required
                            size='small'
                            onChange={(e) => setPassword({ ...password, newPass: e.target.value })}
                        />                    
                        <TextFieldStyled
                            label='Confirmar senha'
                            type='password'
                            variant='outlined'
                            color='secondary'
                            margin='dense'
                            fullWidth
                            required
                            size='small'
                            onChange={(e) => setPassword({ ...password, confirmPass: e.target.value })}
                        />                        
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 20 }}>
                        <Button
                            variant="contained"
                            color="text"
                            sx={{ borderRadius: 300 }}
                            onClick={() => handleCloseSenha()}
                        >
                            <b>Cancelar</b>
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            sx={{ borderRadius: 300, marginLeft: 2 }}
                            disabled={!password.oldPass || !password.newPass || !password.confirmPass}
                            onClick={(e) => handleChangePass(e)}
                        >
                            <b>Alterar senha</b>
                        </Button>
                    </div>
                </Paper>
            </Modal>
            <Modal
                open={modalEmail}
                onClose={handleCloseEmail}
            >
                <Paper
                    sx={{ ...modalStyle, width: 500 }}
                    elevation={3}
                >
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }} >
                            <CircularProgress color='secondary' size={100} />
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant='h6'>
                                    <b>Emails</b>
                                </Typography>
                                <Divider />
                                <Typography variant='body1' sx={{ marginTop: 1 }}>
                                    Endereços de email adicionados.
                                </Typography>
                                <Typography variant="body1" sx={{marginTop: 3}}>
                                    Email principal
                                </Typography>
                                <TextFieldStyled
                                    type='text'
                                    variant='outlined'
                                    color='secondary'
                                    margin='dense'
                                    fullWidth
                                    size='small'
                                    disabled
                                    defaultValue={user.email}
                                />
                            </div>
                            {!email.addEmail ? (
                                <Button
                                    color="secondary"
                                    sx={{marginBottom: 1.5}}
                                    onClick={() => setEmail({...email, addEmail: true})}                           
                                >
                                    + Adicionar email
                                </Button>
                            ) : !email.secondEmail ? (
                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography>
                                            Adicionar novo email
                                        </Typography>
                                        <TextFieldStyled
                                            type='email'
                                            variant='outlined'
                                            color='secondary'
                                            margin='dense'
                                            fullWidth
                                            required
                                            size='small'
                                            onChange={(e) => setEmail({...email, newEmail: e.target.value})}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 20 }}>
                                        <Button
                                            variant="contained"
                                            color="text"
                                            sx={{ borderRadius: 300 }}
                                            onClick={() => handleCloseEmail()}
                                        >
                                            <b>Cancelar</b>
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            sx={{ borderRadius: 300, marginLeft: 2 }}
                                            disabled={!email.newEmail}
                                            onClick={(e) => handleAddEmail(e)}
                                        >
                                            <b>Adicionar</b>
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Typography variant="body1">
                                        Email secundário
                                    </Typography>
                                    <TextFieldStyled
                                        type='text'
                                        variant='outlined'
                                        color='secondary'
                                        margin='dense'
                                        fullWidth
                                        size='small'
                                        disabled
                                        sx={{marginBottom: 1.5}}
                                        defaultValue={email.secondEmail}
                                    />
                                </>
                            )}
                        </>
                    )}
                </Paper>
            </Modal>
            <Modal
                open={modalPhone}
                onClose={handleClosePhone}
            >
                <Paper
                    sx={{ ...modalStyle, width: 500 }}
                    elevation={3}
                >
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center' }} >
                            <CircularProgress color='secondary' size={100} />
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant='h6'>
                                    <b>Telefones</b>
                                </Typography>
                                <Divider />
                                <Typography variant='body1' sx={{ marginTop: 1 }}>
                                    Números de telefone adicionados.
                                </Typography>
                                <Typography variant="body1" sx={{marginTop: 3}}>
                                    Telefone principal
                                </Typography>
                                <TextFieldStyled
                                    type='text'
                                    variant='outlined'
                                    color='secondary'
                                    margin='dense'
                                    fullWidth
                                    size='small'
                                    disabled
                                    defaultValue={phone.mainPhone}
                                />
                            </div>
                            {!phone.addPhone ? (
                                <Button
                                    color="secondary"
                                    sx={{marginBottom: 1.5}}
                                    onClick={() => setPhone({...phone, addPhone: true})}
                                >
                                    + Adicionar telefone
                                </Button>
                            ) : !phone.secondPhone ? (
                                <div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography>
                                            Adicionar novo telefone
                                        </Typography>
                                        <TextFieldStyled
                                            type='text'
                                            variant='outlined'
                                            color='secondary'
                                            margin='dense'
                                            fullWidth
                                            required
                                            size='small'
                                            onChange={(e) => setPhone({...phone, newPhone: e.target.value})}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 15, marginTop: 20 }}>
                                        <Button
                                            variant="contained"
                                            color="text"
                                            sx={{ borderRadius: 300 }}
                                            onClick={() => handleClosePhone()}
                                        >
                                            <b>Cancelar</b>
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            sx={{ borderRadius: 300, marginLeft: 2 }}
                                            disabled={!phone.newPhone}
                                            onClick={(e) => handleAddPhone(e)}
                                        >
                                            <b>Adicionar</b>
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Typography variant="body1">
                                        Telefone secundário
                                    </Typography>
                                    <TextFieldStyled
                                        type='text'
                                        variant='outlined'
                                        color='secondary'
                                        margin='dense'
                                        fullWidth
                                        size='small'
                                        disabled
                                        sx={{marginBottom: 1.5}}
                                        defaultValue={phone.secondPhone}
                                    />
                                </>
                            )}
                        </>
                    )}
                </Paper>
            </Modal>
            <Box mt={5}>
                <Footer />
            </Box>
        </>
    )
}

function ChildModal(props) {
    const { userInfo, setUserInfo } = props;
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
                                defaultValue={`${window.location.href.replace('/configuracoes', '')}/perfil/${userInfo?.id}`}
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
                                variant='outlined'
                                defaultValue={userInfo?.telefone}
                                color='secondary'
                                margin='normal'
                                fullWidth
                                size='small'
                                onChange={(e) => setUserInfo({ ...userInfo, telefone: e.target.value })}
                            />
                            <TextFieldStyled
                                label='Endereço'
                                type='text'
                                variant='outlined'
                                defaultValue={userInfo?.endereco}
                                color='secondary'
                                margin='normal'
                                fullWidth
                                size='small'
                                onChange={(e) => setUserInfo({ ...userInfo, endereco: e.target.value })}
                            />
                            <TextFieldStyled
                                label='Aniversário'
                                type='text'
                                variant='outlined'
                                defaultValue={`${userInfo?.dt_aniversario.split('-')[2].split('T')[0]}/${userInfo?.dt_aniversario.split('-')[1]}`}
                                color='secondary'
                                margin='normal'
                                fullWidth
                                size='small'
                                onChange={(e) => setUserInfo({ ...userInfo, dt_aniversario: e.target.value })}
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

export default Configurations;