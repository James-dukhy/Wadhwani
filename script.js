/* ═══════════════════════════════════════════════════════
   CIV-GUARD — Interactive Scripts
   Scroll Reveals · Case Tracker Demo · Navigation
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── NAVBAR SCROLL EFFECT ───
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    const handleNavScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ─── MOBILE MENU TOGGLE ───
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;

    const toggleMenu = () => {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('active', menuOpen);
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        navToggle.innerHTML = menuOpen
            ? '<i class="ph-bold ph-x"></i>'
            : '<i class="ph-bold ph-list"></i>';
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) toggleMenu();
        });
    });

    // ─── SCROLL REVEAL — INTERSECTION OBSERVER ───
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ─── TIMELINE STEPS — STAGGERED REVEAL ───
    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.timeline-step').forEach(step => {
        stepObserver.observe(step);
    });

    // ─── TIMELINE LINE FILL (HORIZONTAL) ───
    const timelineSection = document.getElementById('how-it-works');
    const timelineFill = document.getElementById('timelineFill');

    if (timelineSection && timelineFill) {
        const updateTimelineFill = () => {
            const rect = timelineSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const windowHeight = window.innerHeight;

            // Calculate how far we've scrolled through the section
            const scrollProgress = Math.max(0, Math.min(1,
                (windowHeight - sectionTop) / (sectionHeight + windowHeight * 0.5)
            ));

            timelineFill.style.width = `${scrollProgress * 100}%`;
        };

        window.addEventListener('scroll', updateTimelineFill, { passive: true });
        updateTimelineFill();
    }

    // ─── CASE ID TRACKER DEMO ───
    const caseInput = document.getElementById('caseInput');
    const caseSubmit = document.getElementById('caseSubmit');
    const terminalOutput = document.getElementById('terminalOutput');

    const mockCases = {
        'CG-7291': {
            status: 'Under Investigation',
            statusClass: 'status-investigating',
            assigned: 'Unit 4, District 12',
            lastUpdate: '2 hours ago',
            evidence: '3 files verified',
            priority: 'High'
        },
        'CG-3845': {
            status: 'Evidence Reviewed',
            statusClass: 'status-reviewed',
            assigned: 'Forensics Lab 2',
            lastUpdate: '1 day ago',
            evidence: '5 files analyzed',
            priority: 'Medium'
        },
        'CG-1056': {
            status: 'Case Resolved',
            statusClass: 'status-resolved',
            assigned: 'Unit 7, District 3',
            lastUpdate: '3 days ago',
            evidence: '2 files verified',
            priority: 'Closed'
        },
        'CG-4420': {
            status: 'Pending Review',
            statusClass: 'status-pending',
            assigned: 'Awaiting assignment',
            lastUpdate: '6 hours ago',
            evidence: '1 file uploaded',
            priority: 'Normal'
        }
    };

    const addTerminalLine = (prompt, text, className = '') => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `
            <span class="terminal-prompt">${prompt}</span>
            <span class="terminal-text ${className}">${text}</span>
        `;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const addCaseResult = (caseId, data) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'case-result';
        resultDiv.innerHTML = `
            <div class="case-result-row">
                <span class="case-result-label">Case ID</span>
                <span class="case-result-value">${caseId}</span>
            </div>
            <div class="case-result-row">
                <span class="case-result-label">Status</span>
                <span class="case-status-badge ${data.statusClass}">${data.status}</span>
            </div>
            <div class="case-result-row">
                <span class="case-result-label">Assigned</span>
                <span class="case-result-value">${data.assigned}</span>
            </div>
            <div class="case-result-row">
                <span class="case-result-label">Evidence</span>
                <span class="case-result-value">${data.evidence}</span>
            </div>
            <div class="case-result-row">
                <span class="case-result-label">Last Update</span>
                <span class="case-result-value">${data.lastUpdate}</span>
            </div>
            <div class="case-result-row">
                <span class="case-result-label">Priority</span>
                <span class="case-result-value">${data.priority}</span>
            </div>
        `;
        terminalOutput.appendChild(resultDiv);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const typeText = (prompt, text, className, callback) => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        const promptSpan = document.createElement('span');
        promptSpan.className = 'terminal-prompt';
        promptSpan.textContent = prompt;
        const textSpan = document.createElement('span');
        textSpan.className = `terminal-text ${className}`;
        textSpan.textContent = '';
        line.appendChild(promptSpan);
        line.appendChild(textSpan);
        terminalOutput.appendChild(line);

        let i = 0;
        const typing = setInterval(() => {
            textSpan.textContent += text[i];
            i++;
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            if (i >= text.length) {
                clearInterval(typing);
                if (callback) setTimeout(callback, 200);
            }
        }, 25);
    };

    const handleCaseQuery = () => {
        const rawInput = caseInput.value.trim();
        if (!rawInput) return;

        const caseId = rawInput.toUpperCase();
        caseInput.value = '';

        // Echo user input
        addTerminalLine('query', `$ ${caseId}`, 'dim');

        // Add divider
        const divider = document.createElement('hr');
        divider.className = 'terminal-divider';
        terminalOutput.appendChild(divider);

        // Show searching animation
        typeText('system', `Searching encrypted database for ${caseId}...`, '', () => {
            const caseData = mockCases[caseId];

            if (caseData) {
                addTerminalLine('system', 'Match found ■', 'success');
                setTimeout(() => {
                    addCaseResult(caseId, caseData);
                }, 300);
            } else {
                addTerminalLine('system', `CASE NOT FOUND: ${caseId}`, 'error');
                addTerminalLine('system', 'Try: CG-7291, CG-3845, CG-1056, CG-4420', 'dim');
            }
        });
    };

    caseSubmit.addEventListener('click', handleCaseQuery);
    caseInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleCaseQuery();
    });

    // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar.offsetHeight + 20;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── ACTIVE NAV LINK HIGHLIGHTING ───
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    const highlightNav = () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.style.color = 'var(--text)';
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ─── INITIAL STATE ───
    handleNavScroll();
    highlightNav();
});
