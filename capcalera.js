// /////////////////////////////////////////////////////  1. Títol de la pestanya   ////////////////////////

document.title = "Olé y Ají - Restaurant i Tapes";

// 2. Icona (Favicon) - La cerca i, si no existeix, la crea
let favicon = document.querySelector("link[rel*='icon']");
if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
}
favicon.href = 'https://altervector.github.io/oleyajidinamics/Icon/logo.jpg';


////////////////////////////////////////////// 3. Descripció (Meta) - La cerca i, si no existeix, la crea  ///////////

let metaDesc = document.querySelector('meta[name="description"]');
if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
}
metaDesc.setAttribute("content", "Donde Colombia y España se unen en sabor.");



////////////////////////////////////////////    4. Capçalera (HTML) - S'executa quan el document està a punt  //////////


document.addEventListener("DOMContentLoaded", () => {
    const headerHTML = `
        <div class="capcalera-principal">
            <div class="contenidor-logo">
                <img src="https://altervector.github.io/oleyajidinamics/Icon/logotrans.png" alt="Logo Olé y Ají" class="logo">
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
    
    if (el) {
        el.innerHTML = headerHTML;

/////////////////////////////////////////////////   LOGIN PER "ME" ////////////////////////////////


    const logo = el.querySelector('.logo');
        let timerLogo;

// --- DISSENY MODE ME ---
  

        if (logo) {
            // Blau permanent si som admin
            if (sessionStorage.getItem('adminMode') === 'true') {
                document.body.style.setProperty('background-color', '#fff9f0', 'important');// Fons taronja suau
                logo.style.filter = "brightness(0) saturate(100%) invert(20%) sepia(98%) saturate(3019%) hue-rotate(202deg)"; 
            }

            const login = (e) => {
                if (e) e.preventDefault(); // Evita que el mòbil vulgui "desar imatge"
                timerLogo = setTimeout(() => {
                    if (prompt("Clau:") === "1234") {
                        sessionStorage.setItem('adminMode', 'true');
                        location.reload(); 
                    }
                }, 4000);
            };

            const stop = () => clearTimeout(timerLogo);

            // ORDINADOR
            logo.addEventListener('mousedown', login);
            logo.addEventListener('mouseup', stop);
            logo.addEventListener('mouseleave', stop);

            // MÒBIL
            logo.addEventListener('touchstart', login, { passive: false });
            logo.addEventListener('touchend', stop);
        }
    }
});