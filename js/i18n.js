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

      "series.more": "Read more",
      "series.less": "Show less",
      "series.music.a": "Over the years, with the breadth of my sound and my musical tastes, rooted in rock, funk, reggae & blues, I have developed a wide and also critical ear, which I have instilled in my sessions.",
      "series.music.b": "Learning not to be pigeonholed into a single genre is what defines me. I am a great lover of this whole wonderful tree called ELECTRONIC MUSIC, from chill out with very low BPM, soft percussion and predominantly ambient sounds, to the most violent, hybrid and dark psytrance. I unfold across that whole range, and I respect all genres. My music library —within Apple Music, Rekordbox or Engine DJ— is open to every kind of event within the range of electronic DJing. Of course, some genres I like more, others less, but I always listen to them and decide based on that. Every genre leaves us a lesson and is applicable in a given moment or context. I am going to guide you through my music and my musical preferences, called \"MY SERIES\".",
      "latest.titulo": "LATEST SET",
      "latest.etiqueta": "Latest Set",
      "series.deep.a": "70% Deep House, 10% Minimal Groove, finishing with 20% soft, upbeat and danceable Progressive House.",
      "series.deep.b": "Average BPM range (119-124).",
      "series.roller.a": "100% Progressive House.",
      "series.roller.b": "A pure series, an exclusive breed within progressive: sets that, whenever possible, do not exceed 1 hour, and I try to use music released within the last 3 months. Starting with soft grooves to take it to an intense stage, with dark atmospheres, plenty of groove and futuristic sounds within the genre. Average BPM range (121-123).",
      "series.casa.a": "40% House, 40% Groove & Deep Minimal, 20% Afro House.",
      "series.casa.b": "My most \"cheerful\" side: sets I preferably like to play during the day or at clubs and events specific to house, with moments of pure entertainment and fun, made up of very diverse tracks, lots of vocals, trumpet, instrumentals, flowing according to the mood of the dancefloor. The most variable of all my series, where I am free to mix and move through unexpected and less usual places. Average BPM range (124-130).",
      "series.etnias.a": "Born from my time in the mythical TULUM, it is an absolutely introspective, personal and uplifting series.",
      "series.etnias.b": "100% Downtempo, Afro-Organic House. I always say, \"ETNIAS is not a set for dancing, it is a set for feeling, for listening and connecting with the natural environment, it is a journey of ancestral cultures and magic\" (which has intrigued me since I was a child). Average BPM range (110-118).",
      "series.xibalba.a": "Last but not least, Techno arrives.",
      "series.xibalba.b": "80% Techno-Melodic, 20% Progressive Hybrid-Organic. Just as ETNIAS takes us down a more spiritual path, XIBALBA takes us down a more underground and darker one, without leaving aside very organic tracks that connect with the natural environment, but from the techno-progressive spectrum. Xibalba (for the Mayans) was the passage to the 'underworld' where the soul rose to the world of the gods after death. That is what I try to convey in every session: dark, fearsome moments —like the fear of that instant of meeting death— as well as post-mortem liberation and healing. Average BPM range (124-130).",
      "card.bombinhas": "Bombinhas · Brazil",
      "card.cenote": "Cenote Edition · Mexico",
      "card.rock": "Argentine Rock Remixes",
      "card.otros": "Other Sets",

      "links.titulo": "DIRECT LINKS &amp; SOCIAL",
      "links.sub": "Connect to listen to more sets and releases",

      "rider.titulo": "TECHNICAL RIDER, CACHÉT &amp; HOSPITALITY",
      "rider.alt": "Technical rider: 2 Pioneer DJ CDJ-3000X and Pioneer DJ DJM-V10 mixer",

      "rider.spec.titulo": "TECHNICAL RIDER",
      "rider.spec.sub": "DJ Equipment · Monitoring · Booth Requirements",
      "rider.spec.s1.t": "01. Preferred Setup",
      "rider.spec.s1.p1": "Players: 2 × AlphaTheta CDJ-3000X or Pioneer CDJ-3000.",
      "rider.spec.s1.p2": "Mixer: 1 × Pioneer DJM-V10 or DJM-A9.",
      "rider.spec.s2.t": "02. Compatible Alternative Equipment",
      "rider.spec.s2.players": "Players",
      "rider.spec.s2.mixers": "Mixers",
      "rider.spec.s2.p": "Alternative setups are subject to availability, technical compatibility and the artist’s prior approval.",
      "rider.spec.s2.note": "* Note: the Pioneer CDJ-1000MK2 does not offer the same USB workflow as modern players.",
      "rider.spec.s3.t": "03. Monitoring",
      "rider.spec.s3.p1": "A professional booth monitoring system is required, with clear sound reproduction, sufficient power headroom and volume control independent from the main sound system.",
      "rider.spec.s3.p2": "Monitoring specifications must be coordinated in advance with the event’s technical team.",
      "rider.spec.s4.t": "04. Booth Requirements",
      "rider.spec.s4.l1": "A stable, secure booth with enough space for the equipment.",
      "rider.spec.s4.l2": "Audio and power connections in good condition.",
      "rider.spec.s4.l3": "Booth monitors correctly positioned.",
      "rider.spec.s4.l4": "Equipment installed, connected and tested before the performance starts.",
      "rider.spec.s5.t": "05. Technical Confirmation",
      "rider.spec.s5.p1": "The organizer or technical manager must confirm with the artist, before the event, the available equipment models and the final booth setup.",
      "rider.spec.s5.p2": "Any change from the preferred setup must be communicated and approved in advance.",


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
      "rates.btn": "Regional rates",
      "rates.hint": "Indicative rate card: varies with each proposal.",
      "rates.close": "Close",
      "rates.title": "Reference rates for sets of up to 180 minutes",
      "rates.th.market": "Market",
      "rates.th.club": "Club / electronic party",
      "rates.th.fest": "Festival / large-scale event",
      "rates.ar": "🇦🇷 Argentina",
      "rates.br": "🇧🇷 Brazil",
      "rates.mx": "🇲🇽 Mexico",
      "rates.int": "🌎 International reference",
      "rates.note": "Indicative amounts proposed for 180-minute sets, subject to review according to city, demand and the organizer’s budget. They do not include travel, accommodation, technical production or taxes. Local figures are not exact currency conversions of the USD ranges.",
      "rates.th.concept": "Concept",
      "rates.th.cond": "Recommended condition",
      "rates.std.t": "Standard set",
      "rates.std.c": "Up to 180 minutes",
      "rates.ext.t": "Set extension",
      "rates.ext.c": "20–30% surcharge for every additional 30 minutes",
      "rates.big.t": "Festival with more than 1,000 attendees",
      "rates.big.c": "Special quote according to production and budget",
      "rates.trav.t": "Transport and accommodation",
      "rates.trav.c": "Covered by the organizer where applicable",
      "rates.out.t": "Date outside your city",
      "rates.out.c": "Cachet plus travel expenses",
      "rates.two.t": "Second performance on the same day",
      "rates.two.c": "Special quote",
      "rates.res.t": "Date reservation",
      "rates.res.c": "30–50% deposit, as agreed",
      "rates.can.t": "Cancellation",
      "rates.can.c": "Conditions defined in writing",
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

      "series.more": "Conhecer mais",
      "series.less": "Ver menos",
      "series.music.a": "Ao longo dos anos, e com a ampla particularidade do meu som e dos meus gostos musicais, originários do rock, funk, reggae & blues, desenvolvi um ouvido amplo, e também crítico, e isso eu incorporei às minhas sessions.",
      "series.music.b": "Aprender a não me limitar a um único gênero é o que me caracteriza; sou um grande apaixonado por toda essa maravilhosa árvore chamada MÚSICA ELETRÔNICA, desde o chill out com BPM bem baixo, percussões suaves e sons ambientes predominantes, até o psytrance mais violento, híbrido e sombrio. Dentro de toda essa gama eu me desenvolvo, e respeito todos os gêneros. Minha biblioteca musical —dentro do Apple Music, Rekordbox ou Engine DJ— está aberta a todo tipo de evento dentro da gama do DJing eletrônico; claro, alguns gêneros me agradam mais, outros menos, mas sempre os escuto e, com base nisso, decido. Cada gênero nos deixa um aprendizado e é aplicável em um momento ou contexto determinado. Vou guiá-los dentro da minha música e das minhas preferências musicais, chamadas \"MINHAS SÉRIES\".",
      "latest.titulo": "SET MAIS RECENTE",
      "latest.etiqueta": "Último Set",
      "series.deep.a": "70% Deep House, 10% Minimal Groove, finalizando com 20% de Progressive House suave, alegre e dançante.",
      "series.deep.b": "Faixa média de BPM (119-124).",
      "series.roller.a": "100% Progressive House.",
      "series.roller.b": "É uma série pura, de raça exclusiva dentro do progressive: sets que, na medida do possível, não passam de 1 hora, e procuro usar músicas lançadas nos últimos 3 meses. Começando com grooves suaves para levar a um cenário intenso, com ambientes escuros, muito groove e sons futuristas dentro do gênero. Faixa média de BPM (121-123).",
      "series.casa.a": "40% House, 40% Groove & Deep Minimal, 20% Afro House.",
      "series.casa.b": "Meu lado mais \"alegre\": são sets que, de preferência, gosto de tocar de dia ou em clubes e eventos específicos de house, com momentos de entretenimento e diversão total, compostos de tracks bem diversas, muito vocal, trompete, instrumentais, fluindo de acordo com o mood da pista. A mais variável de todas as minhas séries, na qual tenho liberdade para misturar e transitar por lugares inesperados e nem tão habituais. Faixa média de BPM (124-130).",
      "series.etnias.a": "Nascida da minha passagem pela mítica TULUM, é uma série absolutamente introspectiva, pessoal e que faz voar.",
      "series.etnias.b": "100% Downtempo, Afro-Organic House. Sempre digo: \"ETNIAS não é um set para dançar, é um set para sentir, para escutar e se conectar com o ambiente natural, é uma viagem de culturas e magias ancestrais\" (que desde pequeno me intriga). Faixa média de BPM (110-118).",
      "series.xibalba.a": "Por último, mas não menos importante, chega o Techno.",
      "series.xibalba.b": "80% Techno-Melodic, 20% Progressive Hybrid-Organic. É uma série que, assim como ETNIAS nos leva por um caminho mais espiritual, XIBALBA nos leva por um caminho mais underground e mais sombrio, sem deixar de lado tracks muito orgânicas que se conectam com o ambiente natural, mas a partir do espectro techno-progressive. Xibalba (para os maias) era a passagem para o 'submundo', onde a alma se elevava ao mundo dos deuses depois da morte. É isso que tento transmitir em cada session: momentos sombrios, temíveis —como o temor desse instante no encontro com a morte— assim como a libertação e a cura pós-morte. Faixa média de BPM (124-130).",
      "card.bombinhas": "Bombinhas · Brasil",
      "card.cenote": "Cenote Edition · México",
      "card.rock": "Remixes de Rock Argentino",
      "card.otros": "Outros Sets",

      "links.titulo": "LINKS DIRETOS &amp; SOCIAL",
      "links.sub": "Conecte-se para ouvir mais sets e lançamentos",

      "rider.titulo": "RIDER TÉCNICO, CACHÊ &amp; HOSPITALITY",
      "rider.alt": "Rider técnico: 2 Pioneer DJ CDJ-3000X e mixer Pioneer DJ DJM-V10",

      "rider.spec.titulo": "RIDER TÉCNICO",
      "rider.spec.sub": "Equipamento DJ · Monitoramento · Requisitos de cabine",
      "rider.spec.s1.t": "01. Configuração preferida",
      "rider.spec.s1.p1": "Players: 2 × AlphaTheta CDJ-3000X ou Pioneer CDJ-3000.",
      "rider.spec.s1.p2": "Mixer: 1 × Pioneer DJM-V10 ou DJM-A9.",
      "rider.spec.s2.t": "02. Equipamento alternativo compatível",
      "rider.spec.s2.players": "Players",
      "rider.spec.s2.mixers": "Mixers",
      "rider.spec.s2.p": "As configurações alternativas estarão sujeitas à disponibilidade, compatibilidade técnica e aprovação prévia do artista.",
      "rider.spec.s2.note": "* Nota: o Pioneer CDJ-1000MK2 não oferece o mesmo fluxo de trabalho USB que os players modernos.",
      "rider.spec.s3.t": "03. Monitoramento",
      "rider.spec.s3.p1": "É necessário um sistema de monitoramento profissional para a cabine, com reprodução clara, margem de potência suficiente e controle de volume independente do sistema principal de som.",
      "rider.spec.s3.p2": "As especificações de monitoramento deverão ser coordenadas previamente com a equipe técnica do evento.",
      "rider.spec.s4.t": "04. Requisitos de cabine",
      "rider.spec.s4.l1": "Cabine estável, segura e com espaço suficiente para o equipamento.",
      "rider.spec.s4.l2": "Conexões de áudio e alimentação em boas condições.",
      "rider.spec.s4.l3": "Monitores de cabine corretamente posicionados.",
      "rider.spec.s4.l4": "Equipamento instalado, conectado e testado antes do início da apresentação.",
      "rider.spec.s5.t": "05. Confirmação técnica",
      "rider.spec.s5.p1": "O organizador ou responsável técnico deverá confirmar com o artista, antes do evento, os modelos de equipamentos disponíveis e a configuração definitiva da cabine.",
      "rider.spec.s5.p2": "Qualquer modificação em relação à configuração preferida deverá ser comunicada e aprovada previamente.",


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
      "rates.btn": "Tabela regional",
      "rates.hint": "Tabela indicativa: varia conforme cada proposta.",
      "rates.close": "Fechar",
      "rates.title": "Tabela de referência para sets de até 180 minutos",
      "rates.th.market": "Mercado",
      "rates.th.club": "Clube / festa eletrônica",
      "rates.th.fest": "Festival / evento de grande porte",
      "rates.ar": "🇦🇷 Argentina",
      "rates.br": "🇧🇷 Brasil",
      "rates.mx": "🇲🇽 México",
      "rates.int": "🌎 Referência internacional",
      "rates.note": "Valores indicativos propostos para sets de 180 minutos, a serem revisados conforme cidade, demanda e orçamento do organizador. Não incluem viagens, hospedagem, produção técnica nem impostos. Os valores locais não são conversões cambiais exatas das faixas em USD.",
      "rates.th.concept": "Conceito",
      "rates.th.cond": "Condição recomendada",
      "rates.std.t": "Set padrão",
      "rates.std.c": "Até 180 minutos",
      "rates.ext.t": "Extensão do set",
      "rates.ext.c": "Acréscimo de 20–30% a cada 30 minutos adicionais",
      "rates.big.t": "Festival com mais de 1.000 participantes",
      "rates.big.c": "Cotação especial conforme produção e orçamento",
      "rates.trav.t": "Transporte e hospedagem",
      "rates.trav.c": "A cargo do organizador, quando aplicável",
      "rates.out.t": "Data fora da sua cidade",
      "rates.out.c": "Cachê mais despesas de deslocamento",
      "rates.two.t": "Segunda apresentação no mesmo dia",
      "rates.two.c": "Orçamento especial",
      "rates.res.t": "Reserva de data",
      "rates.res.c": "Sinal de 30–50%, conforme acordo",
      "rates.can.t": "Cancelamento",
      "rates.can.c": "Condições definidas por escrito",
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
