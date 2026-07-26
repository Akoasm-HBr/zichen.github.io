document.documentElement.classList.add("js");

const menuButton = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

function setMenu(open) {
  if (!menuButton || !siteNav) return;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? menuButton.dataset.labelClose : menuButton.dataset.labelOpen,
  );
  siteNav.dataset.open = String(open);
}

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
      menuButton.focus();
    }
  });
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

async function loadPosterFallback(image) {
  const fallbackUrl = image.dataset.posterFallback;
  if (!fallbackUrl || image.dataset.fallbackLoaded === "true") return;

  image.dataset.fallbackLoaded = "true";

  try {
    const response = await fetch(fallbackUrl);
    if (!response.ok) throw new Error(`Poster fallback failed: ${response.status}`);

    const encodedImage = (await response.text()).replace(/\s+/g, "");
    const dataUrl = `data:image/jpeg;base64,${encodedImage}`;
    image.src = dataUrl;

    const link = image.closest("a");
    if (link) link.href = dataUrl;
  } catch {
    image.dataset.fallbackLoaded = "false";
  }
}

document.querySelectorAll("[data-poster-fallback]").forEach((image) => {
  image.addEventListener("error", () => loadPosterFallback(image), { once: true });
  if (image.complete && image.naturalWidth === 0) loadPosterFallback(image);
});
