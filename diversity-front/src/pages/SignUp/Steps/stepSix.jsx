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

const StepSix = (props) => {
    const { register, handleClick, setValidationCode, countryCode, phoneNumber } = props;
    const [ validate, setValidate ] = useState(false);

    const handleResendSMS = async () => {
        const response = await Request(
            'POST',
            '/signup/check-phone',
            null,
            {countryCode: countryCode, phoneNumber: phoneNumber},
            null,
            null
        );

        if (!response.success) {
            Toast.error(response.message);
        } else {
            setValidationCode(response.data);
            Toast.success('SMS reenviado!');
        }
    }

    return (
        <Box sx={{ textAlign: 'center', marginTop: '10vh' }}>
            <Typography component='h3' variant='h4'>
                <b>Insira o código que enviamos para seu celular</b>
            </Typography>
            <Typography component='h1' variant='h6' style={{ marginTop: 10 }}>
                {'Para concluir o cadastro, insira o código de verificação fornecido.'}<br />
                {'Pode demorar alguns minutos até que você receba seu código'}
            </Typography>
            <div>
                <TextFieldStyled
                    type='number'
                    {...register('smsCode', { required: true })}
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
                {'Não recebeu o código? '}<br />
                <Link
                    href="#"
                    underline="hover"
                    style={{ color: '#8735C7', fontSize: 16 }}
                    component="button"
                    onClick={() => handleResendSMS()}
                >
                    Reenviar código por SMS.
                </Link>
            </Typography>
        </Box>
    )
}

export default StepSix;