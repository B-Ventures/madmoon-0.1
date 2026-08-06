const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const axios = require("axios");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Firebase Cloud Function (v2) triggered when a new merchant is created in Firestore.
 * Collection Path: merchants/{storeSlug}
 * 
 * Automatically sends an onboarding WhatsApp message with verification link and badge snippet.
 */
exports.onMerchantCreated = onDocumentCreated(
  {
    document: "merchants/{storeSlug}",
    region: "us-central1"
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn("No document snapshot found for event", { eventId: event.id });
      return;
    }

    const data = snapshot.data();
    const storeSlug = event.params.storeSlug || data.slug || "";

    // 1. Extract merchant data with fallback support
    const storeNameArabic = data.storeNameArabic || data.nameAr || "متجرك الموثق";
    const ownerName = data.ownerName || "التاجر العزيز";
    const phone = data.phone || "";

    logger.info("Processing new merchant registration event", {
      storeSlug,
      storeNameArabic,
      ownerName,
      phone
    });

    if (!phone) {
      logger.warn("Skipping WhatsApp notification: No phone number provided for merchant", { storeSlug });
      return;
    }

    // 2. Construct dynamic installation snippet
    const snippetCode = `<script src="https://madmoon.jo/badge.js" data-store="${storeSlug}" async></script>`;

    // 3. Construct Arabic WhatsApp onboarding message
    const message = `أهلاً بك يا ${ownerName} 👋
تم تسجيل متجرك (${storeNameArabic}) بنجاح على منصة مضمون!

📜 رابط شهادة التوثيق الخاصة بك:
https://madmoon.jo/verify/${storeSlug}

💻 كود التثبيت الخفيف لمتجرك:
${snippetCode}

قم بنسخ هذا الكود ووضعه في أسفل موقعك (Footer) لتفعيل ختم مضمون فوراً.`;

    // 4. Send HTTP Request to WhatsApp Gateway (Ultramsg / Twilio API)
    try {
      const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
      const token = process.env.ULTRAMSG_TOKEN;
      const endpoint = process.env.WHATSAPP_API_URL || `https://api.ultramsg.com/${instanceId}/messages/chat`;

      logger.info(`Dispatching WhatsApp message to ${phone}...`);

      const response = await axios.post(
        endpoint,
        new URLSearchParams({
          token: token || "",
          to: phone,
          body: message
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          timeout: 10000
        }
      );

      logger.info("WhatsApp onboarding notification sent successfully!", {
        storeSlug,
        phone,
        status: response.status,
        responseData: response.data
      });

      return { success: true, storeSlug, phone };
    } catch (error) {
      logger.error("Failed to send WhatsApp onboarding message", {
        storeSlug,
        phone,
        errorMessage: error.message,
        apiResponse: error.response?.data
      });

      // Throw error to record failure in Cloud Functions logs
      throw error;
    }
  }
);

/**
 * Callable Cloud Function: createAdminUser
 *
 * Creates a new Firebase Auth user and grants it the "admin" custom claim
 * used by firestore.rules' isAdmin() check. Only callable by an already
 * signed-in caller who themselves carries the admin claim — this is the
 * ONLY supported way to mint additional admins. Client-side
 * createUserWithEmailAndPassword() intentionally does NOT grant this claim,
 * since anyone can call it from the browser console with the public
 * Firebase Web config.
 *
 * The very first admin cannot be created this way (no admin exists yet to
 * call it) — use scripts/grantInitialAdmin.js once, out-of-band, instead.
 */
exports.createAdminUser = onCall(async (request) => {
  if (!request.auth || request.auth.token.admin !== true) {
    throw new HttpsError(
      "permission-denied",
      "Only an existing admin may create another admin account."
    );
  }

  const email = String(request.data?.email || "").trim().toLowerCase();
  const password = String(request.data?.password || "");

  if (!email || !password) {
    throw new HttpsError("invalid-argument", "email and password are required.");
  }
  if (password.length < 6) {
    throw new HttpsError("invalid-argument", "password must be at least 6 characters.");
  }

  try {
    const userRecord = await admin.auth().createUser({ email, password });
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    logger.info("Created new admin user", { uid: userRecord.uid, email, byUid: request.auth.uid });
    return { uid: userRecord.uid, email };
  } catch (error) {
    logger.error("Failed to create admin user", { email, errorMessage: error.message });
    if (error.code === "auth/email-already-exists") {
      throw new HttpsError("already-exists", "This email is already registered.");
    }
    if (error.code === "auth/invalid-password") {
      throw new HttpsError("invalid-argument", "Password does not meet Firebase requirements.");
    }
    throw new HttpsError("internal", error.message || "Failed to create admin user.");
  }
});
