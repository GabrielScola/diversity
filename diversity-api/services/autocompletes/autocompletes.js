const db = require('../../config/db');

const getCities = async () => {

    const query = `SELECT * FROM municipios`;
    const result = await db(query, false);

    if (!result.success && !result.data) {
        return {
            success: false,
            message: '',
            data: null
        }
    }
    const data = result.data.map((item) => {
        return {
            value: item.codmunicipio,
            label: `${item.nome} / ${item.uf}`
        } 
    })

    return {
        success: true,
        message: '',
        data: data
    }
}

const getJobs = async () => {

    const query = `SELECT * FROM profissoes`;
    const result = await db(query, false);

    if (!result.success && !result.data) {
        return {
            success: false,
            message: '',
            data: null
        }
    }
    const data = result.data.map((item) => {
        return {
            value: item.codprofissao,
            label: item.descricao
        } 
    })

    return {
        success: true,
        message: '',
        data: data
    }
}

const getAddAdmins = async () => {

    const query = `SELECT * FROM usuarios WHERE codempresa is null`;
    const result = await db(query, false);

    if (!result.success && !result.data) {
        return {
            success: false,
            message: '',
            data: null
        }
    }
    const data = result.data.map((item) => {
        return {
            value: item.id,
            label: item.nome
        } 
    })

    return {
        success: true,
        message: '',
        data: data
    }
}

const getMutuals = async (id) => {

    const query = 
        `SELECT u.id,
                u.nome,
                u.imagem_perfil
           FROM conexoes c
      LEFT JOIN usuarios u
             ON u.id = c.mutual
          WHERE c.idusuario = ${id}
        `
    ;

    const result = await db(query, false);

    if (!result.success && !result.data) {
        return {
            success: false,
            message: '',
            data: null
        }
    }
    const data = result.data.map((item) => {
        return {
            value: item.id,
            label: item.nome,
            image: item.imagem_perfil
        } 
    })

    return {
        success: true,
        message: '',
        data: data
    }
}

module.exports = { 
    getCities,
    getJobs, 
    getAddAdmins,
    getMutuals,
}