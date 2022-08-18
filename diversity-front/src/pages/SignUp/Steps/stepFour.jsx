import React from 'react';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';

const StepFour = (props) => {
    const { identifica, setIdentifica, handleClick } = props;

    return (
        <Box sx={{ textAlign: 'center', marginTop: '10vh' }}>
             <Typography component='h3' variant='h4'>
                <b>Com qual público abaixo se identifica</b>
            </Typography>
            <div>
                <Button
                    variant="contained"
                    color={identifica.lgbt ? "inherit" : "secondary"}
                    size="large"
                    style={{ borderRadius: 300, width: 450, marginTop: 20, color: identifica.lgbt ? 'rgba(0, 0, 0, 0.26)' : null }}
                    onClick={() => setIdentifica({...identifica, lgbt: !identifica.lgbt})}
                >
                    <b>LGBTQIA+</b>
                </Button>
            </div>
            <div>
                <Button
                    variant="contained"
                    color={identifica.negros ? "inherit" : "secondary"}
                    size="large"
                    style={{ borderRadius: 300, width: 450, marginTop: 10, color: identifica.negros ? 'rgba(0, 0, 0, 0.26)' : null }}
                    onClick={() => setIdentifica({...identifica, negros: !identifica.negros})}
                >
                    <b>Negros</b>
                </Button>
            </div>
            <div>
                <Button
                    variant="contained"
                    color={identifica.pcd ? "inherit" : "secondary"}
                    size="large"
                    style={{ borderRadius: 300, width: 450, marginTop: 10, color: identifica.pcd ? 'rgba(0, 0, 0, 0.26)' : null  }}
                    onClick={() => setIdentifica({...identifica, pcd: !identifica.pcd})}
                >
                    <b>PCD'S</b>
                </Button>
            </div>
            <Button
                type="submit"
                variant="outlined"
                color="secondary"
                disabled={!identifica.pcd && !identifica.negros && !identifica.lgbt}
                style={{ borderRadius: 300, width: 450, marginTop: 30 }}
                onClick={() => handleClick()}
            >
                <b>continuar</b>
            </Button>
        </Box>
    )
}

export default StepFour;