const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

// -----------------  EJS  --------------------- //

app.set ('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// --------------------- FILESYSTEM ------------- //

const fs = require('fs')


// --------------------- PRODUCTOS ------------- //

class Contenedor {
    constructor(ruta) {
        this.ruta = ruta
    }

    async getAll() {
        try {
            const load = JSON.parse(await fs.promises.readFile(this.ruta, 'utf-8'))
            return load;
        } catch (error) {
            console.log(`Hubo un error ${error}`);
        }
    }

    async newProduct(objeto) {
        try {
            let itemnuevo = objeto
            const contents = await fs.promises.readFile(this.ruta, 'utf-8')
            const agregar = JSON.parse(contents)
            let valor = agregar.slice(-1).pop()
            if (valor === undefined) {
                agregar.push({ ...itemnuevo, id: 1 })
                await fs.promises.writeFile(this.ruta, JSON.stringify(agregar, null, 2))
            } else {
            let numero = valor.id + 1
            agregar.push({ ...itemnuevo, id: numero })
            await fs.promises.writeFile(this.ruta, JSON.stringify(agregar, null, 2))
            }
        } catch (error) {
            console.log(`Hubo un error ${error}`);
        }
    }

    async newMensaje(msjNuevo) {
        const chat = JSON.parse(await fs.promises.readFile(this.ruta, 'utf-8'))
        chat.push ({...msjNuevo})
        await fs.promises.writeFile(this.ruta, JSON.stringify(chat, null, 2))
    }
}


// --------------------- SERVER ------------- //

let items = new Contenedor('./productos/productos.txt')
let chat = new Contenedor ('./mensajes/mensajes.txt')

// app.get('/', async (req, res) => {
//     let answer = await usuario.getAll()
//     res.render('index', { answer })
// })

io.on('connection', async function(socket) {
    let productos = await items.getAll()
    let mensajes = await chat.getAll()
    socket.emit('productos', productos);
    socket.emit('mensaje', mensajes)

    socket.on('new-objeto', async function(objeto) {
        await items.newProduct(objeto)
        let productos = await items.getAll()
        io.sockets.emit('productos', productos); //emitir todos los productos a todos los clientes
    });    

    socket.on('new-message', async function(objeto) {
        await chat.newMensaje(objeto)
        let mensajes = await chat.getAll()
        io.sockets.emit('mensaje', mensajes); //emitir todos los productos a todos los clientes
    }); 
});

const PORT = process.env.PORT || 8080;

const srv = server.listen(PORT, () => { 
    console.log(`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))