import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Link,
    Button,
    InputAdornment,
    IconButton
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const StepOne = (props) => {
    const { register, errors, handleClick } = props;
    const [ ocultar, setOcultar ] = useState(false);

    return (
        <Box sx={{textAlign: 'center', marginTop: '10vh'}}>
            <Typography component='h3' variant='h4'>
                <b>Aproveite sua carreira profissional ao máximo</b>
            </Typography>
            <TextFieldStyled
                label="E-mail"
                type="email"
                {...register('email', { required: true })}
                variant="outlined"
                color="secondary"
                margin="normal"
                autoFocus
                size="small"
                sx={{width: 450, marginTop: 5}}
                error={!!errors.email}
                helperText={ errors.email && <span>Campo obrigatório!</span> }
            >
            </TextFieldStyled>
            <br />
            <TextFieldStyled
                label="Senha (6 ou mais caracteres)"
                type={ ocultar ? "text" : "password"}
                {...register('password', { required: true })}
                variant="outlined"
                color="secondary"
                margin="normal"
                size="small"
                sx={{width: 450, marginTop: 1}}
                error={!!errors.password}
                helperText={ errors.password && <span>Campo obrigatório!</span> }
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                            onClick={() => setOcultar((prev) => !prev)}
                        >
                            {ocultar ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
            >
            </TextFieldStyled>
            <Typography mt={2}>
            {'Ao clicar em Aceite e cadastre-se, você aceita o '}
            <Link
                href="#"
                underline="hover"
                style={{color: '#8735C7'}}
            >
                Contrato do<br /> Usuário
            </Link>
            {', a '}
            <Link
                href="#"
                underline="hover"
                style={{color: '#8735C7'}}
            >
                Política de Privacidade
            </Link>
            {' e a '}
            <Link
                href="#"
                underline="hover"
                style={{color: '#8735C7'}}
            >
                Política de Cookies
            </Link>
            {' do'}<br />
            Diversity
            </Typography>
            <Button
                type="submit"
                variant="contained"
                color="secondary"
                style={{ borderRadius: 300, width: 450, marginTop: 15}}
                onClick={() => !!errors ? null : handleClick()}
            >
                <b>Aceite e Cadastre-se</b>
            </Button>
            <Typography mt={5}>
                {'Já se cadastrou no Diversity? '}
                <Link
                    href="/"
                    underline="hover"
                    style={{color: '#8735C7'}}
                >
                    Entre
                </Link>
            </Typography>
        </Box>
    )
}

export default StepOne;