// Switches between the dark (default) and light themes and remembers the choice.
// The saved theme is applied in <head> before paint; this wires up the switch.
(() => {
  const root = document.documentElement;
  const switcher = document.querySelector(".theme-switch");
  if (!switcher) return;
  const buttons = switcher.querySelectorAll("button[data-theme-choice]");
  const meta = document.querySelector('meta[name="theme-color"]');

  const syncGiscus = () => {
    const frame = document.querySelector("iframe.giscus-frame");
    const theme = root.dataset.theme === "light" ? "light" : "transparent_dark";
    frame?.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, "https://giscus.app");
  };

  const apply = (theme) => {
    root.dataset.theme = theme;
    buttons.forEach((button) => button.setAttribute("aria-pressed", button.dataset.themeChoice === theme));
    if (meta) meta.content = getComputedStyle(root).getPropertyValue("--bg").trim();
    syncGiscus();
  };

  buttons.forEach((button) => button.addEventListener("click", () => {
    try { localStorage.setItem("theme", button.dataset.themeChoice); } catch {}
    apply(button.dataset.themeChoice);
  }));

  // giscus loads after this script, so match its theme once it first reports in
  let giscusSynced = false;
  addEventListener("message", (event) => {
    if (event.origin !== "https://giscus.app" || giscusSynced) return;
    giscusSynced = true;
    syncGiscus();
  });

  apply(root.dataset.theme === "light" ? "light" : "dark");
  switcher.hidden = false;
})();
