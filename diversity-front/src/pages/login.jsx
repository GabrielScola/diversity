import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
    const { register, handleSubmit } = useForm();
    const { signIn } = useContext(AuthContext)

    async function handleSignIn(data) {
        await signIn(data);
    }

    return (
        <div id="login">
            <h1 className="title">Login</h1>
            <form className="form" onSubmit={handleSubmit(handleSignIn)}>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input {...register('email')} type="email" name="email" id="email" />
                </div>
                <br />
                <div className="field">
                    <label htmlFor="password">Senha</label>
                    <input {...register('password')} type="password" name="password" id="password" />
                </div>
                <br />
                <div className="actions">
                    <button type="submit">Logar</button>
                </div>
            </form>
        </div>
    );
};

export default Login;