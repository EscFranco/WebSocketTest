let socket = io.connect();

socket.on('productos', function (data) {
    render(data)
});

socket.on('mensaje', function (data) {
    chatRender(data)
});

function render(data) {
    if (data.length > 0) {
        var parrafo = document.getElementById('ocultarProductos')
        parrafo.style.display = 'none';
        var tabla = document.getElementById('ocultarTabla')
        tabla.style.display = '';
        let html = data.map(function (elem, index) {
            return (`<tr>
                        <td class="align-middle" scope="row">${elem.id}</td>
                        <td class="align-middle">${elem.gusto}</td>
                        <td class="align-middle">$${elem.precio}</td>
                        <td class="align-middle"><img src=${elem.img} alt="imagen del producto" style="width: 100px" /></td>
                    </tr>`)
        }).join(" ");
        document.getElementById('tabla').innerHTML = html;
    } else {
        var tabla = document.getElementById('ocultarTabla')
        tabla.style.display = 'none';
        var parrafo = document.getElementById('ocultarProductos')
        parrafo.style.display = 'block';
    }
}

function chatRender(data) {
    let html = data.map(function (elem) {
        return (`<div>
            <strong style="color: blue">${elem.usuario} - <span style="color: brown">${elem.hora}</span></strong>: 
            <em style="color: green">${elem.texto}</em> </div>`)
    }).join(" ");
    document.getElementById('chat').innerHTML = html;
}

function addNewProduct() {
    let objeto = {
        gusto: document.getElementById('gusto').value,
        precio: document.getElementById('precio').value,
        img: document.getElementById('img').value
    };
    socket.emit('new-objeto', objeto);
    document.getElementById('gusto').value = ''
    document.getElementById('precio').value = ''
    document.getElementById('img').value = ''
    document.getElementById('gusto').focus()

    return false;
}

function addMessage() {

    let mensaje = {
        usuario: document.getElementById('email').value,
        texto: document.getElementById('texto').value,
        hora: new Date().toLocaleString('es-AR')
    };
    socket.emit('new-message', mensaje); // new-message es el nombre del evento (recordatorio)

    document.getElementById('email').value = ''
    document.getElementById('texto').value = ''
    document.getElementById('texto').focus()

    return false;
}