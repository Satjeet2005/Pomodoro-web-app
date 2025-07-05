// Pomodoro Timer Script
// Handles mode switching, timer logic, settings, and UI updates

let selectedMode = "pomodoro"; // Current timer mode
let isTimerActive = false; // Is any timer running?

// Tracks which timer is currently active (running)
let isActive = {
  pomodoro: false,
  shortbreak: false,
  longbreak: false,
};

document.addEventListener("DOMContentLoaded", () => {
  const modeChangeButtons = document.querySelectorAll(".mode-change-btn");
  const highlighter = document.querySelector(".highlighter");

  // Move the highlighter bar under the selected mode button
  function moveHighlighter(targetBtn) {
    highlighter.style.width = `${targetBtn.offsetWidth}px`;
    highlighter.style.left = `${targetBtn.offsetLeft}px`;
  }

  // Set highlighter to the active button on load
  const setInitialPosition = () => {
    const activeBtn = document.querySelector(".mode-change-btn--active");
    if (activeBtn) moveHighlighter(activeBtn);
  };

  setInitialPosition();
  window.addEventListener("resize", setInitialPosition);

  // Handle mode button clicks
  modeChangeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (isTimerActive)
        showErrorMessage(); // Prevent mode change if timer is running
      else {
        modeChangeButtons.forEach((b) =>
          b.classList.remove("mode-change-btn--active")
        );
        const clickedBtn = e.target;
        clickedBtn.classList.add("mode-change-btn--active");
        selectedMode = clickedBtn.dataset.modeType;
        showRelevantTimer(selectedMode);
        moveHighlighter(clickedBtn);
      }
    });
  });
});

// Show only the timer display relevant to the current mode
function showRelevantTimer(timer) {
  const allTimers = document.querySelectorAll(".timer-display");
  allTimers.forEach((t) => t.classList.add("hidden"));
  const activeTimer = document.querySelector(`[data-timer-type="${timer}"]`);
  activeTimer.classList.remove("hidden");
  return activeTimer;
}

// ===================
// SETTINGS PANEL LOGIC
// ===================

// Open settings panel when settings icon is clicked
const settingsButton = document.querySelector(".settings-icon");
settingsButton.addEventListener("click", () => {
  checkTimer();
  settingsPanelBringUp();
});

// Font selection logic
const allFontOptions = document.querySelectorAll(".font-radio-input");
allFontOptions.forEach((fontOption) => {
  fontOption.addEventListener("click", () => {
    clearAllFontOptions();
    fontOption.classList.add("font-radio-input--active");
  });
});

// Remove active class from all font options
function clearAllFontOptions() {
  allFontOptions.forEach((fontOption) => {
    fontOption.classList.remove("font-radio-input--active");
  });
}

// Color selection logic
const allCheck = document.querySelectorAll(".check");
const allColorOptions = document.querySelectorAll(".color-radio-input");
allColorOptions.forEach((colorOption) => {
  colorOption.addEventListener("click", () => {
    clearAllColorOptions();
    colorOption.querySelector(".check").classList.remove("opacity-0");
  });
});

// Hide all color checkmarks
function clearAllColorOptions() {
  allCheck.forEach((colorOption) => {
    colorOption.classList.add("opacity-0");
  });
}

// Apply button logic: apply settings and close panel
const settingsContainerWrapper = document.querySelector(
  ".settings-container-wrapper"
);
const settingsContainer = document.querySelector(".settings-container");
const applyButton = document.querySelector(".apply-button");
applyButton.addEventListener("click", () => {
  applyTimeChanges();
  applyColorChanges();
  applyFontChanges();
  settingsPanelBringDown();
});

// Show settings panel with animation and backdrop
function settingsPanelBringUp() {
  checkTimer();
  settingsContainer.classList.remove(
    "animate__bounceOutDown",
    "animate__bounceInUp"
  );
  const backDrop = document.querySelector(".backdrop");
  backDrop.classList.add("backdrop--active");
  settingsContainerWrapper.classList.remove("hidden");
  settingsContainer.classList.add("animate__bounceInUp");
}

// Hide settings panel with animation and backdrop
function settingsPanelBringDown() {
  settingsContainer.classList.remove(
    "animate__bounceOutDown",
    "animate__bounceInUp"
  );
  const backDrop = document.querySelector(".backdrop");
  backDrop.classList.remove("backdrop--active");
  settingsContainer.classList.add("animate__bounceOutDown");
  setTimeout(() => {
    settingsContainerWrapper.classList.add("hidden");
  }, 1000);
}

// Close button for settings panel
const closeBtn = document.querySelector(".close-btn");
closeBtn.addEventListener("click", settingsPanelBringDown);

// ===================
// TIMER INPUT ARROWS
// ===================

// Up arrow: increment timer input value
const allUpArrows = document.querySelectorAll(".arrow-up");
allUpArrows.forEach((arrow) => {
  arrow.addEventListener("click", (e) => {
    const input = e.currentTarget
      .closest(".timer-input-container")
      .querySelector(".timer-input");
    if (!isActive[input.id.split("-")[0]]) {
      changeValue(input, 1);
    }
  });
});

// Down arrow: decrement timer input value
const allDownArrows = document.querySelectorAll(".arrow-down");
allDownArrows.forEach((arrow) => {
  arrow.addEventListener("click", (e) => {
    const input = e.currentTarget
      .closest(".timer-input-container")
      .querySelector(".timer-input");
    if (!isActive[input.id.split("-")[0]]) {
      changeValue(input, -1);
    }
  });
});

// Change the value of a timer input by delta (±1)
function changeValue(input, delta) {
  let value = parseFloat(input.value) || 1;
  const minValue = input.min;
  value += delta;
  input.value = value >= minValue ? value : minValue;
}

// ===================
// TIMER SETTINGS LOGIC
// ===================

// Store timer durations (in seconds)
let time = {
  pomodoro: 1500,
  shortbreak: 300,
  longbreak: 900,
};

// Apply changes from settings inputs to timer durations and displays
function applyTimeChanges() {
  if (!isActive.pomodoro) {
    time.pomodoro = document.querySelector("#pomodoro-timer").value * 60;
    timeLeft.pomodoro = document.querySelector("#pomodoro-timer").value * 60;
    document.querySelector("#pomodoro-time-display").innerHTML = formatTime(
      time.pomodoro
    );
  }
  if (!isActive.shortbreak) {
    time.shortbreak = document.querySelector("#shortbreak-timer").value * 60;
    timeLeft.shortbreak =
      document.querySelector("#shortbreak-timer").value * 60;
    document.querySelector("#shortbreak-time-display").innerHTML = formatTime(
      time.shortbreak
    );
  }
  if (!isActive.longbreak) {
    time.longbreak = document.querySelector("#longbreak-timer").value * 60;
    timeLeft.longbreak = document.querySelector("#longbreak-timer").value * 60;
    document.querySelector("#longbreak-time-display").innerHTML = formatTime(
      time.longbreak
    );
  }
}

// Apply color theme from settings
function applyColorChanges() {
  const selectedColor = document.querySelector(".check:not(.opacity-0)")
    .parentElement.dataset.color;
  const body = document.querySelector("body");
  body.classList.remove("body--blue", "body--red", "body--purple");
  body.classList.add(`body--${selectedColor}`);
}

// Apply font from settings
function applyFontChanges() {
  const selectedFont = document.querySelector(".font-radio-input--active")
    .dataset.font;
  const body = document.querySelector("body");
  body.classList.remove(
    "body--kumbh-sans",
    "body--space-mono",
    "body--roboto-slabs"
  );
  body.classList.add(`body--${selectedFont}`);
}

// Format seconds as MM:SS
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ===================
// ERROR MESSAGE LOGIC
// ===================

// Show error message if user tries to change mode while timer is running
function showErrorMessage() {
  const errorMsg = document.querySelector(".error__wrapper");
  errorMsg.classList.remove("animate__bounceInUp", "animate__bounceOutDown");
  errorMsg.classList.add("animate__bounceInUp");
  errorMsg.classList.remove("hidden");
  setTimeout(() => {
    errorMsg.classList.add("animate__bounceOutDown", "animate__slower");
  }, 4000);
  setTimeout(() => {
    errorMsg.classList.add("animate__bounceOutDown", "hidden");
  }, 6000);
}

// ===================
// TIMER LOGIC
// ===================

let intervalId = null; // Stores setInterval ID for timer

// Remaining time for each timer mode (in seconds)
let timeLeft = {
  pomodoro: 1500,
  shortbreak: 300,
  longbreak: 900,
};

const startButton = document.querySelector("#start-btn");
const pauseButton = document.querySelector("#pause-btn");
const restartButton = document.querySelector("#restart-btn");
const circleBorder = document.querySelector(".progress-ring__circle");

// Get correct SVG radius for progress ring based on screen size
function getRadius() {
  let radius;
  if (window.matchMedia("(max-width: 600px)").matches) {
    radius = circleBorder.dataset.smallRadius;
  } else {
    radius = circleBorder.dataset.largeRadius;
  }
  return parseFloat(radius);
}

let circum = 2 * Math.PI * getRadius(); // Circumference for progress ring
circleBorder.style.strokeDasharray = circum;

// Store last offset for each mode (for pause/resume)
let circumferenceLeft = {
  pomodoro: 0,
  shortbreak: 0,
  longbreak: 0,
};

// Set progress ring based on percentage left
function setProgress(percentage, circum) {
  const offset = circum - percentage * circum;
  circumferenceLeft[selectedMode] = offset;
  circleBorder.style.strokeDashoffset = -offset;
}

// Start timer button
startButton.addEventListener("click", () => {
  startButton.classList.add("hidden");
  pauseButton.classList.remove("hidden");
  const seconds = timeLeft[selectedMode];
  circum = 2 * Math.PI * getRadius(); // recalculate if screen/resized
  circleBorder.style.strokeDasharray = circum;
  // Restore last strokeDashoffset if paused before
  const lastOffset = circumferenceLeft[selectedMode] || 0;
  circleBorder.style.strokeDashoffset = -lastOffset;
  startTimer(seconds);
});

// Pause timer button
pauseButton.addEventListener("click", () => {
  stopTimer();
  pauseButton.classList.add("hidden");
  startButton.classList.remove("hidden");
});

// Restart timer button
restartButton.addEventListener("click", () => {
  timeLeft[selectedMode] = time[selectedMode];
  pauseButton.classList.remove("hidden");
  restartButton.classList.add("hidden");
  startTimer();
});

// Start the timer countdown
function startTimer() {
  isTimerActive = true;
  isActive[selectedMode] = true;
  const totalTime = time[selectedMode]; // Full duration for current mode
  updateDisplay(formatTime(timeLeft[selectedMode]));
  intervalId = setInterval(() => {
    timeLeft[selectedMode]--;
    if (timeLeft[selectedMode] < 0) {
      clearInterval(intervalId);
      isTimerActive = false;
      showRestart();
      return;
    }
    updateDisplay(formatTime(timeLeft[selectedMode]));
    const percentLeft = timeLeft[selectedMode] / totalTime;
    setProgress(percentLeft, circum);
  }, 1000);
}

// Stop the timer countdown
function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    isTimerActive = false;
    isActive[selectedMode] = false;
  }
}

// Update the timer display on the UI
function updateDisplay(formattedTime) {
  const activeTimer = showRelevantTimer(selectedMode);
  activeTimer.innerHTML = formattedTime;
}

// Check if any timer is running and disable inputs if so
function checkTimer() {
  const timeErrorText = document.querySelector(".time-error-text");
  const allInput = document.querySelectorAll(".timer-input");
  for (let key in isActive) {
    if (isActive[key]) {
      timeErrorText.classList.remove("hidden");
      timeErrorText.innerHTML = `The ${key} timer is running. You cannot change its value`;
      const input = document.querySelector(`#${key}-timer`);
      input.setAttribute("disabled", true);
      return;
    }
  }
  timeErrorText.classList.add("hidden");
  allInput.forEach((input) => {
    input.setAttribute("disabled", false);
  });
}

// Show restart button when timer ends
function showRestart() {
  pauseButton.classList.add("hidden");
  restartButton.classList.remove("hidden");
}
