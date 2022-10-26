import { BusinessCenter, Chat } from '@mui/icons-material';
import { Divider, List, ListItem, ListItemAvatar, ListItemText, Popover, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Request from '../../helper/Request';
import React from 'react';

const Notification = (props) => {
    const { id, open, anchorEl, handleClose, setOpenChat, notifications } = props;
    const navigate = useNavigate();

    const handleClick = async (event, data) => {
        event.preventDefault();

        await Request(
            'PUT',
            `/notification`,
            null,
            {codusuario: data.codusuario, codnotificacao: data.codnotificacao},
            null,
            null,
        );

        if (data.tipo_notificacao === 1) {
            setOpenChat(true);
            handleClose();            
        } else if(data.tipo_notificacao === 2) {
            navigate('/vagas');
            handleClose();            
        }
    }

    return (
        <>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {!notifications ? (
                    <Typography sx={{ p: 2 }}>Você não tem novas notificações.</Typography>
                ) : (
                    <div>
                        <List sx={{ width: '100%' }}>
                            {notifications.map((data, index) => (
                                <div>
                                {index !== 0 && (<Divider />)}
                                <ListItem
                                    key={`key${data.codnotificacao}`}
                                    button
                                    onClick={(e) => handleClick(e, data)}
                                >
                                    {data.tipo_notificacao === 1 && (
                                        <ListItemAvatar>
                                            <Chat color="secondary" />
                                        </ListItemAvatar>
                                    )}
                                    {data.tipo_notificacao === 2 && (
                                        <ListItemAvatar>                                        
                                            <BusinessCenter color="secondary" />
                                        </ListItemAvatar>
                                    )}
                                    <ListItemText
                                        primary={data.descricao}
                                    />
                                </ListItem>
                                </div>
                            ))}                        
                        </List>
                    </div>
                )}
            </Popover>
        </>
    )
}

export default Notification;