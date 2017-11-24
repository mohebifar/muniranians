const config = {
  firebase: {
    apiKey: process.env.GATSBY_FIREBASE_API_KEY,
    authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL,
    projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
    storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
    functionsBaseUrl: process.env.GATSBY_FIREBASE_FUNCTIONS_BASE_URL,
  },
  googleMaps: {
    apiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY,
  },
}

export default config
