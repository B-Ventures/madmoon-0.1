import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Firebase App for server-side lookup
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;
const db = getFirestore(firebaseApp, dbId);

// Helper to normalize host / domain
function extractDomain(urlStr?: string): string {
  if (!urlStr) return '';
  try {
    let formatted = urlStr.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted;
    }
    const parsed = new URL(formatted);
    return parsed.hostname.toLowerCase().replace(/^www\./, '');
  } catch (e) {
    return urlStr.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}

// Smart Badge Status Endpoint: /api/merchant-status & /api/store-status
app.get(["/api/merchant-status", "/api/store-status"], async (req, res) => {
  try {
    const slug = (req.query.slug || req.query.id || req.query.store) as string;
    if (!slug) {
      return res.json({ showBadge: false, reason: "missing_slug" });
    }

    // Determine request origin or referer header
    const incomingHeader = (req.headers.origin as string) || (req.headers.referer as string) || (req.query.referrer as string) || '';
    const incomingDomain = extractDomain(incomingHeader);

    // Fetch store doc from Firestore
    let storeData: any = null;

    // Try direct doc ID first (e.g., store-12345 or slug)
    const directDocRef = doc(db, 'merchants', slug.startsWith('store-') ? slug : `store-${slug}`);
    const directSnap = await getDoc(directDocRef);

    if (directSnap.exists()) {
      storeData = directSnap.data();
    } else {
      // Query merchants collection by slug
      const q = query(collection(db, 'merchants'), where('slug', '==', slug));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        storeData = qSnap.docs[0].data();
      }
    }

    if (!storeData) {
      // Fallback for default sample store
      if (slug === 'amman-artisans' || slug === 'store-amman-artisans') {
        return res.json({
          showBadge: true,
          verificationStatus: 'active',
          tier: 'منشأة مسجلة - Tier 2',
          domainVerified: true
        });
      }
      return res.json({ showBadge: false, reason: "store_not_found" });
    }

    const verificationStatus = storeData.verificationStatus || (storeData.domainVerified ? 'active' : 'pending');
    const storeDomain = extractDomain(storeData.websiteUrl);

    // Check if merchant is active (Admin Gate)
    if (verificationStatus !== 'active') {
      return res.json({
        showBadge: false,
        reason: "pending_approval",
        verificationStatus: verificationStatus,
        message: "Merchant verification is pending admin review."
      });
    }

    // Domain Verification Check
    const isDevPreview = incomingDomain.includes('localhost') || incomingDomain.includes('run.app') || incomingDomain === '';
    const domainMatches = isDevPreview || incomingDomain === storeDomain || incomingDomain.endsWith('.' + storeDomain) || storeDomain.endsWith('.' + incomingDomain);

    if (!domainMatches) {
      return res.json({
        showBadge: false,
        reason: "domain_mismatch",
        verificationStatus: "active",
        registeredDomain: storeDomain,
        requestDomain: incomingDomain
      });
    }

    return res.json({
      showBadge: true,
      verificationStatus: 'active',
      tier: storeData.tier || (storeData.sellerType === 'business' ? 'منشأة مسجلة' : 'هوية شخصية مؤكدة'),
      sellerType: storeData.sellerType || 'individual',
      nameAr: storeData.nameAr,
      nameEn: storeData.nameEn,
      badgeId: storeData.verificationBadgeId,
      domainVerified: true
    });
  } catch (err: any) {
    console.error("Error in /api/merchant-status:", err);
    return res.status(500).json({ showBadge: false, error: err.message });
  }
});

async function startServer() {
  // Vite middleware for development / Production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
