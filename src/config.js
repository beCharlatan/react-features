import firebase
  from "firebase";

export const appName = 'adv-react-9fac1'
export const firebaseCfg = {
  apiKey: "AIzaSyB_9m6BGWC1DavFwXtXSc3BssMFuZgdlp0",
  authDomain: `${appName}.firebaseapp.com`,
  databaseURL: `https://${appName}.firebaseio.com`,
  projectId: `${appName}`,
  storageBucket: "",
  messagingSenderId: "667953755723",
  appId: "1:667953755723:web:982dc60d980a1211"
}

firebase.initializeApp(firebaseCfg)