import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Phase 11: Credential Expiration Tracker Cron Job
// Runs every day at 12:00 AM
export const checkExpiringCredentials = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    const now = Date.now();
    const msPerDay = 1000 * 60 * 60 * 24;

    const usersSnap = await db.collection("users").get();

    for (const userDoc of usersSnap.docs) {
      const credsSnap = await userDoc.ref.collection("credentials").get();
      
      for (const cred of credsSnap.docs) {
        const data = cred.data();
        if (!data.expirationDate) continue;

        const daysUntilExpiration = Math.floor((data.expirationDate - now) / msPerDay);

        if (daysUntilExpiration === 90 || daysUntilExpiration === 60 || daysUntilExpiration === 30 || daysUntilExpiration === 1) {
          // In production, this drops an event into the "mail" collection for the Firebase Trigger Email Extension
          await db.collection("mail").add({
            to: userDoc.data().email,
            message: {
              subject: `ACTION REQUIRED: Your ${data.type} is expiring in ${daysUntilExpiration} days.`,
              html: `<p>Please log in to your MedBadge Dashboard to upload your renewed credential.</p>`
            }
          });
        }
      }
    }
    console.log("Expiration check completed.");
    return null;
  });
