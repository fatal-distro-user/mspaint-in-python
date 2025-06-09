const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("color");

let drawing = false;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const width = window.innerWidth - 20;
  const height = 400;

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
  ctx.scale(ratio, ratio);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function getPos(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX - canvas.offsetLeft,
      y: e.touches[0].clientY - canvas.offsetTop
    };
  } else {
    return {
      x: e.offsetX,
      y: e.offsetY
    };
  }
}

canvas.addEventListener("mousedown", () => {
  drawing = true;
  ctx.beginPath();
});
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseout", () => drawing = false);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", (e) => {
  drawing = true;
  ctx.beginPath();
  draw(e);
  e.preventDefault();
});
canvas.addEventListener("touchmove", (e) => {
  draw(e);
  e.preventDefault();
});
canvas.addEventListener("touchend", () => drawing = false);

function draw(e) {
  if (!drawing) return;
  const pos = getPos(e);
  ctx.lineWidth = 5;
  ctx.strokeStyle = colorPicker.value;
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
}

function save() {
  const dataURL = canvas.toDataURL("image/png");
  fetch("/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "image=" + encodeURIComponent(dataURL)
  }).then(res => {
    if (res.ok) alert("✔️ Bild auf dem Server gespeichert!");
    else alert("❌ Fehler beim Speichern.");
  });
}

function download() {
  const link = document.createElement("a");
  link.download = "zeichnung.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
