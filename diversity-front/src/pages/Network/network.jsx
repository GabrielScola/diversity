import React, { useState, useEffect, useContext } from 'react';
import { Avatar, Box, Button, CircularProgress, Divider, Grid, Link, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Tab, Tabs, Typography } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import Footer from '../../layout/Footer/Footer';
import Header from '../../layout/Header/After';
import Request from '../../helper/Request';
import { Groups } from '@mui/icons-material';

function TabPanel(props) {
    const { children, value, index } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && (
          <Box sx={{ p: 2 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

const Network = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [recomendation, setRecomendation] = useState(null);
    const [follow, setFollow] = useState({
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
    });
    const [conexoes, setConexoes] = useState(false);
    const [following, setFollowing] = useState(null);
    const [followers, setFollowers] = useState(null);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Request(
                'POST',
                '/home/recomendation',
                null,
                { id: user.id },
                null,
                null,
            )

            if (response.data) {
                setRecomendation(response.data)
            }

            const responseFollowing = await Request(
                'POST',
                '/network/following',
                null,
                {id: user.id},
                null,
                null,
            )

            if(responseFollowing.data) {
                setFollowing(responseFollowing.data)
            }

            const responseFollowers = await Request(
                'POST',
                '/network/followers',
                null,
                {id: user.id},
                null,
                null,
            )

            if(responseFollowers.data) {
                setFollowers(responseFollowers.data)
            }

            setLoading(false);
        }

        fetchData();
    }, [user.id]);

    useEffect(() => {
        if(followers && following && !followers.seguindo && !following.seguindo) {
            following.forEach((x) => {
                x.seguindo = true
                followers.forEach((y) => {
                    if(x.mutual === y.idusuario){
                        y.seguindo = true
                    }
                })
            })
        }
    }, [followers, following])

    const handleSeguir = (e, data, index) => {
        e.preventDefault();
        
        if(!follow[index]) {
            setFollow({...follow, [index]: true});

            Request(
                'POST',
                '/home/follow',
                null,
                {idUsuario: user.id, idFollower: data.id},
                null,
                null,
            )

        } else {
            setFollow({...follow, [index]: false});

            Request(
                'DELETE',
                '/home/unfollow',
                null,
                {idUsuario: user.id, idFollower: data.id},
                null,
                null,
            )
        }
    }

    const handleFollowing = (e, data, index) => {
        e.preventDefault();

        if(!following[index].seguindo) {
            following[index] = {...following[index], seguindo: true}
            setFollowing([...following])
            Request(
                'POST',
                '/home/follow',
                null,
                {idUsuario: user.id, idFollower: data.mutual},
                null,
                null,
            )
        } else {
            following[index] = {...following[index], seguindo: false}
            setFollowing([...following])
            Request(
                'DELETE',
                '/home/unfollow',
                null,
                {idUsuario: user.id, idFollower: data.mutual},
                null,
                null,
            )
        }
    }

    const handleFollowers = (e, data, index) => {
        e.preventDefault();

        if(!followers[index].seguindo) {
            followers[index] = {...followers[index], seguindo: true}
            setFollowers([...followers])
            Request(
                'POST',
                '/home/follow',
                null,
                {idUsuario: user.id, idFollower: data.idusuario},
                null,
                null,
            )
        } else {
            followers[index] = {...followers[index], seguindo: false}
            setFollowers([...followers])
            Request(
                'DELETE',
                '/home/unfollow',
                null,
                {idUsuario: user.id, idFollower: data.idusuario},
                null,
                null,
            )
        }
    }

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
      };

    return (
        <>
            <Header />
            {loading ? (
                <div style={{ marginTop: 150, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress color="secondary" size={100} />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Box
                        sx={{
                            marginTop: '3vh',
                            display: 'flex',
                            flexDirection: 'column',
                            '& > :not(style)': {
                                width: '40vh',
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
                                flexDirection: 'column'
                            }}
                        >   
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" >Gerenciar minha rede</Typography>
                                <Groups sx={{ color: '#696969' }}/>
                            </div>
                            <div style={{ marginTop: 25 }}>
                                <Link onClick={() => setConexoes(true)} underline="hover" color="textSecondary" style={{ cursor: 'pointer' }}><li>Conexões</li></Link>
                            </div>
                        </Grid>
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
                        <div hidden={!conexoes}>
                            {following || followers ? (
                                <>                                                        
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
                                        <Box sx={{ width: '100%' }}>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                <Tabs 
                                                    value={value} 
                                                    onChange={handleChangeTab} 
                                                    textColor="secondary" 
                                                    indicatorColor="secondary"
                                                >
                                                    <Tab label="Seguindo"/>
                                                    <Tab label="Seguidores"/>
                                                </Tabs>
                                            </Box>
                                            <TabPanel value={value} index={0}>
                                                {!following ? (
                                                    <Typography sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }} variant="body2">Você ainda não está seguindo ninguém.</Typography>
                                                ) : (
                                                    <List sx={{ width: '100%' }}>
                                                        {following?.map((data, index) => (
                                                            <div>
                                                                {index !== 0 && (<Divider />)}
                                                                <ListItem
                                                                    key={`key${data.mutual}`}
                                                                >
                                                                    <ListItemAvatar>
                                                                        <Avatar src={data.imagem_perfil}/>
                                                                    </ListItemAvatar>
                                                                    <ListItemText 
                                                                        primary={<Link href={`/perfil/${data.mutual}`} underline="hover" style={{color: 'black', cursor: "pointer"}}>{data.nome}</Link>}
                                                                    />
                                                                    <ListItemSecondaryAction>
                                                                        <Button variant={following[index].seguindo ? "contained" : "outlined"} sx={{borderRadius: 300}} color="secondary" onClick={(e) => handleFollowing(e, data, index)}>
                                                                            {following[index].seguindo ? <b>Seguindo</b> : <b>+ Seguir</b>}
                                                                        </Button>
                                                                    </ListItemSecondaryAction>
                                                                </ListItem>
                                                            </div>
                                                        ))}
                                                    </List>
                                                )}
                                            </TabPanel>
                                            <TabPanel value={value} index={1}>
                                                {!followers ? (
                                                    <Typography sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }} variant="body2">Você ainda não tem seguidores.</Typography>
                                                ) : (
                                                    <List sx={{ width: '100%' }}>
                                                        {followers.map((data, index) => (
                                                            <div>
                                                                {index !== 0 && (<Divider />)}
                                                                <ListItem
                                                                    key={`key${data.idusuario}`}
                                                                >
                                                                    <ListItemAvatar>
                                                                        <Avatar src={data.imagem_perfil}/>
                                                                    </ListItemAvatar>
                                                                    <ListItemText 
                                                                        primary={<Link href={`/perfil/${data.idusuario}`} underline="hover" style={{color: 'black', cursor: "pointer"}}>{data.nome}</Link>}
                                                                    />
                                                                    <ListItemSecondaryAction>
                                                                        <Button variant={followers[index].seguindo ? "contained" : "outlined"} sx={{borderRadius: 300}} color="secondary" onClick={(e) => handleFollowers(e, data, index)}>
                                                                            {followers[index].seguindo ? <b>Seguindo</b> : <b>+ Seguir</b>}
                                                                        </Button>
                                                                    </ListItemSecondaryAction>
                                                                </ListItem>
                                                            </div>
                                                        ))}
                                                    </List>
                                                )}
                                            </TabPanel>
                                        </Box>
                                    </Grid>
                                </>
                            ) : (
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
                                    <Typography variant='h6'>Você ainda não tem conexões</Typography>
                                    <Divider />
                                    <Typography sx={{marginTop: 1}}>
                                        Descubra novas ideias e vagas no Diversity com a ajuda de suas conexões e as redes delas.
                                    </Typography>
                                </Grid>
                            )}
                        </div>
                        <Grid
                            container
                            component={Paper}
                            elevation={3}
                            sx={{
                                borderRadius: 5,
                                padding: '20px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                flexWrap: 'nowrap',
                                marginTop: conexoes ? '25px' : 0
                            }}
                        >
                            <Typography>Recomendações para você</Typography>
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
                                                primary={<Link href={`/perfil/${data.id}`} underline="hover" style={{color: 'black', cursor: "pointer"}}>{data.nome}</Link>}
                                            />
                                            <ListItemSecondaryAction>
                                                <Button variant={follow[index] ? "contained" : "outlined"} sx={{borderRadius: 300}} color="secondary" onClick={(e) => handleSeguir(e, data, index)}>
                                                    {follow[index] ? <b>Seguindo</b> : <b>+ Seguir</b>}
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </div>
                                ))}
                            </List>
                        </Grid>
                    </Box>
                </div>
            )}
            <Box mt={5}>
                <Footer />
            </Box>
        </>
    )
}

export default Network;