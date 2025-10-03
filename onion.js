document.addEventListener('DOMContentLoaded', function () {
    const googleSignIn = document.getElementById('googleSignIn');

    if (googleSignIn) {
        googleSignIn.addEventListener('click', function () {
            window.location.href = '/auth/google';
        });
        return;
    }

    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#00ff88', '#00ccff', '#ff00cc', '#ff4444']
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: true
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00ff88',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });

    const cursor = document.createElement('div');
    const cursorFollower = document.createElement('div');
    cursor.className = 'cursor';
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    const interactiveElements = document.querySelectorAll('button, .search-input, .user-avatar, .logout-btn');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.2)';
            cursorFollower.style.borderColor = '#ff00cc';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
            cursorFollower.style.borderColor = '#00ccff';
        });
    });

    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        function performSearch() {
            const query = searchInput.value.trim();
            if (query) {
                searchBtn.innerHTML = '🔍 ПОИСК...';
                searchBtn.style.background = 'linear-gradient(45deg, #ff00cc, #ff4444)';

                setTimeout(() => {
                    searchBtn.innerHTML = '🔍 ПОИСК';
                    searchBtn.style.background = 'linear-gradient(45deg, #00ff88, #00ccff)';

                    console.log('Search query:', query);

                    searchInput.style.borderColor = '#00ff88';
                    setTimeout(() => {
                        searchInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }, 2000);
                }, 1500);
            }
        }
    }

    const header = document.querySelector('.header');
    const searchContainer = document.querySelector('.search-container');

    if (header) {
        setTimeout(() => {
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 500);
    }

    if (searchContainer) {
        setTimeout(() => {
            searchContainer.style.opacity = '1';
            searchContainer.style.transform = 'translateY(0)';
        }, 1000);
    }

    if (searchBtn) {
        setInterval(() => {
            searchBtn.classList.toggle('pulse');
        }, 4000);
    }

    document.addEventListener('click', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.border = '2px solid #00ff88';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9997';
        ripple.style.animation = 'ripple 0.6s ease-out';

        document.body.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            0% {
                width: 0px;
                height: 0px;
                opacity: 1;
            }
            100% {
                width: 100px;
                height: 100px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k' && searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });

    if (cursor) {
        setInterval(() => {
            const colors = ['#00ff88', '#00ccff', '#ff00cc', '#ff4444'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            cursor.style.background = `radial-gradient(circle, ${randomColor}, transparent)`;
        }, 2000);
    }
});