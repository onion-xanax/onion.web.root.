// search/onion.js
document.addEventListener('DOMContentLoaded', function () {
    // Проверяем авторизацию через основную систему
    checkAuthStatus();

    // Инициализация частиц
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#00ff88' },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1 } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2 } },
            line_linked: { enable: true, distance: 150, color: '#00ff88', opacity: 0.2, width: 1 },
            move: { enable: true, speed: 1, direction: 'none', random: true }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
            modes: { grab: { distance: 200, line_linked: { opacity: 0.3 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });

    // Функция проверки авторизации
    function checkAuthStatus() {
        fetch('/api/user')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Not authenticated');
                }
                return response.json();
            })
            .then(user => {
                // Обновляем информацию о пользователе
                const userEmail = document.getElementById('userEmail');
                if (userEmail && user.email) {
                    userEmail.textContent = user.email;
                }

                // Показываем основной интерфейс
                document.querySelector('.main-interface').style.display = 'block';
            })
            .catch(error => {
                // Если не авторизован, перенаправляем на главную
                window.location.href = '/';
            });
    }

    // Обработка выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            fetch('/logout', { method: 'GET' })
                .then(() => {
                    window.location.href = '/';
                });
        });
    }

    // Обработка поиска
    const searchButtons = document.querySelectorAll('.search-btn');

    searchButtons.forEach(button => {
        button.addEventListener('click', function () {
            const square = this.closest('.square');
            const input = square.querySelector('.search-input');
            const title = square.querySelector('.square-title').textContent;

            if (input.value.trim()) {
                performSearch(input.value, title);
            } else {
                showNotification('Введите данные для поиска', 'error');
            }
        });

        const input = button.previousElementSibling;
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                button.click();
            }
        });
    });

    function performSearch(query, type) {
        const searchType = type.toLowerCase()
            .replace('search by ', '')
            .replace(' ', '_')
            .replace('.ru', '');

        showNotification(`🔍 Поиск ${type}: ${query}`, 'info');

        fetch(`/search_${searchType}?${searchType}=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                return response.text();
            })
            .then(html => {
                const newWindow = window.open('', '_blank');
                newWindow.document.write(html);
                newWindow.document.close();
            })
            .catch(error => {
                showNotification('Ошибка при поиске: ' + error.message, 'error');
            });
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? 'linear-gradient(135deg, #ff6b6b, #ff4757)' : 'linear-gradient(135deg, #00ff88, #00cc6a)'};
            color: #000;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 8px 25px ${type === 'error' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(0, 255, 136, 0.3)'};
            animation: slideDown 0.3s ease;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
});

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
`;
document.head.appendChild(style);