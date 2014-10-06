(function() {

  function $(id) { return document.getElementById(id); }

  function initPay() {
    fxpay.configure({
      fakeProducts: true,
      apiUrlBase: 'https://marketplace.firefox.com'
    });

    fxpay.getProducts(function(err, products) {
      if (err) {
        console.error('error getting products:', err);
        return showError(err);
      }
      products.forEach(function(productInfo) {
        console.info('got product:', productInfo);
        addProduct(productInfo);
      });
    });
  }

  function addProduct(product) {
    var el = document.createElement('li');
    var products-wrap = $('products');
    var name = document.createElement('h3');

    name.innerHTML = product.name;
    el.appendChild(name);

    if (product.smallImageUrl) {
      var img = document.createElement('img');
      img.src = product.smallImageUrl;
      img.height = 64;
      img.width = 64;
      el.appendChild(img);
    }

    products-wrap.appendChild(el);
  }

  fxpay.init({
    onerror: function(err) {
      console.error('error during initialization:', err);
    },
    oninit: function() {
      console.log('fxpay initialized successfully');
      initPay();
    },
    onrestore: function(err, info) {
      if (err) {
        console.error('error restoring product', info.productId,
                      'message:', err);
      }
      console.log('product', info.productId, info, 'restored from receipt');
      //productBought(info);
    }
  });
})();
