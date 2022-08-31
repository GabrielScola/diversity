import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const TextFieldStyled = styled(TextField)({
    '.MuiInputBase-root': {
        borderRadius: 300,
    }
})

const StepNine = (props) => {
    const { register, errors, handleClick } = props;
    const [ valueDia, setValueDia ] = useState('');
    const [ valueMes, setValueMes ] = useState('');

    const dias = [
        { value: '', label: '' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
        { value: 6, label: '6' },
        { value: 7, label: '7' },
        { value: 8, label: '8' },
        { value: 9, label: '9' },
        { value: 10, label: '10' },
        { value: 11, label: '11' },
        { value: 12, label: '12' },
        { value: 13, label: '13' },
        { value: 14, label: '14' },
        { value: 15, label: '15' },
        { value: 16, label: '16' },
        { value: 17, label: '17' },
        { value: 18, label: '18' },
        { value: 19, label: '19' },
        { value: 20, label: '20' },
        { value: 21, label: '21' },
        { value: 22, label: '22' },
        { value: 23, label: '23' },
        { value: 24, label: '24' },
        { value: 25, label: '25' },
        { value: 26, label: '26' },
        { value: 27, label: '27' },
        { value: 28, label: '28' },
        { value: 29, label: '29' },
        { value: 30, label: '30' },
        { value: 31, label: '31' }
    ];

    const meses = [
        { value: '', label: '' },
        { value: '01', label: 'Janeiro' },
        { value: '02', label: 'Fevereiro' },
        { value: '03', label: 'Março' },
        { value: '04', label: 'Abril' },
        { value: '05', label: 'Maio' },
        { value: '06', label: 'Junho' },
        { value: '07', label: 'Julho' },
        { value: '08', label: 'Agosto' },
        { value: '09', label: 'Setembro' },
        { value: '10', label: 'Outubro' },
        { value: '11', label: 'Novembro' },
        { value: '12', label: 'Dezembro' },
    ]

    return (
        <Box sx={{ textAlign: 'center', marginTop: '10vh' }}>
             <Typography component='h3' variant='h4'>
                {'Quando é seu aniversário?'}
            </Typography>
            <Typography component='h1' variant='h6' style={{ marginTop: 10 }}>
                {'Permita que colegas e amigos lhe deseje feliz aniversário!'}
            </Typography>
            <div style={{marginTop: 10}}>
                <TextFieldStyled 
                    label='Dia'
                    select
                    {...register('dia', { required: true })}
                    variant='outlined'
                    color='secondary'
                    value={valueDia}
                    margin='normal'
                    size='small'
                    sx={{ width: 150, textAlign: 'left' }}
                    onChange={(e) => setValueDia(e.target.value)}
                    error={!!errors.dia}
                    helperText={errors.dia && <span>Campo obrigatório!</span>}
                > 
                    {dias.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextFieldStyled>
                <TextFieldStyled 
                    label='Mês'
                    select
                    {...register('mes', { required: true })}
                    variant='outlined'
                    value={valueMes}
                    color='secondary'
                    margin='normal'
                    size='small'
                    sx={{ width: 150, marginLeft: 3, textAlign: 'left' }}
                    onChange={(e) => setValueMes(e.target.value)}
                    error={!!errors.mes}
                    helperText={errors.mes && <span>Campo obrigatório!</span>}
                > 
                    {meses.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
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

export default StepNine;