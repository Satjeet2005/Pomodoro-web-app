document.addEventListener("DOMContentLoaded", () => {
  const modeChangeButtons = document.querySelectorAll(".mode-change-btn");
  const highlighter = document.querySelector(".highlighter");

  function moveHighlighter(targetBtn) {
    highlighter.style.width = `${targetBtn.offsetWidth}px`;
    highlighter.style.left = `${targetBtn.offsetLeft}px`;
  }

  const setInitialPosition = () => {
    const activeBtn = document.querySelector(".mode-change-btn--active");
    if (activeBtn) moveHighlighter(activeBtn);
  };

  // Set initial position on load
  setInitialPosition();

  // Reposition on resize
  window.addEventListener("resize", setInitialPosition);

  modeChangeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      modeChangeButtons.forEach((b) =>
        b.classList.remove("mode-change-btn--active")
      );
      const clickedBtn = e.target;
      clickedBtn.classList.add("mode-change-btn--active");
      moveHighlighter(clickedBtn);
    });
  });
});
