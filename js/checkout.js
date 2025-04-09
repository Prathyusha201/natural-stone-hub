// checkout.js - Checkout functionality for Natural Stone Hub website
// Author: Prathyusha M (Modified with enhancements)
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
    setupIndividualFieldValidation();
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
 * Sets up individual field validation with immediate feedback
 */
function setupIndividualFieldValidation() {
    // Full Name validation
    const fullNameInput = document.getElementById('fullName');
    fullNameInput.addEventListener('blur', () => {
        const value = fullNameInput.value.trim();
        if (value === '') {
            showFieldError(fullNameInput, 'Please enter your full name');
        } else if (value.length < 3) {
            showFieldError(fullNameInput, 'Name must be at least 3 characters');
        } else {
            clearFieldError(fullNameInput);
            showFieldSuccess(fullNameInput);
        }
    });

    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', () => {
        const value = emailInput.value.trim();
        if (value === '') {
            showFieldError(emailInput, 'Please enter your email address');
        } else if (!isValidEmail(value)) {
            showFieldError(emailInput, 'Please enter a valid email address');
        } else {
            clearFieldError(emailInput);
            showFieldSuccess(emailInput);
        }
    });

    // Phone validation
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('blur', () => {
        const value = phoneInput.value.trim();
        if (value === '') {
            showFieldError(phoneInput, 'Please enter your phone number');
        } else if (value.length !== 10) {
            showFieldError(phoneInput, 'Phone number must be 10 digits');
        } else {
            clearFieldError(phoneInput);
            showFieldSuccess(phoneInput);
        }
    });

    // Address validation
    const addressInput = document.getElementById('address');
    addressInput.addEventListener('blur', () => {
        const value = addressInput.value.trim();
        if (value === '') {
            showFieldError(addressInput, 'Please enter your address');
        } else if (value.length < 5) {
            showFieldError(addressInput, 'Please enter a complete address');
        } else {
            clearFieldError(addressInput);
            showFieldSuccess(addressInput);
        }
    });

    // City validation
    const cityInput = document.getElementById('city');
    cityInput.addEventListener('blur', () => {
        const value = cityInput.value.trim();
        if (value === '') {
            showFieldError(cityInput, 'Please enter your city');
        } else {
            clearFieldError(cityInput);
            showFieldSuccess(cityInput);
        }
    });

    // State validation
    const stateInput = document.getElementById('state');
    stateInput.addEventListener('blur', () => {
        const value = stateInput.value.trim();
        if (value === '') {
            showFieldError(stateInput, 'Please enter your state');
        } else {
            clearFieldError(stateInput);
            showFieldSuccess(stateInput);
        }
    });

    // Zip Code validation
    const zipCodeInput = document.getElementById('zipCode');
    zipCodeInput.addEventListener('blur', () => {
        const value = zipCodeInput.value.trim();
        if (value === '') {
            showFieldError(zipCodeInput, 'Please enter your postal code');
        } else if (value.length !== 6) {
            showFieldError(zipCodeInput, 'Postal code must be 6 digits');
        } else {
            clearFieldError(zipCodeInput);
            showFieldSuccess(zipCodeInput);
        }
    });

    // Card Number validation
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('blur', () => {
        const value = cardNumberInput.value.trim();
        if (value === '') {
            showFieldError(cardNumberInput, 'Please enter your card number');
        } else if (value.replace(/\s/g, '').length !== 16) {
            showFieldError(cardNumberInput, 'Card number must be 16 digits');
        } else {
            clearFieldError(cardNumberInput);
            showFieldSuccess(cardNumberInput);
        }
    });

    // Expiry Date validation
    const expiryDateInput = document.getElementById('expiryDate');
    expiryDateInput.addEventListener('blur', () => {
        const value = expiryDateInput.value.trim();
        if (value === '') {
            showFieldError(expiryDateInput, 'Please enter card expiry date');
        } else if (!isValidExpiryDate(value)) {
            showFieldError(expiryDateInput, 'Invalid expiry date (MM/YY)');
        } else {
            clearFieldError(expiryDateInput);
            showFieldSuccess(expiryDateInput);
        }
    });

    // CVV validation
    const cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('blur', () => {
        const value = cvvInput.value.trim();
        if (value === '') {
            showFieldError(cvvInput, 'Please enter CVV');
        } else if (value.length < 3 || value.length > 4) {
            showFieldError(cvvInput, 'CVV must be 3-4 digits');
        } else {
            clearFieldError(cvvInput);
            showFieldSuccess(cvvInput);
        }
    });

    // Card Name validation
    const cardNameInput = document.getElementById('cardName');
    cardNameInput.addEventListener('blur', () => {
        const value = cardNameInput.value.trim();
        if (value === '') {
            showFieldError(cardNameInput, 'Please enter name on card');
        } else if (value.length < 3) {
            showFieldError(cardNameInput, 'Please enter complete name');
        } else {
            clearFieldError(cardNameInput);
            showFieldSuccess(cardNameInput);
        }
    });

    // UPI ID validation
    const upiIdInput = document.getElementById('upiId');
    upiIdInput.addEventListener('blur', () => {
        const value = upiIdInput.value.trim();
        if (value === '') {
            showFieldError(upiIdInput, 'Please enter your UPI ID');
        } else if (!isValidUpiId(value)) {
            showFieldError(upiIdInput, 'Invalid UPI ID format (username@bank)');
        } else {
            clearFieldError(upiIdInput);
            showFieldSuccess(upiIdInput);
        }
    });
}

/**
 * Shows error message for a field
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message to display
 */
function showFieldError(input, message) {
    // Clear any existing error/success
    clearFieldError(input);
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '5px';
    
    // Add red border to input
    input.style.borderColor = '#e74c3c';
    input.style.boxShadow = '0 0 0 1px #e74c3c';
    
    // Add error message after input
    input.parentNode.appendChild(errorElement);
}

/**
 * Shows success indicator for a field
 * @param {HTMLElement} input - Input element
 */
function showFieldSuccess(input) {
    // Add green border to input
    input.style.borderColor = '#27ae60';
    input.style.boxShadow = '0 0 0 1px #27ae60';
    
    // Add check icon (optional)
    const successIcon = document.createElement('span');
    successIcon.className = 'success-icon';
    successIcon.innerHTML = '✓';
    successIcon.style.color = '#27ae60';
    successIcon.style.position = 'absolute';
    successIcon.style.right = '10px';
    successIcon.style.top = '50%';
    successIcon.style.transform = 'translateY(-50%)';
    
    // Make parent relative for icon positioning
    if (input.parentNode.style.position !== 'relative') {
        input.parentNode.style.position = 'relative';
    }
    
    // Add success icon after input
    input.parentNode.appendChild(successIcon);
}

/**
 * Clears error/success indicators for a field
 * @param {HTMLElement} input - Input element
 */
function clearFieldError(input) {
    // Remove error messages
    const errorElements = input.parentNode.querySelectorAll('.field-error');
    errorElements.forEach(el => el.remove());
    
    // Remove success icons
    const successIcons = input.parentNode.querySelectorAll('.success-icon');
    successIcons.forEach(el => el.remove());
    
    // Reset input styling
    input.style.borderColor = '';
    input.style.boxShadow = '';
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
    let isValid = true;
    
    // Get form fields
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const state = document.getElementById('state');
    const zipCode = document.getElementById('zipCode');
    
    // Basic validation - trigger blur events to show errors
    if (fullName.value.trim() === '') {
        showFieldError(fullName, 'Please enter your full name');
        isValid = false;
    }
    
    if (email.value.trim() === '' || !isValidEmail(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    if (phone.value.trim() === '' || phone.value.trim().length < 10) {
        showFieldError(phone, 'Please enter a valid phone number');
        isValid = false;
    }
    
    if (address.value.trim() === '') {
        showFieldError(address, 'Please enter your address');
        isValid = false;
    }
    
    if (city.value.trim() === '') {
        showFieldError(city, 'Please enter your city');
        isValid = false;
    }
    
    if (state.value.trim() === '') {
        showFieldError(state, 'Please enter your state');
        isValid = false;
    }
    
    if (zipCode.value.trim() === '' || zipCode.value.trim().length < 6) {
        showFieldError(zipCode, 'Please enter a valid postal code');
        isValid = false;
    }
    
    // Payment method-specific validation
    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (selectedPaymentMethod === 'creditCard') {
        const cardNumber = document.getElementById('cardNumber');
        const expiryDate = document.getElementById('expiryDate');
        const cvv = document.getElementById('cvv');
        const cardName = document.getElementById('cardName');
        
        if (cardNumber.value.trim() === '' || cardNumber.value.replace(/\s/g, '').length < 16) {
            showFieldError(cardNumber, 'Please enter a valid card number');
            isValid = false;
        }
        
        if (expiryDate.value.trim() === '' || !isValidExpiryDate(expiryDate.value.trim())) {
            showFieldError(expiryDate, 'Please enter a valid expiry date (MM/YY)');
            isValid = false;
        }
        
        if (cvv.value.trim() === '' || cvv.value.trim().length < 3) {
            showFieldError(cvv, 'Please enter a valid CVV');
            isValid = false;
        }
        
        if (cardName.value.trim() === '') {
            showFieldError(cardName, 'Please enter the name on your card');
            isValid = false;
        }
    } else if (selectedPaymentMethod === 'upi') {
        const upiId = document.getElementById('upiId');
        
        if (upiId.value.trim() === '' || !isValidUpiId(upiId.value.trim())) {
            showFieldError(upiId, 'Please enter a valid UPI ID');
            isValid = false;
        }
    }
    
    // If not valid, scroll to first error
    if (!isValid) {
        const firstError = document.querySelector('.field-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
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
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        background-color: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        font-weight: 500;
        animation: fadeInOut 3s forwards;
        min-width: 280px;
        text-align: center;
    `;
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -20px); }
            10% { opacity: 1; transform: translate(-50%, 0); }
            90% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -20px); }
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
 * Clears cart data from localStorage
 */
function clearCart() {
    localStorage.removeItem('cart');
}

/**
 * Renders the order summary on the checkout page
 */
function renderOrderSummary() {
    const cart = loadCart();
    const orderItemsContainer = document.querySelector('.order-items');
    if (!orderItemsContainer) return;
    
    let orderHTML = '';
    
    if (cart.items.length === 0) {
        orderHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        orderItemsContainer.innerHTML = orderHTML;
        
        // Disable the place order button
        const placeOrderBtn = document.querySelector('.place-order-btn');
        if (placeOrderBtn) {
            placeOrderBtn.disabled = true;
            placeOrderBtn.style.opacity = '0.5';
            placeOrderBtn.style.cursor = 'not-allowed';
        }
        
        return;
    }
    
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