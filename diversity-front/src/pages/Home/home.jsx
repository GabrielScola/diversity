import React, { useContext, useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Menu,
    MenuItem,
    Modal,
    Paper,
    TextField,
    Tooltip,
    Typography,

} from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import Header from '../../layout/Header/After.js';
import Footer from '../../layout/Footer/Footer';
import Request from '../../helper/Request';
import Toast from '../../helper/Toast';
import { Close, MoreVert, Movie, PersonAdd, Photo, Send } from '@mui/icons-material';
import moment from 'moment';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState(null);
    const [recomendation, setRecomendation] = useState(null);
    const [publicacao, setPublicacao] = useState(null);
    const [publicacaoImage, setPublicacaoImage] = useState(null);
    const [follow, setFollow] = useState({
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [selectedPost, setSelectedPost] = useState(null);
    const [reload, setReload] = useState(null);
    const [modalEdit, setModalEdit] = useState(false);
    const { user, userImage } = useContext(AuthContext);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const response = await Request(
                'POST',
                '/home/find',
                null,
                { id: user.id },
                null,
                null,
            )

            if (response.data) {
                setPosts(response?.data);
            }

            const responseDois = await Request(
                'POST',
                '/home/recomendation',
                null,
                { id: user.id },
                null,
                null,
            )

            if (responseDois.data) {
                setRecomendation(responseDois.data);
            }
            setLoading(false);
            setPublicacaoImage(null);
        }

        fetchData();
    }, [reload])

    const reloadPosts = () => {
        setReload(Math.random());
    }

    const handleSeguir = (e, data, index) => {
        e.preventDefault();
        if(index === 0)
            setFollow({...follow, 0: true})
        if(index === 1)
            setFollow({...follow, 1: true})
        if(index === 2)
            setFollow({...follow, 2: true})
        if(index === 3)
            setFollow({...follow, 3: true})
        if(index === 4)
            setFollow({...follow, 4: true})

        Request(
            'POST',
            '/home/follow',
            null,
            {idUsuario: user.id, idFollower: data.id},
            null,
            null,
        )
    }

    const handlePublicar = async (e) => {
        e.preventDefault();
        const id = Toast.loading();
        
        const response = await Request (
            'POST',
            '/home/publish',
            null,
            {id: user.id, publicacao: publicacao, anexo: publicacaoImage},
            null,
            null,
        )

        if (!response.success) {
            Toast.updateError(id, response.message, true);
        } else {
            Toast.updateSuccess(id, response.message);
            reloadPosts();
        }
    }

    const handleOpenMenu = (e, post) => {
        setAnchorEl(e.currentTarget);
        setSelectedPost(post)
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleOpenEdit = (e) => {
        e.preventDefault();
        handleCloseMenu();
        setModalEdit(true);
    };

    const handleCloseEdit = () => {
        setModalEdit(false);
    };

    const handleEditarPublicacao = async (e) => {
        e.preventDefault();
        handleCloseEdit();
        const id = Toast.loading();

        const response = await Request(
            'PUT',
            `/home/edit-post`,
            null,
            { codpublicacao: selectedPost.codpublicacao, descricao: selectedPost.descricao },
            null,
            null,
        );

        if (!response.success) {
            Toast.updateError(id, response.message);
        } else {
            Toast.updateSuccess(id, response.message);
            reloadPosts();
        }
    }

    const handleDeletePublicacao = async (e) => {
        e.preventDefault();
        handleCloseMenu();
        const id = Toast.loading();

        const response = await Request(
            'DELETE',
            `/home/delete-post/${selectedPost.codpublicacao}`,
            null,
            null,
            null,
            null,
        )

        if (!response.success) {
            Toast.updateError(id, response.message);
        } else {
            Toast.updateSuccess(id, response.message);
            reloadPosts();
        }
    }

    return (
        <>
            <Header signUp={true} />
            {loading ? (
                <div style={{ marginTop: 150, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress color="secondary" size={100} />
                </div>

            ) : (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Box sx={{
                        marginTop: '3vh',
                        display: 'flex',
                        '& > :not(style)': {
                            width: '40vh',
                        }
                    }}>
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
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
                                    <Avatar src={userImage} sx={{ width: 120, height: 120 }} />
                                    <Typography sx={{ marginTop: 2 }} variant='body1'><b>Olá, {user.nome.split(' ')[0]}!</b></Typography>
                                </div>
                                <Divider />
                                <div style={{ paddingTop: 20, paddingBottom: 20 }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Typography variant='body2'>Conexões</Typography>
                                        <PersonAdd sx={{ color: '#696969' }} />
                                    </div>
                                    <Link href='#' underline='hover' style={{ color: "black", fontSize: 15 }}>Amplie suas conexões</Link>
                                </div>
                                <Divider />
                            </Grid>
                        </div>
                    </Box>
                    <Box
                        sx={{
                            marginTop: '3vh',
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
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <Avatar src={userImage} />
                                <TextField
                                    type="text"
                                    color="secondary"
                                    size="small"
                                    sx={{ marginLeft: 2 }}
                                    multiline
                                    maxRows={5}
                                    placeholder="Começar pubicação"
                                    fullWidth
                                    onChange={(e) => setPublicacao(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={(e) => {
                                                        if(publicacao)
                                                            handlePublicar(e)  
                                                    }}
                                                >
                                                    <Send color="secondary"/>
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>
                            {publicacaoImage && (
                                <>
                                    <div style={{ marginTop: 20, marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
                                        <img 
                                            alt=""
                                            src={publicacaoImage}
                                            width="535"
                                            height="535"
                                        />
                                        <IconButton disableRipple onClick={() => setPublicacaoImage(null)}>
                                            <Tooltip title="Remover imagem">
                                                <Close />   
                                            </Tooltip>
                                        </IconButton>
                                    </div>
                                    <Divider />                                
                                </>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                                <Link  component="label" underline='hover' style={{ color: "black", alignItems: 'center', cursor: 'pointer', display: 'flex' }}>
                                    <Photo sx={{ color: '#696969', marginRight: 0.5 }} />                                    
                                    Foto
                                    <input 
                                        hidden 
                                        accept="image/*" 
                                        type="file"
                                        onChange={(event) => {
                                            event.preventDefault();
                                            const file = event.target.files[0];
                                            if(file && file.type.substr(0, 5) === 'image') {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setPublicacaoImage(reader.result);
                                                }
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </Link>
                                <Link component="label" underline='hover' style={{ color: "black", marginLeft: 30, cursor: 'pointer', alignItems: 'center', display: 'flex' }}>
                                    <Movie sx={{ color: '#696969', marginRight: 0.5 }} />
                                    Vídeo
                                    <input 
                                        hidden 
                                        accept="video/*" 
                                        type="file"
                                        onChange={(event) => {
                                            event.preventDefault();
                                            const file = event.target.files[0];
                                            if(file && file.type.substr(0, 5) === 'video') {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setPublicacaoImage(reader.result);
                                                }
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </Link>
                            </div>
                        </Grid>
                        <Grid
                            container
                            component={Paper}
                            elevation={3}
                            sx={{
                                marginTop: 4,
                                borderRadius: 5,
                                padding: '20px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                flexWrap: 'nowrap'
                            }}
                        >
                            <Typography >Recomendações para você</Typography>
                            <Divider />
                            <List sx={{ width: '100%' }}>
                                {recomendation?.map((data, index) => (
                                    <div>
                                        {index !== 0 && (<Divider />)}
                                        <ListItem 
                                            key={`key${data.id}`}
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={data.imagem_perfil}/>
                                            </ListItemAvatar>
                                            <ListItemText 
                                                primary={<Link href={`/perfil/${data.id}`} underline="hover" style={{color: "black", cursor: "pointer"}}>{data.nome}</Link>}
                                            />
                                            <ListItemSecondaryAction>
                                                <Button variant={follow[index] ? "contained":"outlined"} disabled={follow[index]} sx={{borderRadius: 300}} color="secondary" onClick={(e) => handleSeguir(e, data, index)}>
                                                    {follow[index] ? <b>Seguindo</b> : <b>+ Seguir</b>}
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </div>
                                ))}
                            </List>
                        </Grid>
                        {posts?.map((post, index) => (
                            <Grid 
                                key={`key${post.codpublicacao}`} 
                                container 
                                component={Paper} 
                                elevation={3}
                                sx={{
                                    marginTop: 4,
                                    borderRadius: 5,
                                    padding: '20px 40px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexWrap: 'nowrap'
                                }}
                            >
                                <Avatar src={post.imagem_perfil}/>
                                <div style={{ marginLeft: 10, display: 'flex', flexDirection: 'column' }}>
                                    <Typography>
                                        <b>{post.nome}</b>
                                    </Typography>
                                    <Typography variant="body2" color={"textSecondary"}>
                                        {moment(post.dthr.replace('T', ' ')).format('DD/MM/YYYY HH:mm')}
                                    </Typography>
                                    <Typography variant="body1" sx={{ marginTop: 1, wordWrap: 'break-word', width: '560px'}}>
                                        {post.descricao}
                                    </Typography>
                                    {post.anexo && (
                                        <img 
                                            alt=""
                                            loading="lazy"
                                            width="535"
                                            height="535"
                                            style={{marginTop: 10}}
                                            src={post.anexo}
                                        />
                                    )}
                                </div>
                                {post.id === user.id && (
                                    <div style={{ paddingRight: 20 }}>
                                        <IconButton
                                            onClick={(e) => handleOpenMenu(e, post)}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </div>
                                )}                                
                            </Grid>
                        ))}
                    </Box>
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
                        <MenuItem onClick={(e) => handleOpenEdit(e)}>Editar publicação</MenuItem>
                        <MenuItem onClick={(e) => handleDeletePublicacao(e)}>Excluir publicação</MenuItem>
                    </Menu>
                    <Modal
                        open={modalEdit}
                        onClose={handleCloseEdit}
                    >
                        <Paper
                            sx={{ 
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                paddingLeft: 3,
                                paddingTop: 1,
                                borderRadius: 5,
                                width: 750, 
                                paddingRight: 3 
                            }}
                            elevation={3}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant='h6'>
                                    <b>Editar publicação</b>
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
                                    onClick={() => handleCloseEdit()}
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
                </div>
            )}
            <Box mt={5}>
                <Footer />
            </Box>
        </>
    )
};

export default Home;