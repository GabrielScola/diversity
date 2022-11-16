import React, { useState } from 'react';
import Header from '../../layout/Header/After'
import Footer from '../../layout/Footer/Footer'
import { Box, Grid, Typography, Zoom, Paper, Button } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';
import image from '../../assets/images/image-premium.png';

const Premium = () => {
    const [step, setStep] = useState(0);
    const [plano, setPlano] = useState(null);

    const handleClickPayment = (event) => {
        event.preventDefault();
        setStep(step+1);
        
        const redirect = () => {
            window.location.href = plano === 'mensal' ? 'https://mpago.la/342eXZ6' : 'https://mpago.la/1KnWrUv';
        }
        
        setTimeout(redirect, 5000);
    }

    return (
        <>
            <Header />
            <Zoom in={step === 0} style={{ transitionDelay: '300ms' }} mountOnEnter unmountOnExit>
                <div style={{ marginTop: '6vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5">
                        <b>Destaque sua página empresarial e saia na frente com uma conta Premium</b>
                    </Typography>
                    <Typography variant="h6">
                        Comece sua demonstração gratuita de 1 mês hoje mesmo
                    </Typography>
                    <Box 
                        sx={{
                            display: 'flex',
                            marginTop: 3,
                            justifyContent: 'center',
                            '& > :not(style)': {
                                width: '70vh',
                            }
                        }}
                    >
                        <Grid
                            container 
                            component={Paper} 
                            elevation={3} 
                            sx={{ 
                                borderRadius: 5, 
                                padding: '20px 50px 30px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Typography variant="h6" color="secondary"><b>Recrutador</b></Typography>
                                <Typography variant="h6" sx={{ marginTop: 2 }}>Encontre e contrate talentos</Typography>
                            </div>
                            <Typography variant="body1" sx={{ alignItems: 'center', display: 'flex', marginTop: 3 }}><FiberManualRecord sx={{ fontSize: 10, marginRight: 1 }}/>Encontre candidatos qualificados com rápidez</Typography>
                            <Typography variant="body1" sx={{ alignItems: 'center', display: 'flex', marginTop: 2 }}><FiberManualRecord sx={{ fontSize: 10, marginRight: 1 }}/>Entre em contato direto com os melhores talentos</Typography>
                            <Typography variant="body1" sx={{ alignItems: 'center', display: 'flex', marginTop: 2 }}><FiberManualRecord sx={{ fontSize: 10, marginRight: 1 }}/>Anunciar vaga de forma gratuita</Typography>
                            <Typography variant="body1" sx={{ alignItems: 'center', display: 'flex', marginTop: 2 }}><FiberManualRecord sx={{ fontSize: 10, marginRight: 1 }}/>Obtenha uma lista de todos os candidatos da sua vaga com facilidade</Typography>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Button 
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ width: 250, borderRadius: 300, marginTop: 5 }}
                                    onClick={() => setStep(step+1)}
                                >
                                    <b>saiba mais</b>
                                </Button>
                            </div>
                        </Grid>
                    </Box>
                </div>
            </Zoom>
            <Zoom in={step === 1} style={{ transitionDelay: '300ms' }} mountOnEnter unmountOnExit>
                <div style={{ marginTop: '6vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5" color="secondary">
                        <b>Recursos do Recrutador</b>
                    </Typography>
                    <img 
                        alt=""
                        src={image}
                        width='450'
                    />
                    <Button 
                        variant="contained"
                        color="secondary"
                        sx={{ borderRadius: 300, width: 500 }}
                        onClick={() => setStep(step+1)}
                    >
                        <b>Começar meu mês gratuito</b>
                    </Button>
                    <Typography variant="body1" sx={{ marginTop: 5 }}>
                        {'Após a demonstração gratuita de um mês, '}
                        {'preços a partir de R$500,00* por mês quando cobrado anualmente.'}
                    </Typography>
                    <Typography variant="body2">
                        {'Cancele quando quiser. Enviaremos um lembrete 7 dias antes do término '}
                        {'da sua demonstração'}
                    </Typography>
                </div>
            </Zoom>
            <Zoom in={step === 2} style={{ transitionDelay: '300ms' }} mountOnEnter unmountOnExit>
                <div>
                    <div style={{ marginTop: '6vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h5" color="secondary">
                            <b>Comece sua demonstração de 1 mês gratuito agora</b>
                        </Typography>
                    </div>
                    <Box 
                        sx={{
                            display: 'flex',
                            marginTop: 3,
                            flexDirection: 'column',
                            alignItems: 'center',
                            '& > :not(style)': {
                                width: '80vh',
                            }
                        }}
                    >
                        <Typography variant="h6">
                            Confirme seu plano
                        </Typography>
                        <Typography variant="body1">
                            Selecione anual para obter 15% de desconto e a despesa apresentada em um único recibo.
                        </Typography>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <Button
                                color="secondary"
                                variant={plano && plano === 'mensal' ? "contained" : "outlined"}
                                sx={{ borderRadius: 5, display: 'flex', flexDirection: 'column' }}
                                onClick={() => setPlano(plano === 'mensal' ? null : 'mensal')}
                            >
                                <b>Mensal</b><br />
                                Demonstração gratuita de 1 mês<br />
                                Após demonstração, R$650,00 por mês
                            </Button>
                            <Button
                                color="secondary"
                                variant={plano && plano === 'anual' ? "contained" : "outlined"}
                                sx={{ borderRadius: 5, display: 'flex', flexDirection: 'column' }}
                                onClick={() => setPlano(plano === 'anual' ? null : 'anual')}
                            >
                                <b>Anual</b>
                                Demonstração gratuita de 1 mês<br />
                                Após demonstração, R$6.247,00 por ano<br />
                                {'(economize R$1.102,50)'}
                            </Button>
                        </div>
                        {plano && (
                            <>
                                <Grid
                                    container
                                    component={Paper}
                                    elevation={3}
                                    sx={{
                                        borderRadius: 5,
                                        padding: '20px 50px 20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        marginTop: 2
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Typography variant="body1">
                                            {'Total após a demonstração gratuita '}
                                            {plano === 'anual' ? '(R$520,62 x 12 meses)' : ''}
                                        </Typography>
                                        <Typography variant="body1">
                                            {plano === 'mensal' ? <b>R$650,00/Mês</b> : <b>R$6.247,00/Ano</b>}
                                        </Typography>
                                    </div>
                                    {plano === 'anual' && (
                                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                                            <Typography variant="body2" color="secondary">
                                                *Desconto de R$1.102,50 com pré-pagamento anual
                                            </Typography>
                                        </div>
                                    )}
                                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                                        {'O seu período de demonstração gratuita começa em dia de mês de ano e termina '}
                                        {'em dia de mês de ano. Cancele quando quiser antes de dia de mês de ano para evitar '}
                                        {'cobrança. Nós enviaremos um lembrete por e-mail 7 dias antes do término da sua '}
                                        {'demonstração gratuita. Seu banco poderá aplicar outras taxas de cobrança.'}
                                    </Typography>
                                </Grid>
                                <Button 
                                    color="secondary"
                                    variant="contained"
                                    sx={{ borderRadius: 300, marginTop: 3 }}
                                    onClick={handleClickPayment}
                                >
                                    <b>Continuar para o pagamento</b>
                                </Button>
                            </>
                        )}
                    </Box>
                </div>
            </Zoom>
            <Zoom in={step === 3} style={{ transitionDelay: '300ms' }} mountOnEnter unmountOnExit>
                <div style={{ marginTop: '6vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5" color="secondary">
                        <b>Redirecionando para a página de pagamento...</b>
                    </Typography>
                    <Typography variant="h6">
                        Assim que a compra for confirmada, seu Premium será ativado!
                    </Typography>
                    <Typography variant="body1">
                        Essa ação pode levar alguns instantes.
                    </Typography>
                </div>
            </Zoom>
            <Box mt={5}>
                <Footer />
            </Box>
        </>
    )
}

export default Premium;