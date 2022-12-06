const db = require('../../config/db');

const findFollowing = async (id) => {
    const query = `SELECT c.mutual,
                          u.nome,
                          u.imagem_perfil
                    FROM conexoes c 
                    LEFT JOIN usuarios u
                    on u.id = c.mutual
                    WHERE c.idusuario = ${id}`;

    const result = await db(query, false);

    return {
        success: true,
        message: '',
        data: result.data || null
    }
}

const findFollowers = async (id) => {
    const query = `SELECT c.idusuario,
                          u.nome,
                          u.imagem_perfil
                    FROM conexoes c 
                    LEFT JOIN usuarios u
                    ON u.id = c.idusuario
                    WHERE c.mutual = ${id}`;

    const result = await db(query, false);

    return {
        success: true,
        message: '',
        data: result.data || null
    }
}

module.exports = {
    findFollowing,
    findFollowers,
}