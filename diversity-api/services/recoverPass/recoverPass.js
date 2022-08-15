const db = require('../../config/db');
const { envioEmail } = require('../../util/email');

const find = async (email) => {

    //select para checar se o email existe no sistem
    const querySelect = `SELECT 1 FROM USUARIOS WHERE email = '${email.toLowerCase().trim()}'`;
    const resultSelect = await db(querySelect, true);

    if(!resultSelect.success && !resultSelect.data) {
        return {
            success: false,
            message: "E-mail não encontrado, tente novamente",
            data: null,
        }
    }

    //update para a nova senha temporária
    const senhaTemporaria = Math.floor(Math.random() * 100000) * 999;
    const queryUpdate = `UPDATE usuarios SET senha = ${senhaTemporaria} WHERE email = '${email.toLowerCase().trim()}'`
    const resultUpdate = await db(queryUpdate, false);

    if(!resultUpdate.success) {
        return {
            success: false,
            message: "Ocorreu um erro inesperado ao tentar recuperar a sua senha, tente novamente mais tarde.",
            data: null,
        }
    }

    //envio do email com a nova senha
    const responseEmail = await envioEmail(
        'Redefinição da senha.',
        email,
        `Esta é a sua nova senha: ${senhaTemporaria}
ATENÇÃO: Esta é uma senha temporária, altere-a assim que fizer login no sistema.`
    );

    if(!responseEmail.success) {
        return {
            success: false,
            message: 'Ocorreu um erro ao tentar enviar o email, tente novamente mais tarde.',
            data: responseEmail.data,
        }
    }
    
    return {
        success: true,
        message: "E-mail para redefinição de senha enviado com sucesso!",
        data: null,
    }

}

module.exports = { find };