import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
    Box,
    Typography,
    Button,
    Zoom,
    Grid,
    Paper,
    TextField,
    Checkbox,
    FormControlLabel,
    Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ApartmentIcon from '@mui/icons-material/Apartment';
import UploadIcon from '@mui/icons-material/Upload';
import Header from '../../layout/Header/After';
import Footer from '../../layout/Footer/Footer';
import Request from '../../helper/Request';
import Toast from '../../helper/Toast';

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        width: '90vh',
        borderRadius: 300,
    }
})

const MyCompany = () => {
    const [ transition, setTransition ] = useState(false);
    const [ image, setImage ] = useState(false);
    const [ checked, setChecked ] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleClick = async (data) => {
        const response = await Request(
            'POST',
            '/my-company/register',
            null,
            {...data, logo: image},
            null,
            null
        );

        if(response.success) {
            Toast.success(response.message);
        } else {
            Toast.error(response.message);
        }
    }

    return (
        <div>
            <Header />
            <Zoom in={!transition} mountOnEnter unmountOnExit >
                <Box sx={{textAlign: 'center', marginTop: '10vh'}}>
                    <Typography component='h3' variant='h4'>
                        <b>Criar página empresarial</b>
                    </Typography>
                    <div style={{ marginTop: 15 }}>
                        <Typography variant="body" sx={{ marginTop: '15px' }}>
                            Conecte-se com clientes, funcionários e com a comunidade do Diversity. Para começar, selecione um tipo de página.
                        </Typography>
                    </div>
                    <Button
                        variant='contained'
                        color='secondary'
                        style={{ borderRadius: 20, marginTop: 35 }}
                        startIcon={<ApartmentIcon style={{ fontSize: 50 }} />}
                        onClick={() => setTransition(true)}
                    >
                        <b>{'Pequenas, média, grandes'}<br />
                        {'empresas, escolas, faculdades'}<br />
                        {'e universidades'}</b>
                    </Button>
                </Box>      
            </Zoom>
            <Zoom in={transition} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                <form className={'form'} onSubmit={handleSubmit(handleClick)}>
                    <Box sx={{textAlign: 'center', marginTop: '10vh'}}>
                        <Typography component='h3' variant='h5'>
                            <b> Comece com alguns detalhes sobre sua empresa</b>
                        </Typography>
                        <Grid container sx={{marginTop: 2}}>
                            <Grid item xs />
                            <Grid item xs={8} component={Paper} elevation={8}>
                                <TextFieldStyled
                                    label="Nome *" 
                                    type="text"
                                    {...register('nome', {required: true})}
                                    variant="outlined"
                                    color="secondary"
                                    margin="normal"
                                    sx={{ marginTop: 4 }}
                                    autoFocus
                                    size="small"
                                    error={!!errors.nome}
                                    helperText={ errors.nome && <span>Campo obrigatório!</span> }
                                />
                                <TextFieldStyled
                                    label="Site" 
                                    type="text"
                                    {...register('site')}
                                    variant="outlined"
                                    color="secondary"
                                    margin="normal"
                                    size="small"
                                />
                                <TextFieldStyled
                                    label="Setor *" 
                                    type="text"
                                    {...register('setor', {required: true})}
                                    variant="outlined"
                                    color="secondary"
                                    margin="normal"
                                    size="small"
                                    error={!!errors.setor}
                                    helperText={ errors.setor && <span>Campo obrigatório!</span> }
                                />
                                <TextFieldStyled
                                    label="Tamanho da organização *" 
                                    type="number"
                                    {...register('tamanho', {required: true})}
                                    variant="outlined"
                                    color="secondary"
                                    margin="normal"
                                    size="small"
                                    error={!!errors.tamanho}
                                    helperText={ errors.tamanho && <span>Campo obrigatório!</span> }
                                />
                                {image && (
                                    <Avatar 
                                        alt="Avatar"
                                        src={image}
                                        sx={{ width: 200, height: 200, margin: 'auto', marginTop: 3 }}
                                    />
                                )}
                                <Typography component='body' sx={{ textAlign: 'start', marginLeft: 30, marginTop: 1 }}>Logomarca</Typography>
                                <Button 
                                    component="label"
                                    variant='contained'
                                    color='secondary'
                                    style={{ borderRadius: 20, width: '90vh' }}
                                    startIcon={<UploadIcon />}
                                >
                                    <b>Selecione um arquivo</b>
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
                                                    setImage(reader.result);
                                                }
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </Button>
                                <Typography component='body'>Recomendamos 300 x 300 px. Aceitamos JPGs, JPEGs e PNGs</Typography>
                                <TextFieldStyled
                                    label="Slogan" 
                                    type="number"
                                    {...register('slogan', {required: true})}
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ marginTop: 2}}
                                    multiline
                                    maxRows={2}
                                    size="small"
                                />
                                <Typography component='body' sx={{ textAlign: 'start', marginLeft: 30, marginTop: 1 }}>
                                    Use seu slogan para descrever, em poucas palavras, o que sua <br />organização faz. Isso pode ser alterado mais tarde.
                                </Typography>
                                <div style={{paddingLeft: '25vh', textAlign: 'start', marginTop: 15, width: 1050}}>
                                    <FormControlLabel
                                        label="Declaro que sou representante oficial desta organização e que possuo o direito de agir em nome dela ao criar e gerenciar 
                                        esta página. Eu e a organização aceitamos os Termos adicionais das Pages."
                                        control={<Checkbox color="secondary" onChange={() => setChecked(!checked) }/>}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    variant='contained'
                                    color='secondary'
                                    style={{ borderRadius: 300, marginTop: 10, marginBottom: 10, marginLeft: '75vh', paddingLeft: 20, paddingRight: 20 }}
                                    disabled={!checked}
                                >
                                    <b>Criar página</b>
                                </Button>
                            </Grid>
                            <Grid item xs/>
                        </Grid>
                        <Box mt={5}>
                            <Footer />
                        </Box>
                    </Box>
                </form>
            </Zoom>
        </div>
    )
}

export default MyCompany;