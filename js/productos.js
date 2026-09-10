const productos = [
    {
        id: "p1",
        nombre: "Auriculares Bluetooth",
        descripcion: "Auriculares inalámbricos",
        categoria: "Audio",
        precio: 2500,
        stock: 10,
        imagen: "img/Auriculares1.png"
    },
    {
        id: "p2",
        nombre: "Iphone 16 Pro Max",
        descripcion: "Potencia y rendimiento para todos los días.",
        categoria: "Celulares",
        precio: 59990,
        stock: 5,
        imagen: "img/Iphone16ProMax1.jpg"
    },
    {
        id: "p3",
        nombre: "Notebook Pro",
        descripcion: "Rendimiento y movilidad para tus proyectos.",
        categoria: "Computación",
        precio: 34990,
        stock: 8,
        imagen: "img/Laptop1.png"
    },
    {
        id: "p4",
        nombre: "Teclado Mecánico RGB",
        descripcion: "Precisión y comodidad para trabajar y jugar.",
        categoria: "Periféricos",
        precio: 3750,
        stock: 15,
        imagen: "img/TecladoMecanico1.png"
    }
];


// Da formato de moneda al precio, ej: 2500 -> "$ 2.500"
function formatearPrecio(precio) {
    return "$ " + precio.toLocaleString("es-UY");
}

// Crea el elemento HTML (columna + tarjeta) para un producto
function crearTarjetaProducto(producto) {
    const columna = document.createElement("div");
    columna.className = "col-12 col-md-6 col-xl-3";

    const hayStock = producto.stock > 0;
    const textoStock = hayStock
        ? `${producto.stock} unidades disponibles`
        : "Sin stock";
    const claseStock = hayStock ? "text-secondary" : "text-danger fw-semibold";

    columna.innerHTML = `
        <article class="product-card h-100">
            <div class="product-image">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="p-3">
                <span class="eyebrow">${producto.categoria}</span>
                <h3 class="h5 mt-2">${producto.nombre}</h3>
                <p class="text-secondary small mb-1">${producto.descripcion}</p>
                <p class="small ${claseStock} mb-2">${textoStock}</p>
                <div class="d-flex justify-content-between align-items-center product-footer">
                    <strong>${formatearPrecio(producto.precio)}</strong>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary btn-sm btn-agregar-carrito"
                            data-id="${producto.id}" ${hayStock ? "" : "disabled"}>
                            Agregar
                        </button>
                        <a href="producto.html?id=${producto.id}" class="btn btn-primary btn-sm">Ver producto</a>
                    </div>
                </div>
            </div>
        </article>
    `;

    return columna;
}

// Recorre el arreglo de productos y agrega cada tarjeta al contenedor
function renderizarCatalogo(listaProductos) {
    const contenedor = document.querySelector("#catalogo-container");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (listaProductos.length === 0) {
        contenedor.innerHTML = `<p class="text-secondary">No se encontraron productos que coincidan con tu búsqueda.</p>`;
        return;
    }

    listaProductos.forEach(producto => {
        contenedor.appendChild(crearTarjetaProducto(producto));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarCatalogo(productos);
    inicializarFiltroCategorias();
    inicializarEventosDeFiltro();
    inicializarEventosCatalogo();
});

// Delega el click en los botones "Agregar" de las tarjetas: como el contenedor
// se vuelve a dibujar en cada búsqueda/filtro, el listener se pone una sola vez
// sobre el contenedor (que no cambia) en vez de sobre cada botón.
function inicializarEventosCatalogo() {
    const contenedor = document.querySelector("#catalogo-container");
    if (!contenedor) return;

    contenedor.addEventListener("click", (evento) => {
        const boton = evento.target.closest(".btn-agregar-carrito");
        if (!boton) return;

        const idProducto = boton.dataset.id;
        const producto = productos.find(p => p.id === idProducto);
        if (!producto) return;

        agregarAlCarrito(idProducto, 1);
        mostrarToast(`"${producto.nombre}" se agregó al carrito.`);
    });
}

// Genera dinámicamente las opciones del <select> a partir de las
// categorías presentes en el arreglo de productos (sin repetidas)
function inicializarFiltroCategorias() {
    const selectCategoria = document.querySelector("#filtroCategoria");
    if (!selectCategoria) return;

    const categoriasUnicas = [...new Set(productos.map(p => p.categoria))].sort();

    categoriasUnicas.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria;
        opcion.textContent = categoria;
        selectCategoria.appendChild(opcion);
    });
}

// Filtra el arreglo de productos según el texto buscado y la categoría elegida.
// Usa .filter() para quedarse solo con los productos que cumplen ambas condiciones.
function filtrarProductos(texto, categoria) {
    const textoBuscado = texto.trim().toLowerCase();

    return productos.filter(producto => {
        const coincideNombre = producto.nombre.toLowerCase().includes(textoBuscado);
        const coincideCategoria = categoria === "" || producto.categoria === categoria;

        return coincideNombre && coincideCategoria;
    });
}

// Lee los valores actuales del buscador y del select, filtra y vuelve a renderizar
function aplicarFiltros() {
    const buscador = document.querySelector("#buscador");
    const selectCategoria = document.querySelector("#filtroCategoria");

    const texto = buscador ? buscador.value : "";
    const categoria = selectCategoria ? selectCategoria.value : "";

    const resultado = filtrarProductos(texto, categoria);
    renderizarCatalogo(resultado);
}

// Conecta los eventos del buscador, el select y el botón "Limpiar filtros"
function inicializarEventosDeFiltro() {
    const buscador = document.querySelector("#buscador");
    const selectCategoria = document.querySelector("#filtroCategoria");
    const btnLimpiar = document.querySelector("#btnLimpiarFiltros");

    // "input" para que la búsqueda se actualice mientras se escribe, sin recargar la página
    buscador?.addEventListener("input", aplicarFiltros);

    selectCategoria?.addEventListener("change", aplicarFiltros);

    btnLimpiar?.addEventListener("click", () => {
        if (buscador) buscador.value = "";
        if (selectCategoria) selectCategoria.value = "";
        renderizarCatalogo(productos);
    });
}