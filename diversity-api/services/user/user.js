const db = require('../../config/db');
const bcrypt = require('bcrypt');

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
    titulo,
    localizacao,
    telefone,
    endereco,
) => {

    const query = `UPDATE usuarios 
                      SET nome = '${nome}',
                          titulo = '${titulo}',
                          localizacao = '${localizacao}',
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

const deleteAccount = async (
    ID,
) => {

    const query = `DELETE FROM usuarios WHERE id = ${ID}`;

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
        message: '',
        data: null,
    }
}

const updatePass = async (
    ID,
    oldPass,
    newPass,
) => {
    const queryCheckPass = `SELECT senha FROM usuarios WHERE id = ${ID}`;
    const resultCheckPass = await db(queryCheckPass, true);

    const verificaSenha = bcrypt.compareSync(oldPass, resultCheckPass.data.senha);

    if(!verificaSenha) {
        return {
            success: false,
            message: 'Senha atual incorreta.',
            data: null,
        }
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPass, salt);
        const query = `UPDATE usuarios SET senha = '${hash}' WHERE id = ${ID}`;
        const result = await db(query);

        if(!result.success)
            return {
                success: false,
                message: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
                data: null,
            }

        return {
            success: true,
            message: 'Senha alterada com sucesso.',
            data: null,
        }
    }    
}

const insertEmail = async (
    ID,
    newEmail,
) => {
    const query = `UPDATE usuarios SET email_secundario = '${newEmail}' WHERE id = ${ID}`;

    const result = await db(query);

    if(!result.success) {
        return {
            success: false,
            message: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
            data: null,
        }
    }

    return {
        success: true,
        message: 'Novo email adicionado com sucesso!',
        data: null,
    }
}

const insertPhone = async (
    ID,
    newPhone,
) => {
    const query = `UPDATE usuarios SET fone_secundario = '${newPhone}' WHERE id = ${ID}`;

    const result = await db(query);

    if(!result.success) {
        return {
            success: false,
            message: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
            data: null,
        }
    }

    return {
        success: true,
        message: 'Novo número de telefone adicionado com sucesso!',
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
    insertFormacao,
    deleteAccount,
    updatePass,
    insertEmail,
    insertPhone,
};
