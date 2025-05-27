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

// Fill the pool with emails not used recently
function refillEmailPoolIfNeeded() {
  const recent = new Set(usedEmails.map(e => JSON.stringify(e)));
  emailPool = allEmails.filter(e => !recent.has(JSON.stringify(e)));

  // Shuffle
  for (let i = emailPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [emailPool[i], emailPool[j]] = [emailPool[j], emailPool[i]];
  }
}

fishingDiv.addEventListener("click", fishEmail);

function fishEmail() {
  fishingDiv.classList.add("hidden");
  resultDiv.classList.add("hidden");

  setTimeout(() => {
    // If pool is low, refill
    if (emailPool.length === 0) {
      refillEmailPoolIfNeeded();
    }

    currentEmail = emailPool.pop();
    if (!currentEmail) {
      console.error("No email could be selected!");
      return;
    }

    usedEmails.push(currentEmail);

    document.getElementById("email-sender").textContent = `From: ${currentEmail.sender}`;
    document.getElementById("email-subject").textContent = `Subject: ${currentEmail.subject}`;
    document.getElementById("email-body").textContent = currentEmail.body;

    emailDiv.classList.remove("hidden");
  }, 1000);
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

