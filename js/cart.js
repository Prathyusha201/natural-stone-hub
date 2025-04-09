// cart.js - Shopping Cart functionality for Natural Stone Hub website
// Author: Prathyusha M
// Last Updated: 2025
// Description: Implements cart functionality including add, remove, update quantity and checkout

// =========================================
// Shopping Cart Implementation
// Handles adding, removing, updating products in cart
// =========================================

// Cart data structure
let cart = {
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0
};

// Load cart from localStorage when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded - initializing cart functionality");
    
    // Initialize cart
    loadCart();
    updateCartIcon();
    
    // Add event listener for "Add to Cart" buttons on product pages
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    console.log(`Found ${addToCartButtons.length} 'Add to Cart' buttons`);
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
        console.log("Added click event to button:", button.dataset.productName || "unnamed product");
    });

    // Handle checkout button if on cart page
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.items.length === 0) {
                alert('Your cart is empty. Please add some products before checking out.');
                return;
            }

            // Check if user is logged in
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Please login to proceed with checkout.');
                
                // Store cart in session to retrieve after login
                sessionStorage.setItem('proceedToCheckout', 'true');
                
                // Open login modal
                const loginModal = document.getElementById('login-modal');
                if (loginModal) {
                    loginModal.style.display = 'flex';
                } else {
                    window.location.href = 'login.html';
                }
                return;
            }

            // If logged in, redirect to checkout page
            window.location.href = 'checkout.html';
        });
    }

    // Render cart if on cart page
    if (document.querySelector('.cart-items')) {
        renderCart();
    }

    // Render order summary if on checkout page
    if (document.querySelector('.order-items')) {
        renderOrderSummary();
    }
});

/**
 * Loads cart data from localStorage
 */
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            console.log("Cart loaded from localStorage:", cart);
        } catch (e) {
            console.error("Error parsing cart from localStorage:", e);
            localStorage.removeItem('cart'); // Clear invalid cart data
        }
    } else {
        console.log("No cart found in localStorage, using empty cart");
    }
}

/**
 * Saves cart data to localStorage
 */
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log("Cart saved to localStorage:", cart);
}

/**
 * Updates cart count in the header
 */
function updateCartIcon() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = itemCount;
        
        // Make the cart count badge visible only if there are items
        cartCountElement.style.display = itemCount > 0 ? 'flex' : 'none';
        console.log("Cart icon updated, count:", itemCount);
    } else {
        console.warn("Cart count element not found in the DOM");
    }
}

/**
 * Handles adding a product to cart
 * @param {Event} event - The click event
 */
function handleAddToCart(event) {
    console.log("Add to cart button clicked");
    
    const button = event.currentTarget;
    const productId = button.dataset.productId;
    const productName = button.dataset.productName;
    const productPrice = parseFloat(button.dataset.productPrice);
    
    console.log("Product details:", { 
        id: productId, 
        name: productName, 
        price: productPrice 
    });
    
    let productImage = '';
    // Safely get the image src
    try {
        const productCard = button.closest('.product-card');
        if (productCard) {
            const imgElement = productCard.querySelector('.product-image img');
            if (imgElement) {
                productImage = imgElement.src;
            } else {
                console.warn("Image element not found for product:", productName);
                productImage = './images/placeholder.jpg'; // Use a placeholder
            }
        } else {
            console.warn("Product card not found for button:", button);
            productImage = './images/placeholder.jpg'; // Use a placeholder
        }
    } catch (e) {
        console.error("Error getting product image:", e);
        productImage = './images/placeholder.jpg'; // Use a placeholder
    }
    
    // Check if the product is already in the cart
    const existingItem = cart.items.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log(`Increased quantity for "${productName}" to ${existingItem.quantity}`);
    } else {
        cart.items.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
        console.log(`Added new product "${productName}" to cart`);
    }
    
    // Recalculate cart totals
    updateCartTotals();
    saveCart();
    updateCartIcon();
    
    // Show success message
    showNotification(button, `${productName} added to cart!`, 'success');
}

/**
 * Updates the cart totals
 */
function updateCartTotals() {
    // Calculate subtotal
    cart.subtotal = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    
    // Calculate shipping (free for orders over ₹5000)
    cart.shipping = cart.subtotal >= 5000 ? 0 : 350;
    
    // Calculate total
    cart.total = cart.subtotal + cart.shipping;
    
    console.log("Cart totals updated:", {
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        total: cart.total
    });
}

/**
 * Removes an item from the cart
 * @param {string} productId - ID of product to remove
 */
function removeFromCart(productId) {
    const itemToRemove = cart.items.find(item => item.id === productId);
    if (itemToRemove) {
        console.log(`Removing "${itemToRemove.name}" from cart`);
    }
    
    cart.items = cart.items.filter(item => item.id !== productId);
    updateCartTotals();
    saveCart();
    updateCartIcon();
    renderCart();
    updateSummaryDisplay();
}

// Add a new function to update the summary fields
function updateSummaryDisplay() {
    // Update summary values
    const subtotalEl = document.querySelector('.cart-subtotal');
    const shippingEl = document.querySelector('.cart-shipping');
    const totalEl = document.querySelector('.cart-total');
    
    if (subtotalEl) subtotalEl.textContent = `₹${cart.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = cart.shipping > 0 ? `₹${cart.shipping.toFixed(2)}` : 'FREE';
    if (totalEl) totalEl.textContent = `₹${cart.total.toFixed(2)}`;
}

/**
 * Updates quantity of an item in the cart
 * @param {string} productId - ID of product to update
 * @param {number} quantity - New quantity value
 */
function updateQuantity(productId, quantity) {
    const item = cart.items.find(item => item.id === productId);
    
    if (item) {
        item.quantity = parseInt(quantity);
        console.log(`Updated quantity for "${item.name}" to ${item.quantity}`);
        
        // Remove item if quantity is zero or negative
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        updateCartTotals();
        saveCart();
        updateCartIcon();
        renderCart();
    } else {
        console.warn(`Tried to update quantity for product ID ${productId}, but it was not found in cart`);
    }
}

/**
 * Renders the cart items and totals on the cart page
 */
function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) {
        console.warn("Cart items container not found, can't render cart");
        return;
    }
    
    if (cart.items.length === 0) {
        console.log("Cart is empty, showing empty message");
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                Your cart is empty.
                <div style="margin-top: 20px;">
                    <a href="products-catalog.html" class="continue-shopping">
                        <i class="fas fa-arrow-left" style="margin-right: 8px;"></i>Continue Shopping
                    </a>
                </div>
            </div>
        `;
        
        // Make sure to update summary to zero
        updateSummaryDisplay();
        return;
    }
    
    console.log(`Rendering ${cart.items.length} items in cart`);
    let cartHTML = '';
    
    cart.items.forEach(item => {
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price">₹${item.price}</div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                    <button class="quantity-btn increase">+</button>
                </div>
                <div class="item-total">₹${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    // Update summary display
    updateSummaryDisplay();
    
    // Add event listeners to the newly created elements
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', handleQuantityButtonClick);
    });
    
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', handleQuantityInputChange);
    });
    
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', handleRemoveItemClick);
    });
    
    console.log("Cart rendered successfully");
}

/**
 * Renders the order summary on the checkout page
 */
function renderOrderSummary() {
    const orderItemsContainer = document.querySelector('.order-items');
    if (!orderItemsContainer) {
        console.warn("Order items container not found, can't render order summary");
        return;
    }
    
    console.log(`Rendering ${cart.items.length} items in order summary`);
    let orderHTML = '';
    
    cart.items.forEach(item => {
        orderHTML += `
            <div class="order-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-quantity">x${item.quantity}</span>
                </div>
                <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
    });
    
    orderItemsContainer.innerHTML = orderHTML;
    
    // Update summary values
    const subtotalEl = document.querySelector('.order-subtotal');
    const shippingEl = document.querySelector('.order-shipping');
    const totalEl = document.querySelector('.order-total');
    
    if (subtotalEl) subtotalEl.textContent = `₹${cart.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = cart.shipping > 0 ? `₹${cart.shipping.toFixed(2)}` : 'FREE';
    if (totalEl) totalEl.textContent = `₹${cart.total.toFixed(2)}`;
    
    console.log("Order summary rendered successfully");
}

/**
 * Handles click on the quantity increase/decrease buttons
 * @param {Event} event - The click event
 */
function handleQuantityButtonClick(event) {
    const button = event.currentTarget;
    const cartItem = button.closest('.cart-item');
    const productId = cartItem.dataset.id;
    const quantityInput = cartItem.querySelector('.quantity-input');
    let quantity = parseInt(quantityInput.value);
    
    if (button.classList.contains('decrease')) {
        quantity = Math.max(1, quantity - 1);
    } else if (button.classList.contains('increase')) {
        quantity++;
    }
    
    quantityInput.value = quantity;
    updateQuantity(productId, quantity);
}

/**
 * Handles changes to the quantity input field
 * @param {Event} event - The change event
 */
function handleQuantityInputChange(event) {
    const input = event.currentTarget;
    const cartItem = input.closest('.cart-item');
    const productId = cartItem.dataset.id;
    let quantity = parseInt(input.value);
    
    // If quantity is zero or less, remove the item
    if (quantity <= 0) {
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            removeFromCart(productId);
        } else {
            // If user cancels, reset quantity to 1
            input.value = 1;
            updateQuantity(productId, 1);
        }
        return;
    }
    
    // Update with the new quantity
    updateQuantity(productId, quantity);
}

/**
 * Handles click on the remove item button
 * @param {Event} event - The click event
 */
function handleRemoveItemClick(event) {
    const button = event.currentTarget;
    const cartItem = button.closest('.cart-item');
    const productId = cartItem.dataset.id;
    
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        removeFromCart(productId);
    }
}

/**
 * Clears the entire shopping cart
 */
function clearCart() {
    console.log("Clearing cart");
    cart.items = [];
    updateCartTotals();
    saveCart();
    updateCartIcon();
    
    if (document.querySelector('.cart-items')) {
        renderCart();
    }
}

/**
 * Shows a notification message
 * @param {HTMLElement} element - Element to show notification near
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success' or 'error')
 */
function showNotification(element, message, type = 'success') {
    console.log(`Showing notification: "${message}" (${type})`);
    
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        background-color: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 4px;
        z-index: 9999;
        animation: fadeInOut 3s forwards;
    `;
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after animation completes
    setTimeout(() => {
        if (notification.parentNode === document.body) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// Alternative approach to attach event listeners - try this if DOM loaded doesn't work
window.addEventListener('load', function() {
    console.log("Window loaded - backup initializer for cart");
    
    // Check if we need to add event listeners
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    if (addToCartButtons.length > 0) {
        console.log(`Found ${addToCartButtons.length} 'Add to Cart' buttons in window.load event`);
        
        addToCartButtons.forEach(button => {
            // Remove any existing listeners to avoid duplicates
            button.removeEventListener('click', handleAddToCart);
            // Add fresh listener
            button.addEventListener('click', handleAddToCart);
            console.log("Added click event (window.load) to button:", button.dataset.productName || "unnamed product");
        });
    }
});