const db = require('../../config/db');

const insert = async (
    id,
    tipo
) => {
    const resultCheck = await check(id, tipo);

    if (resultCheck.success) {
        const query = `INSERT INTO notificacoes(codusuario, tipo_notificacao, dthr) VALUES(${id}, ${tipo}, CURRENT_TIMESTAMP(2))`;

        db(query);
    }

    return {
        success: true,
        message: '',
        data: null
    }
}

const check = async (
    id,
    tipo
) => {
    const query = `SELECT * FROM notificacoes WHERE codusuario = ${id} AND tipo_notificacao = ${tipo} AND lida = 'N'`;

    const result = await db(query);

    if(!result.success) {
        return {
            success: true,
            message: '',
            data: null,
        }
    }

    return {
        success: false,
        message: '',
        data: null
    }
}

const find = async (
    id
) => {
    const query = `SELECT n.*, tn.descricao
                     FROM notificacoes n
                LEFT JOIN tipo_notificacao tn
                       ON tn.codtipo = n.tipo_notificacao
                    WHERE n.codusuario = ${id}
                      AND n.lida = 'N'
                      ORDER BY n.dthr DESC`;

    const result = await db(query);

    return {
        success: true,
        message: '',
        data: result.data || null
    }
}

const update = async (
    userId,
    codNotificacao,
) => {
    const query = `UPDATE notificacoes
                      SET lida = 'S'
                    WHERE codusuario = ${userId}
                      AND codnotificacao = ${codNotificacao}`;

    const result = await db(query);

    return {
        success: true,
        message: '',
        data: null,
    }
}

module.exports = {
    insert,
    find,
    update
}