var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_app = require("firebase/app");
var import_firestore = require("firebase/firestore");
var firebaseConfig = {};
try {
  const configPath = import_path.default.join(process.cwd(), "firebase-applet-config.json");
  if (import_fs.default.existsSync(configPath)) {
    firebaseConfig = JSON.parse(import_fs.default.readFileSync(configPath, "utf-8"));
  }
} catch (e) {
  console.warn("Failed to read firebase-applet-config.json:", e);
}
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var firebaseApp = !(0, import_app.getApps)().length ? (0, import_app.initializeApp)(firebaseConfig) : (0, import_app.getApp)();
var dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)" ? firebaseConfig.firestoreDatabaseId : void 0;
var db = (0, import_firestore.getFirestore)(firebaseApp, dbId);
function extractDomain(urlStr) {
  if (!urlStr) return "";
  try {
    let formatted = urlStr.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = "https://" + formatted;
    }
    const parsed = new URL(formatted);
    return parsed.hostname.toLowerCase().replace(/^www\./, "");
  } catch (e) {
    return urlStr.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}
app.get(["/api/merchant-status", "/api/store-status"], async (req, res) => {
  try {
    const slug = req.query.slug || req.query.id || req.query.store;
    if (!slug) {
      return res.json({ showBadge: false, reason: "missing_slug" });
    }
    const incomingHeader = req.headers.origin || req.headers.referer || req.query.referrer || "";
    const incomingDomain = extractDomain(incomingHeader);
    let storeData = null;
    const directDocRef = (0, import_firestore.doc)(db, "merchants", slug.startsWith("store-") ? slug : `store-${slug}`);
    const directSnap = await (0, import_firestore.getDoc)(directDocRef);
    if (directSnap.exists()) {
      storeData = directSnap.data();
    } else {
      const q = (0, import_firestore.query)((0, import_firestore.collection)(db, "merchants"), (0, import_firestore.where)("slug", "==", slug));
      const qSnap = await (0, import_firestore.getDocs)(q);
      if (!qSnap.empty) {
        storeData = qSnap.docs[0].data();
      }
    }
    if (!storeData) {
      if (slug === "amman-artisans" || slug === "store-amman-artisans") {
        return res.json({
          showBadge: true,
          verificationStatus: "active",
          tier: "\u0645\u0646\u0634\u0623\u0629 \u0645\u0633\u062C\u0644\u0629 - Tier 2",
          domainVerified: true
        });
      }
      return res.json({ showBadge: false, reason: "store_not_found" });
    }
    const verificationStatus = storeData.verificationStatus || (storeData.domainVerified ? "active" : "pending");
    const storeDomain = extractDomain(storeData.websiteUrl);
    if (verificationStatus !== "active") {
      return res.json({
        showBadge: false,
        reason: "pending_approval",
        verificationStatus,
        message: "Merchant verification is pending admin review."
      });
    }
    const isDevPreview = incomingDomain.includes("localhost") || incomingDomain.includes("run.app") || incomingDomain === "";
    const domainMatches = isDevPreview || incomingDomain === storeDomain || incomingDomain.endsWith("." + storeDomain) || storeDomain.endsWith("." + incomingDomain);
    if (!domainMatches) {
      return res.json({
        showBadge: false,
        showWarningBadge: true,
        reason: "domain_mismatch",
        verificationStatus: "active",
        registeredDomain: storeDomain,
        requestDomain: incomingDomain
      });
    }
    return res.json({
      showBadge: true,
      verificationStatus: "active",
      tier: storeData.tier || (storeData.sellerType === "business" ? "\u0645\u0646\u0634\u0623\u0629 \u0645\u0633\u062C\u0644\u0629" : "\u0647\u0648\u064A\u0629 \u0634\u062E\u0635\u064A\u0629 \u0645\u0624\u0643\u062F\u0629"),
      sellerType: storeData.sellerType || "individual",
      nameAr: storeData.nameAr,
      nameEn: storeData.nameEn,
      badgeId: storeData.verificationBadgeId,
      domainVerified: true
    });
  } catch (err) {
    console.error("Error in /api/merchant-status:", err);
    return res.status(500).json({ showBadge: false, error: err.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    app.get("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const indexPath = import_path.default.resolve(process.cwd(), "index.html");
        let template = import_fs.default.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
