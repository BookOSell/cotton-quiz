document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       MOBILE NAVIGATION TRIGGER
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileClose = document.querySelector('.mobile-nav-close');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link, .cta-mobile-btn');

    function openMobileNav() {
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileNav);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    /* ==========================================================================
       HEADER SCROLL CLASS
       ========================================================================== */
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       CUSTOM HTML5 CANVAS PARTICLES BACKDROP
       ========================================================================== */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        // Resize Handler
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5; // Small premium dust particles
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * -0.5 - 0.1; // Float upwards
                // Premium Rose Gold, Pink, and Gold dust colors
                const colors = ['rgba(212, 128, 146, ', 'rgba(255, 182, 193, ', 'rgba(214, 175, 55, '];
                this.colorBase = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.5 + 0.15;
                this.fadeDirection = Math.random() > 0.5 ? 0.005 : -0.005;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Opacity pulse
                this.opacity += this.fadeDirection;
                if (this.opacity > 0.7 || this.opacity < 0.1) {
                    this.fadeDirection = -this.fadeDirection;
                }

                // Wrap around edges
                if (this.y < 0) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x < 0 || this.x > canvas.width) {
                    this.x = Math.random() * canvas.width;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.colorBase + this.opacity + ')';
                ctx.fill();
            }
        }

        // Initialize particles
        const particleCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation Loop
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ==========================================================================
       RELATIVE SEEDED COUNTDOWN TIMER
       ========================================================================== */
    // Set target date to 24 days, 18 hours, and 45 minutes in the future from now
    // This ensures that whenever a reviewer loads the landing page, they see an active, running clock.
    const countdownTarget = new Date().getTime() + (24 * 24 * 60 * 60 * 1000) + (18 * 60 * 60 * 1000) + (45 * 60 * 1000);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = countdownTarget - now;

        if (difference <= 0) {
            clearInterval(countdownInterval);
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minutesEl) minutesEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ==========================================================================
       SCROLL TO TRIGGER (HERO HIGHLIGHTS CLICK)
       ========================================================================== */
    const scrollTriggers = document.querySelectorAll('.scroll-to-trigger');
    scrollTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-target');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================================
       INTERSECTION OBSERVER - SCROLL REVEALS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once shown to prevent repeatedly triggering animations on scroll up
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       STATS COUNTERS ANIMATION
       ========================================================================== */
    const counterNums = document.querySelectorAll('.counter-num');
    let countersAnimated = false;

    function animateCounters() {
        counterNums.forEach(counter => {
            const targetValue = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 1500; // 1.5 seconds duration
            const increment = targetValue / (duration / 16); // 16ms per frame (approx 60fps)
            let currentValue = 0;

            const updateValue = () => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    counter.innerText = targetValue;
                } else {
                    counter.innerText = Math.floor(currentValue);
                    requestAnimationFrame(updateValue);
                }
            };
            updateValue();
        });
    }

    const statsSection = document.querySelector('.stats-counters');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       DYNAMIC ROADMAP TIMELINE PROGRESS FILL
       ========================================================================== */
    const timelineProgressFill = document.getElementById('timeline-fill');
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const timelineSection = document.querySelector('.timeline-section');

    function updateTimelineProgress() {
        if (!timelineSection || !timelineProgressFill || timelineNodes.length === 0) return;

        const timelineRect = timelineSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Find scroll ratio within the timeline section
        const startOffset = windowHeight * 0.7; // Start filling when section is 70% down viewport
        const endOffset = windowHeight * 0.3;   // Stop filling when section bottom crosses 30% viewport
        
        const sectionHeight = timelineRect.height;
        const scrolledDistance = -timelineRect.top + startOffset;
        const totalScrollableDistance = sectionHeight + startOffset - endOffset;
        
        let scrollPercent = scrolledDistance / totalScrollableDistance;
        scrollPercent = Math.max(0, Math.min(1, scrollPercent));
        
        // Update line fill
        timelineProgressFill.style.height = `${scrollPercent * 100}%`;

        // Activate Nodes individually based on vertical line crossing
        timelineNodes.forEach((node) => {
            const marker = node.querySelector('.timeline-marker');
            if (marker) {
                const markerTop = marker.getBoundingClientRect().top;
                // Activate if marker is above the center of viewport
                if (markerTop < windowHeight * 0.6) {
                    node.classList.add('active');
                } else {
                    // Only remove active if it is not the very first node
                    if (node !== timelineNodes[0]) {
                        node.classList.remove('active');
                    }
                }
            }
        });
    }

    window.addEventListener('scroll', updateTimelineProgress);
    updateTimelineProgress(); // run once on startup

    /* ==========================================================================
       REGISTRATION MODAL MANAGEMENT
       ========================================================================== */
    const modal = document.getElementById('registration-modal');
    const modalClose = document.querySelector('.modal-close-btn');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    
    // Checkboxes & Collapsible
    const checkQuiz = document.getElementById('check-quiz');
    const checkWorkshop = document.getElementById('check-workshop');
    const teamFields = document.getElementById('team-fields');
    const eventSelectError = document.getElementById('event-select-error');
    
    // Registration Form / Screens
    const regForm = document.getElementById('registration-form');
    const successScreen = document.getElementById('success-screen');
    const closeSuccessBtn = document.querySelector('.close-success-btn');

    function openModal(eventType = 'both') {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Pre-fill checkboxes based on button trigger
        if (checkQuiz && checkWorkshop) {
            if (eventType === 'quiz') {
                checkQuiz.checked = true;
                checkWorkshop.checked = false;
            } else if (eventType === 'workshop') {
                checkQuiz.checked = false;
                checkWorkshop.checked = true;
            } else {
                checkQuiz.checked = true;
                checkWorkshop.checked = true;
            }
            toggleTeamFields();
        }
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset forms and success views after close transitions finish
        setTimeout(() => {
            if (regForm) regForm.reset();
            if (successScreen) successScreen.classList.remove('active');
            if (eventSelectError) eventSelectError.innerText = '';
            toggleTeamFields();
        }, 400);
    }

    function toggleTeamFields() {
        if (!checkQuiz || !teamFields) return;
        if (checkQuiz.checked) {
            teamFields.classList.add('show');
        } else {
            teamFields.classList.remove('show');
        }
    }

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const eventType = btn.getAttribute('data-event') || 'both';
            openModal(eventType);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);
    
    // Click outside modal content to close
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Toggle teammates block dynamically on checkbox edits
    if (checkQuiz) {
        checkQuiz.addEventListener('change', toggleTeamFields);
    }

    // Modal Form Submission Handler
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check if at least one checkbox is checked
            const quizChecked = checkQuiz ? checkQuiz.checked : false;
            const workshopChecked = checkWorkshop ? checkWorkshop.checked : false;
            
            if (!quizChecked && !workshopChecked) {
                if (eventSelectError) {
                    eventSelectError.innerText = 'Please select at least one event (Quiz or Workshop) to register.';
                }
                return;
            } else {
                if (eventSelectError) eventSelectError.innerText = '';
            }

            // Animate submission trigger (mock database send)
            const submitBtn = regForm.querySelector('.submit-btn');
            const originalHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Processing...</span>';

            setTimeout(() => {
                // Restore button and switch screens
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHtml;
                
                if (successScreen) {
                    successScreen.classList.add('active');
                }
            }, 1200);
        });
    }

    /* ==========================================================================
       CONTACT FORM MESSAGE MOCK SUBMIT
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-form-status');

    if (contactForm && contactStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalHtml = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending Message...</span>';
            contactStatus.className = 'form-status-msg';
            contactStatus.style.display = 'none';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHtml;
                
                contactStatus.innerText = 'Thank you! Your message has been sent successfully. We will get back to you shortly.';
                contactStatus.classList.add('success');
                contactForm.reset();
            }, 1000);
        });
    }
});
