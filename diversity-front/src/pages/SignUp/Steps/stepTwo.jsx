import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';


const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const StepTwo = (props) => {
    const { register, handleClick, email } = props;
    const [ validate, setValidate ] = useState(false);

    return (
        <Box sx={{ textAlign: 'center', marginTop: '10vh' }}>
            <Typography component='h3' variant='h4'>
                <b>Confirme seu e-mail!</b>
            </Typography>
            <Typography component='h1' variant='h6' style={{ marginTop: 10 }}>
                Insira o código que foi enviado para o e-mail: {email}
            </Typography>
            <div>
                <TextFieldStyled
                    type='number'
                    {...register('inputCode')}
                    variant='outlined'
                    color='secondary'
                    autoFocus
                    size='small'
                    onInput = {(e) =>{
                        e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,6)
                    }}
                    sx={{ width: 450, marginTop: 3 }}
                    onChange={(e) => e.target.value.length === 6 ? setValidate(true) : setValidate(false)}
                >
                </TextFieldStyled>
            </div>
            <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={!validate}
                style={{ borderRadius: 300, width: 450, marginTop: 20 }}
                onClick={() => handleClick()}
            >
                <b>continuar</b>
            </Button>
            <Typography variant='body1' style={{ marginTop: 50 }}>
                {'Não recebeu o código? '}
                <Link
                    href="#"
                    underline="hover"
                    style={{color: '#8735C7'}}
                >
                    Enviar novamente.
                </Link>
            </Typography>
        </Box>
    )
}

export default StepTwo;