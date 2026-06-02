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
  const navMenu = document.querySelector('.nav-menu-left');
  
  // Toggle Header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Mobile Menu Hamburger Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('mobile-open');
    });
    
    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('mobile-open');
      });
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
  const form = document.querySelector('.interactive-form');
  const successModal = document.getElementById('successModal');
  const modalClose = document.getElementById('modalCloseBtn');
  
  if (form && successModal) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform validation checks
      let isValid = true;
      const inputs = form.querySelectorAll('[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'red';
        } else {
          input.style.borderColor = '';
        }
        
        // Email validation check
        if (input.type === 'email' && input.value) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value)) {
            isValid = false;
            input.style.borderColor = 'red';
          }
        }
        
        // Mobile number validation (10 digits check)
        if (input.type === 'tel' && input.value) {
          const phonePattern = /^\d{10}$/;
          if (!phonePattern.test(input.value.replace(/[^0-9]/g, ''))) {
            isValid = false;
            input.style.borderColor = 'red';
          }
        }
      });
      
      if (isValid) {
        // Show success modal dialog
        successModal.style.display = 'flex';
        form.reset();
      }
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
  // 5. Highlights Slider/Carousel Logic
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

