// ===== CONFIGURAZIONE =====
const LANG_FOLDER = "./lang/";
const FALLBACK_LANG = "en";   // lingua di default

// ===== ELEMENTI DA AGGIORNARE =====
const TRANSLATABLE_ATTRS = ["textContent", "innerHTML"];

// ===== CARICAMENTO DELLA LINGUA =====
async function loadLanguage(lang) {
  try {
    const res = await fetch(`${LANG_FOLDER}${lang}.json`);
    if (!res.ok) throw new Error(`Impossibile caricare ${lang}.json`);

    const dict = await res.json();
    applyTranslations(dict);

    localStorage.setItem("lang", lang);
    setMenuLabel(lang);
  } catch (err) {
    console.error(err);
    if (lang !== FALLBACK_LANG) loadLanguage(FALLBACK_LANG);
  }
}

// ===== APPLICA LE TRADUZIONI =====
function applyTranslations(dict) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");

    const value = getNestedValue(dict, key);
    if (!value) return;

    // Per sicurezza, scelgo innerHTML se il contenuto contiene tag
    if (value.includes("<") || value.includes("</")) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });
}

// ===== RECUPERO VALORI ANNIDATI (es. "home.title") =====
function getNestedValue(obj, key) {
  return key.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}

// ===== GESTIONE DEL PULSANTE LINGUA =====
function setMenuLabel(lang) {
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;

  btn.textContent = lang.toUpperCase();
}

function toggleLanguage() {
  const current = localStorage.getItem("lang") || FALLBACK_LANG;
  const next = current === "en" ? "it" : "en";
  loadLanguage(next);
}

// ===== AVVIO =====
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("lang-toggle");
  if (btn) btn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleLanguage();
  });

  const saved = localStorage.getItem("lang") || FALLBACK_LANG;
  loadLanguage(saved);
});
