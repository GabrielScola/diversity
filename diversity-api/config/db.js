const pool = require('./pool');

const db = async (query, oneRow) => {
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
    }
}

module.exports = db;