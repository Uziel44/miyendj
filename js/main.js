// ==========================================================================
// CONFIGURACIÓN DE TAILWIND CSS
// ==========================================================================
tailwind.config = {
    theme: {
        extend: {
            colors: {
                clubBlack: '#000000', // Negro del hero: fondo de toda la web, header y footer
                neonBlue: '#3B82F6', // Azul brillante para resaltar
                neonSky: '#0EA5E9', // Celeste brillante para acentos enérgicos
                glassBg: 'rgba(40, 44, 50, 0.72)', // Gris medio traslúcido para tarjetas de vidrio (glassmorphism)
                glassBorder: 'rgba(255, 255, 255, 0.12)' // Borde gris claro sutil para el vidrio
            },
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                display: ['Inter', 'sans-serif']
            }
        }
    }
};

// ==========================================================================
// ZOOM DE IMAGEN BIO (ampliar / restaurar)
// La imagen en sí (BIO ESPANOL / BIO ENGLISH / BIO PORTUGUES) la elige js/i18n.js según el idioma.
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const imagen = document.getElementById('mi-imagen');
    const botonAmpliar = document.getElementById('boton-bio-english');

    if (imagen && botonAmpliar) {
        // i18n.js se carga después de este archivo, así que se consulta recién al momento de usarlo
        const texto = (clave, respaldo) => (window.I18N ? window.I18N.t(clave) : respaldo);
        const etiqueta = () => (imagen.classList.contains('zoom')
            ? texto('bio.cerrarAria', 'Restaurar imagen')
            : texto('bio.ampliarAria', 'Ampliar imagen'));

        const ampliar = (activar) => {
            imagen.classList.toggle('zoom', activar);
            imagen.setAttribute('aria-label', etiqueta());
        };

        botonAmpliar.addEventListener('click', () => ampliar(!imagen.classList.contains('zoom')));
        imagen.addEventListener('click', () => {
            if (imagen.classList.contains('zoom')) {
                ampliar(false);
            }
        });
        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && imagen.classList.contains('zoom')) {
                ampliar(false);
            }
        });
        // Si cambia el idioma con la imagen ya tocada, la etiqueta accesible sigue el idioma
        document.addEventListener('i18n:change', () => {
            if (imagen.hasAttribute('aria-label')) imagen.setAttribute('aria-label', etiqueta());
        });
    }

    // ==========================================================================
    // MENÚ MÓVIL
    // ==========================================================================
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // El header es transparente sobre el hero; con el menú abierto o al bajar toma fondo para que se lea
    const cabecera = document.querySelector('.site-header');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.toggle('hidden');
            menuButton.setAttribute('aria-expanded', String(isOpen));
            if (cabecera) cabecera.classList.toggle('menu-abierto', isOpen);
        });

        // Cerrar menú móvil al hacer clic en cualquier enlace
        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuButton.setAttribute('aria-expanded', 'false');
                if (cabecera) cabecera.classList.remove('menu-abierto');
            });
        });
    }

    if (cabecera) {
        const actualizarCabecera = () => cabecera.classList.toggle('is-scrolled', window.scrollY > 24);
        window.addEventListener('scroll', actualizarCabecera, { passive: true });
        actualizarCabecera();
    }

    // ==========================================================================
    // INTERACTIVIDAD DE SERIES (mostrar/ocultar texto)
    // ==========================================================================
    document.querySelectorAll('.series-title').forEach((title) => {
        title.addEventListener('click', () => {
            const textElement = title.closest('.text-center').querySelector('.series-text');
            if (textElement) {
                textElement.classList.toggle('hidden');
            }
        });
    });

    // ==========================================================================
    // REPRODUCTOR ÚNICO (cuando uno suena, los demás se pausan)
    // Cada reproductor (YouTube o SoundCloud) se registra con { pausar() }.
    // Si las APIs externas no cargan (ej. bloqueador de anuncios), la página
    // sigue funcionando igual, solo que sin esta exclusividad.
    // ==========================================================================
    const reproductores = new Set();

    const pausarOtros = (actual) => {
        reproductores.forEach((reproductor) => {
            if (reproductor !== actual) reproductor.pausar();
        });
    };

    // La API de YouTube se descarga una sola vez, en el primer click en una miniatura
    let promesaApiYouTube = null;
    const cargarApiYouTube = () => {
        if (!promesaApiYouTube) {
            promesaApiYouTube = new Promise((resolve) => {
                if (window.YT && window.YT.Player) {
                    resolve(window.YT);
                    return;
                }
                window.onYouTubeIframeAPIReady = () => resolve(window.YT);
                const script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                script.onerror = () => resolve(null);
                document.head.appendChild(script);
            });
        }
        return promesaApiYouTube;
    };

    // SoundCloud: la API se descarga al cargar la página; el reproductor de cada tarjeta se crea al tocar play
    const promesaApiSoundCloud = new Promise((resolve) => {
        const scriptSoundCloud = document.createElement('script');
        scriptSoundCloud.src = 'https://w.soundcloud.com/player/api.js';
        scriptSoundCloud.onload = () => resolve(window.SC || null);
        scriptSoundCloud.onerror = () => resolve(null);
        document.head.appendChild(scriptSoundCloud);
    });

    // ==========================================================================
    // TARJETAS DE SOUNDCLOUD (portada instantánea, reproductor solo al hacer click)
    // Cargar 10 reproductores de SoundCloud al abrir la página era pesado y a veces quedaban en blanco.
    // ==========================================================================
    document.querySelectorAll('.soundcloud-facade').forEach((facade) => {
        const urlPista = facade.dataset.soundcloudUrl;
        const tituloPista = facade.dataset.soundcloudTitle || 'Set de SoundCloud';
        if (!urlPista) return;

        const boton = document.createElement('div');
        boton.className = 'youtube-facade-play';
        boton.innerHTML = '<i class="fa-solid fa-play"></i>';
        facade.appendChild(boton);

        facade.addEventListener('click', () => {
            // El set nuevo arranca solo (auto_play): se pausan los demás ya
            pausarOtros(null);

            const iframe = document.createElement('iframe');
            iframe.className = 'w-full h-full';
            iframe.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(urlPista)
                + '&auto_play=true&visual=true&hide_related=true&show_comments=false&show_teaser=false';
            iframe.title = tituloPista;
            iframe.setAttribute('scrolling', 'no');
            iframe.frameBorder = '0';
            iframe.allow = 'autoplay';

            const tarjeta = facade.closest('.video-card');
            if (tarjeta) tarjeta.classList.add('is-playing');
            facade.replaceWith(iframe);

            promesaApiSoundCloud.then((SC) => {
                if (!SC) return;
                const widget = SC.Widget(iframe);
                const reproductor = { pausar: () => widget.pause() };
                reproductores.add(reproductor);
                widget.bind(SC.Widget.Events.PLAY, () => pausarOtros(reproductor));
            });
        }, { once: true });
    });

    // ==========================================================================
    // FACADE DE VIDEOS DE YOUTUBE (miniatura instantánea, iframe solo al hacer click)
    // ==========================================================================
    document.querySelectorAll('.youtube-facade').forEach((facade) => {
        const videoId = facade.dataset.youtubeId;
        const videoTitle = facade.dataset.youtubeTitle || 'Video de YouTube';
        if (!videoId) return;

        facade.style.backgroundImage = `url('https://img.youtube.com/vi/${videoId}/hqdefault.jpg')`;

        // Versión HD sin barras negras, si el video la tiene (si no existe YouTube devuelve una imagen de 120 px: se descarta)
        const miniaturaHd = new Image();
        miniaturaHd.onload = () => {
            if (miniaturaHd.naturalWidth > 200) {
                facade.style.backgroundImage = `url('${miniaturaHd.src}')`;
                facade.style.backgroundSize = 'cover';
            }
        };
        miniaturaHd.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        const boton = document.createElement('div');
        boton.className = 'youtube-facade-play';
        boton.innerHTML = '<i class="fa-solid fa-play"></i>';
        facade.appendChild(boton);

        facade.addEventListener('click', () => {
            // El video nuevo arranca solo (autoplay): se pausan los demás ya, sin esperar a la API
            pausarOtros(null);

            const iframe = document.createElement('iframe');
            iframe.className = 'w-full h-full';
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
            iframe.title = videoTitle;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            // La barra de título y la insignia de la tarjeta se ocultan: taparían los controles del reproductor
            const tarjeta = facade.closest('.video-card');
            if (tarjeta) tarjeta.classList.add('is-playing');
            facade.replaceWith(iframe);

            cargarApiYouTube().then((YT) => {
                if (!YT) return;
                const reproductor = {
                    // pauseVideo recién existe cuando el reproductor terminó de cargar
                    pausar: () => {
                        if (typeof player.pauseVideo === 'function') player.pauseVideo();
                    }
                };
                const player = new YT.Player(iframe, {
                    events: {
                        onStateChange: (evento) => {
                            if (evento.data === YT.PlayerState.PLAYING) pausarOtros(reproductor);
                        }
                    }
                });
                reproductores.add(reproductor);
            });
        }, { once: true });
    });

    // ==========================================================================
    // CARRUSEL DE FOTOS EN 2 FILAS (movimiento automático en direcciones opuestas)
    // ==========================================================================
    const imagenesGaleria = [
        'img/IMG_1401.JPG', 'img/ROLLERCOASTER 003 - 13.jpg', 'img/IMG_1394.JPG',
        'img/IMG_6034_SnapseedCopy.jpg', 'img/30003D27-945F-4B32-9BB9-152691FBDF07.JPG',
        'img/MIYEN CHIODI.JPG', 'img/IMG_7065.JPG', 'img/Snapseed.jpeg',
        'img/IMG_1396.JPG', 'img/IMG_1406.JPG', 'img/IMG_0459.JPG', 'img/IMG_1403.JPG',
        'img/IMG_1068.jpg', 'img/IMG_0209.JPG', 'img/IMG_1393.JPG', 'img/AfterlightImage.JPG',
        'img/IMG_1400.JPG', 'img/IMG_1399.JPG',
        'img/1788919943542253-573f39ed-338a-40f4-8316-4d69dc0dd7ae_filtered.JPG',
        'img/IMG_3152.jpg', 'img/Snapseed.JPG', 'img/IMG_1402.JPG', 'img/IMG_1398.JPG',
        'img/IMG_1437.JPG', 'img/CASA HOUSE 02 video inicio (Tu historia).jpg',
        'img/a5d4aae3-dcc1-45fe-8c35-e9287fe98827__link-in-bio__image-block__home__5853578e-7ac3-4e03-a5d4-517d0434a81b__01b6f1a9-7ead-49aa-b63e-d5ec206d47a8.jpg',
        'img/D7F56935-A40C-4B2E-8C9E-8A412D5D03D6.JPG', 'img/photo-output.JPG',
        'img/IMG_3498.jpg', 'img/photo-output.JPEG', 'img/IMG_1055.JPG', 'img/IMG_1476.JPG',
        'img/IMG_3094.jpeg', 'img/IMG_1395.JPG', 'img/IMG_1405.JPG', 'img/Snapseed(1).jpeg',
        'img/66818297-4BD1-4213-BE30-64D68DC825A9.jpg'
    ];

    // Crea las imágenes dentro de un contenedor de marquee, duplicando la
    // lista para que la animación (-50%) encadene el loop sin salto visible
    const poblarPistaConImagenes = (contenedor, rutas) => {
        const rutasDuplicadas = [...rutas, ...rutas];
        rutasDuplicadas.forEach((ruta) => {
            const img = document.createElement('img');
            // Se codifica cada tramo: un nombre con "#" o "?" se leería como fragmento/consulta de la URL
            img.src = ruta.split('/').map(encodeURIComponent).join('/');
            img.alt = 'Foto de Miyen DJ';
            img.dataset.i18nAttr = 'alt:alt.foto'; // js/i18n.js traduce el alt
            img.loading = 'lazy';
            contenedor.appendChild(img);
        });
    };

    const filaUno = document.getElementById('marquee-fila-1');
    const filaDos = document.getElementById('marquee-fila-2');

    if (filaUno && filaDos) {
        const mitad = Math.ceil(imagenesGaleria.length / 2);
        poblarPistaConImagenes(filaUno, imagenesGaleria.slice(0, mitad));
        poblarPistaConImagenes(filaDos, imagenesGaleria.slice(mitad));
    }

    // ==========================================================================
    // 3 CARRUSELES VERTICALES (scroll automático en direcciones contrarias)
    // ==========================================================================
    const imagenesFlyers = [
        'flayers/IMG_4206.JPG', 'flayers/Sabado - 1.PNG', 'flayers/CARATULA DEEP ROOM SERIES - 75.PNG',
        'flayers/Deep Room 007.JPG', 'flayers/MIYEN CHIODI.JPG', 'flayers/3A2409EF-1106-43E2-A161-817F23A4D4BD.JPG',
        'flayers/ROLLERCOASTER LOGO.zip - 1.PNG', 'flayers/DEEP ROOM 008 - BOCETOS.zip - 1.JPG',
        'flayers/IMG_2971.JPG', 'flayers/IMG_4121.jpg', 'flayers/DEEP ROOM 008 - BOCETOS.zip - 7.JPG',
        'flayers/Coqueiros beach.09.02.png', 'flayers/IMG_3837.JPG', 'flayers/DEEP ROOM VOL #002 FOTO VIDEO 1.JPEG',
        'flayers/RAICES 001 - caratula.png.PNG', 'flayers/IMG_0862.jpeg',
        'flayers/DEEP ROOM VOL #003 - Mixed by Miyen Chiodi.PNG', 'flayers/Deep Room 007.PNG',
        'flayers/Sabado.PNG', 'flayers/ROLLERCOASTER LOGO - 21.PNG', 'flayers/CARATULA DEEP ROOM SERIES - 17.PNG',
        'flayers/ROLLERCOASTER 003 (Historia de Instagram) - 1.PNG', 'flayers/IMG_3584.JPG',
        'flayers/IMG_2611.png', 'flayers/1c363a6f-ff06-4d48-b792-7b784a01d86f.jpeg',
        'flayers/FLYERS disenos.JPG', 'flayers/Flyer Vagalume (Flyer (A4)) - 2.png',
        'flayers/35500e08-e021-4b01-97a6-5b9c582c41fa.JPG', 'flayers/Flyer Vagalume (Flyer (A4)) - 1.png',
        'flayers/905368a0-264d-4e4d-9334-25a3b74280cf__link-in-bio__image-block__home__5853578e-7ac3-4e03-a5d4-517d0434a81b__d189fb40-a136-466f-ad42-0ebfdbbf0c64.jpg',
        'flayers/IMG_6637.JPG', 'flayers/IMG_1109.png', 'flayers/CARATULA DEEP ROOM SERIES - 60.PNG',
        'flayers/CARATULA (ALTA CALIDAD).PNG',
        'flayers/41fc5007-ec8c-43e9-9411-772c4b6bc810__link-in-bio__image-block__home__5853578e-7ac3-4e03-a5d4-517d0434a81b__739b2b7c-c1dd-4973-ba11-76c9302c1a2b.jpg',
        'flayers/a3f9a498-b110-49dc-97bc-7bfb0792ac3f.JPG', 'flayers/IMG_3813.JPG',
        'flayers/ce658a24-c7a1-4e91-948d-e9eb47bb9e26__link-in-bio__image-block__home__27ee620b-352f-4bf6-9bc6-4f63b96234ea__430df955-fdd3-4622-8063-a1c74905e1e2.png',
        'flayers/9B1C2454-EFEA-445E-B429-24B3B7365A6B.jpeg', 'flayers/48034232-E0B9-4541-B9AC-01AAD6BA75F1.png',
        'flayers/E3706502-4FF3-4F6C-A3AE-CE96F89AD9DA.jpeg', 'flayers/FLYER SANTA ONDA CARNAVAL.png'
    ];

    const columnaUno = document.getElementById('marquee-col-1');
    const columnaDos = document.getElementById('marquee-col-2');
    const columnaTres = document.getElementById('marquee-col-3');

    if (columnaUno && columnaDos && columnaTres) {
        const tercio = Math.ceil(imagenesFlyers.length / 3);

        poblarPistaConImagenes(columnaUno, imagenesFlyers.slice(0, tercio));
        poblarPistaConImagenes(columnaDos, imagenesFlyers.slice(tercio, tercio * 2));
        poblarPistaConImagenes(columnaTres, imagenesFlyers.slice(tercio * 2));
    }
});
