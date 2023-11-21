import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";

const config = {
  apiKey: "AIzaSyBn5gZX30lKDNxWFxyT-6FxbM7abXLXNXk",
  authDomain: "scoreboard-replay.firebaseapp.com",
  databaseURL: "https://scoreboard-replay-default-rtdb.firebaseio.com",
  projectId: "scoreboard-replay",
  storageBucket: "scoreboard-replay.appspot.com",
  messagingSenderId: "516644813158",
  appId: "1:516644813158:web:653793c5d52b0fe85cf0a7"
};
  
export const app = initializeApp(config);
export const database = getDatabase(app);