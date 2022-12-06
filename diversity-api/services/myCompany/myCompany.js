const db = require('../../config/db');

const register = async (
    nome,
    site,
    setor,
    tamanho,
    logo,
    slogan
) => {

    const query = `
        INSERT INTO empresas (
            nome,
            site,
            setor,
            tamanho,
            slogan,
            imagem_perfil
        )
        VALUES (
            '${nome}',
            '${site}',
            '${setor}',
            '${tamanho}',
            '${slogan}',
            '${logo}'
        );
    `;

    const result = await db(query);

    if (!result.success) {
        return {
          success: false,
          message: 'Não foi possível cadastrar a empresa. Tente novamente mais tarde.',
          data: null,
        }
    }

    return {
        success: true,
        message: 'Empresa cadastrada com sucesso!',
        data: null,
    }
}

const find = async (empresaid) => {

    const query = `SELECT * FROM empresas WHERE CODEMPRESA = ${empresaid}`;
    
    const result = await db(query, true);

    if(!result.success || result.rowCount < 1) {
        return {
            success: false,
            message: 'Empresa não encontrada',
            data: null,
        }
    }

    return {
        success: true,
        message: 'Empresa encontrada.',
        data: result.data,
    }

}

const findAdmin = async (id) => {

    const queryUsu = `SELECT codempresa FROM usuarios WHERE id = ${id}`;    
    const resultUsu = await db(queryUsu, true);

    const queryEmp = `SELECT * FROM empresas WHERE codempresa = ${resultUsu.data.codempresa}`;
    const resultEmp = await db(queryEmp, true);

    if(!resultEmp.success || resultEmp.rowCount < 1) {
        return {
            success: false,
            message: 'Empresa não encontrada',
            data: null,
        }
    }

    const queryAdmins = `SELECT * FROM usuarios WHERE codempresa = ${resultUsu.data.codempresa}`;
    const resultAdmins = await db(queryAdmins, false);

    return {
        success: true,
        message: 'Empresa encontrada.',
        data: {empresa: resultEmp.data, admins: resultAdmins.data}
    }

}

const updateAvatar = async (id, newPic) => {

    const query = `UPDATE empresas SET imagem_perfil = '${newPic}' WHERE CODEMPRESA = ${id}`;

    const result = await db(query);

    if(!result.success) {
        return {
            success: false,
            message: 'Ocorreu um problema que impossibilitou a alteração da foto do perfil, tente novamente mais tarde.',
            data: null,
        }
    }

    return {
        success: true,
        message: 'Foto de perfil atualizada com sucesso!',
        data: null,
    }
}

const updatePerfil = async (
    id,
    nome, 
    setor,
    site,
    tamanho,
    slogan,
) => {

    const query = `UPDATE empresas 
                      SET nome = '${nome}',
                          setor = '${setor}',
                          site = '${site}',
                          tamanho = ${tamanho},
                          slogan = '${slogan}'
                    WHERE codempresa = ${id}`;

    const result = await db(query);

    if(!result.success) {
        return {
            success: false,
            message: 'Ocorreu um problema que impossibilitou a alteração das informações do perfil, tente novamente mais tarde.',
            data: null,
        }
    }

    return {
        success: true,
        message: 'Pefil atualizado com sucesso!',
        data: null,
    }
}

const removeAdmin = async (id) => {

    const query = `UPDATE usuarios SET codempresa = null WHERE id = ${id}`;
    
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
        message: 'Admin removido com sucesso.',
        data: result.data,
    }

}

const addAdmin = async (
    id,
    codempresa
) => {

    const query = `UPDATE usuarios SET codempresa = ${codempresa} WHERE id = ${id}`;
    
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
        message: 'Admin adicionado com sucesso.',
        data: result.data,
    }

}

const deletePage = async (id) => {

    const query = `DELETE FROM empresas WHERE codempresa = ${id}`;

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
        message: 'Página desativada com sucesso.',
        data: result.data,
    }

}

const publish = async (
    id,
    texto
) => {
    const query = `INSERT INTO publicacoes(codempresa, descricao, dthr)
                        VALUES (${id}, '${texto}', CURRENT_TIMESTAMP(2))`;

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
        data: result.data,
    }

}

const findPosts = async (
    id
) => {
    const query = `SELECT * FROM publicacoes WHERE codempresa = ${id} ORDER BY dthr DESC`;

    const result = await db(query, false);

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
        data: result.data,
    }

}

const deletePost = async (id) => {

    const query = `DELETE FROM publicacoes WHERE codpublicacao = ${id}`;

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

const editPost = async (
    id,
    texto
) => {

    const query = `UPDATE publicacoes SET descricao = '${texto}' WHERE codpublicacao = ${id}`;

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

module.exports = { 
    register,
    find,
    findAdmin,
    updateAvatar,
    updatePerfil,
    removeAdmin,
    addAdmin,
    deletePage,
    publish,
    findPosts,
    deletePost,
    editPost
}