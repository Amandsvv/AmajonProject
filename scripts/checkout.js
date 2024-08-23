import {cart, removeFromCart,updateCartQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

let cartSummaryHTML = '';
let quantity = updateCartQuantity();
cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `
    <div class="cart-item-container
      js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">Update</span>
            <input class="quantity-input" type="number" data-product-id="${matchingProduct.id}">
            <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

let checkout = `
 <div class="header-content">
    <div class="checkout-header-left-section">
      <a href="index.html">
        <img class="amazon-logo" src="images/amazon-logo.png">
        <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
      </a>
    </div>

    <div class="checkout-header-middle-section">
      Checkout (<a class="return-to-home-link"
        href="index.html">${quantity} items</a>)
    </div>

    <div class="checkout-header-right-section">
      <img src="images/icons/checkout-lock-icon.png">
    </div>
  </div>`;

document.querySelector('.js-checkout-header').innerHTML = checkout;

document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
      quantity = updateCartQuantity();
      document.querySelector('.return-to-home-link').innerHTML = `${quantity} items`;
    });
  });

  function toggleDisplay(productId) {
    const updateBtn = document.querySelectorAll('.update-quantity-link');
    const inputBtn = document.querySelectorAll('.quantity-input');
    const saveBtn = document.querySelectorAll('.save-quantity-link');
  
    updateBtn.forEach((btn) => {
      if (btn.dataset.productId === productId) {
        btn.style.display = btn.style.display === 'none' ? 'inline' : 'none';
      }
    });
  
    inputBtn.forEach((input) => {
      if (input.dataset.productId === productId) {
        input.style.display = input.style.display === 'none' ? 'inline' : 'none';
      }
    });
  
    saveBtn.forEach((btn) => {
      if (btn.dataset.productId === productId) {
        btn.style.display = btn.style.display === 'none' ? 'inline' : 'none';
      }
    });
  }
  
document.querySelectorAll('.update-quantity-link')
.forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    toggleDisplay(productId)
  });
});

document.querySelectorAll('.save-quantity-link')
.forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const inputbtns = document.querySelectorAll('.quantity-input');
    inputbtns.forEach((inputBtn)=>{
      if(inputBtn.dataset.productId === productId){
        quantity = inputBtn.value;
        document.querySelector('.quantity-label').innerHTML = quantity;
        toggleDisplay(productId);
      }
    })
  });
});