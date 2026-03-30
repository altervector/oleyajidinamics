// Això canvia el títol de la pestanya de seguida
document.title = "Olé y Ají - Restaurant i Tapes";

// Això posa la descripció per al Google
const metaDesc = document.querySelector('meta[name="description"]');
if (metaDesc) {
    metaDesc.setAttribute("content", "Donde Colombia y España se unen en sabor.");
}

// Això dibuixa la capçalera quan la pàgina està a punt
document.addEventListener("DOMContentLoaded", () => {
    const headerHTML = `
        <div class="capcalera-principal">
            <div class="contenidor-logo">
                <img src="https://altervector.github.io/oleyajidinamics/Icon/logo.jpg" alt="Logo Olé y Ají" class="logo">
            </div>
            <div class="text-capcalera">
                <p>
                    <em>🇨🇴 Donde Colombia y España
                    <span class="subtitol-capcalera"> se unen en sabor 🇪🇸</span></em>
                </p>
            </div>
        </div>
        <hr class="separador-hr">
        <hr class="separador-hr">
    `;

    const el = document.getElementById("capcalera-dinamica");
    if (el) el.innerHTML = headerHTML;
});