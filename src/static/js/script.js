// Этот скрипт создан для добавления интерактивности на сайт.
// Он обеспечивает плавную прокрутку, управление слайдером и отправку формы.

document.addEventListener('DOMContentLoaded', function() {
    // --- ПЛАВНАЯ ПРОКРУТКА ---
    const navLinks = document.querySelectorAll('a[href^="#"]');
    for (let link of navLinks) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const id = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(id);

            if (targetElement) {
                // Вычисляем позицию для прокрутки с учетом высоты шапки
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // --- АНИМАЦИЯ ЗАГОЛОВКОВ ПРИ СКРОЛЛЕ ---
    const animatedTitles = document.querySelectorAll('.section-title');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Отключаем наблюдение после анимации, чтобы она не повторялась
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.5 // Анимация начнется, когда 50% элемента будет видно
    });

    animatedTitles.forEach(title => {
        observer.observe(title);
    });

    // --- СЛАЙДЕР "ПРИМЕРЫ РАБОТ" ---
    const track = document.getElementById('slider-track');
    if (track) {
        const prevButton = document.getElementById('slider-prev');
        const nextButton = document.getElementById('slider-next');
        const items = Array.from(track.children);
        
        let itemWidth = 0;
        let visibleItems = 1; // Инициализируем с 1, чтобы избежать деления на ноль
        let currentIndex = 0;
        let totalItems = items.length;
        let maxIndex = 0;

        function updateSliderDimensions() {
            const viewportWidth = track.parentElement.clientWidth;
            if (totalItems > 0) {
                 // Рассчитываем ширину элемента, включая отступ
                const itemStyle = window.getComputedStyle(items[0]);
                const gap = parseInt(window.getComputedStyle(track).gap) || 20;
                itemWidth = items[0].offsetWidth + gap;

                visibleItems = Math.max(1, Math.round(viewportWidth / itemWidth));
                maxIndex = totalItems - visibleItems;
                
                // Предотвращаем выход за пределы при изменении размера окна
                if (currentIndex > maxIndex) {
                    currentIndex = maxIndex;
                }
            }
            updateSlider();
        }
        
        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }

        nextButton.addEventListener('click', () => {
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateSlider();
        });

        prevButton.addEventListener('click', () => {
             if (currentIndex <= 0) {
                currentIndex = maxIndex;
            } else {
                currentIndex--;
            }
            updateSlider();
        });

        // Инициализация и пересчет при изменении размера окна
        window.addEventListener('resize', updateSliderDimensions);
        // Запускаем с небольшой задержкой, чтобы все стили применились
        setTimeout(updateSliderDimensions, 100);
    }
    
    // --- ОБРАБОТКА ФОРМЫ ОБРАТНОЙ СВЯЗИ ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Предотвращаем стандартную отправку формы

            const formMessage = document.getElementById('form-message');
            formMessage.textContent = 'Отправка...';
            formMessage.style.color = '#ccc';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Имитация отправки данных на сервер
            // В реальном проекте здесь будет fetch к вашему API
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // })
            
            console.log('Отправляемые данные:', data);

            // Имитация ответа от сервера
            setTimeout(() => {
                // Имитация успешного ответа
                const isSuccess = true; // Поменяйте на false для теста ошибки

                if (isSuccess) {
                    formMessage.textContent = 'Спасибо! Ваша заявка принята.';
                    formMessage.style.color = 'var(--accent-color)';
                    contactForm.reset();
                } else {
                    formMessage.textContent = 'Ошибка отправки. Пожалуйста, попробуйте еще раз.';
                    formMessage.style.color = 'red';
                }

                // Скрываем сообщение через несколько секунд
                setTimeout(() => {
                    formMessage.textContent = '';
                }, 5000);

            }, 1000); // Имитация задержки сети
        });
    }
});