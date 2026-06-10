/**
 * Global JavaScript File for Shyama Public School Website
 * Implements mobile menu, counter animation, form validation, gallery filtering, and image lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Navigation & Scroll Effects
  // ==========================================
  const header = document.querySelector('header');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('header .nav-container > .nav-menu-left');
  
  // Toggle Header background on scroll
  window.addEventListener('scroll', () => {
    if (!header) {
      return;
    }

    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Mobile Menu Hamburger Toggle
  if (mobileToggle && navMenu) {
    if (!navMenu.id) {
      navMenu.id = 'primary-navigation';
    }

    mobileToggle.setAttribute('aria-controls', navMenu.id);
    mobileToggle.setAttribute('aria-expanded', 'false');

    const closeMobileMenu = () => {
      mobileToggle.classList.remove('open');
      navMenu.classList.remove('mobile-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    };

    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('mobile-open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });
    
    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    });
  }

  // ==========================================
  // 2. Numerical Counter Animation (Home Page)
  // ==========================================
  const counterElements = document.querySelectorAll('.stat-count');
  
  if (counterElements.length > 0) {
    const runCounters = () => {
      counterElements.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        const duration = 2000; // Animation duration in ms
        const increment = target / (duration / 16); // ~60fps
        
        const updateCount = () => {
          count += increment;
          if (count < target) {
            counter.innerText = Math.floor(count) + suffix;
            requestAnimationFrame(updateCount);
          } else {
            counter.innerText = target + suffix;
          }
        };
        updateCount();
      });
    };

    // Intersection Observer to start counters when visible
    const observerOptions = {
      root: null,
      threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounters();
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  // ==========================================
  // 3. Gallery Filtering & Lightbox (Gallery Page)
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxClose = document.querySelector('.lightbox-close');
  
  // Gallery Filtering
  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from other buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => item.style.opacity = '1', 50);
          } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 300);
          }
        });
      });
    });
  }
  
  // Gallery Lightbox popup
  if (galleryItems.length > 0 && lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        lightboxImg.setAttribute('src', imgSrc);
        lightbox.style.display = 'flex';
      });
    });
    
    // Close lightbox on click close icon
    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.style.display = 'none';
      });
    }
    
    // Close lightbox on click outside the image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
      }
    });
  }

  // ==========================================
  // 4. Client-side Form Validation & Modals
  // ==========================================
  const forms = document.querySelectorAll('.interactive-form');
  const successModal = document.getElementById('successModal');
  const modalClose = document.getElementById('modalCloseBtn');
  
  if (forms.length > 0 && successModal) {
    const schoolEmail = 'shyamapublicschool1998@gmail.com';

    const getFieldLabel = (field) => {
      if (field.id) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label) {
          return label.textContent.replace('*', '').trim();
        }
      }

      return field.name || field.id || 'Field';
    };

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform validation checks
        let isValid = true;
        const inputs = form.querySelectorAll('[required]');

        inputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
            input.setAttribute('aria-invalid', 'true');
          } else {
            input.style.borderColor = '';
            input.removeAttribute('aria-invalid');
          }

          // Email validation check
          if (input.type === 'email' && input.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value)) {
              isValid = false;
              input.style.borderColor = 'red';
              input.setAttribute('aria-invalid', 'true');
            }
          }

          // Mobile number validation (10 digits check)
          if (input.type === 'tel' && input.value) {
            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(input.value.replace(/[^0-9]/g, ''))) {
              isValid = false;
              input.style.borderColor = 'red';
              input.setAttribute('aria-invalid', 'true');
            }
          }
        });

        if (isValid) {
          const formType = form.dataset.formType || 'Website Inquiry';
          const fields = Array.from(form.querySelectorAll('input, select, textarea'));
          const messageLines = fields
            .filter(field => field.value.trim())
            .map(field => `${getFieldLabel(field)}: ${field.value.trim()}`);
          const body = [
            `Hello Shyama Public School,`,
            '',
            `Please review this ${formType.toLowerCase()} submitted from the website:`,
            '',
            ...messageLines
          ].join('\n');
          const mailtoUrl = `mailto:${schoolEmail}?subject=${encodeURIComponent(formType)}&body=${encodeURIComponent(body)}`;

          window.location.href = mailtoUrl;

          successModal.style.display = 'flex';
          form.reset();
        }
      });
    });
    
    // Close success modal
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        successModal.style.display = 'none';
      });
    }
    
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.style.display = 'none';
      }
    });
  }

  // ==========================================
  // 5. Premium UI Micro Interactions
  // ==========================================
  const interactiveCards = document.querySelectorAll(
    '.feature-card, .facility-card, .testimonial-card, .academics-box-card, .timeline-card, .contact-info-card, .stat-card, .asym-card'
  );

  interactiveCards.forEach(card => {
    card.classList.add('interactive-card');
    card.setAttribute('tabindex', '0');

    const expandCard = () => {
      interactiveCards.forEach(item => {
        if (item !== card) {
          item.classList.remove('is-expanded');
        }
      });
      card.classList.toggle('is-expanded');
    };

    card.addEventListener('click', expandCard);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        expandCard();
      }
    });
  });

  const pressableControls = document.querySelectorAll('.btn, .btn-slanted-pill, .filter-btn, .carousel-control');
  pressableControls.forEach(control => {
    control.addEventListener('pointerdown', () => control.classList.add('is-pressed'));
    ['pointerup', 'pointerleave', 'blur'].forEach(eventName => {
      control.addEventListener(eventName, () => control.classList.remove('is-pressed'));
    });
  });

  // ==========================================
  // 6. Highlights Slider/Carousel Logic
  // ==========================================
  const slider = document.getElementById('announcementsSlider');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicators = document.querySelectorAll('.carousel-indicators .indicator');
  
  if (slider && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;
    
    const updateSlider = () => {
      // Move slider
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update indicators
      indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    };
    
    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    };
    
    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider();
    };
    
    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    };
    
    const stopAutoSlide = () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    };
    
    // Click listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide(); // Reset interval
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide(); // Reset interval
      });
    }
    
    // Indicators listeners
    indicators.forEach(indicator => {
      indicator.addEventListener('click', (e) => {
        currentSlide = parseInt(e.target.getAttribute('data-slide'), 10);
        updateSlider();
        startAutoSlide(); // Reset interval
      });
    });
    
    // Start auto slide initially
    startAutoSlide();
    
    // Stop sliding when hovering over the slider
    const container = document.querySelector('.carousel-container');
    if (container) {
      container.addEventListener('mouseenter', stopAutoSlide);
      container.addEventListener('mouseleave', startAutoSlide);
    }
  }
});
