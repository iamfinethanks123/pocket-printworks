"use strict";

function confirmedTestFlightURL(text) {
  const candidate = text.trim();
  if (!candidate || /\s/.test(candidate)) return null;
  try {
    const url = new URL(candidate);
    if (url.origin !== "https://testflight.apple.com" || url.username || url.password || url.search || url.hash) return null;
    if (!/^\/join\/[A-Za-z0-9]+\/?$/.test(url.pathname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

async function loadInvitation() {
  const unavailable = () => {
    document.getElementById("invite-status").textContent = "暫時未能載入TestFlight邀請，請稍後再試。The TestFlight invitation could not be loaded. Please try again later.";
  };
  try {
    const response = await fetch("invite-url.txt", { cache: "no-store", credentials: "omit", redirect: "error", referrerPolicy: "no-referrer" });
    if (!response.ok) { unavailable(); return; }
    const invitation = confirmedTestFlightURL(await response.text());
    if (!invitation) { unavailable(); return; }
    const link = document.getElementById("testflight-link");
    link.href = invitation;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.removeAttribute("aria-disabled");
    link.removeAttribute("tabindex");
    link.classList.remove("disabled");
    document.getElementById("invite-status").textContent = "前往 TestFlight 查看試玩名額及可用狀態。Open TestFlight to check beta availability.";
  } catch {
    unavailable();
  }
}

for (const image of document.querySelectorAll("img[data-src]")) {
  const frame = image.parentElement;
  image.addEventListener("load", () => {
    if (image.naturalWidth === 0) return;
    frame.href = image.dataset.src;
    frame.hidden = false;
    document.getElementById("screens-note").hidden = true;
  });
  image.addEventListener("error", () => { frame.hidden = true; });
  image.src = image.dataset.src;
}

const video = document.getElementById("preview-video");
video.addEventListener("loadedmetadata", () => { document.getElementById("preview-section").hidden = false; });
video.addEventListener("error", () => { document.getElementById("preview-section").hidden = true; });
video.src = video.dataset.src;

loadInvitation();
