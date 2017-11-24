const config = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    functionsBaseUrl: process.env.FIREBASE_FUNCTIONS_BASE_URL,
  },
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
}

export default config
