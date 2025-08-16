document.querySelectorAll('input[name="color"]').forEach(el => {
  el.addEventListener("change", () => {
    if (el.checked) {
      document.documentElement.style.setProperty("--ui", el.value);
    }
  });
});

let style = "cam";

function updateBackground() {
  // Remove existing background if any
  const existing = document.getElementById("background");
  if (existing) existing.remove();

  // If style is not CAM, create image
  if (style !== "cam") {
    const img = document.createElement("img");
    img.id = "background";
    img.src = "./res/Glainimension.jpg";
    img.alt = "";
    document.body.appendChild(img);
  }
}

// initial call
updateBackground();

// Listen for style changes
document.querySelectorAll('input[name="style"]').forEach(el => {
  el.addEventListener("change", () => {
    if (el.checked) {
      style = el.value;
      updateBackground();
      console.log("style =", style);
    }
  });
});
