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

const StepEight = (props) => {
    const { register, errors, handleClick } = props;
    const [ options, setOptions ] = useState();
    const [ open, setOpen ] = useState();

    useEffect(() => {
        const fetchData = async () => {
            if(!options) {
                const response = await Request(
                    'POST',
                    '/autocomplete/jobs',
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
                {'Crie seu perfil para adicionar as'}< br/>
                {'pessoas e opotunidades certas'}
            </Typography>
            <div>
                <Autocomplete 
                    id="combo-box"
                    options={options}
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
                            label='Cargo mais recente'
                            {...register('cargo', { required: true })}
                            variant='outlined'
                            color='secondary'
                            margin='normal'
                            size='small'
                            error={!!errors.job}
                            helperText={errors.job && <span>Campo obrigatório!</span>}
                        /> 
                    )}
                />
            </div>
            <div>
                <TextFieldStyled 
                    label='Empresa mais recente'
                    {...register('empresa', { required: true })}
                    variant='outlined'
                    color='secondary'
                    margin='dense'
                    size='small'
                    sx={{ width: 450 }}
                    error={!!errors.empresa}
                    helperText={errors.empresa && <span>Campo obrigatório!</span>}
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

export default StepEight;