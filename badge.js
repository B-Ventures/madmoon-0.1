/**
 * Madmoon Trust Badge Embed Script
 * @version 2.0.0 (Smart Admin Gate & Domain Verification)
 * @license Apache-2.0
 * 
 * Usage:
 * <script src="https://madmoon.jo/badge.js" data-store="amman-artisans" data-position="bottom-right" data-theme="dark" async></script>
 */
(function () {
  'use strict';

  // Prevent duplicate execution if script is embedded multiple times
  if (window.__MADMOON_BADGE_INITIALIZED__) return;

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
  const position = currentScript.getAttribute('data-position') || 'bottom-right';
  const theme = currentScript.getAttribute('data-theme') || 'dark';
  const lang = currentScript.getAttribute('data-lang') || 'ar';
  const size = currentScript.getAttribute('data-size') || 'normal';

  // Construct target verification URL
  const baseUrl = window.location.origin.includes('localhost') || window.location.origin.includes('run.app')
    ? window.location.origin
    : 'https://madmoon.jo';
  const verifyUrl = `${baseUrl}/?verify=${encodeURIComponent(storeSlug)}#verify`;

  // Query Backend Merchant Status API
  const statusApiUrl = `${baseUrl}/api/merchant-status?slug=${encodeURIComponent(storeSlug)}&referrer=${encodeURIComponent(window.location.origin || document.referrer || '')}`;

  fetch(statusApiUrl)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      // REQUIREMENT: If showBadge is false, silently exit (return;) and do NOT inject any HTML/CSS into DOM
      if (!data || !data.showBadge) {
        return;
      }

      window.__MADMOON_BADGE_INITIALIZED__ = true;

      // Create badge container element
      const hostDiv = document.createElement('div');
      hostDiv.id = `madmoon-badge-host-${storeSlug}`;

      // Attach Shadow DOM to prevent host website CSS pollution
      const shadow = hostDiv.attachShadow({ mode: 'open' });

      // Scoped CSS
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
          width: ${size === 'compact' ? '16px' : '18px'};
          height: ${size === 'compact' ? '16px' : '18px'};
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
        .pos-bottom-right { position: fixed; bottom: 20px; right: 20px; }
        .pos-bottom-left { position: fixed; bottom: 20px; left: 20px; }
        .pos-inline { position: relative; display: inline-block; }
      `;

      const wrapperAnchor = document.createElement('a');
      wrapperAnchor.href = verifyUrl;
      wrapperAnchor.target = '_blank';
      wrapperAnchor.rel = 'noopener noreferrer';
      wrapperAnchor.className = `madmoon-badge-wrapper pos-${position}`;
      wrapperAnchor.title = lang === 'ar' ? 'عرض شهادة التوثيق الرسمية على منصة مضمون' : 'View Official Verification Certificate on Madmoon';

      const tierDisplay = data.tier || (lang === 'ar' ? 'متجر مضمون' : 'Verified Identity Store');

      wrapperAnchor.innerHTML = `
        <div class="madmoon-icon-container">
          <svg viewBox="0 0 100 100" fill="none">
            <path d="M15 38 L40 63 L85 18 L85 34 L40 79 L15 54 Z" fill="#10B981"></path>
            <polygon points="15,66 15,85 34,85" fill="#34D399"></polygon>
            <polygon points="48,85 85,48 85,63 63,85" fill="#34D399"></polygon>
            <polygon points="73,85 85,73 85,85" fill="#34D399"></polygon>
          </svg>
          <span class="madmoon-pulse-ring"></span>
        </div>
        <div class="madmoon-text-content">
          <span class="madmoon-brand">
            ${lang === 'ar' ? 'مضمون 🇯🇴' : 'MADMOON'}
          </span>
          <span class="madmoon-status">
            ${tierDisplay}
          </span>
        </div>
      `;

      wrapperAnchor.addEventListener('click', function (e) {
        e.preventDefault();
        window.open(verifyUrl, '_blank', 'noopener,noreferrer');
      });

      shadow.appendChild(styleEl);
      shadow.appendChild(wrapperAnchor);

      if (position === 'inline') {
        currentScript.parentNode.insertBefore(hostDiv, currentScript.nextSibling);
      } else {
        document.body.appendChild(hostDiv);
      }
    })
    .catch(function(err) {
      console.warn("Madmoon status verification check error:", err);
    });

})();
