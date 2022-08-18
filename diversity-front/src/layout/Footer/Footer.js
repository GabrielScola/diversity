import React from 'react';
import { Typography } from '@mui/material';

const Footer = () => {
    return (
        <Typography
            variant={'body2'}
            color={'textSecondary'}
            align={'center'}
            className={'footer'}
            gutterBottom={true}
        >
            {'Copyright © Diversity '}
            {' - '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
};

export default React.memo(Footer);
