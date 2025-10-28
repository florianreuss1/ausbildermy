// attendance-shared.js
(function(global){
  // --- Firebase Setup ---
  const firebaseConfig = global.firebaseConfig; // kommt aus firebase-config.js
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const db = firebase.firestore();

  // --- QR Utils ---
  function newNonce(){
    return Math.random().toString(36).substring(2, 10);
  }

  function buildQrPayload(sessionId, nonce){
    // kompaktes JSON, Version 1
    return JSON.stringify({ v: 1, s: sessionId, n: nonce });
  }

  function parseQrPayload(text){
    try {
      const o = JSON.parse(text);
      if (o && o.v === 1 && typeof o.s === 'string' && typeof o.n === 'string') {
        return { s: o.s, n: o.n };
      }
    } catch(e) {}
    return null;
  }

  // --- Role helper (falls Rollen-Logik in Firestore) ---
  async function getUserRole(){
    const u = auth.currentUser;
    if (!u) return null;
    try {
      const doc = await db.collection('users').doc(u.uid).get();
      return doc.exists ? doc.data().role : null;
    } catch(e){
      console.error('getUserRole Fehler:', e);
      return null;
    }
  }

  // global export
  global._att = {
    auth, db,
    newNonce, buildQrPayload, parseQrPayload,
    getUserRole
  };
})(window);
