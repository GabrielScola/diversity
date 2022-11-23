import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Button,
    Grid,
    Paper,
    Link,
    Avatar,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Modal,
    IconButton,
    TextField,
    Tooltip,
    Divider,
    Autocomplete,
    Chip,
    Checkbox,
    FormGroup,
    FormControlLabel
} from '@mui/material';
import { Launch, Notifications, Done, Work, ArrowBack, FilterList } from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import Header from '../../layout/Header/After';
import Footer from '../../layout/Footer/Footer';
import Request from '../../helper/Request';
import Toast from '../../helper/Toast';

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300
    }
})

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    paddingLeft: 3,
    paddingRight: 3,
    paddingBottom: 1,
    paddingTop: 1,
    borderRadius: 5,
}

const Vagas = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [applySent, setApplySent] = useState(false);
    const [vagas, setVagas] = useState(null);
    const [modalVaga, setModalVaga] = useState(false);
    const [modalPergunta, setModalPergunta] = useState(false);
    const [modalAlerta, setModalAlerta] = useState(false);
    const [modalFilter, setModalFilter] = useState(false);
    const [resposta, setResposta] = useState(null);
    const [vagaSelecionada, setVagaSelecionada] = useState(null);
    const [transition, setTransition] = useState(false);
    const [userVagas, setUserVagas] = useState(null);
    const [loadingModal, setLoadingModal] = useState(false);
    const [loadingList, setLoadingList] = useState(false);
    const [userAlerta, setUserAlerta] = useState({
        profissao: null,
        local: null,
    });
    const [filter, setFilter] = useState(null);
    const [filterOptions, setFilterOptions] = useState({
        cargo: null,
        local: null,
        negro: false,
        lgbt: false,
        pcd: false,
    });

    const [opcCidades, setOpcCidades] = useState([]);
    const [openOpcCidades, setOpenOpcCidades] = useState(false);
    const loadingOpcCidades = openOpcCidades && opcCidades.length === 0;

    const [opcJobs, setOpcJobs] = useState([]);
    const [openOpcJobs, setOpenOpcJobs] = useState(false);
    const loadingOpcJobs = openOpcJobs && opcJobs.length === 0;

    useEffect(() => {
        const fetchData = async () => {
            const response = await Request(
                'GET',
                `/user/${user.id}`,
                null,
                null,
                null
            );
    
            if(response.success) {
                setFilter({
                    cargo: response.data.alerta_cargo,
                    local: response.data.alerta_local.split(' /')[0],
                    negro: response.data.negro === 'S' ? true : false,
                    lgbt: response.data.lgbt === 'S' ? true : false,
                    pcd: response.data.pcd === 'S' ? true : false
                })                
            }
        }

        if(!filter)
            fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const response = await Request(
                'POST',
                `/jobs/filter`,
                null,
                filter,
                null,
                null,
            )

            if (!response.success) {
                setVagas(null);
                setLoading(false);
                setLoadingList(false)
            } else {
                setVagas(response.data);
                setLoading(false);
                setLoadingList(false)
            }
        }

        if(filter) {
            fetchData();
            setLoadingList(true)
        }
    }, [filter]);

    useEffect(() => {
        let active = true;

        if (!loadingOpcCidades) {
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
    }, [loadingOpcCidades])

    useEffect(() => {
        if (!openOpcCidades) {
            setOpcCidades([]);
        }
    }, [openOpcCidades]);

    useEffect(() => {
        let active = true;

        if (!loadingOpcJobs) {
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
    }, [loadingOpcJobs])

    useEffect(() => {
        if (!openOpcJobs) {
            setOpcJobs([]);
        }
    }, [openOpcJobs]);

    const handleOpenModalVaga = (event, data) => {
        event.preventDefault();
        setVagaSelecionada(data);
        setModalVaga(true);
    }

    const handleCloseModalVaga = () => {
        setModalVaga(false);
        setApplySent(false);
    }

    const handleOpenModalPergunta = () => {
        setModalPergunta(true);
    }

    const handleCloseModalPergunta = () => {
        setModalPergunta(false);
    }

    const handleCandidatar = async () => {
        if (!vagaSelecionada.pergunta || resposta) {
            setButtonLoading(true);
            handleCloseModalPergunta();
            const response = await Request(
                'POST',
                '/jobs/apply',
                null,
                { ...user, ...vagaSelecionada, resposta: resposta },
                null,
                null
            )

            if (!response.success) {
                Toast.error(response.message);
                setApplySent(true);
            } else {
                Toast.success(response.message);
                setApplySent(true);
            }
            setButtonLoading(false);
        } else {
            handleOpenModalPergunta();
        }
    }

    const handleTransition = async (e) => {
        e.preventDefault();
        setTransition(true);

        if (!userVagas) {
            setLoading(true)
            const response = await Request(
                'GET',
                `/jobs/user-jobs/${user.id}`,
                null,
                null,
                null,
                null
            );

            if (response.success) {
                setUserVagas(response.data)
            }
            setLoading(false);
        }
    }

    const handleOpenAlerta = async () => {
        setLoadingModal(true);
        setModalAlerta(true);

        const response = await Request(
            'GET',
            `/user/${user.id}`,
            null,
            null,
            null
        );

        if(!response.success) {
            Toast.error(response.message);
        } else {
            setUserAlerta({
                profissao: response.data.alerta_cargo,
                local: response.data.alerta_local
            })
        }

        setLoadingModal(false);
    }

    const handleCloseAlerta = () => {
        setModalAlerta(false);
    }

    const handleSalvarAlerta = async () => {
        const response = await Request(
            'PUT',
            '/jobs/update-alert',
            null,
            {...userAlerta, id: user.id},
            null,
            null,
        );

        if(!response.success) {
            Toast.error(response.message)
        } else {
            Toast.success(response.message)
            handleCloseAlerta();
        }
    }

    const handleOpenFilter = async () => {
        setFilterOptions(filter);
        setModalFilter(true);
    }

    const handleCloseFilter = async () => {
        setModalFilter(false);
    }

    const handleChangeCheckbox = (event) => {
        setFilterOptions({...filterOptions, [event.target.name]: event.target.checked})
    }

    const handleFiltrar = () => {
        handleCloseFilter();
        setFilter(filterOptions);
    }

    const handleClearFilter = () => {
        handleCloseFilter();
        setFilter({
            cargo: null,
            local: null,
            negro: false,
            lgbt: false,
            pcd: false,
        })
    }

    return (
        <div>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Box sx={{
                    marginTop: '5vh',
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
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" >Alerta de vagas</Typography>
                                <Notifications sx={{ color: '#696969' }} />
                            </div>
                            <div style={{ marginTop: 25 }}>
                                <Link onClick={handleOpenAlerta} underline="hover" color="textSecondary" style={{ cursor: 'pointer' }}><li>Configurar alerta</li></Link>
                            </div>
                        </Grid>
                        <Grid
                            container
                            component={Paper}
                            elevation={3}
                            sx={{
                                borderRadius: 5,
                                padding: '20px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: 3,
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" >Minhas vagas candidatadas</Typography>
                                <Work sx={{ color: '#696969' }} />
                            </div>
                            <div style={{ marginTop: 25 }}>
                                <Link onClick={handleTransition} underline="hover" color="textSecondary" style={{ cursor: 'pointer' }}><li>Ver vagas</li></Link>
                            </div>
                        </Grid>
                    </div>
                </Box>
                <div hidden={transition}>
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
                            {loading && !transition ? (
                                <div style={{ marginTop: 100, marginBottom: 100, display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress color='secondary' size={100} />
                                </div>
                            ) : (
                                <div>
                                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <div>
                                            <Chip label="Filtros" color="secondary"/>
                                            {filter?.cargo && (
                                                <Chip label={`Cargo: ${filter.cargo}`} sx={{ margin: '2px 2px 2px 2px'}} color="secondary" onDelete={(e) => {e.preventDefault(); setFilter({...filter, cargo: null})}}/>
                                            )}
                                            {filter?.local && (
                                                <Chip label={`Local: ${filter.local}`} sx={{ margin: '2px 2px 2px 2px'}} color="secondary" onDelete={(e) => {e.preventDefault(); setFilter({...filter, local: null})}}/>
                                            )}
                                            {filter?.negro && (
                                                <Chip label={`Negros`} sx={{ margin: '2px 2px 2px 2px'}} color="secondary" onDelete={(e) => {e.preventDefault(); setFilter({...filter, negro: false})}}/>
                                            )}
                                            {filter?.lgbt && (
                                                <Chip label={`LGBTQIA+`} sx={{ margin: '2px 2px 2px 2px'}} color="secondary" onDelete={(e) => {e.preventDefault(); setFilter({...filter, lgbt: false})}}/>
                                            )}
                                            {filter?.pcd && (
                                                <Chip label={`PCD's`} sx={{ margin: '2px 2px 2px 2px'}} color="secondary" onDelete={(e) => {e.preventDefault(); setFilter({...filter, pcd: false})}}/>
                                            )}
                                        </div>
                                        <IconButton onClick={handleOpenFilter}>
                                            <Tooltip title="Filtrar">
                                                <FilterList color={filter ? 'secondary' : 'inherit'} />
                                            </Tooltip>
                                        </IconButton>
                                    </div>
                                    <Typography variant="h6">
                                        Recomendações para você
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Com base no seu perfil e histórico de pesquisas
                                    </Typography>
                                    {vagas ? (
                                        <>
                                            {loadingList ? (
                                                <div style={{ marginTop: 50, marginBottom: 50, display: 'flex', justifyContent: 'center' }}>
                                                    <CircularProgress color='secondary' size={100} />
                                                </div>
                                            ) : (
                                                <List sx={{ width: '100%' }}>
                                                    {vagas?.map((data) => (
                                                        <ListItem
                                                            key={`key${data.codvaga}`}
                                                            button
                                                            onClick={(e) => handleOpenModalVaga(e, data)}
                                                            secondaryAction={
                                                                <IconButton
                                                                    edge="end"
                                                                    aria-label="open"
                                                                    disableRipple
                                                                >
                                                                    <Launch />
                                                                </IconButton>
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
                                                                primary={`${data.cargo} ${data.presencial !== 'Remoto' ? `- ${data.cidade} / ${data.uf}` : ''} - Vaga disponível para ${data.disponivel_para} (${data.presencial} - ${data.tempo_trabalho}h)`}
                                                                secondary={data.nome_empresa}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            )}
                                        </>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>Nenhuma vaga encontrada.</Typography>
                                    )}
                                </div>
                            )}
                        </Grid>
                    </Box>
                </div>
                <div hidden={!transition}>
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
                            {transition && loading ? (
                                <div style={{ marginTop: 100, marginBottom: 100, display: 'flex', justifyContent: 'center' }} >
                                    <CircularProgress color='secondary' size={100} />
                                </div>
                            ) : (
                                <div>
                                    <IconButton onClick={() => setTransition(false)}>
                                        <Tooltip title="Voltar">
                                            <ArrowBack />
                                        </Tooltip>
                                    </IconButton>
                                    <Typography variant="h6">
                                        Vagas candidatadas
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Aqui estão as vagas que você se candidatou
                                    </Typography>
                                    <List sx={{ width: '100%' }}>
                                        {userVagas?.map((data) => (
                                            <ListItem
                                                key={`key${data.codvaga}`}
                                                button
                                                onClick={(e) => handleOpenModalVaga(e, data)}
                                                secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="open"
                                                        disableRipple
                                                    >
                                                        <Launch />
                                                    </IconButton>
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
                                                    primary={`${data.cargo} ${data.presencial !== 'Remoto' ? `- ${data.cidade} / ${data.uf}` : ''} - Vaga disponível para ${data.disponivel_para} (${data.presencial} - ${data.tempo_trabalho}h)`}
                                                    secondary={data.nome_empresa}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            )}
                        </Grid>
                    </Box>
                </div>
            </div>
            <div>
                <Modal
                    open={modalVaga}
                    onClose={handleCloseModalVaga}
                >
                    <Paper
                        sx={{ ...modalStyle, width: 750 }}
                        elevation={3}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='h6'>
                                <b>Detalhes da vaga</b>
                            </Typography>
                            <div style={{ marginTop: 25, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Avatar
                                    src={vagaSelecionada?.imagem_perfil}
                                    sx={{ width: 120, height: 120 }}
                                    variant="rounded"
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
                                    <Typography variant='h5'>
                                        <Link href={`${window.location.href.split('/')[0]}/empresa/${vagaSelecionada?.codempresa}`} target="_blank" underline="hover" color="secondary">
                                            {vagaSelecionada?.nome_empresa}
                                        </Link>
                                    </Typography>
                                    <Typography variant='h6'>
                                        {vagaSelecionada?.setor}
                                    </Typography>
                                </div>
                            </div>
                            <div style={{ marginTop: 15 }}>
                                <Typography variant='body1'>
                                    {`Setor: ${vagaSelecionada?.cargo}`}<br />
                                    {`Local: ${vagaSelecionada?.presencial !== 'Remoto' ?
                                        `${vagaSelecionada?.cidade} / ${vagaSelecionada?.uf} (${vagaSelecionada?.presencial})` :
                                        vagaSelecionada?.presencial}`}<br />
                                    {`Horas de trabalho: ${vagaSelecionada?.tempo_trabalho}h`}<br />
                                    {`Disponível para: ${vagaSelecionada?.disponivel_para}`}<br />
                                    {`Descrição: ${vagaSelecionada?.descricao}`}
                                </Typography>
                            </div>
                        </div>
                        {!transition ? (
                            <div style={{ marginTop: 15, display: 'flex', justifyContent: 'end' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ borderRadius: 300, width: 200, height: 40 }}
                                    onClick={handleCandidatar}
                                    disabled={buttonLoading || applySent}
                                >
                                    {buttonLoading ? <CircularProgress color="secondary" size={25} /> : applySent ? <Done color="secondary" /> : <b>Candidatar-se</b>}
                                </Button>
                            </div>
                        ) : ('')}
                    </Paper>
                </Modal>
                <Modal
                    open={modalPergunta}
                    onClose={handleCloseModalPergunta}
                >
                    <Paper
                        sx={{ ...modalStyle, width: 550 }}
                        elevation={3}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='h6'>
                                <b>Pergunta de triagem</b>
                            </Typography>
                            <Divider />
                            <Typography variant="body1">
                                Antes de se candidatar, responda a seguninte pergunta:
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 2 }}>
                                "{vagaSelecionada?.pergunta}"
                            </Typography>
                            <TextFieldStyled
                                fullWidth
                                color="secondary"
                                size="small"
                                required
                                sx={{ marginTop: 1 }}
                                onChange={(event) => setResposta(event.target.value)}
                            />
                            <div style={{ marginTop: 15, display: 'flex', justifyContent: 'end' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ borderRadius: 300 }}
                                    onClick={handleCandidatar}
                                >
                                    <b>Enviar resposta</b>
                                </Button>
                            </div>
                        </div>
                    </Paper>
                </Modal>
                <Modal
                    open={modalAlerta}
                    onClose={handleCloseAlerta}
                >
                    <Paper
                        sx={{ ...modalStyle, width: 550 }}
                        elevation={3}
                    >
                        {loadingModal ? (
                            <div style={{ display: 'flex', justifyContent: 'center' }} >
                                <CircularProgress color='secondary' size={100} />
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant='h6'>
                                    <b>Configurar alerta de vagas</b>
                                </Typography>
                                <Divider />
                                <Autocomplete
                                    id="combo-box"
                                    sx={{ margin: 'auto' }}
                                    options={opcJobs}
                                    open={openOpcJobs}
                                    onOpen={() => {
                                        setOpenOpcJobs(true);
                                    }}
                                    onClose={() => {
                                        setOpenOpcJobs(false);
                                    }}
                                    defaultValue={userAlerta.profissao}
                                    onChange={(_event, newValue) => {
                                        setUserAlerta({ ...userAlerta, profissao: newValue.label })
                                    }}
                                    fullWidth
                                    loading={loadingOpcJobs}
                                    renderInput={(params) => (
                                        <TextFieldStyled
                                            {...params}
                                            label='Cargo'
                                            type='text'
                                            variant='outlined'
                                            color='secondary'
                                            margin='dense'
                                            fullWidth
                                            size='small'
                                            sx={{marginTop: 3}}
                                        />
                                    )}
                                />
                                <Autocomplete
                                    id="combo-box"
                                    options={opcCidades}
                                    open={openOpcCidades}
                                    onOpen={() => {
                                        setOpenOpcCidades(true);
                                    }}
                                    onClose={() => {
                                        setOpenOpcCidades(false);
                                    }}
                                    defaultValue={userAlerta.local}
                                    onChange={(_event, newValue) => {
                                        setUserAlerta({ ...userAlerta, local: newValue.label })
                                    }}
                                    fullWidth
                                    loading={loadingOpcCidades}
                                    renderInput={(params) => (
                                        <TextFieldStyled
                                            {...params}
                                            label='Local'
                                            type='text'
                                            variant='outlined'
                                            color='secondary'
                                            margin='dense'
                                            fullWidth
                                            size='small'
                                        />
                                    )}
                                />
                                <div style={{ marginTop: 15, display: 'flex', justifyContent: 'end' }}>
                                    <Button
                                        variant="contained"
                                        color="text"
                                        sx={{ borderRadius: 300 }}
                                        onClick={handleCloseAlerta}
                                    >
                                        <b>Cancelar</b>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ borderRadius: 300, marginLeft: 1 }}
                                        onClick={handleSalvarAlerta}
                                    >
                                        <b>Salvar</b>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Paper>
                </Modal>
                <Modal
                    open={modalFilter}
                    onClose={handleCloseFilter}
                >
                    <Paper
                        sx={{ ...modalStyle, width: 550 }}
                        elevation={3}
                    >
                        {loadingModal ? (
                            <div style={{ display: 'flex', justifyContent: 'center' }} >
                                <CircularProgress color='secondary' size={100} />
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant='h6'>
                                    <b>Filtrar</b>
                                </Typography>
                                <Divider />
                                    <Autocomplete
                                        id="combo-box"
                                        sx={{ margin: 'auto' }}
                                        options={opcJobs}
                                        open={openOpcJobs}
                                        onOpen={() => {
                                            setOpenOpcJobs(true);
                                        }}
                                        onClose={() => {
                                            setOpenOpcJobs(false);
                                        }}
                                        defaultValue={filter?.cargo}
                                        onChange={(_event, newValue) => {
                                            setFilterOptions({ ...filterOptions, cargo: newValue.label })
                                        }}
                                        fullWidth
                                        loading={loadingOpcJobs}
                                        renderInput={(params) => (
                                            <TextFieldStyled
                                                {...params}
                                                label='Cargo'
                                                type='text'
                                                variant='outlined'
                                                color='secondary'
                                                margin='dense'
                                                fullWidth
                                                size='small'
                                                sx={{marginTop: 3}}
                                            />
                                        )}
                                    />
                                    <Autocomplete
                                        id="combo-box"
                                        options={opcCidades}
                                        open={openOpcCidades}
                                        onOpen={() => {
                                            setOpenOpcCidades(true);
                                        }}
                                        onClose={() => {
                                            setOpenOpcCidades(false);
                                        }}
                                        defaultValue={filter?.local}
                                        onChange={(_event, newValue) => {
                                            setFilterOptions({ ...filterOptions, local: newValue.label.split('/')[0] })
                                        }}
                                        fullWidth
                                        loading={loadingOpcCidades}
                                        renderInput={(params) => (
                                            <TextFieldStyled
                                                {...params}
                                                label='Local'
                                                type='text'
                                                variant='outlined'
                                                color='secondary'
                                                margin='dense'
                                                fullWidth
                                                size='small'
                                            />
                                        )}
                                    />
                                <FormGroup row>
                                    <FormControlLabel 
                                        control={
                                            <Checkbox
                                                checked={filterOptions?.negro}
                                                onChange={handleChangeCheckbox}
                                                color="secondary"
                                                name="negro"                                              
                                            />
                                        }
                                        label="Negros"
                                    />
                                    <FormControlLabel 
                                        control={
                                            <Checkbox
                                                checked={filterOptions?.lgbt}
                                                onChange={handleChangeCheckbox}
                                                color="secondary"                                                
                                                name="lgbt"                                            
                                            />
                                        }
                                        label="LGBTQIA+"
                                    />
                                    <FormControlLabel 
                                        control={
                                            <Checkbox
                                                checked={filterOptions?.pcd}
                                                onChange={handleChangeCheckbox}
                                                color="secondary"                                                
                                                name="pcd"                                              
                                            />
                                        }
                                        label="PCD's"
                                    />
                                </FormGroup>
                                <div style={{ marginTop: 15, display: 'flex', justifyContent: 'end' }}>
                                    <Button
                                        variant="contained"
                                        color="text"
                                        sx={{ borderRadius: 300 }}
                                        onClick={handleCloseFilter}
                                    >
                                        <b>Cancelar</b>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="text"
                                        sx={{ borderRadius: 300, marginLeft: 1 }}
                                        onClick={handleClearFilter}
                                    >
                                        <b>Limpar</b>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ borderRadius: 300, marginLeft: 1 }}
                                        onClick={handleFiltrar}
                                    >
                                        <b>Filtrar</b>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Paper>
                </Modal>
            </div>
            <Box mt={5}>
                <Footer />
            </Box>
        </div>
    )
}

export default Vagas;