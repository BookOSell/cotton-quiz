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

        // Mouse interaction
        let mouse = { x: null, y: null, radius: 100 };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1; // Slightly larger for constellation
                this.speedX = Math.random() * 0.6 - 0.3;
                this.speedY = Math.random() * 0.6 - 0.3;
                // Turquoise Theme Colors
                const colors = ['rgba(0, 128, 128, ', 'rgba(0, 206, 209, ', 'rgba(128, 222, 234, '];
                this.colorBase = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.6 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Mouse interaction (repel)
                if (mouse.x && mouse.y) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= forceDirectionX * force * 3;
                        this.y -= forceDirectionY * force * 3;
                    }
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
        const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Connect particles with lines
        function connect() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                                 + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        let opacityValue = 1 - (distance / 15000);
                        if(opacityValue > 0) {
                            ctx.strokeStyle = 'rgba(0, 128, 128, ' + opacityValue * 0.3 + ')';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(particles[a].x, particles[a].y);
                            ctx.lineTo(particles[b].x, particles[b].y);
                            ctx.stroke();
                        }
                    }
                }
            }
        }

        // Animation Loop
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connect();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ==========================================================================
       FIXED TARGET COUNTDOWN TIMER
       Fixed target: September 7, 2026 at 09:00 AM IST (UTC+5:30)
       09:00 AM IST = 03:30 AM UTC
       ========================================================================== */
    // Fixed event date — MCB Debate Competition Day
    const countdownTarget = new Date('2026-09-07T03:30:00Z').getTime();

    const daysEl    = document.getElementById('days');
    const hoursEl   = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Helper: animate a flip effect whenever the value changes
    function setWithFlip(el, newVal) {
        if (!el) return;
        const formatted = String(newVal).padStart(2, '0');
        if (el.innerText !== formatted) {
            el.classList.remove('tick-flip');
            // Force reflow so animation re-triggers
            void el.offsetWidth;
            el.innerText = formatted;
            el.classList.add('tick-flip');
        }
    }

    function updateCountdown() {
        const now        = new Date().getTime();
        const difference = countdownTarget - now;

        if (difference <= 0) {
            // Timer expired — show a completed state
            clearInterval(countdownInterval);
            [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => {
                if (el) el.innerText = '00';
            });
            const countdownContainer = document.querySelector('.countdown-container');
            if (countdownContainer) {
                const labelEl = countdownContainer.querySelector('.countdown-label');
                if (labelEl) labelEl.innerText = '🎉 THE FEST HAS BEGUN!';
            }
            return;
        }

        // Correct time unit calculations
        const days    = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setWithFlip(daysEl,    days);
        setWithFlip(hoursEl,   hours);
        setWithFlip(minutesEl, minutes);
        setWithFlip(secondsEl, seconds);
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Run immediately so there's no 1s blank delay on load

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
       GALLERY LIGHTBOX INTERACTIVITY
       ========================================================================== */
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    const galleryImages = [];
    
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const placeholder = item.querySelector('.gallery-img-placeholder span');
        const title = item.querySelector('.gallery-overlay h4');
        const desc = item.querySelector('.gallery-overlay p');
        
        const imgSrc = img ? img.getAttribute('src') : 'https://placehold.co/600x400/F0FAFA/008080?text=Debate';
        const captionText = title ? `<strong>${title.innerText}</strong> - ${desc ? desc.innerText : ''}` : (placeholder ? placeholder.innerText : '');
        
        galleryImages.push({
            src: imgSrc,
            caption: captionText
        });
        
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });
    
    function openLightbox(index) {
        if (!lightbox) return;
        currentImageIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function updateLightboxContent() {
        if (!lightboxImg || !lightboxCaption || galleryImages.length === 0) return;
        lightboxImg.src = galleryImages[currentImageIndex].src;
        lightboxCaption.innerHTML = galleryImages[currentImageIndex].caption;
    }
    
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxContent();
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxContent();
    }
    
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
                closeLightbox();
            }
        });
    }
    
    window.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });

    /* ==========================================================================
       ORGANISING COMMITTEE SEARCH & FILTER
       ========================================================================== */
    const committeeSearchInput = document.getElementById('committee-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const committeeCards = document.querySelectorAll('.committee-card');
    
    let searchFilterQuery = '';
    let activeCategoryFilter = 'all';
    
    function filterCommittee() {
        committeeCards.forEach(card => {
            const name = (card.getAttribute('data-name') || '').toLowerCase();
            const category = card.getAttribute('data-category') || '';
            
            const matchesSearch = name.includes(searchFilterQuery);
            const matchesCategory = activeCategoryFilter === 'all' || category === activeCategoryFilter;
            
            if (matchesSearch && matchesCategory) {
                card.style.display = '';
                card.classList.add('active');
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    if (committeeSearchInput) {
        committeeSearchInput.addEventListener('input', (e) => {
            searchFilterQuery = e.target.value.toLowerCase().trim();
            filterCommittee();
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategoryFilter = btn.getAttribute('data-filter');
            filterCommittee();
        });
    });

    /* ==========================================================================
       IN-PAGE REGISTRATION FORM
       ========================================================================== */
    const inpageRegForm = document.getElementById('inpage-register-form');
    const regSuccessOverlay = document.getElementById('reg-success-overlay');
    const regNewBtn = document.getElementById('reg-new-btn');
    
    if (inpageRegForm && regSuccessOverlay) {
        inpageRegForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const teamNameVal = document.getElementById('reg-team-name').value.trim();
            const instVal = document.getElementById('reg-inst').value.trim();
            const leaderVal = document.getElementById('reg-leader').value.trim();
            const contactVal = document.getElementById('reg-contact').value.trim();
            const mailVal = document.getElementById('reg-mail').value.trim();
            
            const phoneDigits = contactVal.replace(/[^0-9]/g, '');
            if (phoneDigits.length < 10) {
                alert('Please enter a valid mobile number with at least 10 digits.');
                return;
            }
            
            document.getElementById('summary-team-name').innerText = teamNameVal;
            document.getElementById('summary-college').innerText = instVal;
            document.getElementById('summary-leader-name').innerText = leaderVal;
            document.getElementById('summary-email').innerText = mailVal;
            
            const submitBtn = inpageRegForm.querySelector('.submit-btn');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Processing...</span>';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                regSuccessOverlay.classList.add('active');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 1200);
        });
    }
    
    if (regNewBtn && regSuccessOverlay && inpageRegForm) {
        regNewBtn.addEventListener('click', () => {
            inpageRegForm.reset();
            regSuccessOverlay.classList.remove('active');
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
                contactStatus.style.display = 'block';
                contactForm.reset();
            }, 1000);
        });
    }
});
