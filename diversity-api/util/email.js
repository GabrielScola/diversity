const nodemailer = require('nodemailer');

async function envioEmail(
    TITULO,
    DESTINATARIO,
    MENSAGEM
) {
    const emailRemetente = await nodemailer.createTestAccount();

    const remetente = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: 'gabriel@fullsoft.com.br',
          pass: 'Juventude123',
        },
      });

    const email = {
        from: 'gabriel@fullsoft.com.br',
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