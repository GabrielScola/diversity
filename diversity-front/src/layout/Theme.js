// Variáveis do Tema
//		https://material-ui.com/pt/customization/default-theme/
//
// Customização de Cor
//		https://material-ui.com/pt/customization/color/
//

const theme = {
    palette: {
        primary: {
            light: '#a253e0',
            main: '#8735C7',
            dark: '#4f1180',
            contrastText: '#fff',
        },
        secondary: {
            light: '#c0cfd3',
            main: '#8735C7',
            dark: '#7b888c',
            contrastText: '#fff',
        },
        error: {
            light: '#f05357',
            main: '#ED282E',
            dark: '#a51c20',
            contrastText: '#fff',
        },
        text: {
            primary: '#646777',
            secondary: '#999',
            disabled: 'rgba(0, 0, 0, 0.38)',
            hint: 'rgba(0, 0, 0, 0.38)',
        },
    },
    typography: {
        fontFamily: 'OpenSans, Roboto, Helvetica, Arial, sans-serif',
    },
    mixins: {
        toolbar: {
            minHeight: 60,
        },
    },
    overrides: {
        MuiIconButton: {
            colorSecondary: {
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
            },
        },
        MuiAvatar: {
            colorDefault: {
                backgroundColor: '#b1c3c8',
            },
        },
        MuiFormControlLabel: {
            label: {
                fontSize: '0.875rem',
            },
        },
        MuiInputLabel: {
            shrink: {
                width: '125%',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflowX: 'hidden',
                lineHeight: '1.5rem',
                marginTop: '-3px',
            },
        },
    },
    shadows: [
        'none',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        '0 2px 15px 0 rgba(0, 0, 0, 0.15)',
    ],
};

export default theme;
