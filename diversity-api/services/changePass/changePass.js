const db = require('../../config/db');
const bcrypt = require('bcrypt');

const update = async (ID, PASSWORD) => {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(PASSWORD, salt);

    const query = `UPDATE USUARIOS SET senha = '${hash}' WHERE id = ${ID}`;

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
