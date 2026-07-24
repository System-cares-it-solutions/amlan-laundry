/* ============================================
   THE SALAVAI LAUNDRY - Sakthi Masala Interactive JS
   ============================================ */

(function () {
  'use strict';

  // =============================================
  // 1. TOP SCROLL PROGRESS BAR
  // =============================================
  const progressBar = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!progressBar) return;
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }

  // =============================================
  // 2. AOS (ANIMATE ON SCROLL) INTERSECTION OBSERVER
  // =============================================
  function initAOS() {
    const aosElements = document.querySelectorAll('[data-aos]');

    const aosObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-aos-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, delay);
          aosObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    aosElements.forEach(el => aosObserver.observe(el));
  }

  // =============================================
  // 3. SAKTHI STYLE SERVICE CATEGORY FILTERING TABS
  // =============================================
  function initCategoryFilter() {
    const filterTabs = document.querySelectorAll('.filter-tab, .filter-icon-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    if (!filterTabs.length || !serviceCards.length) return;

    function applyFilter(filter) {
      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          card.style.display = 'flex';
          card.style.animation = 'none';
          card.offsetHeight; // Force reflow to restart animation on re-click
          card.style.animation = 'service3DUnfold 0.65s cubic-bezier(0.2, 0.9, 0.3, 1.2) forwards';
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Filter service cards on initial load based on default active button
    const activeTab = document.querySelector('.filter-tab.active, .filter-icon-btn.active');
    if (activeTab) {
      applyFilter(activeTab.getAttribute('data-filter'));
    }

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        applyFilter(tab.getAttribute('data-filter'));
      });
    });
  }

  // =============================================
  // 4. HERO SLIDER LOGIC
  // =============================================
  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slide-dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    let current = 0;
    let autoplayTimer = null;

    if (!slides.length) return;

    function goToSlide(index) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function nextSlide() { goToSlide(current + 1); }
    function prevSlide() { goToSlide(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetAutoplay();
      });
    });

    function startAutoplay() {
      autoplayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    startAutoplay();
  }

  // =============================================
  // 5. STICKY HEADER & NAV HIGHLIGHT
  // =============================================
  function initHeader() {
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTop = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      // Header shadow class
      if (header) {
        if (scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }

      // Scroll top button
      if (scrollTop) {
        if (scrollY > 400) scrollTop.classList.add('visible');
        else scrollTop.classList.remove('visible');
      }

      // Highlight active nav link based on scroll section
      let currentSection = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        const height = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentSection = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
          link.classList.add('active');
        }
      });

      updateScrollProgress();
    });

    if (scrollTop) {
      scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // =============================================
  // 6. MOBILE MENU TOGGLE WITH BACKDROP
  // =============================================
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (!hamburger || !nav) return;

    // Create backdrop overlay element if not exists
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    function toggleMenu() {
      const isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      backdrop.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', closeMenu);

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  // =============================================
  // 7. COUNTER ANIMATION FOR HERO/ABOUT STATS
  // =============================================
  function initCounters() {
    const statElements = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let currentNum = 0;
          const duration = 1600;
          const increment = Math.ceil(targetNum / (duration / 16));

          const timer = setInterval(() => {
            currentNum += increment;
            if (currentNum >= targetNum) {
              el.textContent = targetNum.toLocaleString() + suffix;
              clearInterval(timer);
            } else {
              el.textContent = currentNum.toLocaleString() + suffix;
            }
          }, 16);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statElements.forEach(el => observer.observe(el));
  }

  // =============================================
  // 8. BOOKING FORM SUBMISSION & TOAST NOTIFICATION
  // =============================================
  function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const submitBtn = document.getElementById('submitBtn');

    if (!bookingForm) return;

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const address = document.getElementById('address').value.trim();
      const service = document.getElementById('service').value;

      if (!name || !phone || !address || !service) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Booking Your Pickup...';

      await new Promise(r => setTimeout(r, 1400));

      showToast(`Doorstep pickup booked for ${name}! Our representative will call ${phone} shortly.`, 'success');
      bookingForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Book My Pickup';
    });
  }

  // Toast notification
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.salavai-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'salavai-toast salavai-toast-' + type;
    toast.textContent = message;

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '90px',
      right: '24px',
      background: type === 'success' ? 'rgb(198, 34, 34)' : '#d32f2f',
      color: '#fff',
      padding: '14px 24px',
      borderRadius: '30px',
      boxShadow: '0 8px 30px rgba(198,34,34,0.4)',
      fontSize: '14px',
      fontWeight: '600',
      zIndex: '10000',
      transition: 'all 0.4s ease'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // =============================================
  // ABOUT SECTION FRAME SLIDERS (3s SHIFTING)
  // =============================================
  function initAboutFrameSliders() {
    const frame1Slides = document.querySelectorAll('#aboutFrame1 .frame-slide');
    const frame2Slides = document.querySelectorAll('#aboutFrame2 .frame-slide');

    if (frame1Slides.length) {
      let idx1 = 0;
      setInterval(() => {
        frame1Slides[idx1].classList.remove('active');
        idx1 = (idx1 + 1) % frame1Slides.length;
        frame1Slides[idx1].classList.add('active');
      }, 3000);
    }

    if (frame2Slides.length) {
      let idx2 = 0;
      setInterval(() => {
        frame2Slides[idx2].classList.remove('active');
        idx2 = (idx2 + 1) % frame2Slides.length;
        frame2Slides[idx2].classList.add('active');
      }, 3000);
    }
  }

  // =============================================
  // WHY CHOOSE US FRAMER EXPAND-ONHOVER LIST LOGIC
  // =============================================
  function initExpandHoverList() {
    const items = document.querySelectorAll('.expand-hover-item');
    if (!items.length) return;

    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  // =============================================
  // TECHNOLOGY SECTION TAB SWITCHING & IMAGE SWAP
  // =============================================
  function initTechTabs() {
    const tabs = document.querySelectorAll('.tspec-tab');
    const panels = document.querySelectorAll('.tspec-panel');
    const techImg = document.getElementById('techBigImg');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');

        const targetPanel = document.getElementById('tab-' + tab.dataset.tab);
        if (targetPanel) targetPanel.classList.add('active');

        if (techImg && tab.dataset.img) {
          techImg.style.opacity = '0.2';
          setTimeout(() => {
            techImg.src = tab.dataset.img;
            techImg.style.opacity = '1';
          }, 150);
        }
      });
    });
  }

  // Initialize all functions on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    initHeroSlider();
    initHeader();
    initMobileMenu();
    initCounters();
    initCategoryFilter();
    initBookingForm();
    initAboutFrameSliders();
    initExpandHoverList();
    initTechTabs();
  });

})();
