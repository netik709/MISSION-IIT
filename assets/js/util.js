export function toast(message, { type = "info" } = {}) {
  const stack = document.querySelector(".toast-stack");
  if (!stack) return;
  const el = document.createElement("div");
  el.className = "toast" + (type === "error" ? " is-error" : "");
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity 0.3s ease";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 3400);
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

export function timeAgo(isoString) {
  const then = new Date(isoString).getTime();
  const diffSeconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  const steps = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Infinity, "year"],
  ];
  let value = diffSeconds;
  let unit = "second";
  for (const [size, name] of steps) {
    if (value < size) {
      unit = name;
      break;
    }
    value = Math.floor(value / size);
    unit = name;
  }
  if (unit === "second" && value < 5) return "just now";
  return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
}
