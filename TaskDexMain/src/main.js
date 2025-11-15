// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRuMa8OEfaQUkKKNeiOSujWs0L2O-xjeA",
  authDomain: "taskdexplasma.firebaseapp.com",
  projectId: "taskdexplasma",
  storageBucket: "taskdexplasma.firebasestorage.app",
  messagingSenderId: "327071823280",
  appId: "1:327071823280:web:03d1161d0cb92990a81275",
  measurementId: "G-73D5ENPXYK"
};

// Initialize Firebase
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

// Application state
let currentUser = null;
let currentUserData = null;
let pendingSignupData = null; // Store signup data during OTP flow

// View management
function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  const view = document.getElementById(viewId);
  if (view) {
    view.classList.add('active');
  }
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add('active');
  }
  
  // Update menu active state
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  const menuItem = document.querySelector(`[data-page="${pageId}"]`);
  if (menuItem) {
    menuItem.classList.add('active');
  }
}

// Status message helper
function showStatus(viewId, message, type = "info") {
  const statusEl = document.getElementById(`${viewId}-status-message`);
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.color = type === "error" ? "#ff6b6b" : type === "success" ? "#51cf66" : "rgba(255, 255, 255, 0.87)";
    statusEl.style.backgroundColor = type === "error" ? "rgba(255, 107, 107, 0.1)" : type === "success" ? "rgba(81, 207, 102, 0.1)" : "transparent";
  }
}

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in Firestore temporarily
async function storeOTP(userId, otp) {
  const otpRef = doc(db, "otps", userId);
  await setDoc(otpRef, {
    code: otp,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });
}

// Verify OTP
async function verifyOTP(userId, inputOTP) {
  const otpRef = doc(db, "otps", userId);
  const otpDoc = await getDoc(otpRef);
  
  if (!otpDoc.exists()) {
    return { valid: false, message: "OTP not found or expired" };
  }
  
  const otpData = otpDoc.data();
  const expiresAt = otpData.expiresAt.toDate();
  
  if (new Date() > expiresAt) {
    await deleteDoc(otpRef);
    return { valid: false, message: "OTP has expired" };
  }
  
  if (otpData.code !== inputOTP) {
    return { valid: false, message: "Invalid OTP" };
  }
  
  await deleteDoc(otpRef);
  return { valid: true };
}

// Get user by email or username
async function getUserByEmailOrUsername(emailOrUsername) {
  // First try as email
  try {
    const usersRef = collection(db, "users");
    const emailQuery = query(usersRef, where("email", "==", emailOrUsername));
    const emailSnapshot = await getDocs(emailQuery);
    if (!emailSnapshot.empty) {
      return emailSnapshot.docs[0].data();
    }
  } catch (error) {
    console.error("Error querying by email:", error);
  }
  
  // Then try as username
  try {
    const usersRef = collection(db, "users");
    const usernameQuery = query(usersRef, where("username", "==", emailOrUsername));
    const usernameSnapshot = await getDocs(usernameQuery);
    if (!usernameSnapshot.empty) {
      return usernameSnapshot.docs[0].data();
    }
  } catch (error) {
    console.error("Error querying by username:", error);
  }
  
  return null;
}

// Check if username exists
async function usernameExists(username) {
  const usersRef = collection(db, "users");
  const usernameQuery = query(usersRef, where("username", "==", username));
  const snapshot = await getDocs(usernameQuery);
  return !snapshot.empty;
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Login functionality
  const loginButton = document.getElementById("login-button");
  const loginEmailInput = document.getElementById("login-email");
  const loginPasswordInput = document.getElementById("login-password");
  
  loginButton?.addEventListener("click", async () => {
    const emailOrUsername = loginEmailInput.value.trim();
    const password = loginPasswordInput.value;
    
    if (!emailOrUsername || !password) {
      showStatus("login", "Please enter both email/username and password", "error");
      return;
    }
    
    showStatus("login", "Logging in...", "info");
    
    try {
      // Try to find user by email or username
      const userData = await getUserByEmailOrUsername(emailOrUsername);
      
      if (!userData) {
        showStatus("login", "User not found. Please check your email/username.", "error");
        return;
      }
      
      // Sign in with the email from userData
      const userCredential = await signInWithEmailAndPassword(auth, userData.email, password);
      console.log("User logged in:", userCredential.user.uid);
      
      // Clear form
      loginEmailInput.value = "";
      loginPasswordInput.value = "";
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        showStatus("login", "Incorrect password. Please try again.", "error");
      } else if (error.code === "auth/user-not-found") {
        showStatus("login", "User not found. Please sign up first.", "error");
      } else {
        showStatus("login", `Login error: ${error.message}`, "error");
      }
    }
  });
  
  // Google sign-in
  const googleButton = document.getElementById("google-signin-button");
  googleButton?.addEventListener("click", async () => {
    showStatus("login", "Opening Google sign-in...", "info");
    
    const provider = new GoogleAuthProvider();
    try {
      console.log("Attempting Google sign-in...");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("Google sign-in successful:", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // New user - create profile and go to character selection
        console.log("Creating new user profile...");
        const username = user.displayName 
          ? user.displayName.replace(/\s+/g, '').toLowerCase() 
          : user.email.split('@')[0];
        
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          username: username,
          currentStreak: 0,
          character: null,
          starterPokemon: null,
          tasks: []
        });
        
        console.log("User profile created, loading user data...");
        // Load user data and show character selection
        await loadUserData();
        showView("character-view");
        showStatus("login", "Welcome! Please choose your character.", "success");
      } else {
        // Existing user - load data and go to home or character selection
        console.log("Existing user, loading data...");
        await loadUserData();
        
        if (currentUserData && !currentUserData.character) {
          showView("character-view");
          showStatus("login", "Please complete your character selection.", "info");
        } else if (currentUserData) {
          showView("home-view");
          await loadTasks();
          showStatus("login", `Welcome back, ${currentUserData.username || user.email}!`, "success");
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      if (error.code === 'auth/popup-closed-by-user') {
        showStatus("login", "Sign-in cancelled", "info");
      } else if (error.code === 'auth/popup-blocked') {
        showStatus("login", "Popup blocked. Please allow popups for this site.", "error");
      } else if (error.code === 'auth/operation-not-allowed') {
        showStatus("login", "Google sign-in is not enabled. Please enable it in Firebase Console.", "error");
      } else {
        showStatus("login", `Google sign-in error: ${error.message} (Code: ${error.code})`, "error");
      }
    }
  });
  
  // Sign up functionality
  const signupButton = document.getElementById("signup-button");
  signupButton?.addEventListener("click", async () => {
    const email = document.getElementById("signup-email").value.trim();
    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;
    
    // Validation
    if (!email || !username || !password || !confirmPassword) {
      showStatus("signup", "Please fill in all fields", "error");
      return;
    }
    
    if (password.length < 6) {
      showStatus("signup", "Password must be at least 6 characters", "error");
      return;
    }
    
    if (password !== confirmPassword) {
      showStatus("signup", "Passwords do not match", "error");
      return;
    }
    
    // Check if username exists
    const usernameTaken = await usernameExists(username);
    if (usernameTaken) {
      showStatus("signup", "Username already taken. Please choose another.", "error");
      return;
    }
    
    showStatus("signup", "Creating account...", "info");
    
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Generate and store OTP
      const otp = generateOTP();
      await storeOTP(user.uid, otp);
      
      // Store signup data temporarily
      pendingSignupData = {
        uid: user.uid,
        email: email,
        username: username,
        password: password
      };
      
      // Send email verification (Firebase will send email)
      await sendEmailVerification(user);
      
      // For demo purposes, also show OTP in console and status
      console.log("OTP for", email, ":", otp);
      showStatus("signup", `Account created! OTP sent to email. Check console for OTP: ${otp}`, "success");
      
      // Switch to OTP view
      setTimeout(() => {
        showView("otp-view");
        showStatus("otp", `OTP sent to ${email}. Check your email or console.`, "info");
      }, 1000);
      
    } catch (error) {
      console.error("Sign up error:", error);
      if (error.code === "auth/email-already-in-use") {
        showStatus("signup", "Email already registered. Please login instead.", "error");
      } else {
        showStatus("signup", `Sign up error: ${error.message}`, "error");
      }
    }
  });
  
  // OTP verification
  const verifyOtpButton = document.getElementById("verify-otp-button");
  verifyOtpButton?.addEventListener("click", async () => {
    const otpInput = document.getElementById("otp-input").value.trim();
    
    if (!otpInput || otpInput.length !== 6) {
      showStatus("otp", "Please enter a valid 6-digit OTP", "error");
      return;
    }
    
    if (!pendingSignupData) {
      showStatus("otp", "Session expired. Please sign up again.", "error");
      showView("signup-view");
      return;
    }
    
    showStatus("otp", "Verifying OTP...", "info");
    
    const verification = await verifyOTP(pendingSignupData.uid, otpInput);
    
    if (!verification.valid) {
      showStatus("otp", verification.message, "error");
      return;
    }
    
    // Create user profile in Firestore
    try {
      await setDoc(doc(db, "users", pendingSignupData.uid), {
        email: pendingSignupData.email,
        username: pendingSignupData.username,
        currentStreak: 0,
        character: null,
        starterPokemon: null,
        tasks: []
      });
      
      showStatus("otp", "Account verified! Redirecting...", "success");
      
      // Clear OTP input
      document.getElementById("otp-input").value = "";
      
      // Switch to character selection
      setTimeout(() => {
        showView("character-view");
        pendingSignupData = null;
      }, 1000);
    } catch (error) {
      console.error("Error creating user profile:", error);
      showStatus("otp", "Error creating profile. Please try again.", "error");
    }
  });
  
  // Resend OTP
  const resendOtpButton = document.getElementById("resend-otp-button");
  resendOtpButton?.addEventListener("click", async () => {
    if (!pendingSignupData) {
      showStatus("otp", "Session expired. Please sign up again.", "error");
      return;
    }
    
    const otp = generateOTP();
    await storeOTP(pendingSignupData.uid, otp);
    console.log("New OTP for", pendingSignupData.email, ":", otp);
    showStatus("otp", `New OTP sent! Check console: ${otp}`, "success");
  });
  
  // Character selection
  let selectedCharacter = null;
  const characterOptions = document.querySelectorAll(".character-option");
  characterOptions.forEach(option => {
    option.addEventListener("click", () => {
      characterOptions.forEach(opt => opt.classList.remove("selected"));
      option.classList.add("selected");
      selectedCharacter = option.dataset.character;
      
      // Show Pokemon selection
      document.getElementById("pokemon-selection").classList.remove("hidden");
    });
  });
  
  // Pokemon selection
  let selectedPokemon = null;
  const pokemonOptions = document.querySelectorAll(".pokemon-option");
  pokemonOptions.forEach(option => {
    option.addEventListener("click", async () => {
      pokemonOptions.forEach(opt => opt.classList.remove("selected"));
      option.classList.add("selected");
      selectedPokemon = option.dataset.pokemon;
      
      if (!currentUser) return;
      
      // Save character and Pokemon selection
      try {
        await updateDoc(doc(db, "users", currentUser.uid), {
          character: selectedCharacter,
          starterPokemon: selectedPokemon
        });
        
        showStatus("character", "Selection saved! Loading home...", "success");
        
        // Reload user data and go to home
        await loadUserData();
        showView("home-view");
      } catch (error) {
        console.error("Error saving selection:", error);
        showStatus("character", "Error saving selection. Please try again.", "error");
      }
    });
  });
  
  // Navigation between views
  document.getElementById("go-to-signup")?.addEventListener("click", (e) => {
    e.preventDefault();
    showView("signup-view");
  });
  
  document.getElementById("go-to-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    showView("login-view");
  });
  
  // Sidebar navigation
  document.querySelectorAll(".menu-item[data-page]").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const pageId = item.dataset.page + "-page";
      showPage(pageId);
    });
  });
  
  // Logout
  document.getElementById("logout-menu-item")?.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      showView("login-view");
    } catch (error) {
      console.error("Logout error:", error);
    }
  });
  
  // Load user data from Firestore
  async function loadUserData() {
    if (!currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        currentUserData = userDoc.data();
        return currentUserData;
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    return null;
  }
  
  // Load and display tasks
  async function loadTasks() {
    if (!currentUser || !currentUserData) return;
    
    const tasksContainer = document.getElementById("tasks-container");
    const noTasksMessage = document.getElementById("no-tasks-message");
    
    if (!tasksContainer) return;
    
    const tasks = currentUserData.tasks || [];
    
    if (tasks.length === 0) {
      noTasksMessage.style.display = "block";
      tasksContainer.innerHTML = "";
      return;
    }
    
    noTasksMessage.style.display = "none";
    tasksContainer.innerHTML = tasks.map((task, index) => `
      <div class="task-item" data-task-id="${index}">
        <input type="checkbox" class="task-checkbox" data-task-index="${index}" ${task.completed ? 'checked' : ''} />
        <span class="task-text ${task.completed ? 'completed' : ''}">${task.title}</span>
        <button class="delete-task" data-task-index="${index}">×</button>
      </div>
    `).join("");
    
    // Add event listeners for checkboxes and delete buttons
    tasksContainer.querySelectorAll('.task-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', async (e) => {
        const index = parseInt(e.target.dataset.taskIndex);
        if (!currentUserData.tasks || !currentUserData.tasks[index]) return;
        
        currentUserData.tasks[index].completed = !currentUserData.tasks[index].completed;
        await updateUserTasks();
      });
    });
    
    tasksContainer.querySelectorAll('.delete-task').forEach(button => {
      button.addEventListener('click', async (e) => {
        const index = parseInt(e.target.dataset.taskIndex);
        if (!currentUserData.tasks || !currentUserData.tasks[index]) return;
        
        if (confirm("Delete this task?")) {
          currentUserData.tasks.splice(index, 1);
          await updateUserTasks();
        }
      });
    });
  }
  
  // Add task
  document.getElementById("add-task-button")?.addEventListener("click", () => {
    const title = prompt("Enter task title:");
    if (!title || !title.trim()) return;
    
    if (!currentUserData.tasks) {
      currentUserData.tasks = [];
    }
    
    currentUserData.tasks.push({
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    });
    
    updateUserTasks();
  });
  
  // Update tasks in Firestore
  async function updateUserTasks() {
    if (!currentUser) return;
    
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        tasks: currentUserData.tasks
      });
      await loadUserData();
      await loadTasks();
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
  }
  
  // Monitor auth state
  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    
    if (user) {
      console.log("User logged in:", user.uid);
      
      // Load user data
      await loadUserData();
      
      // Check if user needs character selection
      if (currentUserData && !currentUserData.character) {
        showView("character-view");
      } else if (currentUserData) {
        // User is set up, show home
        showView("home-view");
        await loadTasks();
      } else {
        // User data doesn't exist, create it
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          username: user.email.split('@')[0],
          currentStreak: 0,
          character: null,
          starterPokemon: null,
          tasks: []
        });
        showView("character-view");
      }
    } else {
      console.log("User logged out");
      currentUser = null;
      currentUserData = null;
      showView("login-view");
    }
  });
});
