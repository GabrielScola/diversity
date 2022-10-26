import React, { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import moment from 'moment';
import './style.scss';

const Message = (props) => {
    const { messages } = props;
    const { user } = useContext(AuthContext);
    
    return (
        <div
            className={`messages ${
                !messages.nome_usuario ? 'diversity' : messages.nome_usuario === user.nome ? 'sent' : 'received'
            }`}
        >
            <div className={'message'}>
                <div className={'infos'}>
                    <span className={'user'}>{messages.nome_usuario}</span>                    
                    {messages.datamensagem ? ' - ' : ''}
                    {messages.datamensagem && (
                        <span className={'date'}>{moment(messages.datamensagem.replace('T', ' ')).format('DD/MM/YYYY HH:mm')}</span>
                    )}
                </div>
                <span className={'text'}>{messages.mensagem}</span>
            </div>
        </div>
    );
};

export default Message;
