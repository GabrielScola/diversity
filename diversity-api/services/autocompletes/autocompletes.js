const db = require('../../config/db');

const city = async () => {

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

const jobs = async () => {

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

const addAdmins = async () => {

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

module.exports = { 
    city,
    jobs, 
    addAdmins,
}