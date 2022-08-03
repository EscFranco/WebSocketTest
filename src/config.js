const path = require('path');

const optionsSQL = {
    table : 'productos', 
    config : {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: '',
            database: 'ecommerce',
        }
    }
}

const optionsLITE = {
    table : 'chat',
    config : {
        client: 'sqlite3',
        connection: {
            filename: path.resolve('DB', 'ecommerce.sqlite')
        },
        useNullAsDefault : true
    }
}

module.exports =  { optionsLITE , optionsSQL }