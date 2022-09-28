const nodemailer = require('nodemailer');

async function envioEmail(
    TITULO,
    DESTINATARIO,
    MENSAGEM
) {
    const remetente = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
      });

    const email = {
        from: process.env.NODEMAILER_USER,
        to: DESTINATARIO.toLowerCase().trim(),
        subject: `[DIVERSITY] ${TITULO}`,
        html: MENSAGEM
    }

    remetente.sendMail(email, 
        function (error) {
            if(error) {
                return {
                    success: false,
                    message: '',
                    data: error,
                };
            }
        }
    );

    return {
        success: true,
        message: 'Email enviado com sucesso!',
        data: null
    };
}

module.exports = { envioEmail };