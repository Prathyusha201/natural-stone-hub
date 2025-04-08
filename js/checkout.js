// checkout.js - Checkout functionality for Natural Stone Hub website
// Author: Prathyusha M
// Last Updated: 2025
// Description: Handles the checkout process including form validation,
// payment processing, and order completion

// =========================================
// Checkout Page Implementation
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize checkout page
    loadCart();
    renderOrderSummary();
    setupPaymentMethodToggle();
    setupFormValidation();
});

/**
 * Sets up the payment method toggle functionality
 */
function setupPaymentMethodToggle() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardFields = document.getElementById('creditCardFields');
    const upiFields = document.getElementById('upiFields');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', () => {
            // Hide all payment method fields
            creditCardFields.style.display = 'none';
            upiFields.style.display = 'none';
            
            // Show the selected payment method fields
            if (method.value === 'creditCard') {
                creditCardFields.style.display = 'block';
            } else if (method.value === 'upi') {
                upiFields.style.display = 'block';
            }
        });
    });
}

/**
 * Sets up form validation for the checkout form
 */
function setupFormValidation() {
    const checkoutForm = document.querySelector('.checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            if (validateCheckoutForm()) {
                processOrder();
            }
        });
        
        // Add input validation for specific fields
        setupCardNumberValidation();
        setupExpiryDateValidation();
        setupCVVValidation();
        setupZipCodeValidation();
        setupPhoneNumberValidation();
    }
}

/**
 * Validates credit card number input
 */
function setupCardNumberValidation() {
    const cardNumberInput = document.getElementById('cardNumber');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            // Remove any non-digit characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Add spaces after every 4 digits for readability
            if (value.length > 0) {
                value = value.match(/.{1,4}/g).join(' ');
            }
            
            // Limit to 19 characters (16 digits + 3 spaces)
            e.target.value = value.substring(0, 19);
        });
    }
}

/**
 * Validates expiry date input (MM/YY format)
 */
function setupExpiryDateValidation() {
    const expiryInput = document.getElementById('expiryDate');
    
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            // Remove any non-digit characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Format as MM/YY
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            e.target.value = value.substring(0, 5);
        });
    }
}

/**
 * Validates CVV input (3-4 digits)
 */
function setupCVVValidation() {
    const cvvInput = document.getElementById('cvv');
    
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            // Only allow digits
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
}

/**
 * Validates zip code input
 */
function setupZipCodeValidation() {
    const zipCodeInput = document.getElementById('zipCode');
    
    if (zipCodeInput) {
        zipCodeInput.addEventListener('input', (e) => {
            // Allow only digits for postal code
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 6);
        });
    }
}

/**
 * Validates phone number input
 */
function setupPhoneNumberValidation() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Allow only digits for phone number
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 10);
        });
    }
}

/**
 * Validates the entire checkout form
 * @returns {boolean} - Whether the form is valid
 */
function validateCheckoutForm() {
    // Get form fields
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();
    
    // Basic validation
    if (fullName === '') {
        showNotification(null, 'Please enter your full name', 'error');
        return false;
    }
    
    if (email === '' || !isValidEmail(email)) {
        showNotification(null, 'Please enter a valid email address', 'error');
        return false;
    }
    
    if (phone === '' || phone.length < 10) {
        showNotification(null, 'Please enter a valid phone number', 'error');
        return false;
    }
    
    if (address === '') {
        showNotification(null, 'Please enter your address', 'error');
        return false;
    }
    
    if (city === '') {
        showNotification(null, 'Please enter your city', 'error');
        return false;
    }
    
    if (state === '') {
        showNotification(null, 'Please enter your state', 'error');
        return false;
    }
    
    if (zipCode === '' || zipCode.length < 6) {
        showNotification(null, 'Please enter a valid postal code', 'error');
        return false;
    }
    
    // Payment method-specific validation
    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (selectedPaymentMethod === 'creditCard') {
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        const cardName = document.getElementById('cardName').value.trim();
        
        if (cardNumber === '' || cardNumber.replace(/\s/g, '').length < 16) {
            showNotification(null, 'Please enter a valid card number', 'error');
            return false;
        }
        
        if (expiryDate === '' || !isValidExpiryDate(expiryDate)) {
            showNotification(null, 'Please enter a valid expiry date (MM/YY)', 'error');
            return false;
        }
        
        if (cvv === '' || cvv.length < 3) {
            showNotification(null, 'Please enter a valid CVV', 'error');
            return false;
        }
        
        if (cardName === '') {
            showNotification(null, 'Please enter the name on your card', 'error');
            return false;
        }
    } else if (selectedPaymentMethod === 'upi') {
        const upiId = document.getElementById('upiId').value.trim();
        
        if (upiId === '' || !isValidUpiId(upiId)) {
            showNotification(null, 'Please enter a valid UPI ID', 'error');
            return false;
        }
    }
    
    return true;
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * Validates expiry date format and value
 * @param {string} expiryDate - Expiry date to validate (MM/YY format)
 * @returns {boolean} - Whether the expiry date is valid
 */
function isValidExpiryDate(expiryDate) {
    // Check format
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        return false;
    }
    
    const [month, year] = expiryDate.split('/').map(part => parseInt(part, 10));
    
    // Check month is between 1 and 12
    if (month < 1 || month > 12) {
        return false;
    }
    
    // Get current date
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Get last two digits of year
    const currentMonth = now.getMonth() + 1; // January is 0
    
    // Check if the card is not expired
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false;
    }
    
    return true;
}

/**
 * Validates UPI ID format
 * @param {string} upiId - UPI ID to validate
 * @returns {boolean} - Whether the UPI ID is valid
 */
function isValidUpiId(upiId) {
    // Basic UPI ID validation (username@provider)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(upiId);
}

/**
 * Processes the order after form validation
 */
function processOrder() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    if (!cart || cart.items.length === 0) {
        showNotification(null, 'Your cart is empty', 'error');
        return;
    }
    
    // Get user and shipping information
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    const shippingInfo = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        zipCode: document.getElementById('zipCode').value.trim()
    };
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Generate order
    const order = {
        id: generateOrderId(),
        userId: user.id || 'guest',
        items: cart.items,
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        total: cart.total,
        shippingInfo: shippingInfo,
        paymentMethod: paymentMethod,
        status: 'pending',
        orderDate: new Date().toISOString(),
        estimatedDelivery: getEstimatedDeliveryDate()
    };
    
    // Save order to localStorage
    saveOrder(order);
    
    // Clear cart
    clearCart();
    
    // Show success message and redirect to confirmation page
    showNotification(null, 'Order placed successfully!', 'success');
    
    // Create a temporary order confirmation in sessionStorage to show on next page
    sessionStorage.setItem('lastOrder', JSON.stringify(order));
    
    // Redirect to order confirmation page after a short delay
    setTimeout(() => {
        window.location.href = 'order-confirmation.html';
    }, 1500);
}

/**
 * Generates a unique order ID
 * @returns {string} - Unique order ID
 */
function generateOrderId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `NSH-${timestamp}-${random}`;
}

/**
 * Calculates estimated delivery date (7-10 days from now)
 * @returns {string} - Estimated delivery date
 */
function getEstimatedDeliveryDate() {
    const today = new Date();
    
    // Add 7-10 days for delivery
    const deliveryDays = 7 + Math.floor(Math.random() * 4); // Random between 7-10
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);
    
    return deliveryDate.toISOString();
}

/**
 * Saves the order to localStorage
 * @param {Object} order - Order object
 */
function saveOrder(order) {
    // Get existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Add new order
    existingOrders.push(order);
    
    // Save back to localStorage
    localStorage.setItem('orders', JSON.stringify(existingOrders));
}

/**
 * Shows a notification message
 * @param {HTMLElement} element - Element to show notification near (null for centered)
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success' or 'error')
 */
function showNotification(element, message, type = 'success') {
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

/**
 * Loads cart data from localStorage
 */
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        return JSON.parse(savedCart);
    }
    return {
        items: [],
        subtotal: 0,
        shipping: 0,
        total: 0
    };
}

/**
 * Renders the order summary on the checkout page
 */
function renderOrderSummary() {
    const cart = loadCart();
    const orderItemsContainer = document.querySelector('.order-items');
    if (!orderItemsContainer) return;
    
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
    document.querySelector('.order-subtotal').textContent = `₹${cart.subtotal.toFixed(2)}`;
    document.querySelector('.order-shipping').textContent = cart.shipping > 0 ? `₹${cart.shipping.toFixed(2)}` : 'FREE';
    document.querySelector('.order-total').textContent = `₹${cart.total.toFixed(2)}`;
}