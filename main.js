let allEmails = [];
let emailPool = [];
let usedEmails = [];
let currentEmail = null;
let emailCount = 0;
let correct = 0;

const EMAILS_PER_DAY = 6;

// DOM Elements
const fishingDiv = document.getElementById("fishing");
const emailDiv = document.getElementById("email");
const resultDiv = document.getElementById("result");
const endStatsDiv = document.getElementById("end-stats");

// Load emails from JSON
fetch("emails.json")
  .then(response => response.json())
  .then(data => {
    allEmails = data;
    startNewDay();
  })
  .catch(err => {
    console.error("Failed to load emails.json", err);
  });

// Start a new day with 6 random emails
function startNewDay() {
  refillEmailPoolIfNeeded();
  emailCount = 0;
  correct = 0;
  usedEmails = usedEmails.slice(-EMAILS_PER_DAY * 2); // Keep only last 2 days

  fishingDiv.classList.remove("hidden");
}

function fishEmail() {
  fishingDiv.classList.add("hidden");
  resultDiv.classList.add("hidden");

  setTimeout(() => {
    if (emailPool.length === 0) {
      refillEmailPoolIfNeeded();
    }

    // Final fallback if the pool is still empty (edge case)
    if (emailPool.length === 0) {
      console.error("No available emails to display.");
      endStatsDiv.innerHTML = `
        <h2>Error</h2>
        <p>There are no more emails to display. Please add more emails to the emails.json file.</p>
      `;
      endStatsDiv.classList.remove("hidden");
      return;
    }

    currentEmail = emailPool.pop();
    usedEmails.push(currentEmail);

    document.getElementById("email-sender").textContent = `From: ${currentEmail.sender}`;
    document.getElementById("email-subject").textContent = `Subject: ${currentEmail.subject}`;
    document.getElementById("email-body").textContent = currentEmail.body;

    emailDiv.classList.remove("hidden");
  }, 1000);
}

function refillEmailPoolIfNeeded() {
  const recentSet = new Set(usedEmails.map(e => JSON.stringify(e)));

  // Filter emails not recently used
  const freshEmails = allEmails.filter(e => !recentSet.has(JSON.stringify(e)));

  // If too few emails remain, allow reusing older ones
  if (freshEmails.length < EMAILS_PER_DAY) {
    emailPool = [...allEmails];
    usedEmails = [];
  } else {
    emailPool = [...freshEmails];
  }

  // Shuffle
  for (let i = emailPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [emailPool[i], emailPool[j]] = [emailPool[j], emailPool[i]];
  }
}



function guess(choice) {
  emailDiv.classList.add("hidden");

  const correctChoice = currentEmail.type === "phish" || currentEmail.isPhishing ? "phish" : "legit";

  if (choice === correctChoice) {
    resultDiv.textContent = "✅ Correct!";
    correct++;
  } else {
    resultDiv.textContent = "❌ Wrong!";
  }

  resultDiv.classList.remove("hidden");

  emailCount++;

  if (emailCount >= EMAILS_PER_DAY) {
    showStats();
  } else {
    setTimeout(() => {
      resultDiv.classList.add("hidden");
      fishingDiv.classList.remove("hidden");
    }, 1000);
  }
}

function showStats() {
  fishingDiv.classList.add("hidden");
  resultDiv.classList.add("hidden");
  endStatsDiv.classList.remove("hidden");

  endStatsDiv.innerHTML = `
    <h2>Day Complete!</h2>
    <p>You identified ${correct} out of ${EMAILS_PER_DAY} emails correctly.</p>
    <button onclick="resetGame()">Play Again</button>
  `;
}

function resetGame() {
  endStatsDiv.classList.add("hidden");
  startNewDay();
}

