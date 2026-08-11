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
