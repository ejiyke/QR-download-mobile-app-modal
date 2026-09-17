/**
 * Quote Request Multi-Step Wizard Modal Controller
 * ConnectNigeria Quote Request
 */

(function () {
  'use strict';

  const quoteModalOverlay = document.getElementById('quoteModalOverlay');
  const quoteModalClose = document.getElementById('quoteModalClose');
  const btnPrevStep = document.getElementById('btnPrevStep');
  const btnNextStep = document.getElementById('btnNextStep');

  const step1Pane = document.getElementById('step1Pane');
  const step2Pane = document.getElementById('step2Pane');
  const step3Pane = document.getElementById('step3Pane');
  const stepSuccessPane = document.getElementById('stepSuccessPane');

  const stepIndicators = document.querySelectorAll('.step-indicator');
  const stepLines = document.querySelectorAll('.step-line');

  let currentStep = 1;
  let selectedCategory = 'Solar & Renewable Energy';

  window.openQuoteModal = function (categoryName) {
    if (categoryName) {
      selectedCategory = categoryName;
      selectCategoryButton(categoryName);
    }
    currentStep = 1;
    updateWizardUI();
    if (quoteModalOverlay) {
      quoteModalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeQuoteModal = function () {
    if (quoteModalOverlay) {
      quoteModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  function selectCategoryButton(categoryName) {
    document.querySelectorAll('.category-option-btn').forEach((btn) => {
      if (btn.textContent.trim().toLowerCase() === categoryName.trim().toLowerCase()) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }

  function updateWizardUI() {
    // Hide all panes
    [step1Pane, step2Pane, step3Pane, stepSuccessPane].forEach((pane) => {
      pane?.classList.remove('active');
    });

    // Update step Indicators
    stepIndicators.forEach((ind, index) => {
      const stepNum = index + 1;
      ind.classList.remove('active', 'done');
      if (stepNum === currentStep) {
        ind.classList.add('active');
      } else if (stepNum < currentStep) {
        ind.classList.add('done');
      }
    });

    stepLines.forEach((line, index) => {
      const lineStep = index + 1;
      line.classList.remove('done');
      if (lineStep < currentStep) {
        line.classList.add('done');
      }
    });

    // Show active pane
    if (currentStep === 1) {
      step1Pane?.classList.add('active');
      if (btnPrevStep) btnPrevStep.style.display = 'none';
      if (btnNextStep) {
        btnNextStep.style.display = 'block';
        btnNextStep.textContent = 'Next: Project Details →';
      }
    } else if (currentStep === 2) {
      step2Pane?.classList.add('active');
      if (btnPrevStep) btnPrevStep.style.display = 'block';
      if (btnNextStep) {
        btnNextStep.style.display = 'block';
        btnNextStep.textContent = 'Next: Contact Info →';
      }
    } else if (currentStep === 3) {
      step3Pane?.classList.add('active');
      if (btnPrevStep) btnPrevStep.style.display = 'block';
      if (btnNextStep) {
        btnNextStep.style.display = 'block';
        btnNextStep.textContent = 'Submit Quote Request ✨';
      }
    } else if (currentStep === 4) {
      stepSuccessPane?.classList.add('active');
      if (btnPrevStep) btnPrevStep.style.display = 'none';
      if (btnNextStep) {
        btnNextStep.style.display = 'block';
        btnNextStep.textContent = 'Done';
      }
    }
  }

  // Category Selection
  document.querySelectorAll('.category-option-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-option-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedCategory = btn.textContent.trim();
    });
  });

  // Next / Prev Navigation
  if (btnNextStep) {
    btnNextStep.addEventListener('click', () => {
      if (currentStep === 1) {
        currentStep = 2;
        updateWizardUI();
      } else if (currentStep === 2) {
        currentStep = 3;
        updateWizardUI();
      } else if (currentStep === 3) {
        // Submit
        currentStep = 4;
        updateWizardUI();
        window.showToast?.('🎉 Your quote request has been posted to 100+ verified businesses!');
      } else if (currentStep === 4) {
        window.closeQuoteModal();
      }
    });
  }

  if (btnPrevStep) {
    btnPrevStep.addEventListener('click', () => {
      if (currentStep > 1 && currentStep < 4) {
        currentStep--;
        updateWizardUI();
      }
    });
  }

  // Close triggers
  if (quoteModalClose) quoteModalClose.addEventListener('click', window.closeQuoteModal);
  if (quoteModalOverlay) {
    quoteModalOverlay.addEventListener('click', (e) => {
      if (e.target === quoteModalOverlay) window.closeQuoteModal();
    });
  }

  // Open triggers across page
  document.querySelectorAll('[data-open-quote]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = btn.getAttribute('data-open-quote') || '';
      window.openQuoteModal(cat);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quoteModalOverlay?.classList.contains('active')) {
      window.closeQuoteModal();
    }
  });
})();
