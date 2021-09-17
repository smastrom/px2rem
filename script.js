document.addEventListener("DOMContentLoaded", function (event) {
  // DOM elements declaration
  const baseField = document.querySelector("#base");
  const pixelsField = document.querySelector("#pixels");
  const remsField = document.querySelector("#rems");
  const infoBaseBtn = document.querySelector(".infoBaseBtn");
  const infoBaseTooltip = document.querySelector(".infoBaseTooltip");
  const copyPixels = document.querySelector("#copy_px");
  const copyRems = document.querySelector("#copy_rem");

  // Clipboard
  function hideClipboard() {
    if (!navigator.clipboard) {
      event.target.style.display = "none"; // Hide button if browser not supported
      return; // Ends the function if clipboard not available
    }
  }

  async function copyClipboard(input, target) {
    try {
      await navigator.clipboard.writeText(input);
      target.innerHTML = "Copied!";
      setTimeout(() => {
        target.innerHTML = "Copy";
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        target.innerHTML = "Copy failed";
      }, 1000);
    }
  }

  // Copy pixels to clipboard
  copyPixels.addEventListener("click", async () => {
    hideClipboard();
    let pixelsClean = parseFloat(pixelsField.value);
    copyClipboard(pixelsClean, copyPixels);
  });

  // Copy rems to clipboard
  copyRems.addEventListener("click", async () => {
    hideClipboard();
    let remsClean = parseFloat(remsField.value);
    copyClipboard(remsClean, copyRems);
  });

  // Open and close tooltip

  function closeTooltip() {
    document.addEventListener("click", (e) => {
      if (
        infoBaseTooltip.classList.contains("skewInAnim") &&
        infoBaseTooltip.classList.contains("showInfoBaseTooltip") &&
        !e.target.classList.contains("infoBaseTooltip") &&
        !e.target.classList.contains("infoBaseTooltipText") &&
        !e.target.classList.contains("tooltipLink")
      ) {
        infoBaseTooltip.classList.remove("skewInAnim"); // Removes animation-in class triggered with the opening
        setTimeout(() => {
          infoBaseTooltip.classList.add("skewOutAnim");
        }, 50); // Runs the animation closing class
        setTimeout(() => {
          infoBaseTooltip.classList.remove("showInfoBaseTooltip");
        }, 550); // Sets on display:none the element after the animation is ended

        infoBaseBtn.setAttribute("aria-expanded", "false");
        infoBaseTooltip.setAttribute("aria-hidden", "true");
      }
    });
  }

  infoBaseBtn.addEventListener("click", () => {
    if (infoBaseTooltip.classList.contains("skewOutAnim")) {
      setTimeout(() => {
        infoBaseTooltip.classList.remove("skewOutAnim");
      }, 50); // Remove animation-out class if already trigged the closure, ignored in the first execution
    }

    setTimeout(() => {
      infoBaseTooltip.classList.add("showInfoBaseTooltip"); // Sets tooltip on display: flex
      infoBaseTooltip.classList.add("skewInAnim"); // Runs the animation
    }, 50);

    closeTooltip(); // Runs the function with the listener that closes the tooltip

    if (infoBaseBtn.getAttribute("aria-expanded") === "false") {
      infoBaseBtn.setAttribute("aria-expanded", "true");
    } else {
      infoBaseBtn.setAttribute("aria-expanded", "false");
    }

    if (infoBaseTooltip.getAttribute("aria-hidden") === "true") {
      infoBaseTooltip.setAttribute("aria-hidden", "false");
    } else {
      infoBaseTooltip.setAttribute("aria-hidden", "true");
    }
  });

  function preventChars(e) {
    if (
      ((e.metaKey || e.ctrlKey) &&
        (e.code === "KeyA" ||
          e.code === "KeyC" ||
          e.code === "KeyV" ||
          e.code === "KeyX" ||
          e.code === "KeyZ")) ||
      (e.code >= "Digit" && e.code <= "Digit9") ||
      (e.code >= "Numpad0" && e.code <= "Numpad9") ||
      e.code === "ArrowUp" ||
      e.code === "ArrowRight" ||
      e.code === "ArrowDown" ||
      e.code === "ArrowLeft" ||
      e.code === "Backspace" ||
      e.code === "Delete" ||
      e.code === "Period" ||
      e.code === "Tab"
    ) {
      return;
    }
    e.preventDefault();
  }

  // Pixels field - Rems calculation
  pixelsField.addEventListener("keydown", (e) => {
    preventChars(e);
    setTimeout(() => {
      pixelsField.style.color = "black";

      // Initalize as number the input value
      let baseClean = parseFloat(baseField.value);
      let pixelsClean = parseFloat(pixelsField.value);

      // Calculate rems based on px input
      remsResult = pixelsClean / baseClean;

      // Adjust decimals
      let verifyRems = Number.isInteger(remsResult);
      if (!verifyRems) {
        remsResult = remsResult.toFixed(3);
        remsResult = parseFloat(remsResult);
      }

      // Text color behavior
      remsField.style.color = "var(--mainColor)";
      pixelsField.style.color = "var(--blackText)";

      // Display results
      if (isNaN(pixelsClean)) {
        remsField.value = "";
      } else {
        remsField.value = remsResult;
      }
    }, 50);
  });

  // Rems field - Pixels calculation
  remsField.addEventListener("keydown", (e) => {
    preventChars(e);
    setTimeout(() => {
      // Initalize as number the input value
      let baseClean = parseFloat(baseField.value);
      let remsClean = parseFloat(remsField.value);

      // Calculate px based on rem input
      pixelsResult = baseClean * remsClean;

      // Adjust decimals
      let verifyPixels = Number.isInteger(pixelsResult);
      if (!verifyPixels) {
        pixelsResult = pixelsResult.toFixed(1);
      }

      // Text color behavior
      pixelsField.style.color = "var(--mainColor)";
      remsField.style.color = "var(--blackText)";

      // Display results
      if (isNaN(remsClean)) {
        pixelsField.value = "";
      } else {
        pixelsField.value = pixelsResult;
      }
    }, 50);
  });

  // Base calculation
  baseField.addEventListener("keydown", (e) => {
    preventChars(e);
    setTimeout(() => {
      let baseClean = parseFloat(baseField.value);
      let remsClean = parseFloat(remsField.value);

      // Reset results
      pixelsResult = baseClean * remsClean;

      // Reset color on both fields
      if (isNaN(baseClean)) {
        pixelsField.value = "";
      } else {
        pixelsField.value = pixelsResult;
        pixelsField.style.color = "var(--mainColor)";
      }
    }, 50);
  });

  // Side effects

  // Reset values if input fields are empty
  document.addEventListener("click", (e) => {
    if (e.target != baseField && baseField.value === "") {
      setTimeout(() => {
        pixelsField.value = 16;
        baseField.value = 16;
        remsField.value = 1;
      }, 50);
    } else if (remsField.value === "" || pixelsField.value === "") {
      remsField.value = 1;
      pixelsField.value = baseField.value;
    }
  });

  // Reset and invert properly text color on px and rem input fields when clicking inside the fields
  function resetColor() {
    pixelsField.style.color = "var(--blackText)";
    remsField.style.color = "var(--blackText)";
  }

  pixelsField.addEventListener("click", () => resetColor());
  remsField.addEventListener("click", () => resetColor());

  // Reset text color on px and rem input fields when clicking outside the fields
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("inputField")) {
      pixelsField.style.color = "var(--blackText)";
      remsField.style.color = "var(--blackText)";
    }
  });
});
