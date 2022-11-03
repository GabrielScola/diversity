const db = require('../../config/db');

const find = async (id) => {
    const query = `SELECT p.codpublicacao,
                        p.descricao,
                        p.anexo,
                        p.curtidas,
                        p.comentarios,
                        p.dthr,
                        u.id,
                        u.nome,
                        u.imagem_perfil
                    FROM publicacoes p 
                    left join conexoes c
                    on c.idusuario = ${id}
                    left join usuarios u
                    on u.id = p.codusuario
                    where p.CODEMPRESA is null
                    and p.codusuario in (c.mutual, ${id})
                    ORDER BY p.dthr DESC`;

    const result = await db(query);

    return {
        success: true,
        message: '',
        data: result.data || null
    }
}

const recomendation = async (id) => {
    const query = `select * from usuarios u
                    left join conexoes c 
                    on c.idusuario = ${id}
                    where u.id not in (COALESCE(c.mutual, 0), ${id})
                    order by u.dt_cadastro DESC
                    limit 5`;

    const result = await db(query);

    return {
        success: true,
        message: '',
        data: result.data || null
    }
}

const follow = async (idUsuario, idFollower) => {
    const query = `insert into conexoes(idusuario, mutual)
                   values (${idUsuario}, ${idFollower})`;

    await db(query);

    return {
        success: true,
        message: '',
        data: null
    }
}

const publish = async (
    id,
    publicacao,
    anexo
) => {
    const query = `INSERT INTO publicacoes(codusuario, descricao, anexo, dthr)
                        VALUES (${id}, '${publicacao}', '${anexo ? anexo : ''}', CURRENT_TIMESTAMP(2))`;

    const result = await db(query, true);

    if(!result.success || result.rowCount < 1) {
        return {
            success: false,
            message: 'Ocorreu um erro inesperado, tente novamente mais tarde.',
            data: null,
        }
    }

    return {
        success: true,
        message: 'Publicado com sucesso.',
        data: null,
    }
}

const editPost = async (
    codpublicacao,
    descricao
) => {

    const query = `UPDATE publicacoes SET descricao = '${descricao}' WHERE codpublicacao = ${codpublicacao}`;

    const result = await db(query, true);

    if(!result.success || result.rowCount < 1) {
        return {
            success: false,
            message: 'Ocorreu um erro inesperado, tente novamente mais tarde.',
            data: null,
        }
    }

    return {
        success: true,
        message: 'Publicação editada com sucesso.',
        data: result.data,
    }
}

const deletePost = async (codpublicacao) => {

    const query = `DELETE FROM publicacoes WHERE codpublicacao = ${codpublicacao}`;

    const result = await db(query, true);

    if(!result.success || result.rowCount < 1) {
        return {
            success: false,
            message: 'Ocorreu um erro inesperado, tente novamente mais tarde.',
            data: null,
        }
    }

    return {
        success: true,
        message: 'Publicação removida com sucesso.',
        data: result.data,
    }

}

module.exports = { 
    find,
    recomendation,
    follow,
    publish,
    editPost,
    deletePost
}