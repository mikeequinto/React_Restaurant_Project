const firestoreService = require("firestore-export-import")
const serviceAccount = require('./serviceAccountKey.json')

const databaseURL = "https://foodislife-92b0e.firebaseio.com"

firestoreService.initializeApp(serviceAccount, databaseURL)

firestoreService.restore("menuData.json")
