// // src/firebase.ts
// import admin from "firebase-admin";
// import serviceAccount from "../../firebase-service-account.json";

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
// });

// export default admin;


// src/firebase.ts
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG as string);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
