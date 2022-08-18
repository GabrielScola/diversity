import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
    Box,
    Zoom,
    // Typography,
    // TextField,
    // Button,
    // Link,
 } from '@mui/material';
import Request from '../../helper/Request';
import Toast from '../../helper/Toast';
import Header from '../../layout/Header/Before';
import Footer from '../../layout/Footer/Footer';
import StepOne from './Steps/stepOne';
import StepTwo from './Steps/stepTwo';
import StepThree from './Steps/stepThree';
import StepFour from './Steps/stepFour';

const SignUp = () => {
    const { register, handleSubmit, formState: {errors} } = useForm();
    const [ step, setStep ] = useState(0);
    const [ form, setForm ] = useState({});
    const [ validationCode, setValidationCode ] = useState();
    const [ identifica, setIdentifica ] = useState({
        lgbt: false,
        negros: false,
        pcd: false,
    })

    // React.useEffect(() => {
    //     if(step) {
    //         console.log(step);
    //     }
    // }, [step])

    const handleClick = async (data) => {
        setForm({...data, ...identifica});

        if(step === 0 && data) {
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
            } else if(data.password.length < 6) {
                Toast.error('A senha deve ter no mínimo 6 caracteres!')
            } else {
                setStep(step + 1)
                setValidationCode(response.data)
            }
        } else if(step === 1) {
            if(data.inputCode) {
                if (validationCode !== parseInt(data.inputCode))
                    Toast.error('Código incorreto.')
                else 
                    setStep(step + 1)
            }
        } else {
            setStep(step + 1)
        }
    }

    return (
        <div>
            <Header signUp={true} />
            <form className={'form'} onSubmit={handleSubmit(handleClick)}>
                <Zoom in={step === 0} mountOnEnter unmountOnExit >
                    <div>
                        <StepOne 
                            register={register}
                            errors={errors}
                            handleClick={handleClick}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 1} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepTwo
                            register={register}
                            handleClick={handleClick}
                            email={form.email}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 2} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepThree
                            register={register}
                            errors={errors}
                            handleClick={handleClick}
                        />
                    </div>
                </Zoom>
                <Zoom in={step === 3} style={{ transitionDelay: '200ms' }} mountOnEnter unmountOnExit >
                    <div>
                        <StepFour
                            identifica={identifica}
                            setIdentifica={setIdentifica}
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