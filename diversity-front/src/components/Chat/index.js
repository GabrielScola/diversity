import React, { useState, useRef, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { Card, CardActions, CardContent, CardHeader, CircularProgress, Divider, IconButton, Avatar, Paper, TextField, Typography, Autocomplete, Box, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Close, Send, ArrowBack } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../../contexts/AuthContext';
import Request from '../../helper/Request';
import Message from './Message/index';
import './style.scss';

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const Chat = (props) => {
    const { open, setOpen } = props;

    const { user } = useContext(AuthContext);
    const [ loading, setLoading ] = useState(true);
    const [ messages, setMessages ] = useState(defaultMessage);
    const [ send, setSend ] = useState(false);
    const [ selectedUser, setSelectedUser ] = useState();
    const [ userList, setUserList ] = useState(null);
    const [opcUsers, setOpcUsers] = useState(null);
    const [openOpcUsers, setOpenOpcUsers] = useState(null);
    
    const loadingAutocomplete = openOpcUsers && opcUsers.length === 0;
    const messagesEndRef = useRef(null);
    const { handleSubmit, register, reset, setFocus } = useForm();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await Request(
                'POST',
                '/chat/list',
                null,
                {userId: user.id},
                null,
                null
            );

            if(response.success && response.data && response.data.length > 0){
                setUserList(response.data);
            }
            setLoading(false);
        }
        if(!selectedUser)
            fetchData();    
    }, [user, selectedUser])

    useEffect(() => {
        let active = true;

        if (!loadingAutocomplete) {
            return undefined;
        }

        const fetchData = async () => {
            const response = await Request(
                'POST',
                '/autocomplete/mutuals',
                null,
                {id: user.id},
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

    const getMessages = async (idDestinatario) => {
        setLoading(true);
        setMessages(null);
        const body = {
            remetente: user.id,
            destinatario: idDestinatario,
        }

        const response = await Request(
            'POST',
            '/chat/messages',
            null,
            body,
            null,
            null,
        );

        if(response.success && response.data) {
            setMessages(response.data);
        } else setMessages(defaultMessage);
        setLoading(false);
        scrollToBottom();
    }

    const onSubmit = async (data) => {
        setSend(true);

        const postMessage = async () => {
            const body = {
                remetente: user.id,
                destinatario: selectedUser.id,
                mensagem: data.message,
            }
            
            const response = await Request (
                'POST',
                '/chat/send',
                null,
                body,
                null,
                null,
            );

            if(response.success) {
                if (messages[0].apagar) {
                    setMessages([
                        {
                            nome_usuario: user.nome,
                            datamensagem: moment().format(),
                            mensagem: data.message,
                        }
                    ])
                } else {
                    setMessages((prevState) => [
                        ...prevState,
                        {
                            nome_usuario: user.nome,
                            datamensagem: moment().format(),
                            mensagem: data.message,
                        }
                    ]);
                }
                reset();

                Request(
                    'POST',
                    '/notification',
                    null,
                    {id: selectedUser.id, tipo: 1},
                    null,
                    null,
                )
            }
            setSend(false);
            setFocus('message');
            scrollToBottom();
        };

        postMessage();
    }

    return (
        <>
            {open && (
                <div className={'chat-conversation-container'}>
                    <Paper elevation={12}>
                        <Card variant="outlined">
                            <CardHeader
                                action={
                                    <>
                                        {selectedUser ? (
                                            <IconButton
                                                aria-label="settings"
                                                onClick={() => setSelectedUser(null)}
                                                color="secondary"
                                            >
                                                <ArrowBack />
                                            </IconButton>
                                        ) : ''}
                                        <IconButton
                                            aria-label="settings"
                                            onClick={() => {
                                                setOpen(false);
                                                setSelectedUser(null);
                                            }}
                                            color="secondary"
                                        >
                                            <Close />
                                        </IconButton>
                                    </>
                                }
                                title={'Mensagens'}
                                subheader={selectedUser?.name}
                            />
                            <Divider />
                            <CardContent className={'content'}>
                                {loading ? (
                                    <div className={'loader'}>
                                        <CircularProgress size={70} color="secondary"/>
                                    </div>
                                ) : selectedUser ? (
                                    messages?.map((message, index) => (
                                        <Message
                                            messages={message}
                                            key={`content-${index}`}
                                        />
                                    ))                                                               
                                ) : (
                                    <div>
                                        <Autocomplete 
                                            id="combo-box"
                                            options={opcUsers}
                                            open={openOpcUsers}
                                            autoHighlight
                                            onOpen={() => {
                                                setOpenOpcUsers(true);
                                            }}
                                            onClose={() => {
                                                setOpenOpcUsers(false);
                                            }}
                                            onChange={(_event, newValue) => {
                                                setSelectedUser({id: newValue.value, name: newValue.label});
                                                getMessages(newValue.value);
                                            }}
                                            loading={loading}
                                            renderOption={(props, option) => (
                                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                    <img 
                                                        alt=""
                                                        loading="lazy"
                                                        width="50"
                                                        src={option.image}
                                                    />
                                                    {option.label}
                                                </Box>
                                            )}
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
                                        {userList ? (
                                            <div>
                                                <List sx={{ width: '100%' }}>
                                                    {userList.map((data, index) => (
                                                        <div>
                                                            {index !== 0 && (<Divider />)}
                                                            <ListItem
                                                                key={`key${data.id}`}
                                                                button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setSelectedUser({id: data.id, name: data.nome})
                                                                    getMessages(data.id)
                                                                }}
                                                            >
                                                                <ListItemAvatar>
                                                                    <Avatar
                                                                        alt="avatar"
                                                                        src={data.imagem_perfil}
                                                                    />
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={data.nome}
                                                                />
                                                            </ListItem>
                                                        </div>
                                                    ))}
                                                </List>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 50 }}>
                                                <Typography 
                                                    variant="h6"
                                                    align={'center'}
                                                >
                                                    Mantenha contato com sua rede
                                                </Typography>
                                                <Typography 
                                                    variant="body1"
                                                    align={'center'}
                                                    color={'textSecondary'}
                                                >
                                                    Inicie uma conversa com suas conexões ou encontre mais pessoas para adicionar à sua rede.
                                                </Typography>
                                            </div>
                                        )}
                                    </div>
                                )}
                            <div ref={messagesEndRef}/>                           
                            </CardContent>
                            {selectedUser ? (
                                <>
                                    <Divider />
                                    <CardActions>
                                        <form
                                            className={'footer'}
                                            onSubmit={handleSubmit(onSubmit)}
                                            autoComplete="off"
                                        >
                                            <TextField
                                                fullWidth
                                                {...register('message', { required: true })}
                                                type="text"
                                                placeholder="Digite sua mensagem..."
                                                variant="outlined"
                                                color="secondary"
                                                disabled={send}
                                                inputProps={{
                                                    'aria-label': 'Digite sua mensagem...'
                                                }}
                                            />
                                            {loading || send ? (
                                                <div className="wave">
                                                    <span className="dot" />
                                                    <span className="dot" />
                                                    <span className="dot" />
                                                </div>
                                            ) : (
                                                <IconButton
                                                    className="ico"
                                                    type="submit"
                                                    aria-label="send"
                                                    color={'secondary'}
                                                >
                                                    <Send />
                                                </IconButton>
                                            )}
                                        </form>
                                    </CardActions>
                                </>
                        ) : ('')}
                        </Card>
                    </Paper>
                </div>
            )}
        </>
    )
};
export default Chat;

const defaultMessage = [
    {
        mensagem: 'Envie uma mensagem para iniciar a conversa.',
        apagar: true,
    }
];