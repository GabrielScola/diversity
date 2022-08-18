import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const StepThree = (props) => {
    const { register, errors, handleClick } = props;

    return (
        <Box sx={{ textAlign: 'center', marginTop: '10vh' }}>
             <Typography component='h3' variant='h4'>
                <b>Aproveite sua carreira profissional ao máximo</b>
            </Typography>
            <div>
                <TextFieldStyled 
                    label='Nome'
                    type='text'
                    {...register('nome', { required: true })}
                    variant='outlined'
                    color='secondary'
                    autoFocus
                    size='small'
                    sx={{ width: 450, marginTop: 5 }}
                    error={!!errors.nome}
                    helperText={errors.nome && <span>Campo obrigatório!</span>}
                >
                </TextFieldStyled>
            </div>
            <div>
                <TextFieldStyled 
                    label='Sobrenome'
                    type='text'
                    {...register('sobrenome', { required: true })}
                    variant='outlined'
                    color='secondary'
                    margin='normal'
                    size='small'
                    sx={{ width: 450 }}
                    error={!!errors.sobrenome}
                    helperText={errors.sobrenome && <span>Campo obrigatório!</span>}
                >
                </TextFieldStyled>
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

export default StepThree;