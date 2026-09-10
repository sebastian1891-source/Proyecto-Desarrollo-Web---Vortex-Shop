function crearFichaProducto(producto) {
    const hayStock = producto.stock > 0;
    const textoStock = hayStock
        ? `${producto.stock} unidades disponibles`
        : "Sin stock por el momento";
    const claseStock = hayStock ? "text-secondary" : "text-danger fw-semibold";

    return `
        <div class="row g-5 align-items-start">
            <div class="col-lg-6">
                <div class="hero-card">
                    <div class="hero-card-header">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
            </div>

            <div class="col-lg-6">
                <span class="eyebrow">${producto.categoria}</span>
                <h1 class="fw-bold mt-2">${producto.nombre}</h1>
                <p class="lead">${producto.descripcion}</p>
                <p class="${claseStock} mb-3">${textoStock}</p>
                <h2 class="fw-bold mb-4" style="color: var(--primary);">${formatearPrecio(producto.precio)}</h2>

                <button class="btn btn-primary btn-lg" id="btnAgregarCarrito" ${hayStock ? "" : "disabled"}>
                    Agregar al carrito
                </button>

                <div class="mt-4">
                    <a href="catalogo.html" class="btn btn-outline-dark btn-sm">Volver al catálogo</a>
                </div>
            </div>
        </div>
    `;
}

// Arma el HTML que se muestra cuando no hay un producto válido
function crearMensajeProductoNoEncontrado() {
    return `
        <section class="locked-module">
            <div class="locked-icon">🔍</div>
            <h1>Producto no encontrado</h1>
            <p class="lead">Elegí un producto desde el catálogo para ver su ficha completa.</p>
            <a href="catalogo.html" class="btn btn-primary mt-3">Ir al catálogo</a>
        </section>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector("#detalle-producto");
    if (!contenedor) return;

    const idProducto = new URLSearchParams(window.location.search).get("id");
    const producto = productos.find(p => p.id === idProducto);

    if (!producto) {
        contenedor.innerHTML = crearMensajeProductoNoEncontrado();
        return;
    }

    contenedor.innerHTML = crearFichaProducto(producto);

    document.querySelector("#btnAgregarCarrito")?.addEventListener("click", () => {
        agregarAlCarrito(producto.id, 1);
        mostrarToast(`"${producto.nombre}" se agregó al carrito.`);
    });
});