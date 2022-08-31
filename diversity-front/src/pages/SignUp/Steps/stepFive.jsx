import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
} from '@mui/material';
// import InputMask from "react-input-mask";
import { styled } from '@mui/material/styles';

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const StepFive = (props) => {
    const { register, handleClick } = props;

    return (
        <Box sx={{ textAlign: 'center', marginTop: '10vh' }}>
            <Typography component='h3' variant='h4'>
                <b>Verificação rápida de segurança</b>
            </Typography>
            <Typography component='h1' variant='h6' style={{ marginTop: 10 }}>
                {'Como medida de segurança adicional, precisamos fornecer um código '}<br />
                {'de verificação para você se cadastrar.'}
            </Typography>
            <div>
                <TextFieldStyled 
                    type="number"
                    defaultValue="55"
                    {...register('countryCode', { required: true })}
                    variant='outlined'
                    color='secondary'
                    size='small'
                    onInput = {(e) =>{
                        e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)
                    }}
                    sx={{ width: 100, marginTop: 3 }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">+</InputAdornment>,
                      }}
                >
                </TextFieldStyled>
                <TextFieldStyled 
                    type="number"
                    label="Número de telefone"
                    {...register('phoneNumber', { required: true })}
                    variant='outlined'
                    color='secondary'
                    autoFocus
                    size='small'
                    onInput = {(e) =>{
                        e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,11)
                    }}
                    sx={{ width: 350, marginTop: 3, marginLeft: 0.5 }}
                />
            </div>
            <Button
                type="submit"
                variant="contained"
                color="secondary"
                // disabled={!validate}
                style={{ borderRadius: 300, width: 450, marginTop: 20 }}
                onClick={() => handleClick()}
            >
                <b>enviar</b>
            </Button>
        </Box>
    )
}

export default StepFive;