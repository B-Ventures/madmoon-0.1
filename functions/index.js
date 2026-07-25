const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const axios = require("axios");

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
