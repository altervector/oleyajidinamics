document.addEventListener("DOMContentLoaded", () => {
    const headerHTML = `
        <div class="capcalera-principal">
            <div class="contenidor-logo">
                <img src="https://altervector.github.io/oleyajidinamics/Icon/logo.jpg" alt="Logo Olé y Ají" class="logo">
            </div>
            <div class="text-capcalera">
                <p>
                    <em>Distribució de productes congelats 
                    <span class="subtitol-capcalera">per a hostaleria i col·lectius</span></em>
                </p>
            </div>
        </div>
        <hr class="separador-hr">
        <hr class="separador-hr">
    `;

    const el = document.getElementById("capcalera-dinamica");
    if (el) el.innerHTML = headerHTML;
});