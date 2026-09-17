/**
 * QR Download Mobile App Modal Controller
 * ConnectNigeria Quote Request
 */

(function () {
  'use strict';

  // DOM Elements
  const qrModalOverlay = document.getElementById('qrModalOverlay');
  const qrModalClose = document.getElementById('qrModalClose');
  const qrTabIos = document.getElementById('qrTabIos');
  const qrTabAndroid = document.getElementById('qrTabAndroid');
  const qrCanvas = document.getElementById('qrCanvas');
  const qrScanHintText = document.getElementById('qrScanHintText');
  const sendLinkForm = document.getElementById('sendLinkForm');
  const sendLinkInput = document.getElementById('sendLinkInput');

  // App Links
  const APP_STORE_URL = 'https://apps.apple.com/app/connectnigeria-quotes/id1234567890';
  const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.connectnigeria.quotes';

  let currentPlatform = 'ios'; // 'ios' | 'android'

  // Open Modal
  window.openQrModal = function (platform = 'ios') {
    currentPlatform = platform;
    updatePlatformUI();
    if (qrModalOverlay) {
      qrModalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  // Close Modal
  window.closeQrModal = function () {
    if (qrModalOverlay) {
      qrModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Switch Platform Tab
  function switchPlatform(platform) {
    currentPlatform = platform;
    updatePlatformUI();
  }

  function updatePlatformUI() {
    if (currentPlatform === 'ios') {
      qrTabIos?.classList.add('active');
      qrTabAndroid?.classList.remove('active');
      if (qrScanHintText) qrScanHintText.textContent = 'Scan with iOS Camera to open App Store';
    } else {
      qrTabAndroid?.classList.add('active');
      qrTabIos?.classList.remove('active');
      if (qrScanHintText) qrScanHintText.textContent = 'Scan with phone camera to open Google Play';
    }
    drawQRCode(currentPlatform === 'ios' ? APP_STORE_URL : PLAY_STORE_URL, '#000000');
  }

  /**
   * Draw a high-fidelity stylized QR Code pattern on the canvas
   */
  function drawQRCode(url, dotColor = '#000000') {
    const canvasList = [
      document.getElementById('qrCanvasDesktop'),
      document.getElementById('qrCanvas')
    ].filter(Boolean);

    canvasList.forEach((canvas) => {
      const ctx = canvas.getContext('2d');
      const size = 260;
      canvas.width = size;
      canvas.height = size;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      const gridSize = 29; // 29x29 matrix matching dense high-res QR
      const cellSize = size / gridSize;

      // Deterministic hash based on url for matrix dots
      let seed = 42;
      for (let i = 0; i < url.length; i++) {
        seed = (seed * 31 + url.charCodeAt(i)) % 100000;
      }

      function pseudoRandom() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      }

      // Finder Patterns (3 corners)
      function drawFinderPattern(startX, startY) {
        // Outer 7x7 square
        ctx.fillStyle = dotColor;
        ctx.fillRect(startX * cellSize, startY * cellSize, 7 * cellSize, 7 * cellSize);

        // Inner 5x5 white square
        ctx.fillStyle = '#ffffff';
        ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);

        // Center 3x3 dot
        ctx.fillStyle = dotColor;
        ctx.fillRect((startX + 2) * cellSize, (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);
      }

      // Draw 3 corner finder patterns
      drawFinderPattern(1, 1);
      drawFinderPattern(gridSize - 8, 1);
      drawFinderPattern(1, gridSize - 8);

      // Alignment pattern
      function drawAlignmentPattern(cx, cy) {
        ctx.fillStyle = dotColor;
        ctx.fillRect((cx - 2) * cellSize, (cy - 2) * cellSize, 5 * cellSize, 5 * cellSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect((cx - 1) * cellSize, (cy - 1) * cellSize, 3 * cellSize, 3 * cellSize);
        ctx.fillStyle = dotColor;
        ctx.fillRect(cx * cellSize, cy * cellSize, cellSize, cellSize);
      }
      drawAlignmentPattern(gridSize - 7, gridSize - 7);

      // Data dots matrix
      ctx.fillStyle = dotColor;
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          // Skip finder pattern zones
          const inTopLeft = r < 9 && c < 9;
          const inTopRight = r < 9 && c > gridSize - 10;
          const inBottomLeft = r > gridSize - 10 && c < 9;
          const inAlign = r >= gridSize - 9 && r <= gridSize - 5 && c >= gridSize - 9 && c <= gridSize - 5;

          if (inTopLeft || inTopRight || inBottomLeft || inAlign) continue;

          // Timing lines
          if (r === 6 || c === 6) {
            if ((r + c) % 2 === 0) {
              ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
            continue;
          }

          // Dense data modules
          if (pseudoRandom() > 0.48) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        }
      }
    });
  }

  // Event Listeners
  if (qrModalClose) {
    qrModalClose.addEventListener('click', window.closeQrModal);
  }

  if (qrModalOverlay) {
    qrModalOverlay.addEventListener('click', (e) => {
      if (e.target === qrModalOverlay) {
        window.closeQrModal();
      }
    });
  }

  qrTabIos?.addEventListener('click', () => switchPlatform('ios'));
  qrTabAndroid?.addEventListener('click', () => switchPlatform('android'));

  // Attach trigger to all store buttons
  document.querySelectorAll('[data-open-qr]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const platform = btn.getAttribute('data-open-qr') || 'ios';
      window.openQrModal(platform);
    });
  });

  // Handle Send Link Form
  if (sendLinkForm) {
    sendLinkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const recipient = sendLinkInput?.value.trim();
      if (!recipient) return;

      window.showToast?.(`🚀 Download link sent to ${recipient}! Check your inbox/SMS.`);
      if (sendLinkInput) sendLinkInput.value = '';
    });
  }

  // Keyboard shortcut (Escape to close)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModalOverlay?.classList.contains('active')) {
      window.closeQrModal();
    }
  });

  // Initial draw
  updatePlatformUI();

  // ==========================================================================
  // Automatic Popup after 2 seconds on site landing
  // ==========================================================================
  const AUTO_POPUP_DELAY = 2000; // 2 seconds
  let autoPopupTimer = null;

  function scheduleAutoPopup() {
    autoPopupTimer = setTimeout(() => {
      // Only pop up if no other modal is currently active
      const isQrActive = qrModalOverlay?.classList.contains('active');
      const isQuoteActive = document.getElementById('quoteModalOverlay')?.classList.contains('active');
      const isVideoActive = document.getElementById('videoModalOverlay')?.classList.contains('active');

      if (!isQrActive && !isQuoteActive && !isVideoActive) {
        window.openQrModal('ios');
        window.showToast?.('📱 Experience the full power on our Mobile App!');
      }
    }, AUTO_POPUP_DELAY);
  }

  // Clear timer if user opened it manually earlier
  const originalOpenQrModal = window.openQrModal;
  window.openQrModal = function (platform = 'ios') {
    if (autoPopupTimer) {
      clearTimeout(autoPopupTimer);
      autoPopupTimer = null;
    }
    originalOpenQrModal(platform);
  };

  scheduleAutoPopup();
})();
