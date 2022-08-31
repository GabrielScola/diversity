import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Request from '../../../helper/Request';
import Toast from '../../../helper/Toast';


const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const StepTwo = (props) => {
    const { register, handleClick, email, setValidationCode } = props;
    const [ validate, setValidate ] = useState(false);

    const handleResendEmail = async () => {
        const response = await Request(
            'POST',
            '/signup/check-email',
            null,
            {email: email},
            null,
            null
        );

        if (!response.success) {
            Toast.error(response.message);
        } else {
            setValidationCode(response.data);
            Toast.success('E-mail reenviado!');
        }
    }

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
                    {...register('emailCode', { required: true })}
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
                    style={{ color: '#8735C7', fontSize: 16 }}
                    component="button"
                    onClick={() => handleResendEmail()}
                >
                    Enviar novamente.
                </Link>
            </Typography>
        </Box>
    )
}

export default StepTwo;