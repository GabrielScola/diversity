const db = require('../../config/db');

const findOne = async (id) => {

    const query = `SELECT * FROM usuarios WHERE ID = ${id}`;
    
    const result = await db(query, true);

    if(!result.success || result.rowCount < 1) {
        return {
            success: false,
            message: 'Usuário não encontrado',
            data: null,
        }
    }

    return {
        success: true,
        message: 'Usuário encontrado.',
        data: result.data,
    }
}

const findExperiencia = async (id) => {

    const query = `select
                        ue.empresa,
                        p.descricao,
                        ue.dt_inicio,
                        ue.dt_fim
                    from usuario_experiencias ue
                    left join profissoes p 
                    on p.codprofissao = ue.codprofissao
                    where ue.codusuario = ${id}
                    order by ue.dt_inicio DESC`;
    
    const result = await db(query);

    return {
        success: true,
        message: '',
        data: result.data ? result.data : null
    }
} 

const findFormacao = async (id) => {

    const query = `select uf.faculdade,
                          uf.formacao,
                          uf.dt_inicio,
                          uf.dt_fim
                    from usuario_formacao uf
                    where uf.codusuario = ${id}
                    order by uf.dt_inicio DESC`;
    
    const result = await db(query);

    return {
        success: true,
        message: '',
        data: result.data ? result.data : null
    }
} 

const findImage = async (id) => {

    const query = `SELECT imagem_perfil FROM usuarios WHERE ID = ${id}`;
    
    const result = await db(query, true);

    if(!result.success || result.rowCount < 1) {
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

const updateAvatar = async (id, newPic) => {

    const query = `UPDATE usuarios SET imagem_perfil = '${newPic}' WHERE id = ${id}`;

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
    sobrenome,
    titulo,
    cidade,
    telefone,
    endereco,
) => {

    const query = `UPDATE usuarios 
                      SET nome = '${nome} ${sobrenome}',
                          titulo = '${titulo}',
                          localizacao = '${cidade}',
                          telefone = '${telefone ? telefone : ''}',
                          endereco = '${endereco ? endereco : ''}'
                    WHERE id = ${id}`;

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

const insertExperiencia = async (
    id,
    empresa,
    codprofissao,
    dt_inicio,
    dt_fim,
) => {

    const query = `INSERT INTO usuario_experiencias(codusuario, empresa, codprofissao, dt_inicio ${dt_fim ? ', dt_fim' : ''})
                   VALUES(${id}, '${empresa}', ${codprofissao}, '${dt_inicio}' ${dt_fim ? `, '${dt_fim}'` : ''})`;

    const result = await db(query);

    if(!result.success) {
        return {
            success: false,
            message: 'Ocorreu um problema inesperado, tente novamente mais tarde.',
            data: null,
        }
    }

    return {
        success: true,
        message: 'Experiência adicionada com sucesso!',
        data: null,
    }
}

const insertFormacao = async (
    id,
    instituicao,
    formacao,
    dt_inicio,
    dt_fim,
) => {

    const query = `INSERT INTO usuario_formacao(codusuario, faculdade, formacao, dt_inicio ${dt_fim ? ', dt_fim' : ''})
                   VALUES(${id}, '${instituicao}', '${formacao}', '${dt_inicio}' ${dt_fim ? `, '${dt_fim}'` : ''})`;

                   console.log(query);

    const result = await db(query);

    if(!result.success) {
        return {
            success: false,
            message: 'Ocorreu um problema inesperado, tente novamente mais tarde.',
            data: null,
        }
    }

    return {
        success: true,
        message: 'Formação acadêmica adicionada com sucesso!',
        data: null,
    }
}

module.exports = { 
    findOne,
    findExperiencia,
    findFormacao,
    findImage,
    updateAvatar,
    updatePerfil,
    insertExperiencia,
    insertFormacao
};
