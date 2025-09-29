// Reset page button logic
document.addEventListener("DOMContentLoaded", function () {
  const resetBtn = document.getElementById("resetPageBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      localStorage.removeItem("attendanceCount");
      localStorage.removeItem("waterCount");
      localStorage.removeItem("zeroCount");
      localStorage.removeItem("powerCount");
      localStorage.removeItem("attendeeList");
      location.reload();
    });
  }
});
// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

//Track attendance
let count = 0;
const maxCount = 50;

// Load saved counts and attendee list from localStorage
window.addEventListener("DOMContentLoaded", function () {
  // Load attendance count
  let savedCount = parseInt(localStorage.getItem("attendanceCount"));
  if (isNaN(savedCount)) {
    savedCount = 0;
    localStorage.setItem("attendanceCount", "0");
  }
  count = savedCount;
  document.getElementById("attendeeCount").textContent = count;
  const percentNum = Math.round((count / maxCount) * 100);
  document.getElementById("progressBar").style.width = `${percentNum}%`;

  // Load team counts
  let water = parseInt(localStorage.getItem("waterCount"));
  let zero = parseInt(localStorage.getItem("zeroCount"));
  let power = parseInt(localStorage.getItem("powerCount"));
  if (isNaN(water)) {
    water = 0;
    localStorage.setItem("waterCount", "0");
  }
  if (isNaN(zero)) {
    zero = 0;
    localStorage.setItem("zeroCount", "0");
  }
  if (isNaN(power)) {
    power = 0;
    localStorage.setItem("powerCount", "0");
  }
  document.getElementById("waterCount").textContent = water;
  document.getElementById("zeroCount").textContent = zero;
  document.getElementById("powerCount").textContent = power;

  // Load attendee list
  let attendeeList = [];
  if (localStorage.getItem("attendeeList")) {
    attendeeList = JSON.parse(localStorage.getItem("attendeeList"));
  }
  renderAttendeeList(attendeeList);
});

// Render attendee list
function renderAttendeeList(list) {
  const attendeeListElem = document.getElementById("attendeeList");
  attendeeListElem.innerHTML = "";
  list.forEach(function (att) {
    const li = document.createElement("li");
    li.textContent = `${att.name} (${att.teamName})`;
    li.style.padding = "6px 0";
    li.style.fontSize = "16px";
    attendeeListElem.appendChild(li);
  });
}

// Function to handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  // get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  // Save attendee to list
  let attendeeList = [];
  if (localStorage.getItem("attendeeList")) {
    attendeeList = JSON.parse(localStorage.getItem("attendeeList"));
  }
  attendeeList.push({ name: name, teamName: teamName });
  localStorage.setItem("attendeeList", JSON.stringify(attendeeList));
  renderAttendeeList(attendeeList);

  console.log(name, teamName);

  // Increment count
  count++;
  console.log("Total check-ins: ", count);

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`);

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Save counts to localStorage
  localStorage.setItem("attendanceCount", count);
  localStorage.setItem(
    "waterCount",
    document.getElementById("waterCount").textContent
  );
  localStorage.setItem(
    "zeroCount",
    document.getElementById("zeroCount").textContent
  );
  localStorage.setItem(
    "powerCount",
    document.getElementById("powerCount").textContent
  );

  // Show welcome message
  const message = `🎉Welcome, ${name} from ${teamName}!🎉`;
  console.log(message);

  // --- Add UI updates for progress bar and greeting ---
  const attendeeCount = document.getElementById("attendeeCount");
  const progressBar = document.getElementById("progressBar");
  const greeting = document.getElementById("greeting");

  // Update attendee count in UI
  attendeeCount.textContent = count;

  // Update progress bar visually
  const percentNum = Math.round((count / maxCount) * 100);
  progressBar.style.width = `${percentNum}%`;

  // Show greeting message on page
  greeting.textContent = `Welcome, ${name} from ${teamName}!`;

  // Check for attendance goal
  if (count === maxCount) {
    // Find team counts
    const waterCount = parseInt(
      document.getElementById("waterCount").textContent
    );
    const zeroCount = parseInt(
      document.getElementById("zeroCount").textContent
    );
    const powerCount = parseInt(
      document.getElementById("powerCount").textContent
    );
    let winningTeam = "";
    let maxTeamCount = Math.max(waterCount, zeroCount, powerCount);
    if (waterCount === maxTeamCount) {
      winningTeam = "water";
    } else if (zeroCount === maxTeamCount) {
      winningTeam = "zero";
    } else {
      winningTeam = "power";
    }

    // Celebration message
    greeting.textContent = `🎉 Attendance goal reached! Winning team: ${
      document.querySelector(".team-card." + winningTeam + " .team-name")
        .textContent
    } 🎉`;

    // Highlight winning team
    document.querySelectorAll(".team-card").forEach(function (card) {
      card.style.border = "2px solid transparent";
      card.style.background = "";
    });
    const winnerCard = document.querySelector(".team-card." + winningTeam);
    if (winnerCard) {
      winnerCard.style.border = "3px solid gold";
      winnerCard.style.background = "#fffbe6";
    }
  }

  form.reset();
});
