const knex = require('knex');
const { optionsLITE , optionsSQL }  = require('./config.js')



const LITE = async () => {
	try {
		const dbClient = knex(optionsLITE.config);
		await dbClient.schema.hasTable(optionsLITE.table).then((exists) => {
			if (!exists) {
				return dbClient.schema.createTable(optionsLITE.table, (table) => {
					table.increments('id').primary();
					table.string('usuario');
					table.string('texto');
					table.string('hora');
				});
			}
		});
		await dbClient.destroy();
		console.log('se creo la tabla');
	} catch (error) {
		console.log(error);
	}
};
const mySQL = async () => {
	try {
		const dbClient = knex(optionsSQL.config);

		await dbClient.schema.hasTable(optionsSQL.table).then((exists) => {
			if (!exists) {
				return dbClient.schema.createTable(optionsSQL.table, (table) => {
					table.increments('id').primary();
					table.string('gusto');
					table.string('precio');
					table.string('img');
				});
			}
		});
		
		await dbClient.destroy();
		console.log('se creo la tabla');
	} catch (error) {
		console.log(error);
	}
}

LITE();
// mySQL();
