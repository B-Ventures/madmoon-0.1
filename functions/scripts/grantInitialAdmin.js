#!/usr/bin/env node
/**
 * One-time bootstrap script: grants the "admin" custom claim to one or more
 * existing Firebase Auth users, identified by email.
 *
 * Why this exists: firestore.rules' isAdmin() check now requires
 * request.auth.token.admin == true, not just "any signed-in user". That
 * claim can only be set via the Admin SDK (never from the client), so the
 * very first admin(s) have to be granted it out-of-band before they can
 * sign in to the dashboard or use the "Add Admin User" feature to create
 * more.
 *
 * Usage (run once, locally, by someone with access to the Firebase project):
 *   1. Authenticate with a credential that can access this project, e.g.:
 *        gcloud auth application-default login
 *      or set GOOGLE_APPLICATION_CREDENTIALS to a service account key path.
 *   2. cd functions && npm install (if not already installed)
 *   3. node scripts/grantInitialAdmin.js admin@yourdomain.com second@yourdomain.com
 *
 * Each email must already exist as a Firebase Auth user (sign up once via
 * the app's Admin Login screen — Firebase Auth will create the account on
 * first "sign in" attempt only if you use a flow that does so; otherwise
 * create it via the Firebase Console > Authentication > Add user first).
 *
 * After running this, each user must sign out and back in (or wait for
 * their ID token to refresh) for the new claim to take effect in the app.
 */
const admin = require("firebase-admin");

async function grantOne(email) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`✓ Granted admin claim to ${email} (uid: ${user.uid})`);
}

async function main() {
  const emails = process.argv.slice(2).map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (emails.length === 0) {
    console.error("Usage: node scripts/grantInitialAdmin.js <email> [email2] [email3] ...");
    process.exit(1);
  }

  admin.initializeApp();

  let failures = 0;
  for (const email of emails) {
    try {
      await grantOne(email);
    } catch (err) {
      failures++;
      if (err.code === "auth/user-not-found") {
        console.error(`✗ ${email}: no Firebase Auth account exists yet for this email. ` +
          "Create it first (Firebase Console > Authentication > Add user, or sign up once via the app), then re-run.");
      } else {
        console.error(`✗ ${email}: ${err.message || err}`);
      }
    }
  }

  console.log("\nDone. Anyone granted above must sign out and back in for it to take effect.");
  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Failed to grant admin claim(s):", err.message || err);
  process.exit(1);
});
