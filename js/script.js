// js/script.js

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. LOADING SCREEN --- */
    const loadingScreen = document.getElementById('loading-screen');
    
    // Remove loading screen after 2.5 seconds
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800); // Wait for fade out transition
    }, 2500);

    /* --- 2. MOBILE NAVIGATION --- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navbar = document.getElementById('navbar');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- 3. COUNTDOWN TIMER --- */
    // Target date: May 6th 2026 Midnight
    const countDownDate = new Date("May 6, 2026 00:00:00").getTime();
    const timerElement = document.getElementById('timer');

    const countdownFunction = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            clearInterval(countdownFunction);
            timerElement.innerHTML = "<div class='time-box'><span class='time-val accent-blue'>IT HAS BEGUN</span></div>";
        } else {
            timerElement.innerHTML = `
                <div class="time-box">
                    <span class="time-val">${days.toString().padStart(2, '0')}</span>
                    <span class="time-label">DAYS</span>
                </div>
                <div class="time-box">
                    <span class="time-val">${hours.toString().padStart(2, '0')}</span>
                    <span class="time-label">HOURS</span>
                </div>
                <div class="time-box">
                    <span class="time-val">${minutes.toString().padStart(2, '0')}</span>
                    <span class="time-label">MINUTES</span>
                </div>
                <div class="time-box">
                    <span class="time-val">${seconds.toString().padStart(2, '0')}</span>
                    <span class="time-label">SECONDS</span>
                </div>
            `;
        }
    }, 1000);

    /* --- 4. SCROLL ANIMATIONS (Intersection Observer) --- */
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .fade-in-element, .slide-in-left, .slide-in-right, .word-reveal');
    
    // Animate words in hero title specifically
    const wordReveals = document.querySelectorAll('.word-reveal');
    wordReveals.forEach((word, index) => {
        word.style.transitionDelay = `${(index * 0.15) + 2.5}s`; // Start after loading screen (2.5s)
        setTimeout(() => word.classList.add('visible'), 100); // Trigger after DOM load
    });

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's the stats section, trigger the counter
                if (entry.target.id === 'stats' || entry.target.classList.contains('stats-grid') || entry.target.closest('#stats')) {
                    triggerCounters();
                }

                // If it's the progress bar
                if (entry.target.classList.contains('progress-container')) {
                    const bar = entry.target.querySelector('.progress-bar-fill');
                    if (bar) bar.style.width = '20%'; // Example: 1 out of 5 complete = 20%
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        if (!el.classList.contains('word-reveal')) { // Handle words separately
            scrollObserver.observe(el);
        }
    });

    /* --- 5. STATS COUNTER --- */
    let countersTriggered = false;
    const counters = document.querySelectorAll('.stat-number');
    
    function triggerCounters() {
        if(countersTriggered) return;
        countersTriggered = true;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            
            updateCounter();
        });
    }

    /* --- 6. GLITCH EFFECT --- */
    // The specific glitch effect is now handled purely in CSS via .glitch-hover and .glitch-word classes.
    // Removed the global glitch-overlay logic that caused the entire screen (and the hero icon) to glitch.

    /* --- 7. NEURAL NETWORK CANVAS (Lightweight Parallax) --- */
    const canvas = document.getElementById('neural-net-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 1.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 102, 255, 0.5)';
                ctx.fill();
            }
        }

        // Initialize particles
        const particleCount = Math.min(Math.floor(width / 20), 80); // Responsive amount
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 102, 255, ${0.15 - distance/800})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        }

        animate();

        // Simple Parallax implementation tied to the canvas
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if(scrollY < height) { // Only animate if in view
                canvas.style.transform = `translateY(${scrollY * 0.4}px)`;
            }
        });
    }
});
