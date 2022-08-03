const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

const ClienteSQL = require('./contenedor/container')
const { optionsLITE , optionsSQL }  = require('./config')

// -----------------  EJS  --------------------- //

app.set ('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// // --------------------- SERVER ------------- //

let items = new ClienteSQL(optionsSQL.config, optionsSQL.table)
let chat = new ClienteSQL(optionsLITE.config, optionsLITE.table)

io.on('connection', async function(socket) {
    let productos = await items.getAll()
    let mensajes = await chat.getAll()
    socket.emit('productos', productos);
    socket.emit('mensaje', mensajes)

    socket.on('new-objeto', async function(objeto) {
        await items.newElement(objeto)
        let productos = await items.getAll()
        io.sockets.emit('productos', productos); //emitir todos los productos a todos los clientes
    });    

    socket.on('new-message', async function(objeto) {
        await chat.newElement(objeto)
        let mensajes = await chat.getAll()
        io.sockets.emit('mensaje', mensajes); //emitir todos los productos a todos los clientes
    }); 
});

const PORT = process.env.PORT || 8080;

const srv = server.listen(PORT, () => { 
    console.log(`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))