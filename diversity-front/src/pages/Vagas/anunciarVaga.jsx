import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    IconButton,
    MenuItem,
    Autocomplete,
    TextField,
    Zoom,
    Tooltip,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../../contexts/AuthContext';
import Header from '../../layout/Header/After'
import Footer from '../../layout/Footer/Footer'
import Request from '../../helper/Request';
import { ArrowBack, Done, Close } from '@mui/icons-material';

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300
    }
})

const grupo = [
    { label: 'Negros' },
    { label: 'LGBTQ+' },
    { label: 'PCDs' },
]

const presencial = [
    { label: 'Presencial' },
    { label: 'Remoto' },
    { label: 'Híbrido' },
]

const AnunciarVaga = () => {
    const { user } = useContext(AuthContext);
    const [opcJobs, setOpcJobs] = useState(null);
    const [openOpcJobs, setOpenOpcJobs] = useState(null);
    const [opcCities, setOpcCities] = useState(null);
    const [openOpcCities, setOpenOpcCities] = useState(null);
    const [form, setForm] = useState({
        cargo: null,
        cargoLabel: null,
        horas: null,
        grupo: 'Negros',
        presencial: 'Presencial',
        local: null,
        localLabel: null,
        descricao: null,
        pergunta: null,
    })
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const loadingAutocompleteJobs = openOpcJobs && opcJobs.length === 0;
    const loadingAutocompleteCities = openOpcCities && opcCities.length === 0;

    useEffect(() => {
        let active = true;

        if (!loadingAutocompleteJobs) {
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
    }, [loadingAutocompleteJobs]);

    useEffect(() => {
        if (!openOpcJobs) {
            setOpcJobs([]);
        }
      }, [openOpcJobs]);

      useEffect(() => {
        let active = true;

        if (!loadingAutocompleteCities) {
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
                setOpcCities(response.data);
        }

        fetchData();  
        return () => {
            active = false
        }            
    }, [loadingAutocompleteCities]);

    useEffect(() => {
        if (!openOpcCities) {
            setOpcCities([]);
        }
      }, [openOpcCities]);


    const handleSubmit = async () => {
        setLoading(true);
        setStep(step+1);

        const response = await Request(
            'POST',
            '/jobs/register',
            null,
            {...form, responsavel: user.id, codempresa: user.empresa},
            null,
            null,
        )

        if(!response.success)
            setError(true)
        
        setLoading(false)
    }

    return (
        <div>
            <Header />
            {step !== 3 ? 
                <div style={{ marginTop: '10vh', display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h6'>
                        <b>Encontre rapidamente a pessoa adequada</b>
                    </Typography>
                </div>
            : ''}
            <Zoom in={step === 0} style={{ transitionDelay: '300ms' }} mountOnEnter unmountOnExit>
                <Box sx={{
                    display: 'flex',
                    marginTop: 1,
                    justifyContent: 'center',
                    '& > :not(style)': {
                        width: '70vh',
                    }
                }}>
                    <Grid 
                        container 
                        component={Paper} 
                        elevation={3} 
                        sx={{ 
                            borderRadius: 5, 
                            padding: '40px 50px 30px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Autocomplete 
                            id="combo-box"
                            sx={{ margin: 'auto' }}
                            options={opcJobs ?? null}
                            open={openOpcJobs}
                            fullWidth
                            onOpen={() => {
                                setOpenOpcJobs(true);
                            }}
                            onClose={() => {
                                setOpenOpcJobs(false);
                            }}
                            value={form.cargoLabel ?? null}
                            onChange={(_event, newValue) => {
                                setForm({...form, cargo: newValue.value, cargoLabel: newValue.label});
                            }}
                            loading={loadingAutocompleteJobs}
                            renderInput={(params) => (
                                <TextFieldStyled
                                    {...params}
                                    label="Cargo"
                                    placeholder="Digite para pesquisar"
                                    required
                                    color="secondary"
                                    size="small"
                                />
                            )}
                        />
                        <TextFieldStyled
                            label="Horas de trabalho"
                            type="number"
                            required
                            fullWidth
                            value={form.horas ?? null}
                            color="secondary"
                            size="small"
                            sx={{ marginTop: 3 }}
                            onChange={(event) => setForm({...form, horas: parseInt(event.target.value)})}
                        />
                        <TextFieldStyled
                            label="Grupo de preferência"
                            type="number"
                            required
                            fullWidth
                            color="secondary"
                            size="small"
                            sx={{ marginTop: 3 }}
                            select
                            value={form.grupo}
                            onChange={(event) => setForm({...form, grupo: event.target.value})}
                        >
                            {grupo.map((option) => (
                                <MenuItem key={option.label} value={option.label}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextFieldStyled>
                        <TextFieldStyled
                            label="Local de trabalho"
                            type="number"
                            required
                            fullWidth
                            color="secondary"
                            size="small"
                            sx={{ marginTop: 3 }}
                            select
                            value={form.presencial}
                            onChange={(event) => setForm({...form, presencial: event.target.value})}
                        >
                            {presencial.map((option) => (
                                <MenuItem key={option.label} value={option.label}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextFieldStyled>
                        {form.presencial !== 'Remoto' ?(
                            <Autocomplete 
                                id="combo-box"
                                sx={{ margin: 'auto', marginTop: 3 }}
                                options={opcCities ?? null}
                                open={openOpcCities}
                                fullWidth
                                onOpen={() => {
                                    setOpenOpcCities(true);
                                }}
                                onClose={() => {
                                    setOpenOpcCities(false);
                                }}
                                value={form.localLabel ?? null}
                                onChange={(_event, newValue) => {
                                    setForm({...form, local: newValue.value, localLabel: newValue.label});
                                }}
                                loading={loadingAutocompleteCities}
                                renderInput={(params) => (
                                    <TextFieldStyled
                                        {...params}
                                        label="Localização do funcionário"
                                        placeholder="Digite para pesquisar"
                                        required
                                        color="secondary"
                                        size="small"
                                    />
                                )}
                            />
                        ) : (
                            ''
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            sx={{ borderRadius: 300, marginTop: 3 }}
                            onClick={() => {
                                if(form.cargo && form.horas)
                                    setStep(step+1)
                            }}
                        >
                            <b>Comece gratuitamente</b>
                        </Button>
                    </Grid>
                </Box>
            </Zoom>
            <Zoom in={step === 1} style={{ transitionDelay: '300ms' }} mountOnEnter unmountOnExit>
                <Box sx={{
                    display: 'flex',
                    marginTop: 1,
                    justifyContent: 'center',
                    '& > :not(style)': {
                        width: '70vh',
                    }
                }}>
                    <Grid 
                        container 
                        component={Paper} 
                        elevation={3} 
                        sx={{ 
                            borderRadius: 5, 
                            padding: '5px 50px 30px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        >
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <IconButton onClick={() => setStep(step-1)}>
                                <Tooltip label="Voltar">
                                    <ArrowBack />
                                </Tooltip>
                            </IconButton>
                            <Typography variant="body2">
                                {step} de 2: Detalhes da vaga
                            </Typography>
                        </div>
                        <Typography sx={{ marginTop: 2 }} >
                            Adicionar uma descrição pra vaga
                        </Typography>
                        <TextField
                            label="Descrição"
                            type="text"
                            multiline
                            required
                            fullWidth
                            value={form.descricao ?? null}
                            rows={4}
                            color="secondary"
                            size="small"
                            sx={{ marginTop: 2 }}
                            onChange={(event) => setForm({...form, descricao: event.target.value})}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            sx={{ borderRadius: 300, marginTop: 3 }}
                            onClick={() => {
                                if(form.descricao)
                                    setStep(step+1)
                            }}
                        >
                            <b>Continuar</b>
                        </Button>
                    </Grid>
                </Box>
            </Zoom>
            <Zoom in={step === 2} style={{ transitionDelay: '300ms' }} mountOnEnter unmountOnExit>
                <Box sx={{
                    display: 'flex',
                    marginTop: 1,
                    justifyContent: 'center',
                    '& > :not(style)': {
                        width: '70vh',
                    }
                }}>
                    <Grid 
                        container 
                        component={Paper} 
                        elevation={3} 
                        sx={{ 
                            borderRadius: 5, 
                            padding: '5px 50px 30px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        >
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <IconButton onClick={() => setStep(step-1)}>
                                <Tooltip label="Voltar">
                                    <ArrowBack />
                                </Tooltip>
                            </IconButton>
                            <Typography variant="body2">
                                {step} de 2: Opções de candidatura
                            </Typography>
                        </div>
                        <Typography sx={{ marginTop: 2 }}>
                            Você receberá suas candidaturas por E-mail
                        </Typography>
                        <TextFieldStyled
                            label="Email"
                            fullWidth
                            disabled
                            value={user.email}
                            color="secondary"
                            size="small"
                            sx={{ marginTop: 1 }}
                        />
                        <Typography sx={{ marginTop: 2 }}>
                            Incluir pergunta de triagem
                        </Typography>
                        <TextFieldStyled
                            label="Pergunta personalizada"
                            fullWidth
                            color="secondary"
                            size="small"
                            value={form.pergunta ?? null}
                            sx={{ marginTop: 1 }}
                            onChange={(event) => setForm({...form, pergunta: event.target.value})}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            sx={{ borderRadius: 300, marginTop: 3 }}
                            onClick={handleSubmit}
                        >
                            <b>Anunciar vaga</b>
                        </Button>
                    </Grid>
                </Box>
            </Zoom>
            <Zoom in={step === 3} style={{ transitionDelay: '300ms' }} mountOnEnter unmountOnExit>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh' }}>
                    {loading ? <CircularProgress size={100} color="secondary"/> : 
                        error ? (
                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <Typography variant='h4'>
                                    <b>Ocorreu um erro inesperado, tente novamente mais tarde!</b>
                                </Typography>
                                <Close color="secondary" sx={{fontSize: 150}}/>
                            </div>    
                        ) : (
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Typography variant='h4'>
                                <b>Vaga anunciada com sucesso!</b>
                            </Typography>
                            <Done color="secondary" sx={{fontSize: 150}}/>
                        </div>
                    )}
                </div>
            </Zoom>
            <Box mt={5}>
                <Footer />
            </Box>
        </div>
    )
}

export default AnunciarVaga;