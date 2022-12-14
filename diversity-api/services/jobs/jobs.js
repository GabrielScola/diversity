const db = require('../../config/db');
const { envioEmail } = require('../../util/email');

const find = async (
    cargo,
    local,
    negro,
    lgbt,
    pcd
) => {
    let filter = '';
    if(negro && lgbt && pcd) {
        filter = ` and (v.disponivel_para = 'Negros' or v.disponivel_para = 'LGBTQ+' or v.disponivel_para = 'PCDs')`;
    } else if (negro && !lgbt && !pcd) {
        filter = ` and v.disponivel_para = 'Negros'`;
    } else if (!negro && lgbt && !pcd) {
        filter = ` and v.disponivel_para = 'LGBTQ+'`;
    } else if (!negro && !lgbt && pcd) {
        filter = ` and v.disponivel_para = 'PCDs'`;
    } else if (negro && lgbt && !pcd) {
        filter = ` and (v.disponivel_para = 'Negros' or v.disponivel_para = 'LGBTQ+')`;
    } else if (negro && !lgbt && pcd) {
        filter = ` and (v.disponivel_para = 'Negros' or v.disponivel_para = 'PCDs')`;
    } else if (!negro && lgbt && pcd) {
        filter = ` and (v.disponivel_para = 'LGBTQ+' or v.disponivel_para = 'PCDs')`;
    }

    const query = 
        `SELECT v.codvaga,
                v.descricao,
                v.tempo_trabalho,
                v.disponivel_para,
                v.presencial,
                v.pergunta,
                v.codempresa,
                e.imagem_perfil,
                e.nome as nome_empresa,
                e.setor,
                m.nome as cidade,
                m.uf,
                u.email,
                p.descricao as cargo
        FROM vagas v
        LEFT JOIN empresas e
            ON e.codempresa = v.codempresa
        LEFT JOIN municipios m
            ON m.codmunicipio = v.codmunicipio
        LEFT JOIN usuarios u
            ON u.id = v.responsavel
        LEFT JOIN profissoes p 
            on p.codprofissao = v.cargo
        WHERE codvaga is not null
        ${cargo ? ` and p.descricao = '${cargo}'` : ''}
        ${local ? ` and m.nome = '${local.trim()}'` : ''}
        ${filter}
        ORDER BY v.dthr DESC`
    ;

    const result = await db(query, false);

    if(!result.success && result.rowCount < 1)
        return {
            success: false,
            message: 'Vagas com esse filtro n??o encontradas.',
            data: null,
        }

    return {
        success: true,
        message: 'Vagas encontradas.',
        data: result.data
    }
}

const apply = async (
    idCandidato,
    codVaga,
    emailResponsavel,
    nomeVaga,
    pergunta,
    resposta
) => {
    const check = await checkBeforeApply(idCandidato, codVaga);

    if(!check.success)
        return {
            success: false,
            message: check.message,
            data: null,
        }

    const query = `INSERT INTO candidatos(codusuario, codvaga) VALUES (${idCandidato}, ${codVaga})`;

    const result = await db(query, true);

    if(!result.success)
        return {
            success: false,
            message: 'N??o foi poss??vel candidatar a esta vaga. Tente novamente mais tarde.',
            data: null
        }

    const html = emailHtml(nomeVaga, idCandidato, pergunta, resposta);
    await envioEmail(
        'Voc?? tem um novo candidato para sua vaga!',
        emailResponsavel,
        html,
    );

    return {
        success: true,
        message: 'Candidatado com sucesso!',
        data: null
    }
}

const checkBeforeApply = async (
    idCandidato,
    codVaga
) => {
    const query = `SELECT id FROM candidatos WHERE codusuario = ${idCandidato} AND codvaga = ${codVaga}`;

    const result = await db(query, false);

    if(result.success && result.rowCount > 0)
        return {
            success: false,
            message: 'Voc?? j?? est?? candidatado para esta vaga.',
            data: null,
        }

    return {
        success: true,
        message: '',
        data: null,
    }
}

const register = async (
    cargo,
    horas,
    presencial,
    grupo,
    local,
    descricao,
    responsavel,
    pergunta,
    codempresa
) => {
    const query = `INSERT INTO vagas(cargo, codmunicipio, descricao, codempresa, tempo_trabalho, disponivel_para, presencial, dthr, responsavel, pergunta)
    VALUES(${cargo}, ${local}, '${descricao}', ${codempresa}, ${horas}, '${grupo}', '${presencial}', CURRENT_TIMESTAMP(2), ${responsavel}, '${pergunta ? pergunta : ''}')`;

    const result = await db(query, false);

    if(!result.success)
        return {
            success: false,
            message: 'N??o foi poss??vel criar a vaga. Tente novamente mais tarde.',
            data: null,
        }

    return {
        success: true,
        message: 'Vaga criada com sucesso!',
        data: null,
    }
}

const findUserJobs = async (
    ID
) => {
    const query = 
        `select v.codvaga,
                v.descricao,
                v.tempo_trabalho,
                v.disponivel_para,
                v.presencial,
                v.pergunta,
                v.codempresa,
                e.imagem_perfil,
                e.nome as nome_empresa,
                e.setor,
                m.nome as cidade,
                m.uf,
                p.descricao as cargo
            from vagas v
            left join candidatos c 
            on c.codvaga = v.codvaga
            left join usuarios u
            on u.id = c.codusuario 
            left join empresas e
            on e.codempresa = v.codempresa 
            left join profissoes p 
            on p.codprofissao = v.cargo
            left join municipios m
            on m.codmunicipio = v.codmunicipio 
            where u.id = ${ID}
        ORDER BY v.dthr DESC`
    ;

    const result = await db(query, false);

    if(!result.success && result.rowCount < 1)
        return {
            success: false,
            message: 'Vagas n??o encontradas.',
            data: null,
        }

    return {
        success: true,
        message: 'Vagas encontradas.',
        data: result.data
    }
}

const findCompanyJobs = async (
    ID
) => {
    const query = 
        `select v.codvaga,
            v.descricao,
            v.tempo_trabalho,
            v.disponivel_para,
            v.presencial,
            v.pergunta,
            v.codempresa,
            e.imagem_perfil,
            e.nome as nome_empresa, 
            e.setor,
            m.nome as cidade,
            m.uf,
            p.descricao as cargo
        from vagas v     
        left join empresas e
        on e.codempresa = v.codempresa 
        left join profissoes p 
        on p.codprofissao = v.cargo
        left join municipios m
        on m.codmunicipio = v.codmunicipio 
        where e.codempresa = ${ID}
        order by v.dthr desc`
    ;

    const result = await db(query, false);

    if(!result.success && result.rowCount < 1)
        return {
            success: false,
            message: 'Voc?? n??o possui vagas para essa empresa.',
            data: null,
        }

    return {
        success: true,
        message: 'Vagas encontradas.',
        data: result.data
    }
}

const findCandidatos = async (
    CODVAGA
) => {
    const query = 
        `select
            u.id,
            u.nome,
            u.imagem_perfil,
            u.lgbt,
            u.negro,
            u.pcd,
            u.profissao,
            u.localizacao 
        from
            candidatos c
        left join usuarios u
        on c.codusuario = u.id
        where
            c.codvaga = ${CODVAGA}`;

    const result = await db(query);

    if(!result.success && result.rowCount < 1)
        return {
            success: false,
            message: 'Nenhum candidato para esta vaga.',
            data: null,
        }

    return {
        success: true,
        message: 'Candidatos encontrados.',
        data: result.data
    }
}

const removeJob = async (ID) => {

    const query = `DELETE FROM vagas WHERE codvaga = ${ID}`;

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
        message: 'Vaga removida com sucesso.',
        data: result.data,
    }

}

const updateAlert = async (
    ID,
    PROFISSAO,
    LOCAL,
) => {
    const query = `UPDATE usuarios SET alerta_cargo = '${PROFISSAO}', alerta_local = '${LOCAL}' WHERE id = ${ID}`;
    const result = await db(query);

    if(!result.success || result.rowCount < 1) {
        return {
            success: false,
            message: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
            data: null,
        }
    }

    return {
        success: true,
        message: 'Alerta de vaga salvo com sucesso.',
        data: result.data,
    }
}

const notify = async (
    CARGO,
    LOCAL
) => {
    const Ids = await getIds(CARGO, LOCAL);
    
    for (const id of Ids) {
        const query =
            `INSERT INTO notificacoes(codusuario, tipo_notificacao, dthr)
            VALUES(${id.id}, 2, CURRENT_TIMESTAMP(2))`;

        db(query);
    };

    return {
        success: true,
        message: '',
        data: null,
    }
}

const getIds = async (
    CARGO,
    LOCAL,
) => {
    const query = `SELECT u.id FROM usuarios u WHERE (u.alerta_cargo is not null or u.alerta_local is not null) and (u.alerta_cargo is null or u.alerta_cargo = '${CARGO}') ${LOCAL ? ` and (u.alerta_local is null or u.alerta_local = '${LOCAL}')` : ''}`;
    const result = await db(query, false);

    return result.data;
}

module.exports = {
    find,
    apply,
    register,
    findUserJobs,
    findCompanyJobs,
    findCandidatos,
    removeJob,
    updateAlert,
    notify
}

const emailHtml = (
    nomeVaga,
    idCandidato,
    pergunta,
    resposta
) => {
    const html = `
        <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
        <!--[if gte mso 9]>
        <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
        <title></title>
        
            <style type="text/css">
            @media only screen and (min-width: 520px) {
        .u-row {
            width: 500px !important;
        }
        .u-row .u-col {
            vertical-align: top;
        }

        .u-row .u-col-100 {
            width: 500px !important;
        }

        }

        @media (max-width: 520px) {
        .u-row-container {
            max-width: 100% !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
        }
        .u-row .u-col {
            min-width: 320px !important;
            max-width: 100% !important;
            display: block !important;
        }
        .u-row {
            width: calc(100% - 40px) !important;
        }
        .u-col {
            width: 100% !important;
        }
        .u-col > div {
            margin: 0 auto;
        }
        }
        body {
        margin: 0;
        padding: 0;
        }

        table,
        tr,
        td {
        vertical-align: top;
        border-collapse: collapse;
        }

        p {
        margin: 0;
        }

        .ie-container table,
        .mso-container table {
        table-layout: fixed;
        }

        * {
        line-height: inherit;
        }

        a[x-apple-data-detectors='true'] {
        color: inherit !important;
        text-decoration: none !important;
        }

        table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; }
            </style>
        
        

        </head>

        <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000">
        <!--[if IE]><div class="ie-container"><![endif]-->
        <!--[if mso]><div class="mso-container"><![endif]-->
        <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0">
        <tbody>
        <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->
            

        <div class="u-row-container" style="padding: 0px;background-color: transparent">
        <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
            
        <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
        <div style="height: 100%;width: 100% !important;">
        <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
        
        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
            <tr>
            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="padding-right: 0px;padding-left: 0px;" align="center">
            
            <img align="center" border="0" src="https://i.imgur.com/xrEZ0EQ.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;" width="480"/>
            
            </td>
        </tr>
        </table>

            </td>
            </tr>
        </tbody>
        </table>

        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
            <tr>
            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
        <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
            <tbody>
            <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <span>&#160;</span>
                </td>
            </tr>
            </tbody>
        </table>

            </td>
            </tr>
        </tbody>
        </table>

        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
            <tr>
            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
        <div style="line-height: 140%; text-align: left; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 22px; line-height: 30.8px;"><strong>Novo candidato para a vaga de ${nomeVaga}</strong></span></p>
        </div>

            </td>
            </tr>
        </tbody>
        </table>

        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
            <tr>
            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
        <div style="line-height: 10%; text-align: left; word-wrap: break-word;">
            <p style="font-size: 16px; line-height: 140%;">Pergunta de triagem: ${pergunta}</p><br />
            <p style="font-size: 16px; line-height: 140%;">Resposta do candidato: ${resposta}</p>
        </div>

            </td>
            </tr>
        </tbody>
        </table>

        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
            <tr>
            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
        <div style="line-height: 140%; text-align: left; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 140%;">Clique no bot??o abaixo para ser redirecionado para o perfil do candidato.</p>
        </div>

            </td>
            </tr>
        </tbody>
        </table>

        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
            <tr>
            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                
        <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
        <div align="center">
        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://localhost:3000/perfil/${idCandidato}" style="height:37px; v-text-anchor:middle; width:183px;" arcsize="81%"  stroke="f" fillcolor="#8735c7"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;"><![endif]-->  
            <a href="http://localhost:3000/perfil/${idCandidato}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #8735c7; border-radius: 30px;-webkit-border-radius: 30px; -moz-border-radius: 30px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-width: 0px; border-top-style: solid; border-top-color: #CCC; border-left-width: 0px; border-left-style: solid; border-left-color: #CCC; border-right-width: 0px; border-right-style: solid; border-right-color: #CCC; border-bottom-width: 0px; border-bottom-style: solid; border-bottom-color: #CCC;">
            <span style="display:block;padding:10px 20px;line-height:120%;"><strong><span style="font-size: 14px; line-height: 16.8px;">LINK PARA O PERFIL</span></strong></span>
            </a>
        <!--[if mso]></center></v:roundrect><![endif]-->
        </div>

            </td>
            </tr>
        </tbody>
        </table>

        <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
        </div>
        </div>
        <!--[if (mso)|(IE)]></td><![endif]-->
            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
            </div>
        </div>
        </div>


            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </td>
        </tr>
        </tbody>
        </table>
        <!--[if mso]></div><![endif]-->
        <!--[if IE]></div><![endif]-->
        </body>

        </html>
    `;

    return html;
}