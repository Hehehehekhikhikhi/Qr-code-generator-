// script.js
(function () {
  const el = (id) => document.getElementById(id);

  const qwrap = el("qrcode");
  const txt = el("text");
  const genBtn = el("gen");
  const downloadBtn = el("download");
  const copyBtn = el("copy");
  const openBtn = el("open");
  const sizeInput = el("size");
  const fgInput = el("fg");
  const bgInput = el("bg");
  const levelSelect = el("level");
  const sizeVal = el("sizeVal");
  const metaSize = el("metaSize");
  const metaLevel = el("metaLevel");
  const toast = el("toast");

  let currentQRCode = null;

  function showToast(msg, ms = 2200) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("show"), ms);
  }

  function clearQR() {
    qwrap.innerHTML = "";
  }

  function getCorrectLevel(v) {
    switch (v) {
      case "L":
        return QRCode.CorrectLevel.L;
      case "M":
        return QRCode.CorrectLevel.M;
      case "Q":
        return QRCode.CorrectLevel.Q;
      default:
        return QRCode.CorrectLevel.H;
    }
  }

  function generate() {
    const value = txt.value.trim() || "";
    if (!value) {
      clearQR();
      showToast("Enter text or URL to generate");
      return;
    }

    const size = parseInt(sizeInput.value, 10) || 340;
    const fg = fgInput.value || "#041026";
    const bg = bgInput.value || "#ffffff";
    const level = levelSelect.value || "H";

    clearQR();

    currentQRCode = new QRCode(qwrap, {
      text: value,
      width: size,
      height: size,
      colorDark: fg,
      colorLight: bg,
      correctLevel: getCorrectLevel(level),
    });

    sizeVal.textContent = size + " px";
    metaSize.textContent = size + "px";
    metaLevel.textContent = level;

    qwrap.animate(
      [{ transform: "scale(.98)", opacity: 0.9 }, { transform: "scale(1)", opacity: 1 }],
      { duration: 240, easing: "cubic-bezier(.2,.9,.2,1)" }
    );

    showToast("QR generated");
  }

  function debounce(fn, wait) {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, a), wait);
    };
  }

  function downloadPNG() {
    if (!qwrap.hasChildNodes()) {
      showToast("Nothing to download");
      return;
    }

    const canvas = qwrap.querySelector("canvas");
    const img = qwrap.querySelector("img");
    let dataURL = null;

    if (canvas) {
      try {
        dataURL = canvas.toDataURL("image/png");
      } catch (e) {
        console.error(e);
      }
    } else if (img) {
      dataURL = img.src;
    }

    if (!dataURL) {
      showToast("Unable to generate image");
      return;
    }

    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "frostqr.png";
    document.body.appendChild(a);
    a.click();
    a.remove();

    showToast("Downloaded");
  }

  function copyText() {
    const v = txt.value.trim();
    if (!v) {
      showToast("Nothing to copy");
      return;
    }

    navigator.clipboard.writeText(v).then(
      () => showToast("Copied to clipboard"),
      () => showToast("Copy failed")
    );
  }

  function openLink() {
    const v = txt.value.trim();
    if (!v) {
      showToast("No link to open");
      return;
    }

    let url = v;
    try {
      const hasProto =
        /^https?:\/\//i.test(url) ||
        /^mailto:/i.test(url) ||
        /^ftp:/i.test(url);
      if (!hasProto) {
        url = "https://" + url;
      }
      window.open(url, "_blank");
    } catch (e) {
      showToast("Could not open link");
    }
  }

  // Event Listeners
  genBtn.addEventListener("click", generate);
  downloadBtn.addEventListener("click", downloadPNG);
  copyBtn.addEventListener("click", copyText);
  openBtn.addEventListener("click", openLink);

  sizeInput.addEventListener("input", () => {
    sizeVal.textContent = sizeInput.value + " px";
    metaSize.textContent = sizeInput.value + "px";
  });

  txt.addEventListener(
    "input",
    debounce(() => {
      const v = txt.value.trim();
      if (v.length > 3) generate();
    }, 520)
  );

  document.querySelectorAll(".actions .btn.ghost").forEach((b) => {
    const s = b.getAttribute("data-sample");
    if (!s) return;
    b.addEventListener("click", () => {
      txt.value = s;
      generate();
      showToast("Preset loaded");
    });
  });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      generate();
    }
  });

  // Default sample
  txt.value = "https://example.com";
  generate();
})();
