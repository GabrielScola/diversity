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
                          telefone = '${telefone}',
                          endereco = '${endereco}'
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

module.exports = { 
    findOne,
    findImage,
    updateAvatar,
    updatePerfil
};
