import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Autocomplete
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Request from '../../../helper/Request'
import Toast from '../../../helper/Toast'

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const StepSeven = (props) => {
    const { register, errors, handleClick, userName } = props;
    //const countryData = [{ value: 1, label: 'Brasil' }];
    const [ options, setOptions ] = useState();
    const [ open, setOpen ] = useState();

    useEffect(() => {
        const fetchData = async () => {
            if(!options) {
                const response = await Request(
                    'POST',
                    '/autocomplete/city',
                    null,
                    null,
                    null, 
                    null
                )

                if (response.success && response.data.length > 0)
                    setOptions(response.data);
                else
                    Toast.error(response.message);
            } 
        }

        fetchData();        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box sx={{ textAlign: 'center', marginTop: '10vh' }}>
             <Typography component='h3' variant='h4'>
                <b>Olá, {userName}!</b>
            </Typography>
            <Typography component='h1' variant='h6' style={{ marginTop: 10 }}>
                {'Crie seu perfil para se conectar com profissionais '}< br/>
                {'que têm os mesmos interesses que você.'}
            </Typography>
            {/* <div>
                <Autocomplete 
                    id="combo-box"
                    options={countryData}
                    sx={{ width: 450, marginTop: 5, margin: 'auto' }}
                    renderInput={(params) => (
                        <TextFieldStyled 
                            {...params}
                            label='País / Região'
                            {...register('country', { required: true })}
                            variant='outlined'
                            color='secondary'
                            margin='normal'
                            size='small'
                            error={!!errors.city}
                            helperText={errors.city && <span>Campo obrigatório!</span>}
                        /> 
                    )}
                />
            </div> */}
            <div>
                <Autocomplete 
                    id="combo-box"
                    options={options}
                    sx={{ width: 450, margin: 'auto' }}
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
                            label='Cidade / Estado'
                            {...register('city', { required: true })}
                            variant='outlined'
                            color='secondary'
                            margin='normal'
                            size='small'
                            error={!!errors.city}
                            helperText={errors.city && <span>Campo obrigatório!</span>}
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
        </Box>
    )
}

export default StepSeven;