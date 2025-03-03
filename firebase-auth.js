import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// MongoDB configuration
const mongoUrl = "your-mongodb-connection-string";
const mongoClient = new MongoClient(mongoUrl);
let mongoDb;

// Initialize MongoDB
async function initMongoDB() {
  await mongoClient.connect();
  mongoDb = mongoClient.db("bitewise");
  console.log("Connected to MongoDB");
}

// Function to check authentication and load user-specific data
function checkAuth() {
  console.log("Checking authentication state...");

  onAuthStateChanged(auth, async (user) => {
    console.log("Auth state changed:", user);

    if (user) {
      document.getElementById("user-email").textContent = user.email || "No Email";

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data:", userData);
        customizeDashboard(userData);
        loadUserData(user.uid);
      } else {
        console.log("No user data found in Firestore.");
      }
    } else {
      console.log("No user detected, redirecting...");
      setTimeout(() => {
        if (!auth.currentUser) {
          localStorage.removeItem("loggedIn");
          window.location.href = "../login/login-signup.html";
        }
      }, 1500);
    }
  });
}

// Function to load user data from MongoDB
async function loadUserData(uid) {
  const userWeightData = await mongoDb.collection("weights").findOne({ uid });
  const userSleepData = await mongoDb.collection("sleep").findOne({ uid });
  const userMacrosData = await mongoDb.collection("macros").findOne({ uid });

  if (userWeightData) {
    document.getElementById("current-weight").value = userWeightData.currentWeight;
    document.getElementById("target-weight").value = userWeightData.targetWeight;
    updateAreaChart(userWeightData);
  }

  if (userSleepData) {
    document.getElementById("sleep-hours").value = userSleepData.hours;
    document.getElementById("sleep-target").value = userSleepData.target;
    updateSleepChart(userSleepData);
  }

  if (userMacrosData) {
    document.getElementById("proteinInput").value = userMacrosData.protein;
    document.getElementById("carbInput").value = userMacrosData.carbs;
    document.getElementById("fatInput").value = userMacrosData.fat;
    document.getElementById("caloriesOutput").textContent = userMacrosData.calories;
    updateBarChart(userMacrosData);
  }
}

// Function to customize dashboard based on role
function customizeDashboard(userData) {
  const adminSection = document.getElementById("adminSection");
  const userSection = document.getElementById("userSection");

  if (userData.role === "admin") {
    adminSection.style.display = "block";
    userSection.style.display = "none";
  } else {
    userSection.style.display = "block";
    adminSection.style.display = "none";
  }
}

// Function to handle logout
function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      signOut(auth)
        .then(() => {
          localStorage.removeItem("loggedIn");
          window.location.href = "../login/login-signup.html";
        })
        .catch((error) => {
          console.error("Logout Error:", error);
        });
    });
  }
}

// Run authentication check and setup logout on page load
document.addEventListener("DOMContentLoaded", () => {
  initMongoDB();
  checkAuth();
  setupLogout();
});