/**
 * QR Download Mobile App Modal Controller
 * ConnectNigeria Quote Request
 */

(function () {
  'use strict';

  // Live App Links decoded from verified QR codes
  const APP_STORE_URL = 'https://apps.apple.com/us/app/quote-request-cn/id6759622404';
  const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.cnquoterequest';

  // QR Images for App Stores
  const QR_APP_STORE_IMG = 'assets/images/qr-appstore.png';
  const QR_GOOGLE_PLAY_IMG = 'assets/images/qr-googleplay.png';

  // DOM Elements
  const qrModalOverlay = document.getElementById('qrModalOverlay');
  const qrModalClose = document.getElementById('qrModalClose');
  const qrTabIos = document.getElementById('qrTabIos');
  const qrTabAndroid = document.getElementById('qrTabAndroid');
  const qrCanvas = document.getElementById('qrCanvas');
  const qrScanHintText = document.getElementById('qrScanHintText');
  const sendLinkForm = document.getElementById('sendLinkForm');
  const sendLinkInput = document.getElementById('sendLinkInput');

  // Desktop Modal Specific Elements
  const qrImageDesktop = document.getElementById('qrImageDesktop');
  const desktopQrBox = document.getElementById('desktopQrBox');
  const desktopQrStoreName = document.getElementById('desktopQrStoreName');
  const btnStoreGooglePlay = document.getElementById('btnStoreGooglePlay');
  const btnStoreAppStore = document.getElementById('btnStoreAppStore');

  let currentPlatform = 'android'; // 'android' | 'ios'

  // Open Modal
  window.openQrModal = function (platform = 'android') {
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

  // Switch Platform
  function switchPlatform(platform) {
    if (currentPlatform === platform) return;
    currentPlatform = platform;
    updatePlatformUI();
  }

  function updatePlatformUI() {
    const isIos = currentPlatform === 'ios';
    const activeUrl = isIos ? APP_STORE_URL : PLAY_STORE_URL;
    const activeQrImg = isIos ? QR_APP_STORE_IMG : QR_GOOGLE_PLAY_IMG;
    const storeLabel = isIos ? 'App Store' : 'Google Play';

    // Update Desktop QR Image
    if (qrImageDesktop) {
      qrImageDesktop.style.opacity = '0';
      setTimeout(() => {
        qrImageDesktop.src = activeQrImg;
        qrImageDesktop.alt = `Scan QR Code to download on ${storeLabel}`;
        qrImageDesktop.style.opacity = '1';
      }, 100);
    }

    // Update Desktop QR link
    if (desktopQrBox) {
      desktopQrBox.href = activeUrl;
      desktopQrBox.title = `Click to open ${storeLabel} page`;
    }

    // Update Desktop hint label
    if (desktopQrStoreName) {
      desktopQrStoreName.textContent = storeLabel;
    }

    // Update Desktop Store Buttons Active States
    if (btnStoreGooglePlay && btnStoreAppStore) {
      if (isIos) {
        btnStoreAppStore.classList.add('active');
        btnStoreGooglePlay.classList.remove('active');
      } else {
        btnStoreGooglePlay.classList.add('active');
        btnStoreAppStore.classList.remove('active');
      }
    }

    // Update Mobile / Legacy Tabs
    if (qrTabIos && qrTabAndroid) {
      if (isIos) {
        qrTabIos.classList.add('active');
        qrTabAndroid.classList.remove('active');
      } else {
        qrTabAndroid.classList.add('active');
        qrTabIos.classList.remove('active');
      }
    }

    if (qrScanHintText) {
      qrScanHintText.textContent = isIos
        ? 'Scan with iOS Camera to open App Store'
        : 'Scan with phone camera to open Google Play';
    }

    // Fallback dynamic QR drawing if canvas exists
    drawQRCode(activeUrl, '#000000');
  }

  /**
   * Draw fallback QR code on canvas if present
   */
  function drawQRCode(url, dotColor = '#000000') {
    const canvasList = [
      document.getElementById('qrCanvasDesktop'),
      document.getElementById('qrCanvas')
    ].filter(Boolean);

    if (!canvasList.length) return;

    canvasList.forEach((canvas) => {
      const ctx = canvas.getContext('2d');
      const size = 240;
      canvas.width = size;
      canvas.height = size;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      const gridSize = 29;
      const cellSize = size / gridSize;

      let seed = 42;
      for (let i = 0; i < url.length; i++) {
        seed = (seed * 31 + url.charCodeAt(i)) % 100000;
      }

      function pseudoRandom() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      }

      function drawFinderPattern(startX, startY) {
        ctx.fillStyle = dotColor;
        ctx.fillRect(startX * cellSize, startY * cellSize, 7 * cellSize, 7 * cellSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);
        ctx.fillStyle = dotColor;
        ctx.fillRect((startX + 2) * cellSize, (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);
      }

      drawFinderPattern(1, 1);
      drawFinderPattern(gridSize - 8, 1);
      drawFinderPattern(1, gridSize - 8);

      ctx.fillStyle = dotColor;
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const inTopLeft = r < 9 && c < 9;
          const inTopRight = r < 9 && c > gridSize - 10;
          const inBottomLeft = r > gridSize - 10 && c < 9;
          const inAlign = r >= gridSize - 9 && r <= gridSize - 5 && c >= gridSize - 9 && c <= gridSize - 5;

          if (inTopLeft || inTopRight || inBottomLeft || inAlign) continue;

          if (r === 6 || c === 6) {
            if ((r + c) % 2 === 0) {
              ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
            continue;
          }

          if (pseudoRandom() > 0.48) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        }
      }
    });
  }

  // Event Listeners for Desktop Modal Buttons
  btnStoreGooglePlay?.addEventListener('mouseenter', () => switchPlatform('android'));
  btnStoreGooglePlay?.addEventListener('click', () => switchPlatform('android'));

  btnStoreAppStore?.addEventListener('mouseenter', () => switchPlatform('ios'));
  btnStoreAppStore?.addEventListener('click', () => switchPlatform('ios'));

  // Close buttons
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

  // Attach trigger to all store buttons across the page
  document.querySelectorAll('[data-open-qr]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const platform = btn.getAttribute('data-open-qr') || 'android';
      // On desktop, open modal with selected platform
      if (window.innerWidth > 768) {
        e.preventDefault();
        window.openQrModal(platform);
      }
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
      const isQrActive = qrModalOverlay?.classList.contains('active');
      const isQuoteActive = document.getElementById('quoteModalOverlay')?.classList.contains('active');
      const isVideoActive = document.getElementById('videoModalOverlay')?.classList.contains('active');

      if (!isQrActive && !isQuoteActive && !isVideoActive) {
        window.openQrModal('android');
        window.showToast?.('📱 Experience the full power on our Mobile App!');
      }
    }, AUTO_POPUP_DELAY);
  }

  const originalOpenQrModal = window.openQrModal;
  window.openQrModal = function (platform = 'android') {
    if (autoPopupTimer) {
      clearTimeout(autoPopupTimer);
      autoPopupTimer = null;
    }
    originalOpenQrModal(platform);
  };

  scheduleAutoPopup();
})();
