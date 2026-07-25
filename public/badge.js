/**
 * Madmoon Trust Badge Embed Script
 * @version 1.0.0
 * @license Apache-2.0
 * 
 * Usage:
 * <script src="https://madmoon.jo/badge.js" data-store="amman-artisans" data-position="bottom-right" data-theme="dark" async></script>
 */
(function () {
  'use strict';

  // Prevent duplicate execution if script is embedded multiple times
  if (window.__MADMOON_BADGE_INITIALIZED__) return;
  window.__MADMOON_BADGE_INITIALIZED__ = true;

  // Identify current running script element
  const currentScript = document.currentScript || (function () {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf('badge.js') !== -1) {
        return scripts[i];
      }
    }
    return null;
  })();

  if (!currentScript) return;

  // Extract merchant configuration attributes
  const storeSlug = currentScript.getAttribute('data-store') || 
                    currentScript.getAttribute('data-slug') || 
                    currentScript.getAttribute('data-id') || 
                    'amman-artisans';
  const position = currentScript.getAttribute('data-position') || 'bottom-right'; // 'bottom-right', 'bottom-left', 'inline'
  const theme = currentScript.getAttribute('data-theme') || 'dark'; // 'dark', 'light'
  const lang = currentScript.getAttribute('data-lang') || 'ar'; // 'ar', 'en'
  const size = currentScript.getAttribute('data-size') || 'normal'; // 'normal', 'compact'

  // Construct target verification URL
  const baseUrl = window.location.origin.includes('localhost') || window.location.origin.includes('run.app')
    ? window.location.origin
    : 'https://madmoon.jo';
  const verifyUrl = `${baseUrl}/?verify=${encodeURIComponent(storeSlug)}#verify`;

  // Log impression telemetry (non-blocking)
  try {
    const originHost = window.location.origin || document.referrer || 'direct';
    fetch(`${baseUrl}/api/store-status?slug=${encodeURIComponent(storeSlug)}&referrer=${encodeURIComponent(originHost)}`, {
      method: 'GET',
      mode: 'no-cors'
    }).catch(function () {
      // Silent catch for cross-origin tracking
    });
  } catch (e) {
    // Ignore telemetry errors
  }

  // Create badge container element
  const hostDiv = document.createElement('div');
  hostDiv.id = `madmoon-badge-host-${storeSlug}`;

  // Attach Shadow DOM to prevent host website CSS pollution
  const shadow = hostDiv.attachShadow({ mode: 'open' });

  // Define scoped CSS styles & reset inside Shadow DOM
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    :host {
      all: initial;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      box-sizing: border-box;
      direction: ${lang === 'ar' ? 'rtl' : 'ltr'};
      z-index: 999999;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .madmoon-badge-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      border-radius: 9999px;
      cursor: pointer;
      user-select: none;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(16, 185, 129, 0.15);
      border: 1px solid ${theme === 'light' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.3)'};
      background: ${theme === 'light' 
        ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)' 
        : 'linear-gradient(135deg, #0f172a 0%, #022c22 100%)'};
      color: ${theme === 'light' ? '#064e3b' : '#ffffff'};
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font-size: ${size === 'compact' ? '12px' : '13px'};
      font-weight: 700;
      line-height: 1.2;
    }

    .madmoon-badge-wrapper:hover {
      transform: translateY(-3px) scale(1.02);
      border-color: #10b981;
      box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.25), 0 10px 15px -5px rgba(0, 0, 0, 0.4);
    }

    .madmoon-icon-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${size === 'compact' ? '24px' : '28px'};
      height: ${size === 'compact' ? '24px' : '28px'};
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      flex-shrink: 0;
    }

    .madmoon-icon-container svg {
      width: ${size === 'compact' ? '14px' : '16px'};
      height: ${size === 'compact' ? '14px' : '16px'};
      color: #10b981;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .madmoon-pulse-ring {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #10b981;
      box-shadow: 0 0 8px #10b981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.9; }
      50% { transform: scale(1.3); opacity: 0.4; }
      100% { transform: scale(0.95); opacity: 0.9; }
    }

    .madmoon-text-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: ${lang === 'ar' ? 'right' : 'left'};
    }

    .madmoon-brand {
      color: #10b981;
      font-weight: 900;
      letter-spacing: -0.01em;
      font-size: ${size === 'compact' ? '11px' : '12px'};
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .madmoon-status {
      color: ${theme === 'light' ? '#1e293b' : '#f8fafc'};
      font-weight: 700;
      font-size: ${size === 'compact' ? '12px' : '13px'};
      white-space: nowrap;
    }

    /* Positions */
    .pos-bottom-right {
      position: fixed;
      bottom: 20px;
      right: 20px;
    }

    .pos-bottom-left {
      position: fixed;
      bottom: 20px;
      left: 20px;
    }

    .pos-inline {
      position: relative;
      display: inline-block;
    }
  `;

  // Construct HTML DOM tree inside Shadow DOM
  const wrapperAnchor = document.createElement('a');
  wrapperAnchor.href = verifyUrl;
  wrapperAnchor.target = '_blank';
  wrapperAnchor.rel = 'noopener noreferrer';
  wrapperAnchor.className = `madmoon-badge-wrapper pos-${position}`;
  wrapperAnchor.title = lang === 'ar' ? 'عرض شهادة التوثيق الرسمية على منصة مضمون' : 'View Official Verification Certificate on Madmoon';

  // Render SVG Shield Checkmark
  wrapperAnchor.innerHTML = `
    <div class="madmoon-icon-container">
      <svg viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
      <span class="madmoon-pulse-ring"></span>
    </div>
    <div class="madmoon-text-content">
      <span class="madmoon-brand">
        ${lang === 'ar' ? 'مضمون 🇯🇴' : 'MADMOON'}
      </span>
      <span class="madmoon-status">
        ${lang === 'ar' ? 'متجر هوية مؤكدة' : 'Verified Identity Store'}
      </span>
    </div>
  `;

  // Direct tab navigation event handler
  wrapperAnchor.addEventListener('click', function (e) {
    e.preventDefault();
    window.open(verifyUrl, '_blank', 'noopener,noreferrer');
  });

  shadow.appendChild(styleEl);
  shadow.appendChild(wrapperAnchor);

  // Mount element into host document
  if (position === 'inline') {
    currentScript.parentNode.insertBefore(hostDiv, currentScript.nextSibling);
  } else {
    document.body.appendChild(hostDiv);
  }

})();
