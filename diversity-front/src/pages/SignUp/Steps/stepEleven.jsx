import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Autocomplete,
    Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Request from '../../../helper/Request'
import Toast from '../../../helper/Toast'

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const StepEleven = (props) => {
    const { register, errors, handleClick } = props;
    const [ optionsJobs, setOptionsJobs ] = useState();
    const [ optionsCity, setOptionsCity ] = useState();
    const [ open, setOpen ] = useState();

    useEffect(() => {
        const fetchData = async () => {
            if(!optionsJobs) {
                const response = await Request(
                    'POST',
                    '/autocomplete/jobs',
                    null,
                    null,
                    null, 
                    null
                )

                if (response.success && response.data.length > 0)
                    setOptionsJobs(response.data);
                else
                    Toast.error(response.message);
            }

            if(!optionsCity) {
                const response = await Request(
                    'POST',
                    '/autocomplete/city',
                    null,
                    null,
                    null, 
                    null
                )

                if (response.success && response.data.length > 0)
                    setOptionsCity(response.data);
                else
                    Toast.error(response.message);
            } 
        }

        fetchData();        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            
        }

        fetchData();        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box sx={{ textAlign: 'center', marginTop: '10vh' }}>
             <Typography component='h3' variant='h4'>
                {'Crie um alerta de vaga para nunca'}< br/>
                {'perder a oportunidade ideal'}
            </Typography>
            <div>
                <Autocomplete 
                    id="combo-box"
                    options={optionsJobs}
                    sx={{ width: 450, margin: 'auto', marginTop: 3 }}
                    open={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    isOptionEqualToValue={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextFieldStyled 
                            {...params}
                            label='Cargo'
                            {...register('alerta_cargo', { required: true })}
                            variant='outlined'
                            color='secondary'
                            margin='normal'
                            size='small'
                            error={!!errors.alerta_cargo}
                            helperText={errors.alerta_cargo && <span>Campo obrigatório!</span>}
                        /> 
                    )}
                />
            </div>
            <div>
                <Autocomplete 
                    id="combo-box"
                    options={optionsCity}
                    sx={{ width: 450, margin: 'auto'}}
                    open={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    isOptionEqualToValue={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextFieldStyled 
                            {...params}
                            label='Localidade'
                            {...register('alerta_local', { required: true })}
                            variant='outlined'
                            color='secondary'
                            margin='dense'
                            size='small'
                            error={!!errors.alerta_local}
                            helperText={errors.alerta_local && <span>Campo obrigatório!</span>}
                        /> 
                    )}
                />
            </div>
            <Button
                type="submit"
                variant="contained"
                color="secondary"
                style={{ borderRadius: 300, width: 450, marginTop: 15 }}
                onClick={() => !!errors ? null : handleClick()}
            >
                <b>continuar</b>
            </Button>
            <div style={{ marginTop: 15 }}>
                <Link 
                    href="#"
                    underline="hover"
                    style={{ color: '#000', fontSize: 16 }}
                >
                    Pular por enquanto
                </Link>
            </div>
        </Box>
    )
}

export default StepEleven;