/**
 * Madmoon Trust Badge Embed Script
 * @version 2.1.0 (Direct Firestore Status Lookup - no server required)
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

  // Construct target verification URL dynamically from script source location
  let baseUrl = window.location.origin;
  if (currentScript.src) {
    try {
      const urlObj = new URL(currentScript.src, window.location.href);
      baseUrl = urlObj.origin + urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/'));
    } catch (e) {
      baseUrl = window.location.origin;
    }
  }
  const verifyUrl = `${baseUrl}/?verify=${encodeURIComponent(storeSlug)}#verify`;

  // Resolve merchant status directly from Firestore's public REST API.
  // This domain is hosted on GitHub Pages (static-only), which cannot run
  // the Express /api/merchant-status proxy server.ts defines - so this
  // widget reads Firestore itself instead of depending on a server that
  // isn't actually deployed here. Firestore's read rules already allow
  // public reads on the merchants collection (allow read: if true), and
  // this is a plain REST call - no Firebase SDK needed, keeps this embed
  // script small.
  const FIREBASE_PROJECT_ID = 'gen-lang-client-0823624253';
  const FIREBASE_API_KEY = 'AIzaSyAMGwz1YTFp7pzSJhteSde8AclK-uaBAhk';
  const FIRESTORE_DATABASE_ID = 'ai-studio-madmoontrustbadg-65b6ef74-b70b-422d-8cd7-631c2d824590';
  const FIRESTORE_DOCS_URL = 'https://firestore.googleapis.com/v1/projects/' + FIREBASE_PROJECT_ID +
    '/databases/' + FIRESTORE_DATABASE_ID + '/documents';

  // Unwraps Firestore REST's typed field format ({ stringValue: "x" }, etc.)
  // into a plain JS object.
  function firestoreValueToJs(value) {
    if (value == null) return null;
    if ('stringValue' in value) return value.stringValue;
    if ('booleanValue' in value) return value.booleanValue;
    if ('integerValue' in value) return parseInt(value.integerValue, 10);
    if ('doubleValue' in value) return value.doubleValue;
    if ('mapValue' in value) return firestoreFieldsToJs((value.mapValue && value.mapValue.fields) || {});
    if ('arrayValue' in value) return ((value.arrayValue && value.arrayValue.values) || []).map(firestoreValueToJs);
    return null;
  }
  function firestoreFieldsToJs(fields) {
    const out = {};
    for (const key in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        out[key] = firestoreValueToJs(fields[key]);
      }
    }
    return out;
  }

  // Mirrors server.ts's direct-doc-ID lookup (merchants/store-{slug}).
  function fetchMerchantDocDirect(docId) {
    const url = FIRESTORE_DOCS_URL + '/merchants/' + encodeURIComponent(docId) + '?key=' + FIREBASE_API_KEY;
    return fetch(url)
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (doc) { return doc && doc.fields ? firestoreFieldsToJs(doc.fields) : null; })
      .catch(function () { return null; });
  }

  // Mirrors server.ts's fallback query on the `slug` field when the doc ID
  // guess above doesn't match.
  function fetchMerchantBySlugQuery(slug) {
    const url = FIRESTORE_DOCS_URL + ':runQuery?key=' + FIREBASE_API_KEY;
    const body = {
      structuredQuery: {
        from: [{ collectionId: 'merchants' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'slug' },
            op: 'EQUAL',
            value: { stringValue: slug }
          }
        },
        limit: 1
      }
    };
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (results) {
        if (!Array.isArray(results)) return null;
        for (let i = 0; i < results.length; i++) {
          if (results[i] && results[i].document && results[i].document.fields) {
            return firestoreFieldsToJs(results[i].document.fields);
          }
        }
        return null;
      })
      .catch(function () { return null; });
  }

  // Same domain-normalization logic as server.ts's extractDomain().
  function extractDomain(urlStr) {
    if (!urlStr) return '';
    try {
      let formatted = urlStr.trim();
      if (formatted.indexOf('http://') !== 0 && formatted.indexOf('https://') !== 0) {
        formatted = 'https://' + formatted;
      }
      const parsed = new URL(formatted);
      return parsed.hostname.toLowerCase().replace(/^www\./, '');
    } catch (e) {
      return urlStr.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    }
  }

  // Same admin-gate + domain-verification decision logic that used to live
  // in server.ts's /api/merchant-status handler, now run client-side.
  function resolveMerchantStatus(slug, incomingOrigin) {
    const incomingDomain = extractDomain(incomingOrigin);
    const directDocId = slug.indexOf('store-') === 0 ? slug : ('store-' + slug);

    return fetchMerchantDocDirect(directDocId)
      .then(function (storeData) { return storeData || fetchMerchantBySlugQuery(slug); })
      .then(function (storeData) {
        if (!storeData) {
          if (slug === 'amman-artisans' || slug === 'store-amman-artisans') {
            return { showBadge: true, verificationStatus: 'active', tier: 'منشأة مسجلة - Tier 2', domainVerified: true };
          }
          return { showBadge: false, reason: 'store_not_found' };
        }

        const verificationStatus = storeData.verificationStatus || (storeData.domainVerified ? 'active' : 'pending');
        const storeDomain = extractDomain(storeData.websiteUrl);

        if (verificationStatus !== 'active') {
          return { showBadge: false, reason: 'pending_approval', verificationStatus: verificationStatus };
        }

        const isDevPreview = incomingDomain.indexOf('localhost') !== -1 || incomingDomain.indexOf('run.app') !== -1 || incomingDomain === '';
        const domainMatches = isDevPreview || incomingDomain === storeDomain ||
          incomingDomain.endsWith('.' + storeDomain) || storeDomain.endsWith('.' + incomingDomain);

        if (!domainMatches) {
          return {
            showBadge: false,
            showWarningBadge: true,
            reason: 'domain_mismatch',
            verificationStatus: 'active',
            registeredDomain: storeDomain,
            requestDomain: incomingDomain
          };
        }

        return {
          showBadge: true,
          verificationStatus: 'active',
          tier: storeData.tier || (storeData.sellerType === 'business' ? 'منشأة مسجلة' : 'هوية شخصية مؤكدة'),
          sellerType: storeData.sellerType || 'individual',
          nameAr: storeData.nameAr,
          nameEn: storeData.nameEn,
          badgeId: storeData.verificationBadgeId,
          domainVerified: true
        };
      })
      .catch(function () { return { showBadge: false, reason: 'lookup_failed' }; });
  }

  resolveMerchantStatus(storeSlug, window.location.origin || document.referrer || '')
    .then(function(data) {
      // MODULE 4: Instant Revocation Check
      // If store is suspended, pending, rejected, or invalid (and not domain_mismatch), EXIT IMMEDIATELY and render NOTHING.
      const isDomainMismatch = data && (data.reason === 'domain_mismatch' || data.showWarningBadge === true);

      if (!data || (!data.showBadge && !isDomainMismatch)) {
        return;
      }

      window.__MADMOON_BADGE_INITIALIZED__ = true;

      // Construct target URLs
      const targetUrl = isDomainMismatch
        ? `${baseUrl}/disclaimer?error=domain_mismatch`
        : `${baseUrl}/verify/${encodeURIComponent(storeSlug)}`;

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
          border: 1px solid ${isDomainMismatch 
            ? '#ef4444' 
            : (theme === 'light' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.3)')};
          background: ${isDomainMismatch 
            ? 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)' 
            : (theme === 'light' 
              ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)' 
              : 'linear-gradient(135deg, #0f172a 0%, #022c22 100%)')};
          color: #ffffff;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          font-size: ${size === 'compact' ? '12px' : '13px'};
          font-weight: 700;
          line-height: 1.2;
        }
        .madmoon-badge-wrapper:hover {
          transform: translateY(-3px) scale(1.02);
          border-color: ${isDomainMismatch ? '#f87171' : '#10b981'};
          box-shadow: 0 15px 30px -5px ${isDomainMismatch ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.25)'}, 0 10px 15px -5px rgba(0, 0, 0, 0.4);
        }
        .madmoon-icon-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${size === 'compact' ? '24px' : '28px'};
          height: ${size === 'compact' ? '24px' : '28px'};
          border-radius: 50%;
          background: ${isDomainMismatch ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)'};
          border: 1px solid ${isDomainMismatch ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.4)'};
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
          background-color: ${isDomainMismatch ? '#ef4444' : '#10b981'};
          box-shadow: 0 0 8px ${isDomainMismatch ? '#ef4444' : '#10b981'};
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
          color: ${isDomainMismatch ? '#fca5a5' : '#10b981'};
          font-weight: 900;
          letter-spacing: -0.01em;
          font-size: ${size === 'compact' ? '11px' : '12px'};
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .madmoon-status {
          color: #ffffff;
          font-weight: 700;
          font-size: ${size === 'compact' ? '12px' : '13px'};
          white-space: nowrap;
        }
        .pos-bottom-right { position: fixed; bottom: 20px; right: 20px; }
        .pos-bottom-left { position: fixed; bottom: 20px; left: 20px; }
        .pos-inline { position: relative; display: inline-block; }
      `;

      const wrapperAnchor = document.createElement('a');
      wrapperAnchor.href = targetUrl;
      wrapperAnchor.target = '_blank';
      wrapperAnchor.rel = 'noopener noreferrer';
      wrapperAnchor.className = `madmoon-badge-wrapper pos-${position}`;
      wrapperAnchor.title = isDomainMismatch
        ? (lang === 'ar' ? '🔴 تنبيه أمني: عدم تطابق النطاق - انقر لمعرفة التفاصيل' : '🔴 Security Warning: Domain Mismatch - Click for details')
        : (lang === 'ar' ? 'عرض شهادة التوثيق الرسمية على منصة مضمون' : 'View Official Verification Certificate on Madmoon');

      const tierDisplay = isDomainMismatch
        ? (lang === 'ar' ? '🔴 نطاق غير موثق / مصدر غير مصرح' : '🔴 Unverified Domain Mismatch')
        : (data.tier || (lang === 'ar' ? 'متجر مضمون' : 'Verified Identity Store'));

      const iconSvg = isDomainMismatch
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
        : `<svg viewBox="0 0 100 100" fill="none">
            <path d="M15 38 L40 63 L85 18 L85 34 L40 79 L15 54 Z" fill="#10B981"></path>
            <polygon points="15,66 15,85 34,85" fill="#34D399"></polygon>
            <polygon points="48,85 85,48 85,63 63,85" fill="#34D399"></polygon>
            <polygon points="73,85 85,73 85,85" fill="#34D399"></polygon>
          </svg>`;

      wrapperAnchor.innerHTML = `
        <div class="madmoon-icon-container">
          ${iconSvg}
          <span class="madmoon-pulse-ring"></span>
        </div>
        <div class="madmoon-text-content">
          <span class="madmoon-brand">
            ${isDomainMismatch ? (lang === 'ar' ? 'مضمون ⚠️' : 'MADMOON ALERT') : (lang === 'ar' ? 'مضمون 🇯🇴' : 'MADMOON')}
          </span>
          <span class="madmoon-status">
            ${tierDisplay}
          </span>
        </div>
      `;

      wrapperAnchor.addEventListener('click', function (e) {
        e.preventDefault();
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
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
