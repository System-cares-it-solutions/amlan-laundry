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
  // HEADER TRANSPARENT & SCROLLED HANDLER
  // =============================================
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    function handleScroll() {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      updateScrollProgress();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
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
      autoplayTimer = setInterval(nextSlide, 20000);
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
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTop = document.getElementById('scrollTop');

    // Automatically highlight active nav link based on current page URL
    function updateActiveNavLink() {
      const path = window.location.pathname.toLowerCase();
      let pageName = path.substring(path.lastIndexOf('/') + 1).split('#')[0].split('?')[0];
      if (!pageName || pageName === '') pageName = 'index.html';

      navLinks.forEach(link => {
        if (link.classList.contains('nav-btn-pickup')) return;

        const href = (link.getAttribute('href') || '').toLowerCase();
        let linkPage = href.substring(href.lastIndexOf('/') + 1).split('#')[0].split('?')[0];
        if (!linkPage) linkPage = 'index.html';

        const isCurrentPage = (
          (pageName === 'index.html' && linkPage === 'index.html') ||
          (pageName === linkPage) ||
          (pageName === 'our-story.html' && linkPage === 'about.html')
        );

        if (isCurrentPage) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    updateActiveNavLink();

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

      updateScrollProgress();
    });

    // Smooth scroll for Home links & logo on index page
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/') || !window.location.pathname.includes('.html');
    
    document.querySelectorAll('a[href="#home"], a[href="index.html#home"], a[href="index.html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (isHomePage) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
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
      }, 20000);
    }

    if (frame2Slides.length) {
      let idx2 = 0;
      setInterval(() => {
        frame2Slides[idx2].classList.remove('active');
        idx2 = (idx2 + 1) % frame2Slides.length;
        frame2Slides[idx2].classList.add('active');
      }, 20000);
    }
  }

  // =============================================
  // WHY CHOOSE US FRAMER EXPAND-ONHOVER LIST LOGIC
  // =============================================
  function initExpandHoverList() {
    const items = document.querySelectorAll('.expand-hover-item');
    if (!items.length) return;

    items.forEach(item => {
      function activateItem() {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
      item.addEventListener('mouseenter', activateItem);
      item.addEventListener('click', activateItem);
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

  // =============================================
  // 13. JOIN US NAV DROPDOWN LOGIC
  // =============================================
  function initJoinUsDropdown() {
    const dropdown = document.getElementById('joinUsDropdown');
    const toggleBtn = document.getElementById('joinUsBtn');
    const items = document.querySelectorAll('#joinUsMenu .dropdown-item');

    if (!dropdown || !toggleBtn) return;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      dropdown.classList.toggle('open', !isOpen);
      toggleBtn.setAttribute('aria-expanded', !isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    items.forEach(item => {
      item.addEventListener('click', () => {
        dropdown.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');

        const programName = item.getAttribute('data-program');
        const messageInput = document.querySelector('#contact textarea, input[name="notes"]');
        if (messageInput && programName) {
          messageInput.value = `Enquiry regarding: ${programName}`;
        }
      });
    });
  }

  // =============================================
  // 14. NAV PROGRAM & SERVICE LINKS HANDLER
  // =============================================
  // =============================================
  // 15. STORE LOCATOR SEARCH HANDLER
  // =============================================
  function initStoreLocatorSearch() {
    const searchInput = document.getElementById('storeSearchInput');
    const searchBtn = document.getElementById('storeSearchBtn');
    const chips = document.querySelectorAll('.pincode-chip');
    const storeCards = document.querySelectorAll('.store-card-item');

    if (!storeCards.length) return;

    function filterStores(query) {
      const q = query.trim().toLowerCase();
      let matchedCount = 0;

      storeCards.forEach(card => {
        const pincode = card.getAttribute('data-pincode') || '';
        const keywords = card.getAttribute('data-keywords') || '';

        if (!q || pincode.toLowerCase().includes(q) || keywords.toLowerCase().includes(q)) {
          card.style.display = 'flex';
          matchedCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Highlight matching chip if available
      chips.forEach(chip => {
        const chipVal = chip.getAttribute('data-search').toLowerCase();
        chip.classList.toggle('active', chipVal === q);
        if (chipVal === q) {
          chip.style.background = '#0c2540';
          chip.style.color = '#ffffff';
        } else {
          chip.style.background = 'rgba(12, 37, 64, 0.08)';
          chip.style.color = '#0c2540';
        }
      });
    }

    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', () => {
        filterStores(searchInput.value);
        const locationsSec = document.getElementById('storeLocations');
        if (locationsSec) locationsSec.scrollIntoView({ behavior: 'smooth' });
      });

      searchInput.addEventListener('keyup', (e) => {
        filterStores(searchInput.value);
        if (e.key === 'Enter') {
          const locationsSec = document.getElementById('storeLocations');
          if (locationsSec) locationsSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const searchVal = chip.getAttribute('data-search');
        if (searchInput) searchInput.value = searchVal;
        filterStores(searchVal);
        const locationsSec = document.getElementById('storeLocations');
        if (locationsSec) locationsSec.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // =============================================
  // 16. FAQ ACCORDION TOGGLE
  // =============================================
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question-btn');
      const content = item.querySelector('.faq-answer-content');
      const icon = item.querySelector('.faq-icon');

      if (!btn || !content) return;

      btn.addEventListener('click', () => {
        const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

        // Close other items
        faqItems.forEach(otherItem => {
          const otherContent = otherItem.querySelector('.faq-answer-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherContent) otherContent.style.maxHeight = '0px';
          if (otherIcon) {
            otherIcon.textContent = '+';
            otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        // Toggle current item
        if (!isOpen) {
          content.style.maxHeight = content.scrollHeight + 'px';
          if (icon) {
            icon.textContent = '−';
            icon.style.transform = 'rotate(180deg)';
          }
        } else {
          content.style.maxHeight = '0px';
          if (icon) {
            icon.textContent = '+';
            icon.style.transform = 'rotate(0deg)';
          }
        }
      });
    });
  }

  // =============================================
  // 17. PROGRAM NAVIGATION HANDLERS (FALLBACK)
  // =============================================
  function initNavProgramHandlers() {
    // Helper for program navigation links
  }

  // Initialize all functions on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof initAOS === 'function') initAOS();
    if (typeof initHeroSlider === 'function') initHeroSlider();
    if (typeof initHeader === 'function') initHeader();
    if (typeof initMobileMenu === 'function') initMobileMenu();
    if (typeof initCounters === 'function') initCounters();
    if (typeof initCategoryFilter === 'function') initCategoryFilter();
    if (typeof initBookingForm === 'function') initBookingForm();
    if (typeof initAboutFrameSliders === 'function') initAboutFrameSliders();
    if (typeof initExpandHoverList === 'function') initExpandHoverList();
    if (typeof initTechTabs === 'function') initTechTabs();
    if (typeof initJoinUsDropdown === 'function') initJoinUsDropdown();
    if (typeof initNavProgramHandlers === 'function') initNavProgramHandlers();
    if (typeof initStoreLocatorSearch === 'function') initStoreLocatorSearch();
    if (typeof initFAQAccordion === 'function') initFAQAccordion();
  });

})();

