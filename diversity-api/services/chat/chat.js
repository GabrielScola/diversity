const db = require('../../config/db');

const findList = async (
    USERID
) => {

    const query = `SELECT m.codchat
                     FROM mensagens m
                    WHERE (m.codchat like '${USERID}^%'
                       OR m.codchat like '%^${USERID}')
                    GROUP BY m.codchat`;

    const result = await db(query);

    let userList = [];
    let resultUserInfo = '';
    if(result.success && result.data) {
        result.data.forEach((x) => {
            const split = x.codchat.split('^');

            if(parseInt(split[0]) !== USERID) {
                userList.push(parseInt(split[0]))
            } else {
                userList.push(parseInt(split[1]))
            }
        });

        const queryUserInfo = `SELECT u.id, u.nome, u.imagem_perfil FROM usuarios u WHERE u.id in (${userList.join(',')})`;

        resultUserInfo = await db(queryUserInfo);
    }

    return {
        success: true,
        message: '',
        data: resultUserInfo.data || null,
    }
}

const find = async (
    REMETENTE,
    DESTINATARIO,
) => {
    let codchat = ''
    if(REMETENTE < DESTINATARIO)
        codchat = `${REMETENTE}^${DESTINATARIO}`;
    else
        codchat = `${DESTINATARIO}^${REMETENTE}`;

    const query = `SELECT m.*, u.nome as nome_usuario
                     FROM mensagens m
                LEFT JOIN usuarios u
                       ON u.id = m.usuario_envio
                    WHERE codchat = '${codchat}' 
                    ORDER BY datamensagem ASC`;

    const result = await db(query);

    return {
        success: true,
        message: '',
        data: result.data || null,
    }
}

const insert = async (
    REMETENTE,
    DESTINATARIO,
    MENSAGEM,
) => {
    let codchat = ''
    if(REMETENTE < DESTINATARIO)
        codchat = `${REMETENTE}^${DESTINATARIO}`;
    else
        codchat = `${DESTINATARIO}^${REMETENTE}`;

    const query = `INSERT INTO mensagens (codchat, mensagem, datamensagem, usuario_envio)
                        VALUES ('${codchat}', '${MENSAGEM}', CURRENT_TIMESTAMP(2), ${REMETENTE})`;

    const result = await db(query);

    if(!result.success) {
        return {
            success: false,
            message: '',
            data: null,
        }
    }

    return {
        success: true,
        message: '',
        data: null,
    }
}

module.exports = {
    findList,
    find,
    insert,
}
