const options = {method: 'GET', credentials: "same-origin", headers: {'Content-Type': 'application/json'}};

const storefrontCall = async (endpoint, requestBody = null) => {
  let resource = `${window.location.origin}/api/storefront${endpoint.route}`;
  let init = {
    method: endpoint.method,
    credentials: "same-origin",
    headers: {
      "Accept": endpoint.accept,
    }
  }

  if(requestBody) {
    init.body = JSON.stringify(requestBody);
    init.headers["Content-Type"] = endpoint.content;
  }

  return fetch(resource, init)
  .then((response) => {
    if (
      response.status === endpoint.success ||
      response.status === 201 ||
      response.status === 200
    ) {
      if (response.status === 204) {
        return null;
      } else {
        return response.json();
      }
    } else {
      return new Error(`response.status is ${response.status}`);
    }
  })
  .catch((error) => console.error(error));
};

const createCart = async (cartObject) => {
  const endpoint = {
    route: "/carts",
    method: "POST",
    accept: "application/json",
    content: "application/json",
    success: 201
  };

  const requestBody = {
    line_items: cartObject.line_items
  };

  const cart = await storefrontCall(endpoint, requestBody);
  return cart;
};

const getCart = async () => {
  const endpoint = {
    route: "/carts?include=lineItems",
    method: "GET",
    accept: "application/json",
    success: 200
  };

  const carts = await storefrontCall(endpoint);
  if (carts && carts.length > 0) {
    return carts[0];
  }

  return null;
};


const getBackendCart = async (category) => {
  const specialEndpoint = `http://localhost:9090/get-products/${encodeURIComponent(category)}`;
  try {
    const response = await fetch(specialEndpoint);
    if (response.ok) {
      const products = await response.json();
      return products;
    } else {
      console.error('Error getting products:', response.statusText);
    }
  } catch (error) {
    console.error('Error getting products:', error);
  }
};

const addProductsToCart = async (cartObject) => {
  let cart = await getCart();

  if (!cart) {
    cart = await createCart(cartObject);
  } else {
    const endpoint = {
      route: `/carts/${cart.id}/items`,
      method: 'POST',
      accept: 'application/json',
      success: 200,
      content: 'application/json'
    };

    for (const item of cartObject.line_items) {
      const requestBody = {
        line_item: item
      };
      cart = await storefrontCall(endpoint, requestBody);
    }
  }
  
  window.location.reload()
  // Need to deep dive the utils
  // Having trouble grabbing page info

  // console.log(stencilUtils);
  // const updatedCart = await stencilUtils.api.cart.getCart();

  // if (cart) {
  //   window.stencilUtils.api.cart.refreshContent((err, updatedCart) => {
  //     if (err) {
  //       console.error('Error refreshing cart:', err);
  //     } else {
  //       console.log('Cart refreshed:', updatedCart);
  //     }
  //   });
  // }
 
};

const removeItemsFromCart = async (cart, cartItemIdsForRemoval) => {
  const removalPromises = cartItemIdsForRemoval.map((itemId) => {
    const endpoint = {
      route: `/carts/${cart.id}/items/${itemId}`,
      method: "DELETE",
      accept: "application/json",
      success: 204,
    };

    return storefrontCall(endpoint);
  });

  await Promise.all(removalPromises);
};



const formatLineItems = (cartObject) => {
  return cartObject.line_items.physical_items.map(item => ({
    quantity: item.quantity,
    productId: item.product_id,
  }));
};

const addAllButton = document.getElementById("add-all-to-cart");

addAllButton.addEventListener("click", async () => {
  const cartObject = await getBackendCart("Special Items");
  const formattedLineItems = formatLineItems(cartObject);
  await addProductsToCart({ line_items: formattedLineItems });


  alert("Special Items added to the cart.");
});

const removeAllButton = document.getElementById("remove-all-from-cart");

const formatCartItemsForRemoval = (cart, specialItemIds) => {
  return cart.lineItems.physicalItems
    .filter(item => specialItemIds.includes(item.productId))
    .map(item => item.id);
};

removeAllButton.addEventListener("click", async () => {
  const cart = await getCart();
  
  if (cart) {
    const specialItems = await getBackendCart("Special Items");
    const specialItemIds = specialItems.line_items.physical_items.map(
      (item) => item.product_id
    );
    const cartItemIdsForRemoval = formatCartItemsForRemoval(
      cart,
      specialItemIds
    );

    await removeItemsFromCart(cart, cartItemIdsForRemoval);
    window.location.reload()
    alert("Special Items removed from the cart.");
  } else {
    alert("No items in the cart.");
  }
});



