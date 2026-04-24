var cart         = [];
var activeFilter = "all";
var renderCache = {};
var filterTimeout;

var products = [
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

function renderProducts(list) {
  var grid = document.getElementById("productGrid");
  if (!grid) return;

  if (!list || list.length === 0) {
    grid.innerHTML =
      '<div class="no-results">' +
        '<i class="fas fa-search-minus"></i>' +
        '<p>No products found.<br/>Try a different category or search.</p>' +
      '</div>';
    return;
  }

  var cacheKey = activeFilter + "_" + list.length;

  if (renderCache[cacheKey] && renderCache[cacheKey].ids.join(',') === list.map(p => p.id).join(',')) {
    return;
  }

  var badgeClasses = {
    sale:     "b-sale",
    new:      "b-new",
    hot:      "b-hot",
    trending: "b-trending"
  };

  var html = "";

  for (var i = 0; i < list.length; i++) {
    var p = list[i];

    var inCart = false;
    for (var j = 0; j < cart.length; j++) {
      if (cart[j].product.id === p.id) {
        inCart = true;
        break;
      }
    }

    var badgeHTML = "";
    if (p.badge) {
      badgeHTML = '<span class="pcbadge ' + badgeClasses[p.badge] + '">' + p.badge + '</span>';
    }

    var btnClass = inCart ? "add-btn in-cart" : "add-btn";
    var btnIcon  = inCart ? "fa-check" : "fa-shopping-bag";
    var btnText  = inCart ? "Added to Bag" : "Add to Bag";

    html +=
      '<div class="product-card" data-id="' + p.id + '">' +
        badgeHTML +
        '<button class="wish" type="button" onclick="toggleWish(this)">' +
          '<i class="far fa-heart"></i>' +
        '</button>' +
        '<div class="img-wrap">' +
          '<img ' +
            'src="' + p.img + '" ' +
            'alt="' + p.name + '" ' +
            'loading="lazy" ' +
            'decoding="async" ' +
            'onerror="this.onerror=null;this.src=\'https://via.placeholder.com/300x300/EDE4D8/361319?text=No+Image\'"' +
          '/>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-brand">'  + p.brand  + '</div>' +
          '<div class="card-name">'   + p.name   + '</div>' +
          '<div class="card-rating">' +
            '<div class="rpill"><i class="fas fa-star"></i> ' + p.rating + '</div>' +
            '<span class="rcount">(' + p.rev.toLocaleString() + ' reviews)</span>' +
          '</div>' +
          '<div class="card-price">' +
            '<span class="p-now">&#8377;' + p.price.toLocaleString() + '</span>' +
            '<span class="p-old">&#8377;' + p.old.toLocaleString()   + '</span>' +
            '<span class="p-off">'        + p.off + '% off</span>' +
          '</div>' +
          '<button class="' + btnClass + '" type="button" onclick="addToCart(' + p.id + ', this)">' +
            '<i class="fas ' + btnIcon + '"></i> ' + btnText +
          '</button>' +
        '</div>' +
      '</div>';
  }

  if (grid.innerHTML !== html) {
    grid.innerHTML = html;
    
    renderCache[cacheKey] = {
      ids: list.map(p => p.id),
      html: html
    };
  }
}

function filterProducts(btn) {
  var chips = document.querySelectorAll(".chip");
  for (var i = 0; i < chips.length; i++) {
    chips[i].classList.remove("active");
  }

  btn.classList.add("active");
  activeFilter = btn.getAttribute("data-filter");
  applyFilters();
}

function filterByDeal(category) {
  var chips = document.querySelectorAll(".chip");
  for (var i = 0; i < chips.length; i++) {
    if (chips[i].getAttribute("data-filter") === category) {
      filterProducts(chips[i]);
      break;
    }
  }

  var mainSection = document.querySelector(".main");
  if (mainSection) {
    mainSection.scrollIntoView({ behavior: "smooth" });
  }
}

function applyFilters() {
  if (filterTimeout) {
    clearTimeout(filterTimeout);
  }

  filterTimeout = setTimeout(function() {
    var input = document.getElementById("searchInput");
    var query = input ? input.value.toLowerCase().trim() : "";

    var filtered = [];

    for (var i = 0; i < products.length; i++) {
      var p = products[i];

      var matchCat = (activeFilter === "all") || (p.cat === activeFilter);

      var matchSearch =
        p.name.toLowerCase().indexOf(query)  !== -1 ||
        p.brand.toLowerCase().indexOf(query) !== -1 ||
        p.cat.indexOf(query)                 !== -1;

      if (matchCat && matchSearch) {
        filtered.push(p);
      }
    }

    renderProducts(filtered);
  }, 300);
}

function addToCart(id, btn) {
  var product = null;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      product = products[i];
      break;
    }
  }
  if (!product) return;

  var existingItem = null;
  for (var j = 0; j < cart.length; j++) {
    if (cart[j].product.id === id) {
      existingItem = cart[j];
      break;
    }
  }

  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ product: product, qty: 1 });
    if (btn) {
      btn.classList.add("in-cart");
      btn.innerHTML = '<i class="fas fa-check"></i> Added to Bag';
    }
  }

  updateCart();

  var shortName = product.name.split(" ").slice(0, 3).join(" ");
  showToast(product.brand + " · " + shortName + " added!");
}

function removeItem(id) {
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].product.id !== id) {
      newCart.push(cart[i]);
    }
  }
  cart = newCart;

  var card = document.querySelector('.product-card[data-id="' + id + '"]');
  if (card) {
    var btn = card.querySelector(".add-btn");
    if (btn) {
      btn.classList.remove("in-cart");
      btn.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Bag';
    }
  }

  updateCart();
}

function changeQty(id, delta) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].product.id === id) {
      cart[i].qty += delta;
      if (cart[i].qty <= 0) {
        removeItem(id);
        return;
      }
      break;
    }
  }
  updateCart();
}

function updateCart() {
  var body  = document.getElementById("cartBody");
  var ft    = document.getElementById("cartFt");
  var badge = document.getElementById("cartBadge");

  if (!body || !ft || !badge) return;

  var totalQty = 0;
  for (var i = 0; i < cart.length; i++) {
    totalQty += cart[i].qty;
  }

  if (totalQty > 0) {
    badge.style.display  = "flex";
    badge.textContent    = totalQty;
  } else {
    badge.style.display  = "none";
  }

  if (cart.length === 0) {
    body.innerHTML =
      '<div class="empty-msg">' +
        '<i class="fas fa-shopping-bag"></i>' +
        '<p>Your luxury bag is empty.<br/>Discover our curated collection.</p>' +
      '</div>';
    ft.style.display = "none";
    return;
  }

  var html = "";
  for (var i = 0; i < cart.length; i++) {
    var p = cart[i].product;
    var q = cart[i].qty;
    var lineTotal = (p.price * q).toLocaleString();

    html +=
      '<div class="cart-item">' +
        '<img class="ci-img" ' +
          'src="' + p.img + '" ' +
          'alt="' + p.name + '" ' +
          'onerror="this.onerror=null;this.src=\'https://via.placeholder.com/70/EDE4D8/361319\'"' +
        '/>' +
        '<div class="ci-info">' +
          '<div class="ci-brand">' + p.brand + '</div>' +
          '<div class="ci-name">'  + p.name  + '</div>' +
          '<div class="ci-price">&#8377;' + lineTotal + '</div>' +
          '<div class="qty-row">' +
            '<button class="qbtn" type="button" onclick="changeQty(' + p.id + ', -1)">&#8722;</button>' +
            '<span class="qnum">' + q + '</span>' +
            '<button class="qbtn" type="button" onclick="changeQty(' + p.id + ', +1)">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="del-btn" type="button" onclick="removeItem(' + p.id + ')" title="Remove">' +
          '<i class="fas fa-trash-alt"></i>' +
        '</button>' +
      '</div>';
  }
  body.innerHTML = html;

  var selling = 0;
  var mrp     = 0;
  for (var i = 0; i < cart.length; i++) {
    selling += cart[i].product.price * cart[i].qty;
    mrp     += cart[i].product.old   * cart[i].qty;
  }
  var discount = mrp - selling;

  document.getElementById("subTotal").textContent   = "₹" + mrp.toLocaleString();
  document.getElementById("discAmt").textContent    = "-₹" + discount.toLocaleString();
  document.getElementById("grandTotal").textContent = "₹" + selling.toLocaleString();

  ft.style.display = "block";
}

function toggleCart() {
  document.getElementById("cartSide").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("open");
}

function toggleWish(btn) {
  btn.classList.toggle("active");
  var icon = btn.querySelector("i");
  icon.classList.toggle("far");
  icon.classList.toggle("fas");
}

function showToast(msg) {
  var toast = document.getElementById("toast");
  var toastMsg = document.getElementById("toastMsg");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
  }, 2800);
}

renderProducts(products);
