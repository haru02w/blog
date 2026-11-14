// Awards one star per chapter read and thanks the reader once every star is earned.
// Chapters start at the post's top-level headings; progress is kept per page.
(() => {
  const prefix = "stars:";
  const key = prefix + location.pathname;
  const load = (k = key) => {
    try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; }
  };
  const save = (stars) => {
    try { localStorage.setItem(key, JSON.stringify(stars)); } catch {}
  };

  // stars earned across every post, shown next to the username
  const total = document.querySelector(".total-stars");
  const renderTotal = () => {
    let sum = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith(prefix)) sum += load(k).length;
      }
    } catch {}
    total.textContent = sum + "*";
    total.hidden = false;
  };
  renderTotal();

  const content = document.querySelector(".content[data-chapters]");
  if (!content) return;

  const marker = () => {
    const end = document.createElement("p");
    end.className = "chapter-end";
    end.setAttribute("aria-hidden", "true");
    end.innerHTML = "<span>*</span>";
    return end;
  };

  // a chapter ends right before the next top-level heading, the last one at the end of the post
  const level = [1, 2, 3, 4, 5, 6].find((n) => content.querySelector(":scope > h" + n));
  const headings = level ? [...content.querySelectorAll(":scope > h" + level)] : [];
  const ends = headings.slice(1).map((heading) => {
    const end = marker();
    heading.before(end);
    return end;
  });
  ends.push(content.appendChild(marker()));

  const earned = new Set(load().filter((i) => i < ends.length));
  const wasComplete = earned.size === ends.length;

  const progress = document.querySelector(".chapter-progress");
  const count = progress.querySelector(".chapter-earned");
  progress.querySelector(".chapter-total").textContent = ends.length;
  progress.hidden = false;

  const render = () => {
    ends.forEach((end, i) => end.classList.toggle("earned", earned.has(i)));
    count.textContent = earned.size;
  };
  render();

  const toast = document.querySelector(".toast");
  let toastTimer;
  const hideToast = () => { toast.hidden = true; clearTimeout(toastTimer); };
  toast.querySelector(".toast-close").addEventListener("click", hideToast);

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      earned.add(ends.indexOf(entry.target));
      entry.target.classList.add("just-earned");
    }
    save([...earned]);
    render();
    renderTotal();
    if (!wasComplete && earned.size === ends.length) {
      toast.hidden = false;
      toastTimer = setTimeout(hideToast, 10000);
    }
  }, { threshold: 1 });

  ends.forEach((end, i) => { if (!earned.has(i)) observer.observe(end); });
})();
