var productsData = [];

function $(id) { return document.getElementById(id); }

function initPay() {
  fxpay.configure({
    fakeProducts: true,
    apiUrlBase: 'https://marketplace.firefox.com'
  });

  fxpay.getProducts(function(err, products) {
    if (err) {
      console.error('error getting products:', err);
    }
    products.forEach(function(productInfo, i) {
      console.info('got product:', productInfo);
      setProducts(productInfo, i);
    });
  });
}

function addProduct(parentEl, product) {
  var el = document.createElement('li');
}

function setProducts(product, i) {
  var el = document.createElement('li');
  var productsWrap = $('products');
  var name = document.createElement('h3');
  var btn = document.createElement('button');

  name.innerHTML = product.name;
  el.appendChild(name);

  if (product.smallImageUrl) {
    var img = document.createElement('img');
    img.src = product.smallImageUrl;
    img.height = 64;
    img.width = 64;
    el.appendChild(img);
  }

  btn.innerHTML = 'Buy';
  productsData.push(product);
  btn.setAttribute('class', 'fake-product');
  btn.setAttribute('data-index', i);
  // ...
  el.appendChild(btn);

  productsWrap.appendChild(el);
}

function boughtProduct(productInfo) {
  var productWrap = $('purchased-products');
  var el = document.createElement('li');
  var name = document.createElement('h3');

  name.innerHTML = productInfo.name;
  el.appendChild(name);
  productWrap.appendChild(el);
}

function setEvents() {
  console.log('first init get elements');
  var buyBtns = document.getElementsByClassName('fake-product');

  for (var i=0; i < buyBtns.length; i++) {
    var btn = buyBtns[i];
    console.log('set event in ' + i);

    btn.onclick = function(e) {
      buyEvent(e);
    };
  }

  console.log('events setted');
}

function buyEvent(e) {
  console.log('start onclick event');
  var index = e.target.getAttribute('data-index');
  var product = productsData[index];

  fxpay.purchase(product.productId, function(err, item) {
    if (err) {
      console.error('error purchasing product',
                   (item && item.productId),
                   'message:', err);
      return showError(err);
    }
    console.log('product:', item.productId, item, 'purchased');
    boughtProduct(item);
  });
}

fxpay.init({
  onerror: function(err) {
    console.error('error during initialization:', err);
  },
  oninit: function() {
    console.log('fxpay initialized successfully');
    initPay();
    setEvents();
  },
  onrestore: function(err, info) {
    if (err) {
      console.error('error restoring product', info.productId,
                    'message:', err);
    }
    console.log('product', info.productId, info, 'restored from receipt');
    boughtProduct(info);
  }
});
