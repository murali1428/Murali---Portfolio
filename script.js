document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
    1. HTML5 Canvas Particles System (Drifting Cyan Stars)
    ========================================================================== */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let particlesArray = [];
  const numberOfParticles = 75; // Balanced for good looks and high performance

  // Set canvas bounds
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  setCanvasSize();

  // Particle Class Definition
  class Particle {
    constructor() {
      this.reset();
      // Randomize initial positions fully across screen
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10; // Start slightly below viewport
      this.size = Math.random() * 2 + 1; // 1px to 3px
      this.speedX = Math.random() * 0.4 - 0.2; // Slow horizontal float
      this.speedY = -(Math.random() * 0.5 + 0.2); // Slow upward float
      this.opacity = Math.random() * 0.6 + 0.15;
      this.pulseSpeed = Math.random() * 0.015 + 0.005;
      this.pulseDir = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Handle off-screen transitions
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
      }

      // Smooth opacity breath/pulse
      this.opacity += this.pulseSpeed * this.pulseDir;
      if (this.opacity > 0.85 || this.opacity < 0.15) {
        this.pulseDir *= -1;
      }
    }

    draw() {
      ctx.fillStyle = `rgba(0, 245, 255, ${this.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00f5ff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize Particle Array
  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  initParticles();

  // Animation Loop
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and update particles
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#00f5ff';

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }

    // Reset shadow blur to avoid affecting other draws if any
    ctx.shadowBlur = 0;

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Handle Resize Event
  let resizeTimeout;
  window.addEventListener('resize', () => {
    // Debounce to improve performance
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setCanvasSize();
      initParticles();
    }, 150);
  });


  /* ==========================================================================
    2. Asynchronous Glitching Typewriter Console
    ========================================================================== */
  const words = ["Flutter Developer", "Mobile App Developer", "Building Production-Ready Applications"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedTextSpan = document.getElementById("typedText");

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typingSpeed = isDeleting ? 30 : 60;

    // Glitchy terminal feel - add slight random speed variations
    typingSpeed += Math.random() * 20;

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2200; // Standstill at completion
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Brief delay before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  // Launch Typewriter Loop
  if (typedTextSpan) {
    setTimeout(type, 1000);
  }


  /* ==========================================================================
    3. IntersectionObserver Section Scroll Reveal
    ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-hidden');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Reveal once only
      }
    });
  }, {
    threshold: 0.1, // Element is revealed when 10% is inside screen bounds
    rootMargin: '0px 0px -50px 0px' // Slightly offset bottom threshold
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ==========================================================================
    4. Navigation ScrollSpy Observer
    ========================================================================== */
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        // Remove active class from all links
        navItems.forEach(item => {
          item.classList.remove('active');
          const link = item.querySelector('a');
          if (link && link.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.4 // High threshold to ensure proper tracking when centering sections
  });

  sections.forEach(sec => spyObserver.observe(sec));


  /* ==========================================================================
    5. Responsive Mobile Navigation Drawer
    ========================================================================== */
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = navLinks.querySelectorAll('a');

  // Toggle navigation visibility
  hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close nav screen on link tap (crucial for responsive UX)
  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
      hamburgerMenu.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Dynamic header style adjustment on scrolling
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.height = '70px';
      navbar.style.background = 'rgba(5, 5, 16, 0.95)';
    } else {
      navbar.style.height = '80px';
      navbar.style.background = 'rgba(5, 5, 16, 0.85)';
    }
  });

});
