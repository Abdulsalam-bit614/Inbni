// firebase.js (بدون modules — يشتغل مع app.js مباشرة)

// 🔥 Firebase SDK (CDN لازم يكون مضاف بالـ index.html)
// <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>

// 🔐 إعدادات مشروعك
const firebaseConfig = {
  apiKey: "AIzaSyDNTuigUGGpTAKadc2Io71zV-RIYNc7-6c",
  authDomain: "ibbni-55e41.firebaseapp.com",
  projectId: "ibbni-55e41",
  storageBucket: "ibbni-55e41.firebasestorage.app",
  messagingSenderId: "429036025018",
  appId: "1:429036025018:web:f0dd72fa90771ee0f43e83",
  measurementId: "G-XFSPZS1RDD"
};

// 🚀 تشغيل Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// نخليهم global
window.auth = auth;
window.db = db;

console.log("🔥 Firebase جاهز");

// ─────────────────────────────
// 🔐 تسجيل الدخول
// ─────────────────────────────
window.doLogin = async function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("اكتب الايميل وكلمة السر");
    return;
  }

  try {
    const res = await auth.signInWithEmailAndPassword(email, password);

    window.curUser = res.user;
    window.curType = (email === "admin@gmail.com") ? "admin" : "client";

    alert("✅ تم تسجيل الدخول");

    if (typeof _activateUser === "function") _activateUser();
    go("pg-home");

  } catch (err) {
    alert("❌ " + err.message);
  }
};

// ─────────────────────────────
// 🆕 تسجيل حساب جديد
// ─────────────────────────────
window.doAuth = async function () {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!email || !password) {
    alert("اكتب الايميل وكلمة السر");
    return;
  }

  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);

    await db.collection("users").doc(res.user.uid).set({
      email: email,
      createdAt: new Date()
    });

    alert("✅ تم إنشاء الحساب");

  } catch (err) {
    alert("❌ " + err.message);
  }
};

// ─────────────────────────────
// 🚪 تسجيل خروج
// ─────────────────────────────
window.doLogout = async function () {
  await auth.signOut();

  window.curUser = null;
  window.curType = null;

  if (typeof _deactivateUser === "function") _deactivateUser();

  alert("تم تسجيل الخروج");
  go("pg-home");
};

// ─────────────────────────────
// 💾 حفظ بروفايل (ربط مع app.js)
// ─────────────────────────────
window.savePro = async function (data) {
  try {
    const docRef = await db.collection("professionals").add(data);

    console.log("✅ تم الحفظ:", docRef.id);

  } catch (err) {
    console.error(err);
  }
};

// ─────────────────────────────
// 📥 تحميل البيانات
// ─────────────────────────────
window.loadPros = async function () {
  try {
    const snap = await db.collection("professionals").get();

    snap.forEach(doc => {
      professionals.push({
        id: doc.id,
        ...doc.data()
      });
    });

    if (typeof renderPros === "function") renderPros();

  } catch (err) {
    console.error(err);
  }
};

// ─────────────────────────────
// 🔁 متابعة حالة المستخدم
// ─────────────────────────────
auth.onAuthStateChanged(user => {
  if (user) {
    window.curUser = user;

    if (typeof _activateUser === "function") _activateUser();
  } else {
    window.curUser = null;

    if (typeof _deactivateUser === "function") _deactivateUser();
  }
});
