#!/usr/bin/env node
/**
 * One-time bootstrap script: grants the "admin" custom claim to an existing
 * Firebase Auth user, identified by email.
 *
 * Why this exists: firestore.rules' isAdmin() check now requires
 * request.auth.token.admin == true, not just "any signed-in user". That
 * claim can only be set via the Admin SDK (never from the client), so the
 * very first admin has to be granted it out-of-band before they can sign
 * in to the dashboard or use the "Add Admin User" feature to create more.
 *
 * Usage (run once, locally, by someone with access to the Firebase project):
 *   1. Authenticate with a credential that can access this project, e.g.:
 *        gcloud auth application-default login
 *      or set GOOGLE_APPLICATION_CREDENTIALS to a service account key path.
 *   2. cd functions && npm install (if not already installed)
 *   3. node scripts/grantInitialAdmin.js admin@yourdomain.com
 *
 * After running this, the user must sign out and back in (or wait for their
 * ID token to refresh) for the new claim to take effect in the app.
 */
const admin = require("firebase-admin");

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/grantInitialAdmin.js <email>");
    process.exit(1);
  }

  admin.initializeApp();

  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });

  console.log(`Granted admin claim to ${email} (uid: ${user.uid}).`);
  console.log("They must sign out and back in for it to take effect.");
}

main().catch((err) => {
  console.error("Failed to grant admin claim:", err.message || err);
  process.exit(1);
});
