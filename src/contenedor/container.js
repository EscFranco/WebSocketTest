// --------------------- KNEX ------------------- //

const knex = require('knex')

// --------------------- CONTENEDOR ------------- //

class ClienteSQL {
    constructor(option,table) {
        this.knex = knex(option)
        this.table = table
    }

    async getAll() {
        try {
            return await this.knex(this.table).select('*')
        } catch (error) {
            console.log(`Hubo un error ${error}`);
        }
    }

    async newElement(element) {
        try {
            return await this.knex(this.table).insert(element)
        } catch (error) {
            console.log(`Hubo un error ${error}`);
        }
    }
}

module.exports = ClienteSQL