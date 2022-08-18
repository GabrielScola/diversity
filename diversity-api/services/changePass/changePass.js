const db = require('../../config/db');

const update = async (ID, PASSWORD) => {

    const query = `UPDATE USUARIOS SET senha = '${PASSWORD}' WHERE id = ${ID}`;

    const result = await db(query, false);

    if(!result.success) {
        return {
            success: false,
            message: 'Não foi possível alterar a sua senha, tente novamente mais tarde.',
            data: null
        }
    }

    return {
        success: true,
        message: 'Senha alterada com sucesso!',
        data: null
    }
}

module.exports = { update };
