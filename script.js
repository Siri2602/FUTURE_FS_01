/* ============================================================
   PORTFOLIO — script.js
   Terminal, AI Chat, Animations, Dark Mode, Typing, Particles
   ============================================================ */

// ─────────────────────────────────────────────────────────────
// 1. PARTICLES BACKGROUND
// ─────────────────────────────────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const COUNT = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 2 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) { p.update(); p.draw(); }
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.08 * (1 - dist / 150)})`;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

// ─────────────────────────────────────────────────────────────
// 2. TYPING EFFECT
// ─────────────────────────────────────────────────────────────
(function initTyping() {
    const phrases = [
        'Frontend Developer',
        'Future Full Stack Engineer',
        'React.js Enthusiast',
        'Problem Solver',
        'B.Tech IT Student',
        'Open Source Contributor'
    ];
    const el = document.getElementById('typingText');
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function type() {
        const current = phrases[phraseIdx];
        if (deleting) {
            el.textContent = current.substring(0, charIdx--);
            if (charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 400); return; }
        } else {
            el.textContent = current.substring(0, ++charIdx);
            if (charIdx === current.length) { deleting = true; setTimeout(type, 1800); return; }
        }
        setTimeout(type, deleting ? 40 : 80);
    }
    type();
})();

// ─────────────────────────────────────────────────────────────
// 3. DARK / LIGHT MODE
// ─────────────────────────────────────────────────────────────
(function initTheme() {
    const html = document.documentElement;
    const btn = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) html.setAttribute('data-theme', saved);
    updateIcon();

    btn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
        updateIcon();
    });

    function updateIcon() {
        icon.textContent = html.getAttribute('data-theme') === 'dark' ? '🌙' : '☀️';
    }
})();

// ─────────────────────────────────────────────────────────────
// 4. NAVBAR
// ─────────────────────────────────────────────────────────────
(function initNav() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const backToTop = document.getElementById('backToTop');

    // Scroll effects
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        backToTop.classList.toggle('visible', window.scrollY > 500);

        // Active link tracking
        let current = '';
        sections.forEach(sec => {
            if (sec.getBoundingClientRect().top <= 150) current = sec.id;
        });
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
    });

    // Hamburger
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('open');
    });
    links.forEach(l => l.addEventListener('click', () => {
        hamburger.classList.remove('active');
        menu.classList.remove('open');
    }));

    // Back to top
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ─────────────────────────────────────────────────────────────
// 5. SCROLL ANIMATIONS
// ─────────────────────────────────────────────────────────────
(function initScrollAnimations() {
    // Skill bars
    const barItems = document.querySelectorAll('.skill-bar-item');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const level = item.getAttribute('data-level');
                item.style.setProperty('--level', level + '%');
                item.classList.add('animated');
                barObserver.unobserve(item);
            }
        });
    }, { threshold: 0.3 });
    barItems.forEach(item => barObserver.observe(item));

    // Skill rings
    const rings = document.querySelectorAll('.ring-fill');
    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const pct = parseInt(circle.getAttribute('data-pct'));
                const circumference = 2 * Math.PI * 42; // r=42
                const offset = circumference - (pct / 100) * circumference;
                circle.style.strokeDashoffset = offset;
                ringObserver.unobserve(circle);
            }
        });
    }, { threshold: 0.5 });
    rings.forEach(r => ringObserver.observe(r));

    // Project cards
    const cards = document.querySelectorAll('.project-card.reveal');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 150);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(c => cardObserver.observe(c));

    // Generic section fade
    const allSections = document.querySelectorAll('.section:not(.hero-section)');
    const secObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.05 });
    allSections.forEach(sec => {
        sec.style.opacity = '0';
        sec.style.transform = 'translateY(30px)';
        sec.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        secObserver.observe(sec);
    });
})();

// ─────────────────────────────────────────────────────────────
// 6. DEVELOPER TERMINAL
// ─────────────────────────────────────────────────────────────
(function initTerminal() {
    const input = document.getElementById('terminalInput');
    const body = document.getElementById('terminalBody');

    const COMMANDS = {
        help: () => [
            { text: 'Available commands:', cls: 'term-accent' },
            { text: '  help      — Show this help menu', cls: 'term-text' },
            { text: '  about     — Learn about Siri', cls: 'term-text' },
            { text: '  skills    — View technical skills', cls: 'term-text' },
            { text: '  projects  — See all projects', cls: 'term-text' },
            { text: '  contact   — Get contact info', cls: 'term-text' },
            { text: '  education — Academic background', cls: 'term-text' },
            { text: '  social    — Social media links', cls: 'term-text' },
            { text: '  clear     — Clear terminal', cls: 'term-text' },
            { text: '  whoami    — Who are you?', cls: 'term-text' },
            { text: '  date      — Current date', cls: 'term-text' },
            { text: '  joke      — Dev joke 😄', cls: 'term-text' },
        ],
        about: () => [
            { text: '╔══════════════════════════════════════════╗', cls: 'term-accent' },
            { text: '║         MASINA SIRI SURYA                ║', cls: 'term-accent' },
            { text: '╚══════════════════════════════════════════╝', cls: 'term-accent' },
            { text: '' },
            { text: "I'm a passionate developer pursuing B.Tech in", cls: 'term-text' },
            { text: 'Information Technology at SRKR Engineering College.', cls: 'term-text' },
            { text: '' },
            { text: 'DOB: 26/08/2007', cls: 'term-text' },
            { text: 'Goal: Full Stack Developer & build impactful products', cls: 'term-text' },
            { text: 'Currently learning: React, Node.js, APIs, Cloud, DSA', cls: 'term-text' },
        ],
        skills: () => [
            { text: '── LANGUAGES ──', cls: 'term-accent' },
            { text: '  C ██████████░ 90%   JavaScript ██████████░ 92%', cls: 'term-text' },
            { text: '  Python █████████░ 88%   Java █████████░ 85%', cls: 'term-text' },
            { text: '  SQL ████████░ 80%   DSA █████████░ 87%', cls: 'term-text' },
            { text: '' },
            { text: '── FRAMEWORKS ──', cls: 'term-accent' },
            { text: '  React.js, HTML5, CSS3, Bootstrap', cls: 'term-text' },
            { text: '  Node.js, Express.js, Django, REST APIs', cls: 'term-text' },
            { text: '  MongoDB, MySQL, Git/GitHub, AWS', cls: 'term-text' },
        ],
        projects: () => [
            { text: '── PROJECTS ──', cls: 'term-accent' },
            { text: '' },
            { text: '📝 To-Do App', cls: 'term-cmd' },
            { text: '   Live: https://siri2602.github.io/pro-todo-app/', cls: 'term-dim' },
            { text: '   Tech: HTML, CSS, JavaScript', cls: 'term-text' },
            { text: '' },
            { text: '🧮 Calculator App', cls: 'term-cmd' },
            { text: '   Live: https://siri2602.github.io/calculator-app/', cls: 'term-dim' },
            { text: '   Tech: HTML, CSS Grid, JavaScript', cls: 'term-text' },
            { text: '' },
            { text: '🌦️ Weather App', cls: 'term-cmd' },
            { text: '   Live: https://siri2602.github.io/weather-app/', cls: 'term-dim' },
            { text: '   Tech: API, Async JS, JSON', cls: 'term-text' },
            { text: '' },
            { text: '💼 Portfolio Website', cls: 'term-cmd' },
            { text: '   You\'re looking at it right now! 😎', cls: 'term-text' },
        ],
        contact: () => [
            { text: '── CONTACT ──', cls: 'term-accent' },
            { text: '  📧 Email:    sirisurya2007@gmail.com', cls: 'term-text' },
            { text: '  📱 Phone:    +91 8121163943', cls: 'term-text' },
            { text: '  💼 LinkedIn: linkedin.com/in/siri-surya-566023366', cls: 'term-text' },
            { text: '  🐙 GitHub:   github.com/Siri2602', cls: 'term-text' },
        ],
        education: () => [
            { text: '── EDUCATION ──', cls: 'term-accent' },
            { text: '  🎓 B.Tech IT (2024–2028) — SRKR Engineering College', cls: 'term-text' },
            { text: '     Status: IN PROGRESS', cls: 'term-cmd' },
            { text: '  📚 Intermediate (2022–2024) — 95.2%', cls: 'term-text' },
            { text: '  📖 SSC (2022) — 95%', cls: 'term-text' },
        ],
        social: () => [
            { text: '── SOCIAL LINKS ──', cls: 'term-accent' },
            { text: '  GitHub:   https://github.com/Siri2602', cls: 'term-text' },
            { text: '  LinkedIn: https://www.linkedin.com/in/siri-surya-566023366', cls: 'term-text' },
        ],
        whoami: () => [
            { text: 'You are a curious visitor exploring Siri\'s portfolio! 🕵️', cls: 'term-text' },
        ],
        date: () => [
            { text: new Date().toString(), cls: 'term-text' },
        ],
        joke: () => {
            const jokes = [
                'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
                'There are only 10 types of people: those who understand binary and those who don\'t.',
                'A SQL query walks into a bar, walks up to two tables, and asks "Can I JOIN you?"',
                '!false — It\'s funny because it\'s true.',
                'Why was the JavaScript developer sad? Because he didn\'t Node how to Express himself. 😢',
                'Algorithm: A word used by programmers when they don\'t want to explain what they did.',
            ];
            return [{ text: jokes[Math.random() * jokes.length | 0], cls: 'term-cmd' }];
        },
    };

    function addLines(lines) {
        for (const line of lines) {
            const div = document.createElement('div');
            div.className = 'term-line';
            const span = document.createElement('span');
            span.className = line.cls || 'term-text';
            span.textContent = line.text || '';
            div.appendChild(span);
            body.appendChild(div);
        }
        body.scrollTop = body.scrollHeight;
    }

    function addPromptLine(cmd) {
        const div = document.createElement('div');
        div.className = 'term-line';
        div.innerHTML = `<span class="term-prompt-line">visitor@siri:~$ </span><span class="term-text">${escapeHtml(cmd)}</span>`;
        body.appendChild(div);
    }

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const cmd = input.value.trim().toLowerCase();
        input.value = '';
        if (!cmd) return;

        addPromptLine(cmd);

        if (cmd === 'clear') {
            body.innerHTML = '';
            return;
        }

        const handler = COMMANDS[cmd];
        if (handler) {
            const lines = handler();
            addLines(lines);
        } else {
            addLines([{ text: `Command not found: ${cmd}. Type "help" for commands.`, cls: 'term-error' }]);
        }
    });
})();

// ─────────────────────────────────────────────────────────────
// 7. AI CHATBOT
// ─────────────────────────────────────────────────────────────
(function initChat() {
    const messagesEl = document.getElementById('chatMessages');
    const inputEl = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const chips = document.querySelectorAll('.suggestion-chip');

    const KB = [
        { keys: ['project', 'built', 'build', 'made', 'work', 'app'], answer: "Siri has built several projects:\n\n📝 **To-Do App** — Task management with priority system, search & filter, progress tracking, and local storage.\n🧮 **Calculator App** — Stylish calculator with dark mode, keyboard support, sound effects, and animated buttons.\n🌦️ **Weather App** — Live weather data using OpenWeather API with dynamic backgrounds.\n💼 **Portfolio Website** — This very site with terminal, AI chat, and modern UI!\n\nYou can check them out in the Projects section above! 🚀" },
        { keys: ['technolog', 'tech', 'stack', 'know', 'language', 'framework', 'skill'], answer: "Siri is skilled in:\n\n💻 **Languages:** C, JavaScript, Python, Java, SQL, DSA\n⚛️ **Front-End:** React.js, HTML5, CSS3, Bootstrap\n🔧 **Back-End:** Node.js, Express.js, Django, REST APIs\n🗄️ **Databases:** MongoDB, MySQL\n🛠️ **Tools:** Git/GitHub, AWS\n\nAlways learning more! Currently diving deeper into React and cloud technologies. ☁️" },
        { keys: ['education', 'study', 'college', 'university', 'school', 'degree', 'btech'], answer: "📚 **Education:**\n\n🎓 B.Tech in Information Technology (2024–2028)\n    SRKR Engineering College, Bhimavaram — Currently 2nd Year\n📖 Intermediate (2022–2024) — Scored **95.2%**\n📝 SSC / 10th (Completed 2022) — Scored **95%**\n\nStrong academic record with a passion for continuous learning! 📈" },
        { keys: ['contact', 'reach', 'email', 'phone', 'call', 'message', 'hire'], answer: "📬 **Contact Siri:**\n\n📧 Email: sirisurya2007@gmail.com\n📱 Phone: +91 8121163943\n💼 LinkedIn: linkedin.com/in/siri-surya-566023366\n🐙 GitHub: github.com/Siri2602\n\nFeel free to reach out — always happy to connect! 🤝" },
        { keys: ['goal', 'aim', 'future', 'plan', 'dream', 'career', 'aspir'], answer: "🎯 **Siri's Goals:**\n\n• Become a skilled Full Stack Developer\n• Contribute to open-source projects\n• Build products that solve real-world problems\n• Land an internship at a top tech company\n• Master cloud computing and DevOps\n• Help and mentor fellow students along the way\n\nDriven, focused, and always learning! 💪" },
        { keys: ['who', 'name', 'about', 'yourself', 'intro', 'introduction', 'siri'], answer: "👋 I'm **Masina Siri Surya**, a 2nd Year B.Tech IT student at SRKR Engineering College, Bhimavaram.\n\nDOB: 26/08/2007\nPassionate about web development, problem-solving, and building awesome applications!\n\nI scored 95% in SSC and 95.2% in Intermediate. Currently learning full-stack development and aiming to build impactful products. 🚀" },
        { keys: ['hello', 'hi', 'hey', 'greet', 'sup', 'howdy'], answer: "Hey there! 👋 Welcome to Siri's portfolio! I can tell you about Siri's projects, skills, education, contact info, or goals. What would you like to know? 😊" },
        { keys: ['thank', 'thanks', 'thx', 'awesome', 'great', 'cool', 'nice'], answer: "You're welcome! 😊 Glad I could help. Feel free to ask anything else about Siri, or scroll around and explore the portfolio! 🚀" },
        { keys: ['hobby', 'hobbies', 'fun', 'interest', 'free time'], answer: "When not coding, Siri enjoys:\n\n🧩 Solving DSA problems on coding platforms\n📚 Learning new technologies and frameworks\n🎮 Exploring tech communities online\n👨‍🏫 Mentoring fellow students\n💡 Brainstorming new project ideas\n\nAlways productive! 💪" },
        { keys: ['age', 'old', 'born', 'birthday', 'dob'], answer: "Siri was born on **26th August 2007**. Currently a young and passionate 2nd year B.Tech student! 🎂" },
        { keys: ['linkedin', 'social', 'github', 'profile'], answer: "🔗 **Social Profiles:**\n\n💼 LinkedIn: https://www.linkedin.com/in/siri-surya-566023366\n🐙 GitHub: https://github.com/Siri2602\n\nConnect and follow for updates! 🌟" },
    ];

    function findAnswer(query) {
        const q = query.toLowerCase();
        for (const entry of KB) {
            if (entry.keys.some(k => q.includes(k))) return entry.answer;
        }
        return "Hmm, I'm not sure about that! 🤔 Try asking about Siri's **projects**, **skills**, **education**, **contact**, or **goals**. I'll do my best to help!";
    }

    function addMsg(text, isBot) {
        const wrap = document.createElement('div');
        wrap.className = `chat-msg ${isBot ? 'bot' : 'user'}`;
        const avatar = document.createElement('div');
        avatar.className = 'chat-avatar';
        avatar.textContent = isBot ? '🤖' : '👤';
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        // Simple markdown-like bold
        bubble.innerHTML = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
        wrap.appendChild(avatar);
        wrap.appendChild(bubble);
        messagesEl.appendChild(wrap);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function handleSend() {
        const q = inputEl.value.trim();
        if (!q) return;
        inputEl.value = '';
        addMsg(q, false);
        // Simulate thinking delay
        setTimeout(() => {
            addMsg(findAnswer(q), true);
        }, 500 + Math.random() * 500);
    }

    inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
    sendBtn.addEventListener('click', handleSend);
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            inputEl.value = chip.getAttribute('data-q');
            handleSend();
        });
    });
})();

// ─────────────────────────────────────────────────────────────
// 8. CONTACT FORM
// ─────────────────────────────────────────────────────────────
(function initContactForm() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const message = document.getElementById('formMessage').value.trim();
        if (!name || !email || !message) return;

        // In a real app, send to backend. Here just show confirmation.
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = '✅ Message Sent!';
        btn.disabled = true;
        btn.style.background = '#22c55e';

        setTimeout(() => {
            btn.textContent = original;
            btn.disabled = false;
            btn.style.background = '';
            form.reset();
        }, 3000);
    });
})();

