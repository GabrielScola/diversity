const pool = require('./pool');

const db = async (query, oneRow = false) => {
    try {
        const { rows, rowCount } = await pool.query(query);
        console.log('QUERY = ', query);
        
        if(!rowCount) {
            return {
                success: false,
                data: null,
                rowCount: 0
            }
        }

        if(oneRow) 
            return {
                success: true,
                data: rows[0],
                rowCount: rowCount
            }

        return {
            success: true,
            data: rows,
            rowCount: rowCount
        };
    } catch (ex) {
        console.error('Ocorreu um erro ao acessar o banco: ', ex);
        return {
            success: false,
            message: 'Ocorreu um erro com o banco de dados. Entre em contato com o suporte.',
            data: null,
        }
    }
}

module.exports = db;