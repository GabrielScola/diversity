const db = require('../../config/db');
const { envioEmail } = require('../../util/email');
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const bcrypt = require('bcrypt');

const sendEmail = async (
    email,
    password,
) => {
    const query = `SELECT 1 FROM USUARIOS WHERE email = '${email.toLowerCase().trim()}'`;
    const result = await db(query, true);

    if(result.success && result.data) {
        return {
            success: false,
            message: 'Alguém já está utilizando esse email!',
            data: null,
        }
    }

    if(password && password.length < 6) {
        return {
            success: false,
            message: 'A senha deve conter no mínimo 6 caracteres!',
            data: null,
        }
    }

    const codigo = Math.floor(100000 + Math.random() * 900000);
    const html = montaHtml(codigo);

    const resultEmail = await envioEmail(
        'Código de confirmação.',
        email,
        html
    );

    if(!resultEmail.success) {
        return {
            success: false,
            message: 'Ocorreu um erro ao tentar enviar o email, tente novamente mais tarde.',
            data: resultEmail.data,
        }
    }

    return {
        success: true,
        message: '',
        data: codigo,
    }
}

const sendSMS = async (
    countryCode,
    phoneNumber
) => {
    const telefone = `+${countryCode}${phoneNumber}`;

    const query = `SELECT 1 FROM USUARIOS WHERE telefone = '${telefone}'`;
    const result = await db(query, true);

    if(result.success && result.data) {
        return {
            success: false,
            message: 'Alguém já está utilizando esse número de telefone!',
            data: null,
        }
    }

    const codigo = Math.floor(100000 + Math.random() * 900000);
    
    twilio.messages
        .create({
            body: `Seu código de verificação do Diversity é: ${codigo}`,
            from: process.env.TWILIO_PHONE,
            to: telefone
        }).then(message => {
            if (message.errorMessage && message.errorMessage.length > 0) {
                return {
                    success: false,
                    message: 'Ocorreu um erro ao enviar o SMS. Revise o número de telefone informado.',
                    data: null
                }
            }
        });

    return {
        success: true,
        message: 'SMS enviado com sucesso!',
        data: codigo
    }
    
}

const register = async (
    email,
    password,
    nome,
    sobrenome,
    lgbt,
    negros,
    pcd,
    countryCode,
    phoneNumber,
    city,
    cargo,
    empresa,
    dia,
    mes,
    image,
    alerta_cargo,
    alerta_local
) => {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const query = `
        INSERT INTO usuarios (email, senha, nome, telefone, dt_cadastro, imagem_perfil, lgbt, negro, pcd, localizacao, dt_aniversario, empresa, alerta_cargo, alerta_local, profissao)
        VALUES ('${email.toLowerCase().trim()}', '${hash}', '${nome} ${sobrenome}', '+${countryCode}${phoneNumber}', CURRENT_TIMESTAMP(2), '${image}', '${lgbt ? 'S' : 'N'}', '${negros ? 'S' : 'N'}', '${pcd ? 'S' : 'N'}',
        '${city}', '2000-${mes}-${dia}', '${empresa}', '${alerta_cargo}', '${alerta_local}', '${cargo}');
    `;

    const result = await db(query);

    if (!result.success) {
        return {
          success: false,
          message: 'Não foi possível cadastrar usuário.',
          data: null,
        }
    }

    return {
        success: true,
        message: 'Usuário cadastrado com sucesso! Faça login no sistema.',
        data: null,
    }
}

const montaHtml = (codigo) => {

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
    
    table, td { color: #000000; } </style>
      
      
    
    </head>
    
    <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000">
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0">
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
      <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
      
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
            
      <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: arial,helvetica,sans-serif; font-size: 22px;">
        <strong>Aqui está o seu código de verificação</strong>
      </h1>
    
          </td>
        </tr>
      </tbody>
    </table>
    
    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
      <tbody>
        <tr>
          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
      <div style="line-height: 150%; text-align: center; word-wrap: break-word;">
        <p style="line-height: 150%; text-align: center; font-size: 14px;"><span style="line-height: 21px; color: #ecf0f1; font-size: 14px;"><strong><span style="font-size: 28px; background-color: #8735c7; line-height: 42px;"><span style="background-color: #8735c7; font-size: 28px; line-height: 42px;">   </span>${codigo}   </span></strong></span></p>
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

module.exports = { sendEmail, sendSMS, register };