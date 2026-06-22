
let numeroPedido = 1;
let ubicacionCliente = "";
let pedidoActivo = false;










function comprobarHorario() {
    const ahora = new Date();

    const horaLaPaz = parseInt(
        new Intl.DateTimeFormat('es-BO', {
            timeZone: 'America/La_Paz',
            hour: 'numeric',
            hour12: false
        }).format(ahora)
    );

    const diaLaPaz = parseInt(
        new Intl.DateTimeFormat('es-BO', {
            timeZone: 'America/La_Paz',
            weekday: 'numeric'
        }).format(ahora)
    );

    const contenedor = document.getElementById('estado-horario');

    if (!contenedor) return;

    let abierto = false;

    const diaReal = ahora.getDay();

    if (diaReal === 0) {
        // Domingo
        abierto = horaLaPaz >= 9 && horaLaPaz < 14;
    } else {
        // Lunes a sábado
        abierto = horaLaPaz >= 8 && horaLaPaz < 18;
    }

    if (abierto) {
        contenedor.innerHTML =
            '<span class="circulo verde"></span> <span class="texto-estado">ABIERTO AHORA - ¡PASA POR TU JUGO AL PASO!</span>';
    } else {
        contenedor.innerHTML =
            '<span class="circulo rojo"></span> <span class="texto-estado">CERRADO - TE ESPERAMOS EN NUESTRO PRÓXIMO HORARIO</span>';
    }
}

window.addEventListener("DOMContentLoaded", comprobarHorario);


// ===============================
// MODO OSCURO / CLARO
// ===============================

const toggleBtn = document.getElementById("theme-toggle");

if (toggleBtn) {

    if (localStorage.getItem("tema") === "claro") {
        document.body.classList.add("light-mode");
        toggleBtn.textContent = "☀️";
    } else {
        toggleBtn.textContent = "🌙";
    }

    toggleBtn.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {

            toggleBtn.textContent = "☀️";
            localStorage.setItem("tema", "claro");

        } else {

            toggleBtn.textContent = "🌙";
            localStorage.setItem("tema", "oscuro");

        }
    });
}


// ===============================
// BOTÓN VOLVER ARRIBA
// ===============================

const btnTop = document.getElementById("btn-top");

if (btnTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {
            btnTop.style.display = "block";
        } else {
            btnTop.style.display = "none";
        }

    });

    btnTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });
}
function abrirPedido(){
document.getElementById("modalPedido").style.display="flex";
}

function cerrarPedido(){
document.getElementById("modalPedido").style.display="none";
}
document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // FRUTAS (máximo 3)
    // ===============================
    const frutas = document.querySelectorAll(".fruta-card");

    frutas.forEach(fruta => {
        fruta.addEventListener("click", () => {

            const activas = document.querySelectorAll(".fruta-card.activa");

            if (!fruta.classList.contains("activa") && activas.length >= 3) {
                alert("Máximo 3 frutas");
                return;
            }

            fruta.classList.toggle("activa");
            actualizarPrecio();
        });
    });


    // ===============================
    // BASE + HIELO
    // ===============================
    const grupos = document.querySelectorAll(".grupo-opciones");

    grupos.forEach(grupo => {

        const opciones = grupo.querySelectorAll(".opcion");

        opciones.forEach(opcion => {

            opcion.addEventListener("click", () => {

                // limpiar SOLO dentro del grupo
                grupo.querySelectorAll(".opcion").forEach(btn => {
                    btn.classList.remove("activa");
                });

                opcion.classList.add("activa");

                actualizarPrecio();
            });

        });

    });

});

// ===============================
// PRECIO
// ===============================
function actualizarPrecio() {

    const cantidad = document.querySelectorAll(".fruta-card.activa").length;

    let precio = 0;

    if (cantidad === 1) precio = 10;
    else if (cantidad === 2) precio = 15;
    else if (cantidad === 3) precio = 20;

    const el = document.getElementById("precioEstimado");
    if (el) el.textContent = `💰 Precio estimado: ${precio} Bs`;
}
// UBICACIÓN
// ===============================
function enviarUbicacion() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(position){

            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            ubicacionCliente =
            `https://www.google.com/maps?q=${lat},${lon}`;

            alert("📍 Ubicación guardada correctamente");

        }, function(){

            alert("❌ No se pudo obtener la ubicación");

        });

    } else {

        alert("Tu navegador no soporta geolocalización");

    }

}


// ===============================
// PAGAR AHORA
function hacerPedido(){

    let frutas = [...document.querySelectorAll(".fruta-card.activa")]
        .map(f => f.dataset.nombre);

    const leche = document.querySelectorAll(".grupo-opciones")[0]?.querySelector(".opcion.activa");
    const hielo = document.querySelectorAll(".grupo-opciones")[1]?.querySelector(".opcion.activa");

    if (frutas.length === 0) return alert("Selecciona frutas");
    if (!leche) return alert("Selecciona leche");
    if (!hielo) return alert("Selecciona hielo");

    document.getElementById("qrPremium").style.display = "block";
}
function confirmarPedido() {

    let frutas = [...document.querySelectorAll(".fruta-card.activa")]
        .map(f => f.dataset.nombre);

    const leche = document.querySelectorAll(".grupo-opciones")[0].querySelector(".opcion.activa");
    const hielo = document.querySelectorAll(".grupo-opciones")[1].querySelector(".opcion.activa");

    let nombre = document.getElementById("nombreCliente").value.trim();
    let telefono = document.getElementById("telefonoCliente").value.trim();
    let direccion = document.getElementById("direccionCliente").value.trim();

    let qr = document.getElementById("qrPremium");

    // =========================
    // VALIDACIONES OBLIGATORIAS
    // =========================
    if (nombre === "" || telefono === "" || direccion === "") {
        alert("⚠️ Debes llenar todos los datos antes de pagar");
        return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        alert("⚠️ El nombre solo debe contener letras");
        return;
    }

    if (!/^[0-9]{8,}$/.test(telefono)) {
        alert("⚠️ El teléfono debe tener mínimo 8 números y solo números");
        return;
    }

    if (frutas.length === 0) return alert("Selecciona frutas");
    if (!leche) return alert("Selecciona leche o base");
    if (!hielo) return alert("Selecciona hielo");

    // =========================
    // SI TODO ESTÁ BIEN → QR
    // =========================
    let precio = document.getElementById("precioEstimado").textContent;
let mensaje = `
🍹 *NUEVO PEDIDO 

👤 *Cliente:* ${nombre}
📞 *Teléfono:* ${telefono}
*Dirección:* ${direccion}

🍓 *Frutas:* ${frutas.join(", ")}

🥛 *Base:* ${leche.textContent}
🧊 *temperatura:* ${hielo.textContent}

💰 *${precio}*

━━━━━━━━━━━━━━
🔍 QR en proceso de verificación...
📦 Pedido generado desde La Paz Street Juice
`;

    qr.style.display = "block";

    window.open(
        "https://wa.me/59172541194?text=" + encodeURIComponent(mensaje),
        "_blank"
    );

       
}
function estadoNegocio() {

    const ahora = new Date();
    const hora = new Intl.DateTimeFormat('es-BO', {
        timeZone: 'America/La_Paz',
        hour: 'numeric',
        hour12: false
    }).format(ahora);

    const dia = ahora.getDay();

    const estado = document.querySelector(".estado-negocio");
    const texto = document.getElementById("textoEstado");

    if (!estado || !texto) return;

    let abierto = false;

    // Domingo
    if (dia === 0) {
        abierto = hora >= 9 && hora < 14;
    }
    // Lunes a sábado
    else {
        abierto = hora >= 8 && hora < 18;
    }

    if (abierto) {
        texto.textContent = "ABIERTO";
        estado.classList.remove("cerrado");
    } else {
        texto.textContent = "CERRADO";
        estado.classList.add("cerrado");
    }
}

document.addEventListener("DOMContentLoaded", estadoNegocio);

// actualización automática cada 1 minuto
setInterval(estadoNegocio, 60000);