// script.js - fixed, robust single-file script for products, cart, wishlist, account
(function () {
  // ---- state ----
  let cart = [];            // [{ product, qty }]
  let wishlist = [];        // [productId]
  let user = null;          // { name }
  let activeFilter = "all";
  let renderCache = {};
  let filterTimeout = null;

  // ---- products (unchanged) ----
  const products = [
    { id:1,  brand:"Samsung",      name:"Galaxy S24 Ultra 5G 256GB",          cat:"mobiles",  price:124999, old:134999, off:7,  rating:4.6, rev:18423, badge:"hot",      img:"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80" },
    { id:2,  brand:"Apple",        name:"iPhone 15 Pro Max 256GB",             cat:"mobiles",  price:159900, old:179900, off:11, rating:4.9, rev:41230, badge:"trending", img:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80" },
    { id:3,  brand:"OnePlus",      name:"OnePlus 12 5G 512GB",                 cat:"mobiles",  price:64999,  old:69999,  off:7,  rating:4.5, rev:9823,  badge:"new",      img:"https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80" },
    { id:4,  brand:"Google",       name:"Pixel 8 Pro 128GB Bay Blue",          cat:"mobiles",  price:89999,  old:106999, off:16, rating:4.7, rev:7654,  badge:"sale",     img:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80" },
    { id:5,  brand:"Apple",        name:"MacBook Pro M3 14\" Space Black",     cat:"laptops",  price:168900, old:199900, off:15, rating:4.9, rev:12456, badge:"trending", img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80" },
    { id:6,  brand:"Dell",         name:"Dell XPS 15 Intel i9 32GB OLED",      cat:"laptops",  price:189990, old:224990, off:16, rating:4.7, rev:4321,  badge:"hot",      img:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80" },
    { id:7,  brand:"HP",           name:"HP Spectre x360 14 Intel Evo",        cat:"laptops",  price:139990, old:164990, off:15, rating:4.6, rev:3214,  badge:"new",      img:"https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80" },
    { id:8,  brand:"Sony",         name:"Sony WH-1000XM5 Headphones",          cat:"audio",    price:24990,  old:34990,  off:28, rating:4.8, rev:15678, badge:"hot",      img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
    { id:9,  brand:"Bose",         name:"Bose QuietComfort Ultra",              cat:"audio",    price:34900,  old:44900,  off:22, rating:4.8, rev:8932,  badge:"trending", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80" },
    { id:10, brand:"JBL",          name:"JBL Charge 5 Bluetooth Speaker",       cat:"audio",    price:14999,  old:19999,  off:25, rating:4.6, rev:12341, badge:"sale",     img:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80" },
    { id:11, brand:"Levi's",       name:"Levi's 511 Slim Fit Jeans Indigo",    cat:"fashion",  price:1799,   old:3999,   off:55, rating:4.4, rev:23456, badge:"sale",     img:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80" },
    { id:12, brand:"Zara",         name:"Zara Oversized Blazer Camel",          cat:"fashion",  price:4999,   old:7990,   off:37, rating:4.5, rev:7654,  badge:"new",      img:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80" },
    { id:13, brand:"Ralph Lauren", name:"Ralph Lauren Oxford Shirt White",      cat:"fashion",  price:6500,   old:9500,   off:32, rating:4.7, rev:5432,  badge:"hot",      img:"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80" },
    { id:14, brand:"Nike",         name:"Nike Air Max 270 Black White",         cat:"footwear", price:9795,   old:12995,  off:25, rating:4.7, rev:34512, badge:"trending", img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
    { id:15, brand:"Adidas",       name:"Adidas Samba OG Core Black",           cat:"footwear", price:7999,   old:10999,  off:27, rating:4.8, rev:28901, badge:"hot",      img:"https://images.unsplash.com/photo-1585232351009-aa37e5c9bf63?w=400&q=80" },
    { id:16, brand:"New Balance",  name:"New Balance 990v6 Made in USA",        cat:"footwear", price:18999,  old:23999,  off:21, rating:4.9, rev:4567,  badge:"new",      img:"https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80" },
    { id:17, brand:"Dyson",        name:"Dyson V15 Detect Cordless Vacuum",     cat:"home",     price:62900,  old:74900,  off:16, rating:4.8, rev:5678,  badge:"trending", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
    { id:18, brand:"Nespresso",    name:"Nespresso Vertuo Pop Ruby Red",         cat:"home",     price:12900,  old:15900,  off:19, rating:4.7, rev:4321,  badge:"new",      img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80" },
    { id:19, brand:"Philips",      name:"Philips Air Fryer XXL 7.3L",           cat:"home",     price:14995,  old:19995,  off:25, rating:4.6, rev:11234, badge:"sale",     img:"https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80" },
    { id:20, brand:"Estee Lauder", name:"Estee Lauder Night Repair Serum 50ml", cat:"beauty",   price:7999,   old:11500,  off:30, rating:4.8, rev:34521, badge:"hot",      img:"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80" },
    { id:21, brand:"The Ordinary", name:"The Ordinary Hyaluronic Acid 2% 30ml", cat:"beauty",   price:799,    old:1600,   off:50, rating:4.6, rev:23456, badge:"trending", img:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80" },
    { id:22, brand:"Forest Ess.",  name:"Forest Essentials Facial Tonic Mist",  cat:"beauty",   price:1295,   old:1995,   off:35, rating:4.5, rev:8765,  badge:"sale",     img:"https://images.unsplash.com/photo-1617897903246-719242758050?w=400&q=80" },
    { id:23, brand:"Garmin",       name:"Garmin Forerunner 265 GPS Watch",      cat:"sports",   price:39999,  old:49999,  off:20, rating:4.7, rev:3421,  badge:"new",      img:"https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&q=80" },
    { id:24, brand:"Decathlon",    name:"Decathlon Domyos Fitness Mat 8mm",     cat:"sports",   price:1299,   old:1999,   off:35, rating:4.5, rev:18234, badge:"sale",     img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80" },
    { id:25, brand:"Fossil",       name:"Fossil Gen 6 Smartwatch Stainless",    cat:"watches",  price:19995,  old:27995,  off:29, rating:4.5, rev:6543,  badge:"hot",      img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
    { id:26, brand:"Titan",        name:"Titan Raga Rose Gold Dial Watch",       cat:"watches",  price:7495,   old:10995,  off:32, rating:4.6, rev:12345, badge:"trending", img:"https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=400&q=80" },
    { id:27, brand:"Casio",        name:"Casio G-Shock Full Metal Black",        cat:"watches",  price:8995,   old:12995,  off:31, rating:4.7, rev:9876,  badge:"sale",     img:"https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&q=80" },
    { id:28, brand:"Da Milano",    name:"Da Milano Leather Tote Bag Tan",        cat:"bags",     price:4999,   old:8999,   off:44, rating:4.5, rev:3456,  badge:"hot",      img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" },
    { id:29, brand:"Hidesign",     name:"Hidesign Harvey Leather Backpack",      cat:"bags",     price:7499,   old:11999,  off:37, rating:4.7, rev:5678,  badge:"trending", img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
    { id:30, brand:"Lavie",        name:"Lavie Women Satchel Handbag Burgundy",  cat:"bags",     price:1499,   old:2999,   off:50, rating:4.3, rev:8901,  badge:"sale",     img:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80" },
    { id:31, brand:"Luxury Vogue", name:"Premium Skincare Gift Hamper Box",      cat:"gifting",  price:2999,   old:4999,   off:40, rating:4.6, rev:2345,  badge:"new",      img:"https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80" },
    { id:32, brand:"Ferrero",      name:"Ferrero Rocher Chocolate Gift Box 48",  cat:"gifting",  price:999,    old:1499,   off:33, rating:4.8, rev:9876,  badge:"hot",      img:"https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&q=80" }
  ];

  // ---- persistence keys ----
  const KEY_CART = "myCart";
  const KEY_WISH = "myWishlist";
  const KEY_USER = "myUser";

  // ---- helpers ----
  function saveState() {
    try {
      localStorage.setItem(KEY_CART, JSON.stringify(cart));
      localStorage.setItem(KEY_WISH, JSON.stringify(wishlist));
      localStorage.setItem(KEY_USER, JSON.stringify(user));
    } catch (e) {
      console.warn("saveState error:", e);
    }
  }

  function loadState() {
    try {
      const c = localStorage.getItem(KEY_CART);
      const w = localStorage.getItem(KEY_WISH);
      const u = localStorage.getItem(KEY_USER);
      cart = c ? JSON.parse(c) : [];
      wishlist = w ? JSON.parse(w).map(Number) : [];
      user = u ? JSON.parse(u) : null;
    } catch (e) {
      console.warn("loadState error:", e);
      cart = []; wishlist = []; user = null;
    }
  }

  function escapeHtml(s) {
    if (s == null) return "";
    return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function isInWishlist(id) { return wishlist.indexOf(Number(id)) !== -1; }

  // ---- render products (event-delegation friendly) ----
  function renderProducts(list) {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    if (!list || list.length === 0) {
      grid.innerHTML = '<div class="no-results"><i class="fas fa-search-minus"></i><p>No products found.<br/>Try a different category or search.</p></div>';
      return;
    }

    const cacheKey = activeFilter + "_" + list.length + "_w" + wishlist.join(",") + "_c" + cart.map(i=>i.product.id+"x"+i.qty).join(",");
    if (renderCache[cacheKey]) { grid.innerHTML = renderCache[cacheKey].html; return; }

    const badgeClasses = { sale:"b-sale", new:"b-new", hot:"b-hot", trending:"b-trending" };
    let html = "";

    for (let p of list) {
      const inCart = cart.some(ci => ci.product.id === p.id);
      const inWish = isInWishlist(p.id);
      const badgeHTML = p.badge ? '<span class="pcbadge '+(badgeClasses[p.badge]||'')+'">'+escapeHtml(p.badge)+'</span>' : "";
      const wishClass = inWish ? "active" : "";
      const wishIcon = inWish ? "fas" : "far";
      const btnClass = inCart ? "add-btn in-cart" : "add-btn";
      const btnIcon = inCart ? "fa-check" : "fa-shopping-bag";
      const btnText = inCart ? "Added to Bag" : "Add to Bag";

      html +=
        '<div class="product-card" data-id="'+p.id+'">'+
          badgeHTML +
          '<button class="wish '+wishClass+'" type="button" data-action="wish" aria-label="wishlist">'+
            '<i class="'+wishIcon+' fa-heart"></i>'+
          '</button>'+
          '<div class="img-wrap"><img src="'+p.img+'" alt="'+escapeHtml(p.name)+'" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'https://via.placeholder.com/300x300/EDE4D8/361319?text=No+Image\'" /></div>'+
          '<div class="card-body">'+
            '<div class="card-brand">'+escapeHtml(p.brand)+'</div>'+
            '<div class="card-name">'+escapeHtml(p.name)+'</div>'+
            '<div class="card-rating"><div class="rpill"><i class="fas fa-star"></i> '+p.rating+'</div><span class="rcount">('+p.rev.toLocaleString()+' reviews)</span></div>'+
            '<div class="card-price"><span class="p-now">&#8377;'+p.price.toLocaleString()+'</span><span class="p-old">&#8377;'+p.old.toLocaleString()+'</span><span class="p-off">'+p.off+'% off</span></div>'+
            '<button class="'+btnClass+'" type="button" data-action="add"><i class="fas '+btnIcon+'"></i> <span class="btn-text">'+btnText+'</span></button>'+
          '</div>'+
        '</div>';
    }

    grid.innerHTML = html;
    renderCache = {}; renderCache[cacheKey] = { html: html };
  }

  // ---- filters ----
  function applyFilters() {
    if (filterTimeout) clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      const input = document.getElementById("searchInput");
      const q = input ? input.value.toLowerCase().trim() : "";
      const filtered = products.filter(p => {
        const matchCat = activeFilter === "all" || p.cat === activeFilter;
        const matchSearch = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
        return matchCat && matchSearch;
      });
      renderProducts(filtered);
    }, 180);
  }

  function filterProducts(btn) {
    const chips = document.querySelectorAll(".chip");
    chips.forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.getAttribute("data-filter") || "all";
    applyFilters();
  }

  // ---- cart functions ----
  function addToCart(id, btn) {
    id = Number(id);
    const product = products.find(p => p.id === id);
    if (!product) return;
    const existing = cart.find(ci => ci.product.id === id);
    if (existing) existing.qty++;
    else cart.push({ product: product, qty: 1 });

    saveState();
    updateCart();
    applyFilters();
    showToast(product.brand + " · " + product.name.split(" ").slice(0,3).join(" ") + " added!");
  }

  function removeItem(id) {
    id = Number(id);
    cart = cart.filter(ci => ci.product.id !== id);
    saveState();
    updateCart();
    applyFilters();
  }

  function changeQty(id, delta) {
    id = Number(id);
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].product.id === id) {
        cart[i].qty += delta;
        if (cart[i].qty <= 0) { removeItem(id); return; }
        break;
      }
    }
    saveState();
    updateCart();
  }

  function updateCart() {
    const body = document.getElementById("cartBody");
    const ft = document.getElementById("cartFt");
    const badge = document.getElementById("cartBadge");
    if (!body || !ft || !badge) return;

    const totalQty = cart.reduce((acc,ci)=>acc+ci.qty, 0);
    badge.style.display = totalQty ? "flex" : "none";
    badge.textContent = totalQty || "";

    if (!cart.length) {
      body.innerHTML = '<div class="empty-msg"><i class="fas fa-shopping-bag"></i><p>Your luxury bag is empty.<br/>Discover our curated collection.</p></div>';
      ft.style.display = "none";
      return;
    }

    let html = "";
    for (let ci of cart) {
      const p = ci.product, q = ci.qty, lineTotal = (p.price*q).toLocaleString();
      html += '<div class="cart-item">' +
        '<img class="ci-img" src="'+p.img+'" alt="'+escapeHtml(p.name)+'" onerror="this.onerror=null;this.src=\'https://via.placeholder.com/70/EDE4D8/361319\'" />' +
        '<div class="ci-info"><div class="ci-brand">'+escapeHtml(p.brand)+'</div><div class="ci-name">'+escapeHtml(p.name)+'</div><div class="ci-price">&#8377;'+lineTotal+'</div>' +
        '<div class="qty-row"><button class="qbtn" type="button" data-action="dec" data-id="'+p.id+'">&#8722;</button><span class="qnum">'+q+'</span><button class="qbtn" type="button" data-action="inc" data-id="'+p.id+'">+</button></div>' +
        '</div>' +
        '<button class="del-btn" type="button" data-action="remove" data-id="'+p.id+'" title="Remove"><i class="fas fa-trash-alt"></i></button>' +
      '</div>';
    }
    body.innerHTML = html;

    let selling = 0, mrp = 0;
    for (let ci of cart) { selling += ci.product.price*ci.qty; mrp += ci.product.old*ci.qty; }
    const discount = mrp - selling;
    const subEl = document.getElementById("subTotal"), discEl = document.getElementById("discAmt"), grandEl = document.getElementById("grandTotal");
    if (subEl) subEl.textContent = "₹" + mrp.toLocaleString();
    if (discEl) discEl.textContent = "-₹" + discount.toLocaleString();
    if (grandEl) grandEl.textContent = "₹" + selling.toLocaleString();

    ft.style.display = "block";
  }

  function toggleCart() {
    const cartSide = document.getElementById("cartSide");
    const overlay = document.getElementById("overlay");
    if (cartSide) cartSide.classList.toggle("open");
    if (overlay) overlay.classList.toggle("open");
  }

  // ---- wishlist ----
  function renderWishlist() {
    const body = document.getElementById("wishBody");
    const badge = document.getElementById("wishBadge");
    const ft = document.getElementById("wishFt");
    if (!body || !badge) return;
    if (!wishlist.length) {
      badge.style.display = "none";
      body.innerHTML = '<div class="empty-msg"><i class="fas fa-heart"></i><p>Your wishlist is empty.<br/>Tap the heart on any product to save it here.</p></div>';
      if (ft) ft.style.display = "none";
      return;
    }
    badge.style.display = "flex"; badge.textContent = wishlist.length;
    let html = "";
    for (let id of wishlist) {
      const p = products.find(x=>x.id===Number(id)); if (!p) continue;
      html += '<div class="wish-item">' +
        '<img class="wi-img" src="'+p.img+'" alt="'+escapeHtml(p.name)+'" onerror="this.onerror=null;this.src=\'https://via.placeholder.com/70/EDE4D8/361319\'" />' +
        '<div class="wi-info"><div class="wi-brand">'+escapeHtml(p.brand)+'</div><div class="wi-name">'+escapeHtml(p.name)+'</div><div class="wi-price">&#8377;'+p.price.toLocaleString()+'</div></div>' +
        '<div class="wi-actions"><button type="button" class="add-btn" data-action="add-wish" data-id="'+p.id+'"><i class="fas fa-shopping-bag"></i> Add</button><button type="button" class="del-btn" data-action="remove-wish" data-id="'+p.id+'"><i class="fas fa-trash-alt"></i></button></div>' +
      '</div>';
    }
    body.innerHTML = html;
    if (ft) ft.style.display = "block";
  }

  function toggleWishlistPanel() {
    const wishSide = document.getElementById("wishSide");
    const overlay = document.getElementById("overlay");
    if (wishSide) wishSide.classList.toggle("open");
    if (overlay) overlay.classList.toggle("open");
    renderWishlist();
  }

  function toggleWish(btn, id) {
    let parsed = id !== undefined ? Number(id) : null;
    if (!parsed && btn) {
      const card = btn.closest(".product-card");
      parsed = card ? Number(card.getAttribute("data-id")) : null;
    }
    if (!parsed) return;
    const idx = wishlist.indexOf(parsed);
    if (idx === -1) {
      wishlist.push(parsed);
      if (btn) { btn.classList.add("active"); const ic=btn.querySelector("i"); if(ic){ic.classList.remove("far"); ic.classList.add("fas");} }
      showToast("Added to wishlist");
    } else {
      wishlist.splice(idx,1);
      if (btn) { btn.classList.remove("active"); const ic=btn.querySelector("i"); if(ic){ic.classList.remove("fas"); ic.classList.add("far");} }
      showToast("Removed from wishlist");
    }
    saveState(); renderWishlist(); applyFilters();
  }

  function removeFromWishlist(id) {
    id = Number(id);
    const idx = wishlist.indexOf(id);
    if (idx !== -1) { wishlist.splice(idx,1); saveState(); renderWishlist(); applyFilters(); showToast("Removed from wishlist"); }
  }

  // ---- account ----
  function renderAccountState() {
    const nameDisplay = document.getElementById("accountName");
    const accountBtn = document.getElementById("accountBtn");
    const display = user && user.name ? user.name : "Guest";
    if (nameDisplay) nameDisplay.textContent = display;
    if (accountBtn) accountBtn.textContent = user && user.name ? user.name : "Account";
  }

  function openAccountModal() {
    const modal = document.getElementById("accountModal");
    if (!modal) return;
    modal.classList.add("open");
    const inputName = modal.querySelector("input[name='name']");
    if (inputName && user && user.name) inputName.value = user.name;
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.classList.add("open");
  }

  function closeAccountModal() {
    const modal = document.getElementById("accountModal");
    if (!modal) return;
    modal.classList.remove("open");
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.classList.remove("open");
  }

  function loginAccount(formOrEvent) {
    let name = "";
    if (formOrEvent && formOrEvent.nodeType === 1 && formOrEvent.tagName.toLowerCase() === "form") {
      const inp = formOrEvent.querySelector("input[name='name']"); if (inp) name = inp.value;
    } else if (formOrEvent && formOrEvent.target && formOrEvent.target.tagName) {
      const f = formOrEvent.target; const inp2 = f.querySelector("input[name='name']"); if (inp2) name = inp2.value;
    } else {
      const modal = document.getElementById("accountModal"); if (!modal) { showToast("Account modal missing"); return false; }
      const input = modal.querySelector("input[name='name']"); if (!input) { showToast("Name input missing"); return false; }
      name = input.value;
    }
    if (!name || !name.trim()) { showToast("Please enter a name"); return false; }
    user = { name: name.trim() }; saveState(); renderAccountState(); closeAccountModal(); showToast("Welcome, " + user.name + "!"); return false;
  }

  function logoutAccount() { user = null; saveState(); renderAccountState(); showToast("Logged out"); }

  // ---- toast ----
  function showToast(msg) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toastMsg");
    if (!toast || !toastMsg) { console.log("Toast:", msg); return; }
    toastMsg.textContent = msg; toast.classList.add("show"); setTimeout(()=>toast.classList.remove("show"), 2800);
  }

  // ---- overlay behavior ----
  function initOverlayBehavior() {
    const overlay = document.getElementById("overlay");
    if (!overlay) return;
    overlay.addEventListener("click", ()=> {
      const cartSide = document.getElementById("cartSide");
      const wishSide = document.getElementById("wishSide");
      const accountModal = document.getElementById("accountModal");
      if (cartSide && cartSide.classList.contains("open")) cartSide.classList.remove("open");
      if (wishSide && wishSide.classList.contains("open")) wishSide.classList.remove("open");
      if (accountModal && accountModal.classList.contains("open")) accountModal.classList.remove("open");
      overlay.classList.remove("open");
    });
  }

  // ---- delegation ----
  function initDelegation() {
    const grid = document.getElementById("productGrid");
    if (grid) {
      grid.addEventListener("click", function(e) {
        const btn = e.target.closest("button");
        if (!btn) return;
        const card = btn.closest(".product-card");
        const id = card ? Number(card.getAttribute("data-id")) : null;
        const action = btn.getAttribute("data-action");
        if (action === "wish") toggleWish(btn, id);
        else if (action === "add") addToCart(id, btn);
        else if (btn.classList.contains("wish")) toggleWish(btn, id);
        else if (btn.classList.contains("add-btn")) addToCart(id, btn);
      });
    }

    const cartBody = document.getElementById("cartBody");
    if (cartBody) {
      cartBody.addEventListener("click", function(e) {
        const el = e.target.closest("button"); if (!el) return;
        const action = el.getAttribute("data-action"); const id = Number(el.getAttribute("data-id"));
        if (!action || !id) return;
        if (action === "dec") changeQty(id, -1);
        else if (action === "inc") changeQty(id, +1);
        else if (action === "remove") removeItem(id);
      });
    }

    const wishBody = document.getElementById("wishBody");
    if (wishBody) {
      wishBody.addEventListener("click", function(e) {
        const el = e.target.closest("button"); if (!el) return;
        const action = el.getAttribute("data-action"); const id = Number(el.getAttribute("data-id"));
        if (!action || !id) return;
        if (action === "add-wish") addToCart(id);
        else if (action === "remove-wish") removeFromWishlist(id);
      });
    }
  }

  // ---- expose common functions to global for compatibility ----
  window.addToCart = addToCart;
  window.removeItem = removeItem;
  window.changeQty = changeQty;
  window.toggleCart = toggleCart;
  window.toggleWishlistPanel = toggleWishlistPanel;
  window.toggleWish = toggleWish;
  window.openAccountModal = openAccountModal;
  window.loginAccount = loginAccount;
  window.logoutAccount = logoutAccount;
  window.filterProducts = filterProducts;
  window.filterByDeal = function(cat){ activeFilter = cat; applyFilters(); };

  // ---- init ----
  function initShop() {
    loadState();
    renderProducts(products);
    updateCart();
    renderWishlist();
    renderAccountState();
    initOverlayBehavior();
    initDelegation();

    const input = document.getElementById("searchInput");
    if (input) input.addEventListener("input", applyFilters);

    const accountModal = document.getElementById("accountModal");
    if (accountModal) {
      const form = accountModal.querySelector("form");
      if (form) form.addEventListener("submit", function(e){ e.preventDefault(); loginAccount(e); });
    }

    const cBadge = document.getElementById("cartBadge");
    const wBadge = document.getElementById("wishBadge");
    if (cBadge) cBadge.style.display = cart.length ? "flex" : "none";
    if (wBadge) wBadge.style.display = wishlist.length ? "flex" : "none";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initShop);
  else initShop();
})();