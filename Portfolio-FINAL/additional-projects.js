document.addEventListener('DOMContentLoaded', function() {
    // Función para verificar el tamaño de la pantalla y redirigir si es necesario
    function checkScreenSizeAndRedirect() {
        if (window.innerWidth <= 768) {
            window.location.href = 'index.html';
            return;
        }
    }

    // Ejecutar la verificación al cargar la página
    checkScreenSizeAndRedirect();

    // Agregar un listener para el evento 'resize'
    window.addEventListener('resize', checkScreenSizeAndRedirect);

    // Datos de ejemplo para los carruseles
    const models3D = [
        { type: 'video', src: 'assets/Additional/ave.mp4', alt: '3D Model Thraupis palmerum' },
        { type: 'image', src: 'assets/Additional/Inosuke.png', alt: 'Inosuke as Lego minifigure' },
        { type: 'image', src: 'assets/Additional/LegoProcess.png', alt: '3D modeling on Rhinoceros' },
        { type: 'video', src: 'assets/Additional/ave2.mp4', alt: '3D animation Sporophila minuta' },
    ];

    const otherProjects = [
        { type: 'image', src: 'assets/Additional/Nagito.png', alt: 'Nagito Komaeda as text' },
        { type: 'image', src: 'assets/Additional/Coin.png', alt: 'Coin of Carnage' },
    ];

    // Variables globales
    let translations;
    let implementedProjects = [];
    let implementedCurrentIndex = 0;

    // Función para obtener el idioma actual
    function getCurrentLanguage() {
        return localStorage.getItem('language') || 'en';
    }

    // Función para cargar los proyectos implementados desde las traducciones
    function loadImplementedProjects() {
        const currentLang = getCurrentLanguage();
        const projectsData = translations[currentLang].implementedProjects;
        
        implementedProjects = Object.keys(projectsData).map(key => {
            return {
                id: key,
                image: projectsData[key].image,
                behanceUrl: projectsData[key].behanceUrl
            };
        });

        // Actualizar la lista de títulos en el DOM
        const titlesContainer = document.querySelector('#implemented-projects .flex-column-afb');
        titlesContainer.innerHTML = `
            <span class="projects" data-i18n="implementedProjects">Implemented Projects</span>
            ${Object.keys(projectsData).map((key, index) => 
                `<span class="project-title" data-project-id="${key}">${projectsData[key].title}</span>`
            ).join('')}
        `;

        // Añadir event listeners a los nuevos títulos
        document.querySelectorAll('#implemented-projects .project-title').forEach((title, index) => {
            title.addEventListener('click', () => {
                implementedCurrentIndex = index;
                updateImplementedProject(implementedCurrentIndex);
            });
        });
    }

    // Función para actualizar un proyecto implementado
    function updateImplementedProject(index) {
        const currentLang = getCurrentLanguage();
        const project = implementedProjects[index];
        const projectData = translations[currentLang].implementedProjects[project.id];
        
        if (!projectData) return;

        // Fade out
        document.querySelector('#implemented-projects .flex-column').classList.add('fade-out');
        
        setTimeout(() => {
            // Actualizar contenido
            document.querySelector('#implemented-projects .current-project-title').textContent = projectData.title;
            document.querySelector('#implemented-projects .image').style.backgroundImage = `url(${project.image})`;
            document.querySelector('#implemented-projects .project-description').textContent = projectData.description;
            document.querySelector('#implemented-projects .linkz-button').href = project.behanceUrl;
            
            // Actualizar clase activa
            document.querySelectorAll('#implemented-projects .project-title').forEach((title, i) => {
                if (i === index) {
                    title.classList.add('active');
                } else {
                    title.classList.remove('active');
                }
            });

            // Fade in
            setTimeout(() => {
                document.querySelector('#implemented-projects .flex-column').classList.remove('fade-out');
                document.querySelector('#implemented-projects .flex-column').classList.add('fade-in');
            }, 50);
        }, 500);
    }

    // Función principal para actualizar el idioma
    function updateLanguage(lang) {
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        
        // Actualizar textos generales
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Actualizar botones de carrusel
        document.querySelectorAll('.carousel-button.prev').forEach(button => {
            button.textContent = translations[lang]['previous'];
        });
        document.querySelectorAll('.carousel-button.next').forEach(button => {
            button.textContent = translations[lang]['next'];
        });

        // Recargar proyectos implementados con las nuevas traducciones
        loadImplementedProjects();
        
        // Actualizar el proyecto mostrado
        if (implementedProjects.length > 0) {
            updateImplementedProject(implementedCurrentIndex);
        }
    }

    // Cargar traducciones y inicializar
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            const currentLang = getCurrentLanguage();
            
            // Inicializar componentes
            createCarousel(models3D, '3d-models-carousel');
            createCarousel(otherProjects, 'other-projects-carousel');
            setupCarousel('3d-models-carousel');
            setupCarousel('other-projects-carousel');
            initFigmaPrototypes();
            
            // Configurar idioma
            updateLanguage(currentLang);
            document.getElementById('languageSelector').value = currentLang;
            
            // Inicializar proyectos implementados
            loadImplementedProjects();
            if (implementedProjects.length > 0) {
                updateImplementedProject(0);
            }
        })
        .catch(error => console.error('Error loading translations:', error));

    // Evento para cambiar el idioma
    document.getElementById('languageSelector').addEventListener('change', function() {
        updateLanguage(this.value);
        if (window.innerWidth <= 768) {
            document.querySelector('nav').classList.remove('active');
        }
    });

    // Funciones de carrusel (mantener igual)
    function createCarousel(data, carouselId) {
        const carousel = document.getElementById(carouselId);
        let currentIndex = 0;

        function createItem(item) {
            const div = document.createElement('div');
            div.className = 'carousel-item';
            
            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.alt;
                div.appendChild(img);
            } else if (item.type === 'video') {
                const video = document.createElement('video');
                video.src = item.src;
                video.controls = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                div.appendChild(video);
            }
            
            return div;
        }

        function showItem(index) {
            carousel.innerHTML = '';
            const item = createItem(data[index]);
            carousel.appendChild(item);
            
            if (data[index].type === 'video') {
                const video = item.querySelector('video');
                video.play();
            }
        }

        function nextItem() {
            currentIndex = (currentIndex + 1) % data.length;
            showItem(currentIndex);
        }

        function prevItem() {
            currentIndex = (currentIndex - 1 + data.length) % data.length;
            showItem(currentIndex);
        }

        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-button prev';
        prevButton.addEventListener('click', prevItem);

        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-button next';
        nextButton.addEventListener('click', nextItem);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'carousel-button-container';
        buttonContainer.appendChild(prevButton);
        buttonContainer.appendChild(nextButton);

        carousel.parentNode.insertBefore(buttonContainer, carousel.nextSibling);
        showItem(currentIndex);
    }

    function setupCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        const items = carousel.querySelectorAll('.carousel-item');
        const itemCount = items.length;
        let currentIndex = 0;
        let startX, startScrollLeft, isDown = false;

        function updateCarousel() {
            const angle = (360 / itemCount) * currentIndex * -1;
            carousel.style.transform = `translateZ(-300px) rotateY(${angle}deg)`;
            
            items.forEach((item, index) => {
                item.classList.remove('active', 'prev', 'next');
                if (index === currentIndex) {
                    item.classList.add('active');
                } else if (index === (currentIndex - 1 + itemCount) % itemCount) {
                    item.classList.add('prev');
                } else if (index === (currentIndex + 1) % itemCount) {
                    item.classList.add('next');
                }
                
                const video = item.querySelector('video');
                if (video) {
                    if (item.classList.contains('active')) {
                        video.play();
                    } else {
                        video.pause();
                    }
                }
            });
        }

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            startScrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            if (walk > 100) {
                currentIndex = (currentIndex - 1 + itemCount) % itemCount;
                updateCarousel();
                isDown = false;
            } else if (walk < -100) {
                currentIndex = (currentIndex + 1) % itemCount;
                updateCarousel();
                isDown = false;
            }
        });

        updateCarousel();
    }

    // Función para inicializar los prototipos de Figma
    function initFigmaPrototypes() {
        function loadFigmaPrototype(container) {
            if (container.dataset.loaded === 'true') return;

            const img = document.createElement('img');
            img.src = container.dataset.thumbnail;
            img.alt = 'Figma Prototype Thumbnail';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.cursor = 'pointer';

            img.addEventListener('click', () => {
                window.open(container.dataset.src, '_blank');
            });

            const placeholder = container.querySelector('.figma-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            container.appendChild(img);
            container.dataset.loaded = 'true';
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadFigmaPrototype(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '100px', threshold: 0.1 });

        document.querySelectorAll('.figma-container').forEach(container => {
            const placeholder = document.createElement('div');
            placeholder.className = 'figma-placeholder';
            placeholder.textContent = translations[getCurrentLanguage()]['clickToLoad'];
            container.appendChild(placeholder);

            placeholder.addEventListener('click', () => loadFigmaPrototype(container));
            observer.observe(container);
        });
    }
});