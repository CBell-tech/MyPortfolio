const themeToggle = document.getElementById("darkModeToggle");
const navToggle = document.getElementById("navToggle");
const navPanel = document.getElementById("siteNavPanel");
const navbar = navToggle?.closest(".navbar");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateThemeState() {
  if (!themeToggle) {
    return;
  }

  const icon = themeToggle.querySelector("i");
  const isDarkMode = document.body.classList.contains("dark-mode");

  themeToggle.setAttribute("aria-label", isDarkMode ? "Enable light mode" : "Enable dark mode");

  if (icon) {
    icon.className = isDarkMode ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

let savedTheme;
try { savedTheme = localStorage.getItem("theme"); } catch {}
if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  document.body.classList.add("dark-mode");
}

updateThemeState();

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  try { localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light"); } catch {}
  updateThemeState();
});

function updateNavState(isOpen) {
  if (!navToggle || !navbar) {
    return;
  }

  const icon = navToggle.querySelector("i");

  navbar.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");

  if (icon) {
    icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  }
}

updateNavState(false);

navToggle?.addEventListener("click", () => {
  updateNavState(!navbar?.classList.contains("menu-open"));
});

navPanel?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 860) {
      updateNavState(false);
    }
  });
});

document.addEventListener("click", (event) => {
  if (!navbar || window.innerWidth > 860) {
    return;
  }

  if (!navbar.contains(event.target)) {
    updateNavState(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    updateNavState(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const wasOpen = navbar?.classList.contains("menu-open");
    updateNavState(false);
    if (wasOpen) navToggle?.focus();
  }
});

const revealItems = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = new Date().getFullYear();
});
