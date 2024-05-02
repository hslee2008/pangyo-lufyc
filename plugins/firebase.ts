import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getPerformance } from "firebase/performance";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCiWkcqYQJoO8YkvhSBaozKmS87D1R87JA",
  authDomain: "pangyo-lufyc.firebaseapp.com",
  databaseURL:
    "https://pangyo-lufyc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pangyo-lufyc",
  storageBucket: "pangyo-lufyc.appspot.com",
  messagingSenderId: "704521993270",
  appId: "1:704521993270:web:094ef0fd7be8b5bab7ac97",
  measurementId: "G-74X25F2K35",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getDatabase(app);
const storage = getStorage(app);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:transition:finish", () => {
    getPerformance(app);
    getAnalytics(app);
  });

  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.provide("auth", auth);

  nuxtApp.vueApp.provide("db", db);
  nuxtApp.provide("db", db);

  nuxtApp.vueApp.provide("storage", storage);
  nuxtApp.provide("storage", storage);

  nuxtApp.vueApp.provide("firestore", firestore);
  nuxtApp.provide("firestore", firestore);
});

export { db };
