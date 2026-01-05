// import { auth, db } from './firebase.js';
// import {
//   signOut,
//   onAuthStateChanged
// } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// import {
//   doc,
//   getDoc,
//   updateDoc,
//   Timestamp,
//   increment
// } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// const usernameEl = document.getElementById("username");
// const userImageEl = document.getElementById("userImage");
// const checkinTimeEl = document.getElementById("checkinTime");
// const checkoutTimeEl = document.getElementById("checkoutTime");
// const breakStatus = document.getElementById("breakStatus");
// const breakCountsEl = document.getElementById("breakCounts");
// const endBreakBtn = document.getElementById("endBreakBtn");

// let currentUser, userDocRef;
// let breakStartTime = null;
// let currentBreakType = "";

// onAuthStateChanged(auth, async (user) => {
//   if (!user) return location.href = "login.html";
//   currentUser = user;
//   userDocRef = doc(db, "users", user.uid);

//   const docSnap = await getDoc(userDocRef);
//   const userData = docSnap.data() || {};

//   usernameEl.textContent = userData.name || "User";

//   // Profile Image - if photoURL present show, else show "?" text
//   if (userData.photoURL) {
//     userImageEl.textContent = "";
//     userImageEl.style.backgroundImage = `url(${userData.photoURL})`;
//     userImageEl.style.backgroundSize = "cover";
//     userImageEl.style.backgroundPosition = "center";
//   } else {
//     userImageEl.style.backgroundImage = "";
//     userImageEl.textContent = "?";
//   }

//   if (userData.checkInTime) {
//     checkinTimeEl.textContent = new Date(userData.checkInTime.seconds * 1000).toLocaleTimeString();
//   }
//   if (userData.checkOutTime) {
//     checkoutTimeEl.textContent = new Date(userData.checkOutTime.seconds * 1000).toLocaleTimeString();
//   }
//   updateBreakCounts(userData.breakCounts || {});
// });

// document.getElementById("checkinBtn").onclick = async () => {
//   const now = Timestamp.now();

//   const docSnap = await getDoc(userDocRef);
//   const userData = docSnap.data() || {};

//   if (userData.checkInTime) {
//     const lastCheckIn = userData.checkInTime.toDate();
//     const diffHours = (now.toDate() - lastCheckIn) / (1000 * 60 * 60);
//     if (diffHours < 12) {
//       alert(`You already checked in less than 12 hours ago.\nPlease wait ${Math.ceil(12 - diffHours)} hour(s) before checking in again.`);
//       return;
//     }
//   }

//   await updateDoc(userDocRef, { checkInTime: now });
//   checkinTimeEl.textContent = now.toDate().toLocaleTimeString();

//   alert("Checked In Successfully!");
// };

// document.getElementById("checkoutBtn").onclick = async () => {
//   const now = Timestamp.now();

//   const docSnap = await getDoc(userDocRef);
//   const userData = docSnap.data() || {};

//   if (userData.checkOutTime) {
//     const lastCheckOut = userData.checkOutTime.toDate();
//     const diffHours = (now.toDate() - lastCheckOut) / (1000 * 60 * 60);
//     if (diffHours < 12) {
//       alert(`You already checked out less than 12 hours ago.\nPlease wait ${Math.ceil(12 - diffHours)} hour(s) before checking out again.`);
//       return;
//     }
//   }

//   await updateDoc(userDocRef, { checkOutTime: now });
//   checkoutTimeEl.textContent = now.toDate().toLocaleTimeString();

//   alert("Checked Out Successfully!");
// };

// // window.startBreak = async (type) => {
// //   breakStartTime = new Date();
// //   currentBreakType = type;
// //   breakStatus.innerHTML = `<strong>On ${type} break...</strong>`;
// //   endBreakBtn.classList.remove("d-none");
// // };
//  window.startBreak = async (type) => {
//   if (breakStartTime !== null) {
//     alert(`You're already on a ${currentBreakType} break! End it first.`);
//     return;
//   }

//   breakStartTime = new Date();
//   currentBreakType = type;
//   breakStatus.innerHTML = `<strong>On ${type} break...</strong>`;
//   endBreakBtn.classList.remove("d-none");
// };

// endBreakBtn.onclick = async () => {
//   const end = new Date();
//   const minutes = Math.round((end - breakStartTime) / 60000);

//   await updateDoc(userDocRef, {
//   [`breakHistory.${Date.now()}`]: {
//     type: currentBreakType,
//     start: breakStartTime,
//     end,
//     duration: minutes
//   },
//   [`breakCounts.${currentBreakType}`]: increment(1)
// });


//   // await updateDoc(userDocRef, {
//   //   [`breakCounts.${currentBreakType}`]: increment(1)
//   // });

//   breakStatus.innerHTML = `<strong>${currentBreakType} Break ended: ${minutes} minutes</strong>`;
//   endBreakBtn.classList.add("d-none");

//   const docSnap = await getDoc(userDocRef);
//   updateBreakCounts(docSnap.data().breakCounts || {});
// };

// document.getElementById("logoutBtn").onclick = async () => {
//   await signOut(auth);
//   location.href = "login.html";
// };

// function updateBreakCounts(counts) {
//   breakCountsEl.innerHTML = '';
//   for (const [type, count] of Object.entries(counts)) {
//     const li = document.createElement('li');
//     li.className = "list-group-item bg-transparent border-light text-white";
//     li.textContent = `${type}: ${count} times`;
//     breakCountsEl.appendChild(li);
//   }
// }



import { auth, db } from './firebase.js';
import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// DOM Elements
const usernameEl = document.getElementById("username");
const userImageEl = document.getElementById("userImage");
const checkinTimeEl = document.getElementById("checkinTime");
const checkoutTimeEl = document.getElementById("checkoutTime");
const breakStatus = document.getElementById("breakStatus");
const breakCountsEl = document.getElementById("breakCounts");
const endBreakBtn = document.getElementById("endBreakBtn");
const checkinBtn = document.getElementById("checkinBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

let currentUser, userDocRef;
let breakStartTime = null;
let currentBreakType = "";

// Check user auth
onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "login.html";
  currentUser = user;
  userDocRef = doc(db, "users", user.uid);

  const docSnap = await getDoc(userDocRef);
  const userData = docSnap.data() || {};

  // Show username
  const name = userData.name || user.displayName || "User";
  usernameEl.textContent = name;

  // Handle image or fallback
  const photo = userData.photoURL || user.photoURL;
  if (photo) {
    userImageEl.textContent = "";
    userImageEl.style.backgroundImage = `url(${photo})`;
    userImageEl.style.backgroundSize = "cover";
    userImageEl.style.backgroundPosition = "center";
  } else {
    userImageEl.style.backgroundImage = "";
    userImageEl.textContent = name[0].toUpperCase();
  }

  // Show existing checkin/checkout times
  if (userData.checkInTime) {
    checkinTimeEl.textContent = new Date(userData.checkInTime.seconds * 1000).toLocaleTimeString();
  }
  if (userData.checkOutTime) {
    checkoutTimeEl.textContent = new Date(userData.checkOutTime.seconds * 1000).toLocaleTimeString();
  }

  // Show correct button based on last activity
  if (userData.checkInTime && !userData.checkOutTime) {
    checkinBtn.classList.add("d-none");
    checkoutBtn.classList.remove("d-none");
  } else {
    checkinBtn.classList.remove("d-none");
    checkoutBtn.classList.add("d-none");
  }

  updateBreakCounts(userData.breakCounts || {});
});

// Check In Button Click
checkinBtn.onclick = async () => {
  const now = Timestamp.now();

  const docSnap = await getDoc(userDocRef);
  const userData = docSnap.data() || {};

  if (userData.checkInTime) {
    const lastCheckIn = userData.checkInTime.toDate();
    const diffHours = (now.toDate() - lastCheckIn) / (1000 * 60 * 60);
    if (diffHours < 12) {
      alert(`You already checked in less than 12 hours ago.\nPlease wait ${Math.ceil(12 - diffHours)} hour(s) before checking in again.`);
      return;
    }
  }

  await updateDoc(userDocRef, { checkInTime: now });
  checkinTimeEl.textContent = now.toDate().toLocaleTimeString();

  // Show/hide buttons
  checkinBtn.classList.add("d-none");
  checkoutBtn.classList.remove("d-none");

  alert("Checked In Successfully!");
};

// Check Out Button Click
checkoutBtn.onclick = async () => {
  const now = Timestamp.now();

  const docSnap = await getDoc(userDocRef);
  const userData = docSnap.data() || {};

  if (userData.checkOutTime) {
    const lastCheckOut = userData.checkOutTime.toDate();
    const diffHours = (now.toDate() - lastCheckOut) / (1000 * 60 * 60);
    if (diffHours < 12) {
      alert(`You already checked out less than 12 hours ago.\nPlease wait ${Math.ceil(12 - diffHours)} hour(s) before checking out again.`);
      return;
    }
  }

  await updateDoc(userDocRef, { checkOutTime: now });
  checkoutTimeEl.textContent = now.toDate().toLocaleTimeString();

  // Show/hide buttons
  checkoutBtn.classList.add("d-none");
  checkinBtn.classList.remove("d-none");

  alert("Checked Out Successfully!");
};

// Break Start
window.startBreak = async (type) => {
  if (breakStartTime !== null) {
    alert(`You're already on a ${currentBreakType} break! End it first.`);
    return;
  }

  breakStartTime = new Date();
  currentBreakType = type;
  breakStatus.innerHTML = `<strong>On ${type} break...</strong>`;
  endBreakBtn.classList.remove("d-none");
};

// End Break
endBreakBtn.onclick = async () => {
  const end = new Date();
  const minutes = Math.round((end - breakStartTime) / 60000);

  await updateDoc(userDocRef, {
    [`breakHistory.${Date.now()}`]: {
      type: currentBreakType,
      start: breakStartTime,
      end,
      duration: minutes
    },
    [`breakCounts.${currentBreakType}`]: increment(1)
  });

  breakStatus.innerHTML = `<strong>${currentBreakType} Break ended: ${minutes} minutes</strong>`;
  endBreakBtn.classList.add("d-none");
  breakStartTime = null;
  currentBreakType = "";

  const docSnap = await getDoc(userDocRef);
  updateBreakCounts(docSnap.data().breakCounts || {});
};

// Logout
document.getElementById("logoutBtn").onclick = async () => {
  await signOut(auth);
  location.href = "login.html";
};

// Update break list
function updateBreakCounts(counts) {
  breakCountsEl.innerHTML = '';
  for (const [type, count] of Object.entries(counts)) {
    const li = document.createElement('li');
    li.className = "list-group-item bg-transparent border-light text-white";
    li.textContent = `${type}: ${count} times`;
    breakCountsEl.appendChild(li);
  }
}

