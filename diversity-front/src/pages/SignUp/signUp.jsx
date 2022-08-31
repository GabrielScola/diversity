import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
    Box,
    Zoom,
 } from '@mui/material';
import Request from '../../helper/Request';
import Toast from '../../helper/Toast';
import Header from '../../layout/Header/Before';
import Footer from '../../layout/Footer/Footer';
import StepOne from './Steps/stepOne';
import StepTwo from './Steps/stepTwo';
import StepThree from './Steps/stepThree';
import StepFour from './Steps/stepFour';
import StepFive from './Steps/stepFive';
import StepSix from './Steps/stepSix';
import StepSeven from './Steps/stepSeven';
import StepEight from './Steps/stepEight';
import StepNine from './Steps/stepNine';
import StepTen from './Steps/stepTen';
import StepEleven from './Steps/stepEleven';

const SignUp = () => {
    const { register, handleSubmit, formState: {errors} } = useForm();
    const [ step, setStep ] = useState(1);
    const [ form, setForm ] = useState({});
    const [ validationCode, setValidationCode ] = useState();
    const [ image, setImage ] = useState(null);
    const [ identifica, setIdentifica ] = useState({
        lgbt: false,
        negros: false,
        pcd: false,
    })
    const navigate = useNavigate();


    const handleClick = async (data) => {
        console.log(data);
        setForm({...data, ...identifica, image});
        if(data) {
            if(step === 1) {
                const response = await Request(
                    'POST',
                    '/signup/check-email',
                    null,
                    data,
                    null,
                    null
                );

                if (!response.success) {
                    Toast.error(response.message);
                } else {
                    setValidationCode(response.data)
                    setStep(step + 1)
                }
            } else if(step === 2) {
                if(data.emailCode) {
                    if (validationCode !== parseInt(data.emailCode))
                        Toast.error('Código incorreto.')
                    else 
                        setStep(step + 1)
                }
            } else if(step === 5) {
                const response = await Request(
                    'POST',
                    '/signup/check-phone',
                    null,
                    data,
                    null,
                    null
                );

                if (!response.success) {
                    Toast.error(response.message);
                } else {
                    setValidationCode(response.data);
                    setStep(step + 1);
                }
            } else if (step === 6) {
                if(data.smsCode) {
                    if (validationCode !== parseInt(data.smsCode))
                        Toast.error('Código incorreto.');
                    else
                        setStep(step + 1);
                }
            } else if (step === 11) {
                const id = Toast.loading()
                const response = await Request(
                    'POST',
                    '/signup/register',
                    null,
                    form,
                    null,
                    null
                );

                if(!response.success) {
                    Toast.updateError(id, response.message);
                } else {
                    Toast.updateSuccess(id, response.message);
                    navigate('/')
                }
            } else {
                setStep(step + 1)
            }
        }
    }

    return (
        <div>
            <Header signUp={true} />
            <form className={'form'} onSubmit={handleSubmit(handleClick)}>
                <Zoom in={step === 1} mountOnEnter unmountOnExit >
                    <div>
                        <StepOne 
                            register={register}
                            errors={errors}
                            handleClick={handleClick}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 2} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepTwo
                            register={register}
                            handleClick={handleClick}
                            email={form.email}
                            setValidationCode={setValidationCode}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 3} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepThree
                            register={register}
                            errors={errors}
                            handleClick={handleClick}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 4} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepFour
                            identifica={identifica}
                            setIdentifica={setIdentifica}
                            handleClick={handleClick}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 5} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepFive
                            register={register}
                            handleClick={handleClick}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 6} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepSix
                            register={register}
                            handleClick={handleClick}
                            setValidationCode={setValidationCode}
                            countryCode={form.countryCode}
                            phoneNumber={form.phoneNumber}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 7} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepSeven
                            register={register}
                            errors={errors}
                            handleClick={handleClick}
                            userName={form.nome}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 8} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepEight
                            register={register}
                            errors={errors}
                            handleClick={handleClick}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 9} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepNine
                            register={register}
                            errors={errors}
                            handleClick={handleClick}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 10} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepTen
                            nome={form.nome}
                            sobrenome={form.sobrenome}
                            cargo={form.cargo}
                            cidade={form.city}
                            setStep={setStep}
                            image={image}
                            setImage={setImage}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 11} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepEleven
                            register={register}
                            errors={errors}
                            handleClick={handleClick}
                        />
                    </div>
                </Zoom>
            </form>
            <Box mt={5}>
                <Footer />
            </Box>
        </div>
    )
}

export default SignUp;