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

module.exports = { register }