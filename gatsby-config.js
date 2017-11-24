module.exports = {
  siteMetadata: {
    title: `MUNIranians`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-firebase`,
      options: {
        credential: process.env.FIREBASE_PRIVATE_KEY_FILE
          ? require(process.env.FIREBASE_PRIVATE_KEY_FILE)
          : {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: JSON.parse(`"${process.env.FIREBASE_PRIVATE_KEY}"`),
          },
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        types: [
          {
            type: "Event",
            path: "events",
          },
        ]
      }
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: './src/favicon.png',
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          twitter: false,
          yandex: false,
          windows: false
        }
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID
      },
    },
  ],
}
