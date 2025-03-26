document.addEventListener('DOMContentLoaded', function() {
          // Configuración de los CV por idioma
const cvFiles = {
  'es': {
    pdfFilename: 'CV-Isaac-Montaño.pdf',
    pngFilename: 'CV-Isaac-Montaño.png', // Nuevo campo para la imagen
    viewUrl: 'https://acrobat.adobe.com/id/urn:aaid:sc:US:8e8bd379-b6cb-461b-aaad-5ab63b8a870f'
  },
  'en': {
    pdfFilename: 'CV-Isaac-Montano.pdf',
    pngFilename: 'CV-Isaac-Montano.png', // Nuevo campo para la imagen
    viewUrl: 'https://acrobat.adobe.com/id/urn:aaid:sc:US:2584e934-a5bc-49d6-8e4d-07d836aab052'
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

    const projectTitles = document.querySelectorAll('.project-title');
    const currentProjectTitle = document.querySelector('.current-project-title');
    const projectImage = document.querySelector('.image');
    const projectDescription = document.querySelector('.project-description');
    const behanceButton = document.querySelector('.behance-button');
    let currentIndex = 0;

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

    function updateProject(index, shouldScroll = false) {
      const projectContent = document.querySelector('.flex-column');
      const currentLang = localStorage.getItem('language') || 'en';
      updateCV(currentLang);
      
      // Fade out
      projectContent.classList.add('fade-out');
      
      setTimeout(() => {
        const project = projects[index];
        const projectTranslation = translations[currentLang].projects[project.id];
        
        if (projectTranslation) {
          currentProjectTitle.textContent = projectTranslation.title;
          projectImage.style.backgroundImage = `url(${project.image})`;
          projectDescription.textContent = projectTranslation.description;
          behanceButton.href = project.behanceUrl;
        } else {
          console.error(`Translation not found for project: ${project.id}`);
        }
        
        // Actualizar clase activa
        projectTitles.forEach((title, i) => {
          if (i === index) {
            title.classList.add('active');
          } else {
            title.classList.remove('active');
          }
        });

        // Fade in
        setTimeout(() => {
          projectContent.classList.remove('fade-out');
          projectContent.classList.add('fade-in');
        }, 50);

        // Scroll suave a la sección de proyectos en dispositivos móviles solo si se hizo clic
        if (shouldScroll && window.innerWidth <= 768) {
          setTimeout(() => {
            const projectsSection = document.getElementById('projects');
            const yOffset = -50; // Ajusta este valor para subir más o menos
            const y = projectsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({top: y, behavior: 'smooth'});
          }, 100);
        }

        clearInterval(autoChangeInterval);
        startAutoChange(shouldScroll ? extendedInterval : normalInterval);
      }, 500); // Este tiempo debe coincidir con la duración de la transición en CSS
    }

    function nextProject() {
      currentIndex = (currentIndex + 1) % projects.length;
      updateProject(currentIndex, false);
    }

    // Iniciar con el primer proyecto
    updateProject(0);

    // Iniciar el cambio automático con el intervalo normal
    startAutoChange(normalInterval);

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
      updateProject(currentIndex);
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