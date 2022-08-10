import React from 'react';
import { useForm } from 'react-hook-form';
import Request from '../helper/Request';
import Cookie from '../helper/Cookie';

const Login = () => {
    const { register, handleSubmit } = useForm();

    async function handleSignIn(data) {
        const response = await Request(
            'POST',
            '/login',
            null,
            data,
            null,
            null
        );

        if(response.success && response.data) {
            Cookie.set('token', response.data.token);
        }
        console.log(response);
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