const WA_NUMBER = "6282213133961";
const WA_MESSAGE = "halo kakak aku mau pesen dong.....";
const waUrl = (extra = "") => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(extra || WA_MESSAGE)}`;

document.getElementById("waFloat").href = waUrl();
document.getElementById("ctaWa").href = waUrl();

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("open"));
mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mobileMenu.classList.remove("open")));

const searchBtn = document.getElementById("searchBtn");
const searchPanel = document.getElementById("searchPanel");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");
searchBtn.addEventListener("click", () => { searchPanel.classList.add("open"); searchInput.focus(); });
closeSearch.addEventListener("click", () => searchPanel.classList.remove("open"));

const cards = [...document.querySelectorAll(".product-card")];
const emptyState = document.getElementById("emptyState");
function applyFilter(filter) {
  let shown = 0;
  cards.forEach(card => {
    const ok = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("hidden", !ok);
    if (ok) shown++;
  });
  emptyState.style.display = shown ? "none" : "block";
  document.querySelectorAll("[data-filter]").forEach(btn => {
    if (btn.classList.contains("pill") || btn.classList.contains("category-card")) {
      btn.classList.toggle("active", btn.dataset.filter === filter);
    }
  });
}
document.querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => applyFilter(btn.dataset.filter)));

searchInput.addEventListener("input", e => {
  const term = e.target.value.toLowerCase().trim();
  let shown = 0;
  cards.forEach(card => {
    const ok = card.dataset.name.toLowerCase().includes(term) || card.dataset.category.includes(term);
    card.classList.toggle("hidden", !ok);
    if (ok) shown++;
  });
  emptyState.style.display = shown ? "none" : "block";
});

document.querySelectorAll(".heart").forEach(btn => btn.addEventListener("click", () => {
  btn.classList.toggle("liked");
  btn.textContent = btn.classList.contains("liked") ? "♥" : "♡";
}));

let cartCount = 0;
const toast = document.getElementById("toast");
document.querySelectorAll(".add-btn").forEach(btn => btn.addEventListener("click", () => {
  cartCount++;
  document.querySelector(".cart-count").textContent = cartCount;
  toast.textContent = `${btn.dataset.product} ditambahkan 🛍️`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}));

document.querySelector(".cart-btn").addEventListener("click", e => {
  e.preventDefault();
  if (cartCount) {
    const items = `Halo Kak, aku mau pesan ${cartCount} produk dari DiStore.`;
    window.open(waUrl(items), "_blank");
  } else {
    document.getElementById("produk").scrollIntoView({behavior:"smooth"});
  }
});

const backTop = document.getElementById("backTop");
window.addEventListener("scroll", () => backTop.classList.toggle("show", window.scrollY > 500));
backTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));


// ================================
// AUTO SCROLL SAAT TIDAK AKTIF
// ================================
const AUTO_SCROLL_DELAY = 2000; // 2 detik tanpa aktivitas
const AUTO_SCROLL_STEP = 1.2;   // kecepatan scroll ke bawah
const AUTO_SCROLL_INTERVAL = 30; // semakin kecil = semakin halus

let autoScrollTimer = null;
let autoScrollInterval = null;
let autoScrolling = false;
let programmaticScrolling = false;

function stopAutoScroll() {
  autoScrolling = false;

  if (autoScrollTimer) {
    clearTimeout(autoScrollTimer);
    autoScrollTimer = null;
  }

  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }
}

function startAutoScroll() {
  if (autoScrolling) return;

  // Jangan menjalankan auto-scroll jika halaman memang tidak bisa di-scroll.
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return;

  autoScrolling = true;

  autoScrollInterval = setInterval(() => {
    const maxScrollPosition =
      document.documentElement.scrollHeight - window.innerHeight;
    const currentPosition = window.scrollY;

    // Kalau sudah sampai paling bawah:
    // langsung lompat cepat ke paling atas, lalu lanjut scroll pelan lagi.
    if (currentPosition >= maxScrollPosition - 2) {
      programmaticScrolling = true;
      window.scrollTo({
        top: 0,
        behavior: "auto"
      });

      // Beri browser waktu menyelesaikan perpindahan ke atas.
      setTimeout(() => {
        programmaticScrolling = false;
      }, 50);

      return;
    }

    programmaticScrolling = true;
    window.scrollBy({
      top: AUTO_SCROLL_STEP,
      left: 0,
      behavior: "auto"
    });

    setTimeout(() => {
      programmaticScrolling = false;
    }, 20);
  }, AUTO_SCROLL_INTERVAL);
}

function resetAutoScrollTimer() {
  stopAutoScroll();

  autoScrollTimer = setTimeout(() => {
    startAutoScroll();
  }, AUTO_SCROLL_DELAY);
}

// Aktivitas user menghentikan auto-scroll dan memulai hitungan 2 detik lagi.
const userActivityEvents = [
  "mousemove",
  "mousedown",
  "click",
  "keydown",
  "touchstart",
  "touchmove",
  "wheel",
  "pointerdown",
  "pointermove"
];

userActivityEvents.forEach(eventName => {
  window.addEventListener(eventName, () => {
    if (programmaticScrolling) return;
    resetAutoScrollTimer();
  }, { passive: true });
});

// Mulai menghitung 2 detik sejak halaman dibuka.
resetAutoScrollTimer();
