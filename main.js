const emails = [
  {
    sender: "security@paypal.com",
    subject: "Suspicious login attempt",
    body: "Click here to confirm your identity.",
    isPhishing: true
  },
  {
    sender: "mom@example.com",
    subject: "Dinner tonight?",
    body: "Can you bring dessert?",
    isPhishing: false
  },
  {
    sender: "it-helpdesk@work.org",
    subject: "Your account will be deactivated",
    body: "Log in now to prevent shutdown.",
    isPhishing: true
  },
  {
    sender: "spotify@mail.com",
    subject: "Thanks for subscribing!",
    body: "Here’s your receipt.",
    isPhishing: false
  }
];

let currentEmail = null;
let emailCount = 0;
let correct = 0;

const fishingDiv = document.getElementById("fishing");
const emailDiv = document.getElementById("email");
const resultDiv = document.getElementById("result");
const endStatsDiv = document.getElementById("end-stats");

fishingDiv.addEventListener("click", fishEmail);

function fishEmail() {
  fishingDiv.classList.add("hidden");
  resultDiv.classList.add("hidden");

  setTimeout(() => {
    currentEmail = emails[Math.floor(Math.random() * emails.length)];
    document.getElementById("email-sender").textContent = `From: ${currentEmail.sender}`;
    document.getElementById("email-subject").textContent = `Subject: ${currentEmail.subject}`;
    document.getElementById("email-body").textContent = currentEmail.body;

    emailDiv.classList.remove("hidden");
  }, 1000); // simulate fishing delay
}

function guess(choice) {
  emailDiv.classList.add("hidden");

  const correctChoice = currentEmail.isPhishing ? "phish" : "legit";

  if (choice === correctChoice) {
    resultDiv.textContent = "✅ Correct!";
    correct++;
  } else {
    resultDiv.textContent = "❌ Wrong!";
  }

  resultDiv.classList.remove("hidden");

  emailCount++;

  if (emailCount >= 6) {
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
    <p>You identified ${correct} out of 6 emails correctly.</p>
    <button onclick="resetGame()">Play Again</button>
  `;
}

function resetGame() {
  emailCount = 0;
  correct = 0;
  endStatsDiv.classList.add("hidden");
  fishingDiv.classList.remove("hidden");
}
