// ddos/onion.js
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация частиц
    particlesJS('particles-js', {
        particles: {
            number: { value: 100, density: { enable: true, value_area: 800 } },
            color: { value: ['#ff0066', '#ff4400', '#ff0000'] },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1 } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2 } },
            line_linked: { enable: true, distance: 150, color: '#ff0066', opacity: 0.2, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: true }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
            modes: { grab: { distance: 200, line_linked: { opacity: 0.3 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });

    // Проверяем авторизацию
    checkAuthStatus();
    
    // Инициализация Chart.js
    initializeChart();
    
    // Обработчики событий
    setupEventListeners();
});

function checkAuthStatus() {
    fetch('/api/user')
        .then(response => {
            if (!response.ok) {
                throw new Error('Not authenticated');
            }
            return response.json();
        })
        .then(user => {
            const userEmail = document.getElementById('userEmail');
            if (userEmail && user.email) {
                userEmail.textContent = user.email;
            }
        })
        .catch(error => {
            window.location.href = '/';
        });
}

function initializeChart() {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    window.trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 20}, (_, i) => i + 1),
            datasets: [{
                label: 'Requests/Second',
                data: Array(20).fill(0),
                borderColor: '#ff0066',
                backgroundColor: 'rgba(255, 0, 102, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { 
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                },
                y: { 
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                }
            }
        }
    });
}

function setupEventListeners() {
    const startBtn = document.getElementById('startAttack');
    const stopBtn = document.getElementById('stopAttack');
    const testBtn = document.getElementById('testConnection');
    
    let attackInterval;
    let attackRunning = false;
    let requestCount = 0;
    let successCount = 0;
    let startTime = 0;

    startBtn.addEventListener('click', startAttack);
    stopBtn.addEventListener('click', stopAttack);
    testBtn.addEventListener('click', testTarget);

    function startAttack() {
        const targetUrl = document.getElementById('targetUrl').value;
        const attackType = document.getElementById('attackType').value;
        const threads = parseInt(document.getElementById('threads').value);
        const duration = parseInt(document.getElementById('duration').value);
        const rate = parseInt(document.getElementById('rate').value);
        
        if (!targetUrl) {
            showNotification('Please enter target URL', 'error');
            return;
        }

        if (!targetUrl.startsWith('http')) {
            showNotification('Please enter a valid URL (http:// or https://)', 'error');
            return;
        }

        // Обновляем статус
        updateStatus('ATTACKING', '#ff0066');
        startBtn.disabled = true;
        stopBtn.disabled = false;
        
        attackRunning = true;
        requestCount = 0;
        successCount = 0;
        startTime = Date.now();
        
        showNotification(`Starting ${attackType} attack on ${targetUrl}`, 'info');
        
        // Симуляция атаки (в реальном приложении здесь будет WebSocket или API вызовы)
        attackInterval = setInterval(() => {
            if (!attackRunning) return;
            
            const currentTime = Math.floor((Date.now() - startTime) / 1000);
            if (currentTime >= duration) {
                stopAttack();
                return;
            }
            
            // Симуляция запросов
            const requestsThisSecond = Math.floor(Math.random() * rate) + rate / 2;
            const successRate = 0.8 + Math.random() * 0.15; // 80-95% успешных запросов
            
            requestCount += requestsThisSecond;
            successCount += Math.floor(requestsThisSecond * successRate);
            
            updateStats();
            updateChart(requestsThisSecond);
            
        }, 1000);
    }

    function stopAttack() {
        attackRunning = false;
        clearInterval(attackInterval);
        
        updateStatus('STOPPED', '#ffa500');
        startBtn.disabled = false;
        stopBtn.disabled = true;
        
        showNotification('Attack stopped', 'warning');
        
        // Финальное обновление статистики
        setTimeout(updateStats, 100);
    }

    function testTarget() {
        const targetUrl = document.getElementById('targetUrl').value;
        
        if (!targetUrl) {
            showNotification('Please enter target URL', 'error');
            return;
        }

        showNotification(`Testing connection to ${targetUrl}...`, 'info');
        
        // Симуляция тестирования соединения
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% шанс успеха
            if (success) {
                showNotification('Target is reachable', 'success');
                updateStatus('READY', '#00ff88');
            } else {
                showNotification('Target is not reachable', 'error');
                updateStatus('ERROR', '#ff0066');
            }
        }, 2000);
    }

    function updateStats() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        const successRate = requestCount > 0 ? Math.round((successCount / requestCount) * 100) : 0;
        const avgResponseTime = requestCount > 0 ? Math.floor(Math.random() * 500) + 50 : 0;
        
        document.getElementById('requestsSent').textContent = requestCount.toLocaleString();
        document.getElementById('successRate').textContent = successRate + '%';
        document.getElementById('responseTime').textContent = avgResponseTime + 'ms';
        document.getElementById('attackTime').textContent = currentTime + 's';
        document.getElementById('bandwidth').textContent = Math.floor(requestCount * 0.002) + ' MB/s';
        document.getElementById('activeThreads').textContent = attackRunning ? document.getElementById('threads').value : '0';
        document.getElementById('errorCount').textContent = (requestCount - successCount).toLocaleString();
        document.getElementById('targetStatus').textContent = attackRunning ? 'Under Attack' : 'Unknown';
    }

    function updateChart(requests) {
        if (window.trafficChart) {
            const data = window.trafficChart.data.datasets[0].data;
            data.push(requests);
            if (data.length > 20) data.shift();
            window.trafficChart.update('none');
        }
    }

    function updateStatus(status, color) {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-indicator span');
        
        statusDot.style.background = color;
        statusDot.style.boxShadow = `0 0 10px ${color}`;
        statusText.textContent = status;
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'linear-gradient(135deg, #ff0066, #ff4400)' : 
                         type === 'warning' ? 'linear-gradient(135deg, #ffa500, #ff7700)' : 
                         type === 'success' ? 'linear-gradient(135deg, #00ff88, #00cc6a)' :
                         'linear-gradient(135deg, #6464ff, #0066ff)'};
            color: #000;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
            animation: slideInRight 0.3s ease;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
