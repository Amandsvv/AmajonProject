import { cart, removeFromCart, updateCartQuantity,updateDeliveryOption, saveTheUpdatedQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from '../data/deliveryOption.js'
let cartSummaryHTML = '';
let quantity = updateCartQuantity();

const D = dayjs();
const deliveryDate = D.add(7, 'days');
const deliveryDateHTML = deliveryDate.format('dddd, MMMM D');
console.log(deliveryDateHTML);

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId;

  let deliveryOption;

  deliveryOptions.forEach((option)=>{
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
      console.log("if runned");
    }
  });

console.log(deliveryOption);  

  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays,'days');
  const deliveryDateStr = deliveryDate.format('dddd, MMMM D'); 

  cartSummaryHTML += `
    <div class="cart-item-container
      js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${deliveryDateStr}
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
              Quantity: <span class="quantity-label" data-product-id="${matchingProduct.id}">${cartItem.quantity}</span>
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
          ${deliveryOptionsHTML(matchingProduct,cartItem)}
        </div>
      </div>
    </div>
  `;
});

function deliveryOptionsHTML(matchingProduct,cartItem) {
  let html = '';

  deliveryOptions.forEach((deliveryOption)=>{
    
    const priceStr = deliveryOption.priceCents === 0? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} - ` ;
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays,'days');

    const deliveryDateStr = deliveryDate.format('dddd, MMMM D'); 
    const ischecked = deliveryOption.id === cartItem.deliveryOptionId;
    html+=
    ` <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-deliver-opyion-id="${deliveryOption.id}">
        <input type="radio" ${ischecked?'checked':''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${deliveryDateStr}
          </div>
          <div class="delivery-option-price">
            ${priceStr} Shipping
          </div>
        </div>
      </div>
    `
  });

  return html;
}
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
      // If the update button is currently visible
      if (btn.style.display !== 'none') {
        btn.style.display = 'none'; // Hide the update button

        // Show the input field and save button as inline elements
        inputBtn.forEach((input) => {
          if (input.dataset.productId === productId) {
            input.style.display = 'inline';
          }
        });

        saveBtn.forEach((btn) => {
          if (btn.dataset.productId === productId) {
            btn.style.display = 'inline';
          }
        });
      } else {
        btn.style.display = 'inline'; // Show the update button again

        // Hide the input field and save button
        inputBtn.forEach((input) => {
          if (input.dataset.productId === productId) {
            input.style.display = 'none';
          }
        });

        saveBtn.forEach((btn) => {
          if (btn.dataset.productId === productId) {
            btn.style.display = 'none';
          }
        });
      }
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

function saveTheChanges(productId) {

}
document.querySelectorAll('.save-quantity-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const inputbtns = document.querySelectorAll('.quantity-input');
      let QuantityLabel = document.querySelectorAll('.quantity-label');

      inputbtns.forEach((inputBtn) => {
        if (inputBtn.dataset.productId === productId) {
          quantity = parseInt(inputBtn.value);
          saveTheUpdatedQuantity(productId, quantity);

          QuantityLabel.forEach((label) => {
            if (label.dataset.productId === productId) {
              label.innerHTML = quantity;
            }
          });

          quantity = updateCartQuantity();
          document.querySelector('.return-to-home-link').innerHTML = `${quantity} items`;

          toggleDisplay(productId);
        }
      })
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element)=>{
    element.addEventListener('click',()=>{
      const {productId,deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId,deliveryOptionId);
    })
  })

