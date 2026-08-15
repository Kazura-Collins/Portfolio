document.addEventListener('DOMContentLoaded', function() {
          // Configuración de los CV por idioma
const cvFiles = {
  'es': {
    pdfFilename: 'CV-Isaac-Montaño.pdf',
    pngFilename: 'CV-Isaac-Montaño.png', // Nuevo campo para la imagen
    viewUrl: 'https://acrobat.adobe.com/id/urn:aaid:sc:US:165cd96c-74ba-43a4-b9f7-a5e65f8151d1'
  },
  'en': {
    pdfFilename: 'CV-Isaac-Montano.pdf',
    pngFilename: 'CV-Isaac-Montano.png', // Nuevo campo para la imagen
    viewUrl: 'https://acrobat.adobe.com/id/urn:aaid:sc:US:071a822d-a679-4b67-8b33-7e8045b16e72'
  }
};
          
        // Funcionalidad para el botón de CV
        const openCVButton = document.getElementById('openCVButton');
        const modal = document.getElementById('cvModal');
        const closeButton = modal.querySelector('.close');
        const cvViewer = document.getElementById('cvViewer');
        const cvDownloadLink = document.getElementById('cvDownloadLink');
        const viewCVOnline = document.getElementById('viewCVOnline');

    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');

    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
      });
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', function(event) {
      const isClickInsideNav = nav.contains(event.target);
      const isClickOnMenuToggle = menuToggle.contains(event.target);
      
      if (!isClickInsideNav && !isClickOnMenuToggle && nav.classList.contains('active')) {
        nav.classList.remove('active');
      }
    });

    const projectsSection = document.getElementById('projects');
    const projectTitles = projectsSection.querySelectorAll('.project-title');
    const currentProjectTitle = projectsSection.querySelector('.current-project-title');
    const projectImage = projectsSection.querySelector('.image');
    const projectDescription = projectsSection.querySelector('.project-description');
    const behanceButton = projectsSection.querySelector('.behance-button');
    let currentIndex = 0;
    let isProjectAnimating = false;
    let pendingProjectUpdate = null;
    const projectTransitionMs = 450;
    const projectRevealMs = 700;

    const projects = [
      { 
        id: 'CloudTrack',
        image: 'assets/images/CloudTrack.png', 
        behanceUrl: 'https://www.behance.net/gallery/200259979/CloudTrack-GDO'
      },
      { 
        id: 'RitualOfMadness',
        image: 'assets/images/RitualofMadness.gif', 
        behanceUrl: 'https://www.behance.net/gallery/193558463/Ritual-of-madness-Card-Game'
      },
      { 
        id: 'EditorialDesign',
        image: 'assets/images/editorial.png', 
        behanceUrl: 'https://www.behance.net/gallery/140643145/Editorial-design-Interview-with-Shigeru-Miyamoto'
      },
      { 
        id: 'Fitmate',
        image: 'assets/images/fitmate.png', 
        behanceUrl: 'https://www.behance.net/gallery/169200729/FitMate-UXUI'
      },
      { 
        id: 'SignalChase',
        image: 'assets/images/signal.png', 
        behanceUrl: 'https://www.behance.net/gallery/187551597/Signal-Chase'
      },
      { 
        id: 'IntuRedesign',
        image: 'assets/images/intu.png', 
        behanceUrl: 'https://www.behance.net/gallery/186202987/INTU-Makeover'
      },
      { 
        id: 'UruguayBranding',
        image: 'assets/images/uruguay.png', 
        behanceUrl: 'https://www.behance.net/gallery/139613811/Uruguay-Country-brand'
      }
    ];


    let autoChangeInterval;
    const normalInterval = 10000;
    const extendedInterval = 40000;

    function startAutoChange(interval) {
      clearInterval(autoChangeInterval);
      autoChangeInterval = setInterval(() => {
        nextProject();
      }, interval);
    }

    function updateCV(language) {
      const cvConfig = cvFiles[language] || cvFiles['en'];
      const pdfPath = `assets/PDF/${cvConfig.pdfFilename}`;
      const pngPath = `assets/PDF/${cvConfig.pngFilename}`;
      
      // Actualizar la imagen del CV (PNG)
      const cvImage = document.getElementById('cvImage');
      if (cvImage) {
        cvImage.src = pngPath;
        cvImage.alt = `CV ${language === 'es' ? 'en Español' : 'in English'}`;
      }
      
      // Actualizar el enlace de descarga (PDF)
      const cvDownloadLink = document.getElementById('cvDownloadLink');
      if (cvDownloadLink) {
        cvDownloadLink.href = pdfPath;
        cvDownloadLink.download = cvConfig.pdfFilename;
      }
      
      // Actualizar el enlace para ver online (PDF)
      const viewCVOnline = document.getElementById('viewCVOnline');
      if (viewCVOnline) {
        viewCVOnline.href = cvConfig.viewUrl;
      }
    }

    function updateSidebarTitles(lang) {
      if (!translations) {
        return;
      }

      projectTitles.forEach((titleEl, i) => {
        const project = projects[i];
        const projectTranslation = translations[lang]?.projects?.[project.id];

        if (projectTranslation) {
          titleEl.textContent = projectTranslation.title;
        }
      });
    }

    function updateProject(index, shouldScroll = false, skipAnimation = false) {
      const projectContent = projectsSection.querySelector('.flex-column');
      const currentLang = localStorage.getItem('language') || 'en';
      updateCV(currentLang);

      const applyProjectContent = () => {
        const project = projects[index];

        projectImage.style.backgroundImage = `url(${project.image})`;
        behanceButton.href = project.behanceUrl;

        if (translations) {
          const projectTranslation = translations[currentLang].projects[project.id];

          if (projectTranslation) {
            currentProjectTitle.textContent = projectTranslation.title;
            projectDescription.textContent = projectTranslation.description;
          } else {
            console.error(`Translation not found for project: ${project.id}`);
          }

          updateSidebarTitles(currentLang);
        }

        projectTitles.forEach((title, i) => {
          title.classList.remove('is-switching');
          if (i === index) {
            title.classList.add('active');
            if (!skipAnimation) {
              title.classList.add('is-switching');
            }
          } else {
            title.classList.remove('active');
          }
        });
      };

      const scrollToProjectTitle = () => {
        const title = currentProjectTitle;
        if (!title) {
          return;
        }

        const header = document.querySelector('.header');
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const paddingTop = 10;
        const targetY = title.getBoundingClientRect().top + window.pageYOffset - headerHeight - paddingTop;

        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      };

      const finishTransition = () => {
        if (shouldScroll && window.innerWidth <= 768) {
          setTimeout(scrollToProjectTitle, 120);
        }

        clearInterval(autoChangeInterval);
        startAutoChange(shouldScroll ? extendedInterval : normalInterval);
      };

      if (skipAnimation) {
        applyProjectContent();
        finishTransition();
        return;
      }

      if (isProjectAnimating && !skipAnimation) {
        pendingProjectUpdate = { index, shouldScroll };
        return;
      }

      pendingProjectUpdate = null;

      isProjectAnimating = true;
      projectContent.classList.remove('is-revealing');
      projectContent.classList.add('is-changing');

      setTimeout(() => {
        applyProjectContent();
        projectContent.classList.remove('is-changing');
        projectContent.classList.add('is-revealing');

        setTimeout(() => {
          projectContent.classList.remove('is-revealing');
          isProjectAnimating = false;

          if (pendingProjectUpdate) {
            const pending = pendingProjectUpdate;
            pendingProjectUpdate = null;
            updateProject(pending.index, pending.shouldScroll);
          }
        }, projectRevealMs);

        finishTransition();
      }, projectTransitionMs);
    }

    function nextProject() {
      currentIndex = (currentIndex + 1) % projects.length;
      updateProject(currentIndex, false);
    }

    // Permitir clic en los títulos para cambiar manualmente
    projectTitles.forEach((title, index) => {
      title.addEventListener('click', () => {
        currentIndex = index;
        updateProject(currentIndex, true);
      });
    });

     // Cargar traducciones
     let translations;
    fetch('./translations.json')
      .then(response => response.json())
      .then(data => {
        translations = data;
        const lang = localStorage.getItem('language') || 'en';
        changeLanguage(lang);
        document.getElementById('languageSelector').value = lang;
        startAutoChange(normalInterval);
      })
      .catch(error => console.error('Error cargando las traducciones:', error));

    // Función para cambiar el idioma
    function changeLanguage(lang) {
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
          element.textContent = translations[lang][key];
        }
      });
      document.documentElement.lang = lang;
      localStorage.setItem('language', lang);
      
      // Actualizar el proyecto actual con el nuevo idioma
      updateProject(currentIndex, false, true);

      // Actualizar el carrusel de texto (marquee) con el nuevo idioma
      renderMarquee(lang);
    }

    // Genera el carrusel de texto a partir de las palabras del JSON.
    // Para AÑADIR o QUITAR palabras: edita el array "marqueeWords"
    // dentro de translations.json (en cada idioma), no aquí.
    function renderMarquee(lang) {
      const track = document.getElementById('marqueeTrack');
      if (!track || !translations || !translations[lang]) {
        return;
      }

      const words = translations[lang].marqueeWords || [];
      if (words.length === 0) {
        return;
      }

      // Se duplica la lista una vez para que el loop sea infinito
      // sin que se note el corte (se recorre la mitad del ancho total)
      const buildItems = () => words
        .map(word => `<span class="marquee-item">${word}<span class="dot">•</span></span>`)
        .join('');

      track.innerHTML = buildItems() + buildItems();

      // Recalcular el ancho de "una vuelta" para el loop.
      // Se usa requestAnimationFrame para asegurar que el navegador ya
      // pintó el nuevo contenido y scrollWidth sea correcto.
      requestAnimationFrame(() => {
        marqueeHalfWidth = track.scrollWidth / 2;
        // Si la posición actual quedó fuera del nuevo ancho (ej. cambiaste
        // de idioma y el texto es más corto), la ajustamos sin que salte
        // visualmente de golpe.
        if (marqueeHalfWidth > 0) {
          marqueePosition = marqueePosition % marqueeHalfWidth;
        }
      });

      startMarqueeLoop();
    }

    // ============================================
    // MOTOR DEL CARRUSEL — controla la velocidad manualmente por JS
    // en vez de usar @keyframes, para poder desacelerar suavemente en
    // hover sin que el carrusel "salte" o reinicie su posición.
    // ============================================
    const marqueeNormalSpeed = 90;   // <-- VELOCIDAD normal, en píxeles por segundo
    const marqueeHoverSpeed = 25;    // <-- VELOCIDAD al pasar el mouse (más lento, no pausado)
    const marqueeEasing = 4;         // <-- qué tan rápido se ajusta la velocidad al entrar/salir del hover (más alto = transición más corta)

    let marqueeCurrentSpeed = marqueeNormalSpeed;
    let marqueeTargetSpeed = marqueeNormalSpeed;
    let marqueePosition = 0;
    let marqueeHalfWidth = 0;
    let marqueeLastTimestamp = null;
    let marqueeLoopStarted = false;

    function marqueeLoop(timestamp) {
      const track = document.getElementById('marqueeTrack');

      if (marqueeLastTimestamp === null) {
        marqueeLastTimestamp = timestamp;
      }
      const deltaSeconds = (timestamp - marqueeLastTimestamp) / 1000;
      marqueeLastTimestamp = timestamp;

      if (track && marqueeHalfWidth > 0) {
        // Interpola suavemente la velocidad actual hacia la velocidad objetivo
        marqueeCurrentSpeed += (marqueeTargetSpeed - marqueeCurrentSpeed) * Math.min(deltaSeconds * marqueeEasing, 1);

        marqueePosition -= marqueeCurrentSpeed * deltaSeconds;

        // Cuando recorrimos "una vuelta" completa, la sumamos de vuelta
        // para que el loop sea infinito sin saltos
        if (marqueePosition <= -marqueeHalfWidth) {
          marqueePosition += marqueeHalfWidth;
        }

        track.style.transform = `translateX(${marqueePosition}px)`;
      }

      requestAnimationFrame(marqueeLoop);
    }

    function startMarqueeLoop() {
      if (marqueeLoopStarted) {
        return;
      }
      marqueeLoopStarted = true;

      const marqueeSection = document.querySelector('.marquee-section');
      if (marqueeSection) {
        marqueeSection.addEventListener('mouseenter', () => {
          marqueeTargetSpeed = marqueeHoverSpeed;
        });
        marqueeSection.addEventListener('mouseleave', () => {
          marqueeTargetSpeed = marqueeNormalSpeed;
        });
      }

      requestAnimationFrame(marqueeLoop);
    }

    // Evento para cambiar el idioma
    document.getElementById('languageSelector').addEventListener('change', function() {
      changeLanguage(this.value);
      if (window.innerWidth <= 768) {
        // Cerrar el menú móvil después de cambiar el idioma
        document.querySelector('nav').classList.remove('active');
      }
    });
    
        // Evento para abrir el modal
        openCVButton.addEventListener('click', function() {
          const currentLang = localStorage.getItem('language') || 'en';
          updateCV(currentLang);
          modal.style.display = 'block';
        });
    
        // Evento para cerrar el modal
        closeButton.addEventListener('click', function() {
          modal.style.display = 'none';
        });
    
        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', function(event) {
          if (event.target === modal) {
            modal.style.display = 'none';
          }
        });
    
        // Actualizar CV cuando cambia el idioma
        document.getElementById('languageSelector')?.addEventListener('change', function() {
          updateCV(this.value);
        }); })