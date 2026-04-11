document.addEventListener("DOMContentLoaded", () => {
    const enllacosHTML = `
        
        <div class="bloc-enllacos">
            <p><a href="https://altervector.github.io/oleyajidinamics/Carta.pdf"><img src="https://altervector.github.io/oleyajidinamics/Icon/Icopdf.png" alt="Pdf" class="icona-app">Descarrèga la Carta al complet (PDF)</a></p>
            <p><a href="https://www.instagram.com/oleyajivilafranca" target="_blank"><img src="https://altervector.github.io/oleyajidinamics/Icon/Icoinsta.png" alt="Instagram" class="icona-app">Instagram: @oleyajivilafranca</a></p>
            <p><a href="https://wa.me/34642325582"><img src="https://altervector.github.io/oleyajidinamics/Icon/icowhats.png" alt="Whatsapp" class="icona-app">Contacta per WhatsApp</a></p>
            <p><a href="mailto:_"> <img src="https://altervector.github.io/oleyajidinamics/Icon/Icomail.png" alt="e-mail" class="icona-app">Envia un correu</a></p>
        </div>
        <hr class="separador-hr">
        <hr class="separador-hr">
            <footer style="text-align: center; padding: 40px 20px; font-family: 'Segoe UI', Roboto, sans-serif;">
            <a href="https://altervector.com" target="_blank" style="text-decoration: none; color: #999; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">
            Powered by <span style="color: #129dfc; font-weight: bold; border-bottom: 1px solid #129dfc;">AlterVector</span>
            </a>
            </footer>
        `;

    const contenidor = document.getElementById("bloc-enllacos-dinamic");
    if (contenidor) {
        contenidor.innerHTML = enllacosHTML;
    }
});
