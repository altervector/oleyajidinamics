document.addEventListener("DOMContentLoaded", () => {
    const headerHTML = `
        <div class="capcalera-principal">
            <div class="contenidor-logo">
                <img src="https://altervector.github.io/oleyajidinamics/Icon/logo.jpg" alt="Logo Olé y Ají" class="logo">
            </div>
            <div class="text-capcalera">
                <p>
                    <em>🇨🇴Donde Colombia y España
                    <span class="subtitol-capcalera"> se unen en sabor🇪🇸/span></em>
                </p>
            </div>
        </div>
        <hr class="separador-hr">
        <hr class="separador-hr">
    `;

    const el = document.getElementById("capcalera-dinamica");
    if (el) el.innerHTML = headerHTML;
});
