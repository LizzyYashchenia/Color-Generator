const generateBtn = document.getElementById("generateColorBtn");
const colorBlock = document.querySelector(".color-info");
const colorsSettings = document.querySelector(".colors-settings");
const colorFormatNumber = colorsSettings.querySelectorAll(
  ".colors-settings__color"
);

const getRGBA = (color, alpha = 1) => {
  color = color.replace(/^#/, "");
  if (color.length === 3) {
    color = color
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const a = Math.round((parseInt(color.substring(6, 8), 16) / 255) * 100) / 100;

  const colorRGBA = `${r}, ${g}, ${b}, ${a ?? alpha}`;

  return colorRGBA;
};

const getHSV = (color) => {
  let [r, g, b, a] = getRGBA(color).split(", ").map(Number);

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = max === 0 ? 0 : delta / max;
  let v = max;

  if (delta !== 0) {
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h /= 6;
  }

  const colorHSV = `${Math.round(h * 360)}, ${Math.round(
    s * 100
  )}, ${Math.round(v * 100)}, (${a})`;
  return colorHSV;
};

const getCMYK = (color) => {
  const [r, g, b, a] = getRGBA(color).split(", ").map(Number);
  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;

  const k = 1 - Math.max(normalizedR, normalizedG, normalizedB);

  if (k === 1) {
    return `0, 0, 0, 100, ${a}`;
  }
  const c = Math.round(((1 - normalizedR - k) / (1 - k)) * 100);
  const m = Math.round(((1 - normalizedG - k) / (1 - k)) * 100);
  const y = Math.round(((1 - normalizedB - k) / (1 - k)) * 100);
  const kPercent = Math.round(k * 100);

  const colorCMYK = `${c}, ${m}, ${y}, ${kPercent} (${a})`;

  return colorCMYK;
};

const setColorName = (randomColor) => {
  const HEX = randomColor;
  const HSV = getHSV(randomColor);
  const CMYK = getCMYK(randomColor);
  const RGBA = getRGBA(randomColor);

  colorFormatNumber.forEach((item) => {
    const itemId = item.getAttribute("id");
    switch (itemId) {
      case "HEX":
        item.setAttribute("value", HEX);
        break;
      case "HSV":
        item.setAttribute("value", HSV);
        break;
      case "CMYK":
        item.setAttribute("value", CMYK);
        break;
      case "RGBA":
        item.setAttribute("value", RGBA);
        break;
    }
  });
};

const createNewColor = () => {
  generateBtn.innerHTML = "Regenerate";
  const hex = `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, "0")}`;
  const alpha = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const randomColor = `${hex}${alpha}`;

  setColorName(randomColor);

  if (colorBlock) {
    colorBlock.style.backgroundColor = randomColor;
  }

  document.querySelector(".container").style.backgroundColor = randomColor;

  const content = document.querySelector(".content");
  content.classList.add("result");

  colorBlock.classList.remove("hidden");
  colorsSettings.classList.remove("hidden");
};

function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.classList.add("notification");

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 300);
  }, 500);
}

generateBtn.addEventListener("click", createNewColor);

colorFormatNumber.forEach(function (input) {
  input.onclick = function () {
    navigator.clipboard.writeText(this.value);
    showNotification("Текст скопирован!");
  };
});
