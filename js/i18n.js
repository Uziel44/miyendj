/* ==========================================================================
   M I Y E N · Traducciones (ES / EN / PT)
   Se carga DESPUÉS de main.js (para que ya existan las imágenes que crea el carrusel).

   CÓMO FUNCIONA
   El español (idioma base) vive en el propio HTML: sirve de respaldo sin JS y para
   los buscadores. Al cargar se guarda una copia de cada texto marcado y es lo que se
   restaura al volver a "es". Aquí abajo están el inglés y el portugués.
     data-i18n="clave"                    → reemplaza el contenido (innerHTML) del elemento
     data-i18n-attr="atributo:clave;..."  → reemplaza atributos (alt, title, aria-label)
     <button data-lang="es|en|pt">        → cambia el idioma (aria-pressed marca el activo)

   Idioma inicial: el elegido antes (localStorage "lang") → idioma del navegador
   (es / en / pt) → inglés si el navegador está en otro idioma.

   Para agregar un texto: ponele data-i18n="clave" en el HTML (con el texto en español)
   y sumá la clave en "en" y "pt". El test de la carpeta tests/ avisa si falta alguna.
   ========================================================================== */

(function () {
  "use strict";

  const LANGS = ["es", "en", "pt"];
  const BASE = "es";          // idioma que está escrito en el HTML
  const FALLBACK = "en";      // idioma para navegadores que no están en es / en / pt
  const STORAGE_KEY = "lang";

  // Imagen de la bio (texto completo) por idioma. Si el archivo del idioma no existe (hoy falta el
  // portugués), se muestra la de español. Para sumar el PT: guardar "BIO PORTUGUES.png" en la raíz y listo.
  const BIO_IMG = { es: "BIO ESPANOL.png", en: "BIO ENGLISH.png", pt: "BIO PORTUGUES.png" };

  const DICT = {
    // ---- Textos que genera el JS (en el HTML no hay nada que copiar) ----
    es: {
      "bio.ampliarAria": "Ampliar imagen",
      "bio.cerrarAria": "Restaurar imagen",
      "alt.foto": "Foto de Miyen DJ"
    },

    en: {
      "meta.title": "M I Y E N | DJ & Producer",
      "meta.description": "M I Y E N - Tech House & Minimal Deep DJ / Producer | Sets, Videos & Music",

      "nav.rider": "TECHNICAL RIDER",
      "aria.menu": "Open menu",
      "aria.idioma": "Language",
      "alt.logo": "MIYEN logo",
      "hero.foto": "Miyen, DJ and producer",

      "bio.titulo": "BIO & PERSONAL INFORMATION",
      "bio.texto": "Born in Villa Carlos Paz, Córdoba, Argentina. Currently residing in Brazil (Rio de Janeiro). Designing atmospheric sets, organic, intense, and progressive grooves to connect minds on the dancefloor.",
      "bio.alt": "Miyen mixing live",
      "bio.ampliar": "ENLARGE",
      "bio.ampliarAria": "Enlarge image",
      "bio.cerrarAria": "Restore image",
      "alt.publico": "Electronic music crowd",
      "alt.foto": "Photo of Miyen DJ",

      "series.music": "Over the years, with the breadth of my sound and my musical tastes, rooted in rock, funk, reggae & blues, I have developed a wide and also critical ear, which I have instilled in my sessions. Learning not to be pigeonholed into a single genre is what defines me. I am a great lover of this whole wonderful tree called ELECTRONIC MUSIC, from chill out with very low BPM, soft percussion and predominantly ambient sounds, to the most violent, hybrid and dark psytrance. I unfold across that whole range, and I respect all genres. My music library —within Apple Music, Rekordbox or Engine DJ— is open to every kind of event within the range of electronic DJing. Of course, some genres I like more, others less, but I always listen to them and decide based on that. Every genre leaves us a lesson and is applicable in a given moment or context. I am going to guide you through my music and my musical preferences, called \"MY SERIES\".",
      "latest.titulo": "LATEST SET",
      "latest.etiqueta": "Latest Set",
      "series.deep": "70% Deep House, 10% Minimal Groove, finishing with 20% soft, upbeat and danceable Progressive House. Average BPM range (119-124).",
      "series.roller": "100% Progressive House. A pure series, an exclusive breed within progressive: sets that, whenever possible, do not exceed 1 hour, and I try to use music released within the last 3 months. Starting with soft grooves to take it to an intense stage, with dark atmospheres, plenty of groove and futuristic sounds within the genre. Average BPM range (121-123).",
      "series.casa": "40% House, 40% Groove & Deep Minimal, 20% Afro House. My most \"cheerful\" side: sets I preferably like to play during the day or at clubs and events specific to house, with moments of pure entertainment and fun, made up of very diverse tracks, lots of vocals, trumpet, instrumentals, flowing according to the mood of the dancefloor. The most variable of all my series, where I am free to mix and move through unexpected and less usual places. Average BPM range (124-130).",
      "series.etnias": "Born from my time in the mythical TULUM, it is an absolutely introspective, personal and uplifting series. 100% Downtempo, Afro-Organic House. I always say, \"ETNIAS is not a set for dancing, it is a set for feeling, for listening and connecting with the natural environment, it is a journey of ancestral cultures and magic\" (which has intrigued me since I was a child). Average BPM range (110-118).",
      "series.xibalba": "Last but not least, Techno arrives. 80% Techno-Melodic, 20% Progressive Hybrid-Organic. Just as ETNIAS takes us down a more spiritual path, XIBALBA takes us down a more underground and darker one, without leaving aside very organic tracks that connect with the natural environment, but from the techno-progressive spectrum. Xibalba (for the Mayans) was the passage to the 'underworld' where the soul rose to the world of the gods after death. That is what I try to convey in every session: dark, fearsome moments —like the fear of that instant of meeting death— as well as post-mortem liberation and healing. Average BPM range (124-130).",
      "card.bombinhas": "Bombinhas · Brazil",
      "card.cenote": "Cenote Edition · Mexico",
      "card.rock": "Argentine Rock Remixes",
      "card.otros": "Other Sets",

      "links.titulo": "DIRECT LINKS &amp; SOCIAL",
      "links.sub": "Connect to listen to more sets and releases",

      "rider.titulo": "TECHNICAL RIDER, CACHÉT &amp; HOSPITALITY",
      "rider.alt": "Technical rider: 2 Pioneer DJ CDJ-3000X and Pioneer DJ DJM-V10 mixer",

      // Texto del cliente, tal cual lo entregó (no cambiar sin avisarle)
      "cachet.titulo": "CACHÉT &amp; HOSPITALITY",
      "cachet.sub": "Booking Conditions · Technical &amp; Hospitality Rider",
      "cachet.fee.t": "Performance Fee",
      "cachet.fee.p": "Each booking is quoted individually according to the event format, performance duration, location, production scale and booking requirements. Rates are adapted to the local market, with an international reference fee for bookings abroad.",
      "cachet.travel.t": "Travel &amp; Accommodation",
      "cachet.travel.p": "For bookings outside the artist’s city of residence, transportation, accommodation and local transfers are to be covered by the promoter, unless otherwise agreed in advance.",
      "cachet.tech.t": "Technical Requirements",
      "cachet.tech.p": "Professional DJ equipment compatible with the artist’s setup, a high-quality sound system and suitable booth conditions are required. The full technical rider is available upon request.",
      "cachet.hosp.t": "Hospitality",
      "cachet.hosp.p": "Hospitality requirements, guest list allocation and any additional arrangements will be agreed upon with the promoter prior to the event.",
      "cachet.terms.t": "Booking Terms &amp; Confirmation",
      "cachet.terms.p1": "Once the performance terms have been agreed upon, the booking must be confirmed in writing, specifying the event date, performance time, set duration, agreed fee, payment terms and cancellation or rescheduling policies.",
      "cachet.terms.p2": "To secure the date, the booking must be arranged in advance and in accordance with the agreed terms, including the required deposit. The date will be considered confirmed once the agreed booking requirements have been fulfilled.",
      "cachet.inq.t": "Booking Inquiries",
      "cachet.inq.p": "For availability, rates and booking proposals, please contact the artist directly. Each proposal will be assessed according to the event’s specific requirements.",

      "footer.desc": "Tech House &amp; Minimal Deep aesthetic. Atmospheric grooves, dynamic sets and deep sonic experiences to connect minds in motion.",
      "footer.credito": "© 2026 M I Y E N · Designed by Plexiweb Development",
      "footer.secciones": "Sections",
      "footer.inicio": "Home",
      "footer.booking": "Booking &amp; Hiring"
    },

    pt: {
      "meta.title": "M I Y E N | DJ & Produtor",
      "meta.description": "M I Y E N - DJ / Produtor de Tech House & Minimal Deep | Sets, Vídeos e Música",

      "nav.rider": "RIDER TÉCNICO",
      "aria.menu": "Abrir menu",
      "aria.idioma": "Idioma",
      "alt.logo": "Logo do MIYEN",
      "hero.foto": "Miyen, DJ e produtor",

      "bio.titulo": "BIO & INFORMAÇÕES PESSOAIS",
      "bio.texto": "Nascido em Villa Carlos Paz, Córdoba, Argentina. Atualmente morando no Brasil (Rio de Janeiro). Criando sets atmosféricos, grooves orgânicos, intensos e progressivos para conectar mentes na pista de dança.",
      "bio.alt": "Miyen mixando ao vivo",
      "bio.ampliar": "AMPLIAR",
      "bio.ampliarAria": "Ampliar imagem",
      "bio.cerrarAria": "Restaurar imagem",
      "alt.publico": "Público de música eletrônica",
      "alt.foto": "Foto de Miyen DJ",

      "series.music": "Ao longo dos anos, e com a ampla particularidade do meu som e dos meus gostos musicais, originários do rock, funk, reggae & blues, desenvolvi um ouvido amplo, e também crítico, e isso eu incorporei às minhas sessions. Aprender a não me limitar a um único gênero é o que me caracteriza; sou um grande apaixonado por toda essa maravilhosa árvore chamada MÚSICA ELETRÔNICA, desde o chill out com BPM bem baixo, percussões suaves e sons ambientes predominantes, até o psytrance mais violento, híbrido e sombrio. Dentro de toda essa gama eu me desenvolvo, e respeito todos os gêneros. Minha biblioteca musical —dentro do Apple Music, Rekordbox ou Engine DJ— está aberta a todo tipo de evento dentro da gama do DJing eletrônico; claro, alguns gêneros me agradam mais, outros menos, mas sempre os escuto e, com base nisso, decido. Cada gênero nos deixa um aprendizado e é aplicável em um momento ou contexto determinado. Vou guiá-los dentro da minha música e das minhas preferências musicais, chamadas \"MINHAS SÉRIES\".",
      "latest.titulo": "SET MAIS RECENTE",
      "latest.etiqueta": "Último Set",
      "series.deep": "70% Deep House, 10% Minimal Groove, finalizando com 20% de Progressive House suave, alegre e dançante. Faixa média de BPM (119-124).",
      "series.roller": "100% Progressive House. É uma série pura, de raça exclusiva dentro do progressive: sets que, na medida do possível, não passam de 1 hora, e procuro usar músicas lançadas nos últimos 3 meses. Começando com grooves suaves para levar a um cenário intenso, com ambientes escuros, muito groove e sons futuristas dentro do gênero. Faixa média de BPM (121-123).",
      "series.casa": "40% House, 40% Groove & Deep Minimal, 20% Afro House. Meu lado mais \"alegre\": são sets que, de preferência, gosto de tocar de dia ou em clubes e eventos específicos de house, com momentos de entretenimento e diversão total, compostos de tracks bem diversas, muito vocal, trompete, instrumentais, fluindo de acordo com o mood da pista. A mais variável de todas as minhas séries, na qual tenho liberdade para misturar e transitar por lugares inesperados e nem tão habituais. Faixa média de BPM (124-130).",
      "series.etnias": "Nascida da minha passagem pela mítica TULUM, é uma série absolutamente introspectiva, pessoal e que faz voar. 100% Downtempo, Afro-Organic House. Sempre digo: \"ETNIAS não é um set para dançar, é um set para sentir, para escutar e se conectar com o ambiente natural, é uma viagem de culturas e magias ancestrais\" (que desde pequeno me intriga). Faixa média de BPM (110-118).",
      "series.xibalba": "Por último, mas não menos importante, chega o Techno. 80% Techno-Melodic, 20% Progressive Hybrid-Organic. É uma série que, assim como ETNIAS nos leva por um caminho mais espiritual, XIBALBA nos leva por um caminho mais underground e mais sombrio, sem deixar de lado tracks muito orgânicas que se conectam com o ambiente natural, mas a partir do espectro techno-progressive. Xibalba (para os maias) era a passagem para o 'submundo', onde a alma se elevava ao mundo dos deuses depois da morte. É isso que tento transmitir em cada session: momentos sombrios, temíveis —como o temor desse instante no encontro com a morte— assim como a libertação e a cura pós-morte. Faixa média de BPM (124-130).",
      "card.bombinhas": "Bombinhas · Brasil",
      "card.cenote": "Cenote Edition · México",
      "card.rock": "Remixes de Rock Argentino",
      "card.otros": "Outros Sets",

      "links.titulo": "LINKS DIRETOS &amp; SOCIAL",
      "links.sub": "Conecte-se para ouvir mais sets e lançamentos",

      "rider.titulo": "RIDER TÉCNICO, CACHÊ &amp; HOSPITALITY",
      "rider.alt": "Rider técnico: 2 Pioneer DJ CDJ-3000X e mixer Pioneer DJ DJM-V10",

      // Tradução ao português do texto do cliente: pendente de revisão por ele
      "cachet.titulo": "CACHÊ E HOSPITALITY",
      "cachet.sub": "Condições de contratação · Rider técnico e de hospitalidade",
      "cachet.fee.t": "Cachê da apresentação",
      "cachet.fee.p": "Cada contratação é cotada individualmente de acordo com o formato do evento, a duração da apresentação, o local, a escala da produção e os requisitos da contratação. Os valores são adaptados ao mercado local, com um cachê de referência internacional para apresentações no exterior.",
      "cachet.travel.t": "Viagem e hospedagem",
      "cachet.travel.p": "Para apresentações fora da cidade de residência do artista, o transporte, a hospedagem e os traslados locais ficam a cargo do promotor, salvo acordo prévio em contrário.",
      "cachet.tech.t": "Requisitos técnicos",
      "cachet.tech.p": "São necessários equipamentos de DJ profissionais compatíveis com o setup do artista, um sistema de som de alta qualidade e condições adequadas de cabine. O rider técnico completo está disponível mediante solicitação.",
      "cachet.hosp.t": "Hospitalidade",
      "cachet.hosp.p": "Os requisitos de hospitalidade, a cota de lista de convidados e quaisquer outros acordos adicionais serão combinados com o promotor antes do evento.",
      "cachet.terms.t": "Condições e confirmação da contratação",
      "cachet.terms.p1": "Depois de acordadas as condições da apresentação, a contratação deve ser confirmada por escrito, especificando a data do evento, o horário da apresentação, a duração do set, o cachê acordado, as condições de pagamento e as políticas de cancelamento ou reagendamento.",
      "cachet.terms.p2": "Para garantir a data, a contratação deve ser feita com antecedência e de acordo com as condições acordadas, incluindo o depósito exigido. A data será considerada confirmada assim que os requisitos de contratação acordados forem cumpridos.",
      "cachet.inq.t": "Consultas de contratação",
      "cachet.inq.p": "Para consultar disponibilidade, valores e propostas de contratação, entre em contato diretamente com o artista. Cada proposta será avaliada de acordo com os requisitos específicos do evento.",

      "footer.desc": "Estética Tech House &amp; Minimal Deep. Grooves atmosféricos, sets dinâmicos e experiências sonoras profundas para conectar mentes em movimento.",
      "footer.credito": "© 2026 M I Y E N · Desenvolvido por Plexiweb Development",
      "footer.secciones": "Seções",
      "footer.inicio": "Início",
      "footer.booking": "Booking &amp; Contratação"
    }
  };

  const $$ = function (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); };

  let lang = BASE;
  let source = new Map();
  let originalTitle = "";
  let originalDescription = "";
  let metaDesc = null;

  // t("clave"): texto en el idioma actual; si falta, cae al español
  const t = function (key) {
    return (DICT[lang] && DICT[lang][key]) || (DICT[BASE] && DICT[BASE][key]) || key;
  };

  // ---- Copia del español original, antes de tocar el DOM ----
  const snapshot = function () {
    source = new Map();
    $$("[data-i18n], [data-i18n-attr]").forEach(function (el) {
      const entry = { html: null, attrs: [] };
      if (el.dataset.i18n) entry.html = el.innerHTML;
      (el.dataset.i18nAttr || "").split(";").filter(Boolean).forEach(function (pair) {
        const i = pair.indexOf(":");
        entry.attrs.push({ attr: pair.slice(0, i).trim(), key: pair.slice(i + 1).trim(), value: el.getAttribute(pair.slice(0, i).trim()) });
      });
      source.set(el, entry);
    });
    metaDesc = document.querySelector('meta[name="description"]');
    originalTitle = document.title;
    originalDescription = metaDesc ? metaDesc.content : "";
  };

  // Imagen de la bio según el idioma (con respaldo al español si el archivo no existe)
  const bioImage = function () {
    const img = document.getElementById("mi-imagen");
    if (!img) return;
    const want = BIO_IMG[lang] || BIO_IMG[BASE];
    const set = function (src) { if (img.getAttribute("src") !== src) img.src = src; };
    if (want === BIO_IMG[BASE]) { set(want); return; }
    const probe = new Image();
    probe.onload = function () { if (BIO_IMG[lang] === want) set(want); };
    probe.onerror = function () { if (BIO_IMG[lang] === want) set(BIO_IMG[BASE]); };
    probe.src = want;
  };

  const apply = function () {
    const isBase = lang === BASE;
    const pick = function (key, original) { return isBase ? original : ((DICT[lang] && DICT[lang][key]) || original); };

    source.forEach(function (entry, el) {
      if (entry.html !== null) el.innerHTML = pick(el.dataset.i18n, entry.html);
      entry.attrs.forEach(function (a) { el.setAttribute(a.attr, pick(a.key, a.value)); });
    });
    document.title = pick("meta.title", originalTitle);
    if (metaDesc) metaDesc.content = pick("meta.description", originalDescription);
    document.documentElement.lang = lang;

    $$("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });
    // el selector desplegable de la barra muestra el idioma activo (ES / EN / PT)
    $$("[data-lang-actual]").forEach(function (el) { el.textContent = lang.toUpperCase(); });
    bioImage();
  };

  const setLang = function (next, opts) {
    if (!LANGS.includes(next) || next === lang) return;
    lang = next;
    apply();
    if (!opts || opts.persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* modo privado */ }
    }
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: lang } }));
  };

  // Idioma inicial: elección guardada → idioma del navegador → inglés
  const initial = function () {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (LANGS.includes(saved)) return saved;
    } catch (_) { /* sin almacenamiento */ }
    const preferred = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]) || [];
    const match = preferred.map(function (l) { return String(l).toLowerCase().slice(0, 2); }).find(function (l) { return LANGS.includes(l); });
    return match || FALLBACK;
  };

  const init = function () {
    snapshot();
    $$("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () { setLang(btn.dataset.lang); });
    });
    // Siempre se aplica una vez (marca el botón activo, la imagen de la bio y <html lang>), también si el idioma es el base
    lang = initial();
    apply();
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: lang } }));
  };

  window.I18N = { t: t, setLang: setLang, get lang() { return lang; }, DICT: DICT, LANGS: LANGS };

  // main.js (cargado antes) crea las imágenes del carrusel en su DOMContentLoaded: este arranque va DESPUÉS.
  // Ojo: un script "defer" corre con readyState "interactive" (antes de DOMContentLoaded), por eso no alcanza
  // con preguntar si ya terminó de cargar: se espera siempre al evento, y "load" queda de respaldo.
  let iniciado = false;
  const arrancar = function () { if (iniciado) return; iniciado = true; init(); };
  if (document.readyState === "complete") arrancar();
  else { document.addEventListener("DOMContentLoaded", arrancar); window.addEventListener("load", arrancar); }
})();
