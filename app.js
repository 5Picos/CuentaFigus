// Selecciones clasificadas al Mundial 2026, en orden de grupo (A-L)
const COUNTRIES = [
  // Grupo A
  { code: "MX", name: "México" },
  { code: "ZA", name: "Sudáfrica" },
  { code: "KR", name: "Corea del Sur" },
  { code: "CZ", name: "República Checa" },
  // Grupo B
  { code: "CA", name: "Canadá" },
  { code: "BA", name: "Bosnia y Herzegovina" },
  { code: "QA", name: "Qatar" },
  { code: "CH", name: "Suiza" },
  // Grupo C
  { code: "BR", name: "Brasil" },
  { code: "MA", name: "Marruecos" },
  { code: "HT", name: "Haití" },
  { code: "SCT", name: "Escocia" },
  // Grupo D
  { code: "US", name: "Estados Unidos" },
  { code: "PY", name: "Paraguay" },
  { code: "AU", name: "Australia" },
  { code: "TR", name: "Turquía" },
  // Grupo E
  { code: "DE", name: "Alemania" },
  { code: "CW", name: "Curazao" },
  { code: "CI", name: "Costa de Marfil" },
  { code: "EC", name: "Ecuador" },
  // Grupo F
  { code: "NL", name: "Países Bajos" },
  { code: "JP", name: "Japón" },
  { code: "SE", name: "Suecia" },
  { code: "TN", name: "Túnez" },
  // Grupo G
  { code: "BE", name: "Bélgica" },
  { code: "EG", name: "Egipto" },
  { code: "IR", name: "Irán" },
  { code: "NZ", name: "Nueva Zelanda" },
  // Grupo H
  { code: "ES", name: "España" },
  { code: "CV", name: "Cabo Verde" },
  { code: "SA", name: "Arabia Saudita" },
  { code: "UY", name: "Uruguay" },
  // Grupo I
  { code: "FR", name: "Francia" },
  { code: "SN", name: "Senegal" },
  { code: "IQ", name: "Irak" },
  { code: "NO", name: "Noruega" },
  // Grupo J
  { code: "AR", name: "Argentina" },
  { code: "DZ", name: "Argelia" },
  { code: "AT", name: "Austria" },
  { code: "JO", name: "Jordania" },
  // Grupo K
  { code: "PT", name: "Portugal" },
  { code: "CD", name: "RD Congo" },
  { code: "UZ", name: "Uzbekistán" },
  { code: "CO", name: "Colombia" },
  // Grupo L
  { code: "GB", name: "Inglaterra" },
  { code: "HR", name: "Croacia" },
  { code: "GH", name: "Ghana" },
  { code: "PA", name: "Panamá" },
];

// Posiciones dentro de cada bloque (grid de 4 columnas)
const BLOCK_A_LAYOUT = { // escudo (1-10)
  1: { row: 1, col: 3 }, 2: { row: 1, col: 4 },
  3: { row: 2, col: 1 }, 4: { row: 2, col: 2 }, 5: { row: 2, col: 3 }, 6: { row: 2, col: 4 },
  7: { row: 3, col: 1 }, 8: { row: 3, col: 2 }, 9: { row: 3, col: 3 }, 10: { row: 3, col: 4 },
};
const BLOCK_B_LAYOUT = { // equipo (11-20)
  11: { row: 1, col: 1 }, 12: { row: 1, col: 2 }, 13: { row: 1, col: 4 },
  14: { row: 2, col: 1 }, 15: { row: 2, col: 2 }, 16: { row: 2, col: 3 }, 17: { row: 2, col: 4 },
  18: { row: 3, col: 2 }, 19: { row: 3, col: 3 }, 20: { row: 3, col: 4 },
};

const SPECIAL_NUMBERS = { 1: "\u{1F6E1}️", 13: "\u{1F465}" }; // escudo, equipo

// Códigos usados por otra app de figuritas conocida, en el mismo orden de grupos (A-L)
// que COUNTRIES, para poder importar/exportar mensajes compatibles con ella.
const OTHER_APP_CODES = [
  "MEX", "RSA", "KOR", "CZE",
  "SUI", "CAN", "BIH", "QAT",
  "BRA", "MAR", "SCO", "HAI",
  "USA", "AUS", "PAR", "TUR",
  "GER", "CIV", "ECU", "CUW",
  "NED", "JPN", "SWE", "TUN",
  "BEL", "EGY", "IRN", "NZL",
  "ESP", "CPV", "URU", "KSA",
  "FRA", "NOR", "SEN", "IRQ",
  "ARG", "AUT", "ALG", "JOR",
  "COL", "POR", "COD", "UZB",
  "ENG", "CRO", "GHA", "PAN",
];

const OUR_TO_OTHER_CODE = {};
const OTHER_TO_OUR_CODE = {};
COUNTRIES.forEach(({ code }, i) => {
  const otherCode = OTHER_APP_CODES[i];
  OUR_TO_OTHER_CODE[code] = otherCode;
  OTHER_TO_OUR_CODE[otherCode] = code;
});

const STORAGE_KEY = "figuritas-mundial-2026";
const LONG_PRESS_MS = 450;

const TOTAL_STICKERS = COUNTRIES.length * 20 + 19 + 1;

// Todos los IDs de figuritas numeradas, sin contar el "00" (logo Panini),
// que no aparece en los mensajes de faltantes/repetidas de ninguna app.
const ALL_STICKER_IDS = [];
COUNTRIES.forEach(({ code }) => {
  for (let n = 1; n <= 20; n++) ALL_STICKER_IDS.push(`${code}-${n}`);
});
for (let n = 1; n <= 19; n++) ALL_STICKER_IDS.push(`FWC-${n}`);

function flagEmoji(code) {
  if (code === "SCT") return "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}";
  if (code === "GB") return "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}";
  return code
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCount(id) {
  return state[id] || 0;
}

function setCount(id, value) {
  const v = Math.max(0, value);
  if (v === 0) {
    delete state[id];
  } else {
    state[id] = v;
  }
  saveState();
}

function stickerClass(count) {
  if (count >= 2) return "state-repeated";
  if (count === 1) return "state-obtained";
  return "state-empty";
}

function buildSticker(id, label, opts = {}) {
  const el = document.createElement("div");
  el.className = "sticker";
  el.dataset.id = id;
  if (opts.special) el.classList.add("special");
  if (opts.gridRow) el.style.gridRow = opts.gridRow;
  if (opts.gridColumn) el.style.gridColumn = opts.gridColumn;

  const numSpan = document.createElement("span");
  numSpan.className = "num";
  numSpan.textContent = label;
  el.appendChild(numSpan);

  if (opts.special) {
    const icon = document.createElement("span");
    icon.className = "type-icon";
    icon.textContent = opts.special;
    el.appendChild(icon);
  }

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.style.display = "none";
  el.appendChild(badge);

  refreshSticker(el);
  attachStickerEvents(el);
  return el;
}

function refreshSticker(el) {
  const id = el.dataset.id;
  const count = getCount(id);
  el.classList.remove("state-empty", "state-obtained", "state-repeated");
  el.classList.add(stickerClass(count));
  const badge = el.querySelector(".badge");
  if (count >= 2) {
    badge.textContent = "×" + (count - 1);
    badge.style.display = "block";
  } else {
    badge.style.display = "none";
  }
}

function attachStickerEvents(el) {
  let timer = null;
  let longPressed = false;

  const clearPress = () => {
    clearTimeout(timer);
    el.classList.remove("pressing");
  };

  const onDown = (e) => {
    longPressed = false;
    el.classList.add("pressing");
    timer = setTimeout(() => {
      longPressed = true;
      const id = el.dataset.id;
      setCount(id, getCount(id) - 1);
      refreshSticker(el);
      updateGlobalStats();
      updateGroupProgress(el);
      el.classList.remove("pressing");
      if (navigator.vibrate) navigator.vibrate(20);
    }, LONG_PRESS_MS);
  };

  const onUp = () => {
    clearPress();
    if (!longPressed) {
      const id = el.dataset.id;
      setCount(id, getCount(id) + 1);
      refreshSticker(el);
      updateGlobalStats();
      updateGroupProgress(el);
    }
  };

  const onCancel = () => clearPress();

  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointerup", onUp);
  el.addEventListener("pointerleave", onCancel);
  el.addEventListener("pointercancel", onCancel);
  el.addEventListener("contextmenu", (e) => e.preventDefault());
}

function updateGroupProgress(stickerEl) {
  const item = stickerEl.closest(".accordion-item");
  if (!item) return;
  const stickers = item.querySelectorAll(".sticker");
  let obtained = 0;
  stickers.forEach((s) => {
    if (getCount(s.dataset.id) >= 1) obtained++;
  });
  const label = item.querySelector(".mini-progress");
  if (label) label.textContent = `${obtained}/${stickers.length}`;
}

function updateGlobalStats() {
  let obtained = 0;
  let repeated = 0;
  for (const key in state) {
    const c = state[key];
    if (c >= 1) obtained++;
    if (c >= 2) repeated += c - 1;
  }
  document.getElementById("stat-obtained").textContent = obtained;
  document.getElementById("stat-obtained-label").textContent = `de ${TOTAL_STICKERS} obtenidas`;
  document.getElementById("stat-repeated").textContent = repeated;
  document.getElementById("progress-fill").style.width =
    ((obtained / TOTAL_STICKERS) * 100).toFixed(2) + "%";
}

function buildCountryBody(code) {
  const body = document.createElement("div");

  const blockA = document.createElement("div");
  blockA.className = "sticker-block";
  for (let n = 1; n <= 10; n++) {
    const pos = BLOCK_A_LAYOUT[n];
    const id = `${code}-${n}`;
    const el = buildSticker(id, n, {
      special: SPECIAL_NUMBERS[n],
      gridRow: pos.row,
      gridColumn: pos.col,
    });
    blockA.appendChild(el);
  }

  const gap = document.createElement("div");
  gap.className = "block-gap";

  const blockB = document.createElement("div");
  blockB.className = "sticker-block";
  for (let n = 11; n <= 20; n++) {
    const pos = BLOCK_B_LAYOUT[n];
    const id = `${code}-${n}`;
    const el = buildSticker(id, n, {
      special: SPECIAL_NUMBERS[n],
      gridRow: pos.row,
      gridColumn: pos.col,
    });
    blockB.appendChild(el);
  }

  body.appendChild(blockA);
  body.appendChild(gap);
  body.appendChild(blockB);
  return body;
}

function buildFwcBody() {
  const body = document.createElement("div");
  const block = document.createElement("div");
  block.className = "sticker-block fwc-block";

  block.appendChild(buildSticker("00", "00", { special: "\u{1F3C6}" }));
  for (let n = 1; n <= 19; n++) {
    block.appendChild(buildSticker(`FWC-${n}`, n));
  }

  body.appendChild(block);
  return body;
}

function buildAccordionItem({ flag, name, body, totalCount }) {
  const item = document.createElement("div");
  item.className = "accordion-item";

  const header = document.createElement("div");
  header.className = "accordion-header";

  const flagSpan = document.createElement("span");
  flagSpan.className = "flag";
  flagSpan.textContent = flag;

  const nameSpan = document.createElement("span");
  nameSpan.className = "name";
  nameSpan.textContent = name;

  const progressSpan = document.createElement("span");
  progressSpan.className = "mini-progress";

  const chevron = document.createElement("span");
  chevron.className = "chevron";
  chevron.textContent = "▼";

  header.appendChild(flagSpan);
  header.appendChild(nameSpan);
  header.appendChild(progressSpan);
  header.appendChild(chevron);

  const bodyWrap = document.createElement("div");
  bodyWrap.className = "accordion-body";
  bodyWrap.appendChild(body);

  header.addEventListener("click", () => {
    item.classList.toggle("open");
  });

  item.appendChild(header);
  item.appendChild(bodyWrap);

  // progreso inicial
  requestAnimationFrame(() => {
    const stickers = item.querySelectorAll(".sticker");
    let obtained = 0;
    stickers.forEach((s) => {
      if (getCount(s.dataset.id) >= 1) obtained++;
    });
    progressSpan.textContent = `${obtained}/${totalCount}`;
  });

  return item;
}

// Interpreta un mensaje pegado que puede traer una sección "Me faltan",
// una sección "Repetidas", o ambas juntas en un solo mensaje (de esta app
// o de la app compatible). Devuelve { faltantes, repetidas } con arrays de
// ids (o null si esa sección no apareció), o null si no se reconoce ningún
// encabezado válido.
function parsePastedList(text) {
  if (!text || !text.trim()) return null;
  const lines = text.split(/\r?\n/);
  let mode = null;
  const result = { faltantes: null, repetidas: null };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (/^me faltan$/i.test(line)) { mode = "faltantes"; continue; }
    if (/^repetidas$/i.test(line)) { mode = "repetidas"; continue; }
    if (!mode) continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const left = line.slice(0, colonIdx).trim();
    const right = line.slice(colonIdx + 1);

    const codeMatch = left.match(/^([A-Za-z]+)/);
    if (!codeMatch) continue;
    const code = codeMatch[1].toUpperCase();

    const numbers = right
      .split(",")
      .map((s) => s.match(/\d+/))
      .filter(Boolean)
      .map((m) => parseInt(m[0], 10));
    if (!numbers.length) continue;

    const ids = result[mode] || (result[mode] = []);
    if (code === "FWC") {
      numbers.forEach((n) => ids.push(`FWC-${n}`));
      continue;
    }
    const ourCode = OTHER_TO_OUR_CODE[code];
    if (!ourCode) continue;
    numbers.forEach((n) => ids.push(`${ourCode}-${n}`));
  }

  if (!result.faltantes && !result.repetidas) return null;
  return result;
}

// Genera un mensaje de texto ("faltantes" o "repetidas") compatible con
// el formato de la otra app, a partir del estado actual del álbum.
function buildExportMessage(kind) {
  const lines = ["CuentaFigus", "FWC 2026"];
  if (kind === "repetidas") lines.push("");
  lines.push(kind === "faltantes" ? "Me faltan" : "Repetidas");

  const matches = (id) => {
    const c = getCount(id);
    return kind === "faltantes" ? c === 0 : c >= 2;
  };

  const fwcNums = [];
  for (let n = 1; n <= 19; n++) {
    if (matches(`FWC-${n}`)) fwcNums.push(n);
  }
  if (fwcNums.length) lines.push(`FWC \u{1F3C6}: ${fwcNums.join(", ")}`);

  COUNTRIES.forEach(({ code }) => {
    const nums = [];
    for (let n = 1; n <= 20; n++) {
      if (matches(`${code}-${n}`)) nums.push(n);
    }
    if (nums.length) {
      lines.push(`${OUR_TO_OTHER_CODE[code]} ${flagEmoji(code)}: ${nums.join(", ")}`);
    }
  });

  lines.push("");
  lines.push("Hecho con CuentaFigus \u{1F3C6}");
  return lines.join("\n");
}

function importFaltantes(ids) {
  const ok = confirm(
    "Importar esta lista de faltantes reiniciará tu álbum actual y marcará como obtenidas todas las figuritas que no estén en la lista. ¿Continuar?"
  );
  if (!ok) return false;
  state = {};
  const missing = new Set(ids);
  ALL_STICKER_IDS.forEach((id) => {
    if (!missing.has(id)) setCount(id, 1);
  });
  return true;
}

function importRepetidas(ids) {
  new Set(ids).forEach((id) => {
    const c = getCount(id);
    if (c >= 1 && c < 2) setCount(id, 2);
  });
  return true;
}

function openModal({ title, desc, value, readonly, primaryLabel, secondaryLabel, onPrimary }) {
  const overlay = document.getElementById("modal-overlay");
  const textarea = document.getElementById("modal-textarea");
  const primaryBtn = document.getElementById("modal-primary-btn");
  const secondaryBtn = document.getElementById("modal-secondary-btn");

  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-desc").textContent = desc;
  textarea.value = value || "";
  textarea.readOnly = !!readonly;
  primaryBtn.textContent = primaryLabel;
  secondaryBtn.textContent = secondaryLabel;

  overlay.hidden = false;
  textarea.focus();
  if (readonly) textarea.select();

  const closeModal = () => {
    overlay.hidden = true;
    primaryBtn.onclick = null;
    secondaryBtn.onclick = null;
  };

  secondaryBtn.onclick = closeModal;
  primaryBtn.onclick = () => onPrimary({ textarea, closeModal, primaryBtn });
}

function copyModalText(textarea, primaryBtn) {
  textarea.select();
  const restore = () => { primaryBtn.textContent = "Copiar"; };
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(textarea.value)
      .then(() => {
        primaryBtn.textContent = "¡Copiado!";
        setTimeout(restore, 1200);
      })
      .catch(() => {});
  }
}

function setupFooterActions() {
  document.getElementById("import-btn").addEventListener("click", () => {
    openModal({
      title: "Importar álbum",
      desc: 'Pegá acá el mensaje de "Me faltan", de "Repetidas", o ambos juntos en un solo mensaje (de esta app o de otra compatible como "Figuritas") para actualizar tu álbum.',
      value: "",
      readonly: false,
      primaryLabel: "Importar",
      secondaryLabel: "Cancelar",
      onPrimary: ({ textarea, closeModal }) => {
        const parsed = parsePastedList(textarea.value);
        if (!parsed) {
          alert('No se reconoció el formato del mensaje. Pegá el texto completo de "Me faltan" o "Repetidas".');
          return;
        }
        if (parsed.faltantes && !importFaltantes(parsed.faltantes)) return;
        if (parsed.repetidas) importRepetidas(parsed.repetidas);
        render();
        closeModal();
      },
    });
  });

  document.getElementById("export-missing-btn").addEventListener("click", () => {
    openModal({
      title: "Exportar faltantes",
      desc: "Copiá este mensaje y compartilo para que te ayuden a completar el álbum.",
      value: buildExportMessage("faltantes"),
      readonly: true,
      primaryLabel: "Copiar",
      secondaryLabel: "Cerrar",
      onPrimary: ({ textarea, primaryBtn }) => copyModalText(textarea, primaryBtn),
    });
  });

  document.getElementById("export-repeated-btn").addEventListener("click", () => {
    openModal({
      title: "Exportar repes",
      desc: "Copiá este mensaje y compartilo para intercambiar tus repetidas.",
      value: buildExportMessage("repetidas"),
      readonly: true,
      primaryLabel: "Copiar",
      secondaryLabel: "Cerrar",
      onPrimary: ({ textarea, primaryBtn }) => copyModalText(textarea, primaryBtn),
    });
  });
}

function render() {
  const container = document.getElementById("accordion-container");
  container.innerHTML = "";

  container.appendChild(
    buildAccordionItem({
      flag: "\u{1F3C6}",
      name: "FWC + Especiales",
      body: buildFwcBody(),
      totalCount: 20,
    })
  );

  COUNTRIES.forEach(({ code, name }) => {
    container.appendChild(
      buildAccordionItem({
        flag: flagEmoji(code),
        name,
        body: buildCountryBody(code),
        totalCount: 20,
      })
    );
  });

  updateGlobalStats();
}

document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("¿Reiniciar todo el álbum? Se perderá el progreso guardado.")) {
    state = {};
    saveState();
    render();
  }
});

setupFooterActions();
render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
