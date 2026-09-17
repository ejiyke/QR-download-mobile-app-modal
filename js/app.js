/**
 * Main Application Logic & Interactions
 * ConnectNigeria Quote Request
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Sticky Header on Scroll
  // ==========================================================================
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // ==========================================================================
  // 2. Mobile Drawer Navigation
  // ==========================================================================
  const btnMobileMenu = document.getElementById('btnMobileMenu');
  const drawerOverlay = document.getElementById('mobileDrawerOverlay');
  const drawerClose = document.getElementById('mobileDrawerClose');

  function openDrawer() {
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  btnMobileMenu?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', (e) => {
    if (e.target === drawerOverlay) closeDrawer();
  });

  document.querySelectorAll('.drawer-nav-link').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================================================
  // 3. Hero Search & Category Quick Chips
  // ==========================================================================
  const heroSearchInput = document.getElementById('heroSearchInput');
  const btnHeroRequest = document.getElementById('btnHeroRequest');

  btnHeroRequest?.addEventListener('click', () => {
    const val = heroSearchInput?.value.trim() || 'Solar';
    window.openQuoteModal?.(val);
  });

  heroSearchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = heroSearchInput.value.trim() || 'Solar';
      window.openQuoteModal?.(val);
    }
  });

  document.querySelectorAll('.tag-btn[data-category]').forEach((tag) => {
    tag.addEventListener('click', () => {
      const cat = tag.getAttribute('data-category');
      if (heroSearchInput) {
        heroSearchInput.value = cat;
      }
      window.openQuoteModal?.(cat);
    });
  });

  // ==========================================================================
  // 4. FAQ Accordion & Tabs (Customers vs Vendors)
  // ==========================================================================
  const faqTabCustomers = document.getElementById('faqTabCustomers');
  const faqTabVendors = document.getElementById('faqTabVendors');
  const faqListCustomers = document.getElementById('faqListCustomers');
  const faqListVendors = document.getElementById('faqListVendors');

  function switchFaqTab(tab) {
    if (tab === 'customers') {
      faqTabCustomers?.classList.add('active');
      faqTabVendors?.classList.remove('active');
      if (faqListCustomers) faqListCustomers.style.display = 'flex';
      if (faqListVendors) faqListVendors.style.display = 'none';
    } else {
      faqTabVendors?.classList.add('active');
      faqTabCustomers?.classList.remove('active');
      if (faqListCustomers) faqListCustomers.style.display = 'none';
      if (faqListVendors) faqListVendors.style.display = 'flex';
    }
  }

  faqTabCustomers?.addEventListener('click', () => switchFaqTab('customers'));
  faqTabVendors?.addEventListener('click', () => switchFaqTab('vendors'));

  // Accordion Expand / Collapse
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const parentItem = button.closest('.faq-item');
      const isAlreadyActive = parentItem.classList.contains('active');

      // Close other active items in current list
      const currentList = button.closest('.faq-accordion-list');
      currentList?.querySelectorAll('.faq-item.active').forEach((item) => {
        if (item !== parentItem) {
          item.classList.remove('active');
        }
      });

      parentItem.classList.toggle('active', !isAlreadyActive);
    });
  });

  // ==========================================================================
  // 5. Video Player Modal
  // ==========================================================================
  const videoModalOverlay = document.getElementById('videoModalOverlay');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoModalTitle = document.getElementById('videoModalTitle');

  window.openVideoModal = function (title) {
    if (videoModalTitle) videoModalTitle.textContent = title || 'How Quote Request Works';
    videoModalOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeVideoModal = function () {
    videoModalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-video-title]').forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-video-title');
      window.openVideoModal(title);
    });
  });

  videoModalClose?.addEventListener('click', window.closeVideoModal);
  videoModalOverlay?.addEventListener('click', (e) => {
    if (e.target === videoModalOverlay) window.closeVideoModal();
  });

  // ==========================================================================
  // 6. See All Categories Toggle
  // ==========================================================================
  const btnSeeAllCategories = document.getElementById('btnSeeAllCategories');
  const extraCategories = document.querySelectorAll('.category-extra');

  let categoriesExpanded = false;
  btnSeeAllCategories?.addEventListener('click', () => {
    categoriesExpanded = !categoriesExpanded;
    extraCategories.forEach((cat) => {
      cat.style.display = categoriesExpanded ? 'block' : 'none';
    });
    if (btnSeeAllCategories) {
      const textSpan = btnSeeAllCategories.querySelector('.btn-see-all-text');
      if (textSpan) {
        textSpan.textContent = categoriesExpanded ? 'Show Less' : 'See All';
      }
      const iconSpan = btnSeeAllCategories.querySelector('.btn-see-all-icon');
      if (iconSpan) {
        iconSpan.textContent = categoriesExpanded ? '↑' : '→';
      }
    }
  });

  // ==========================================================================
  // 7. Toast Notification System
  // ==========================================================================
  const toastContainer = document.getElementById('toastContainer');

  window.showToast = function (message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // ==========================================================================
  // 8. Floating Feedback Widget
  // ==========================================================================
  const feedbackBtn = document.getElementById('floatingFeedbackBtn');
  feedbackBtn?.addEventListener('click', () => {
    const feedback = prompt('We would love your feedback on Quote Request:');
    if (feedback && feedback.trim()) {
      window.showToast('❤️ Thank you! Your feedback has been submitted.');
    }
  });

})();
