// order-confirmation.js - Order confirmation functionality for Natural Stone Hub website
// Author: Prathyusha M
// Last Updated: 2025
// Description: Handles the display of order confirmation details

document.addEventListener('DOMContentLoaded', () => {
    // Load and display order details
    displayOrderConfirmation();
    
    // Set up print invoice button
    const printInvoiceBtn = document.getElementById('printInvoiceBtn');
    if (printInvoiceBtn) {
        printInvoiceBtn.addEventListener('click', printInvoice);
    }
});

function saveOrderToLocalStorage(order) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Add user ID to order
    if (currentUser && currentUser.id) {
        order.userId = currentUser.id;
        if (currentUser.email) {
            order.userEmail = currentUser.email;
        }
        console.log("Adding user ID to order:", currentUser.id);
    } else {
        console.log("No logged in user found!");
        // Create a temporary user ID if no user is logged in
        order.userId = "guest-" + Date.now();
        
        // Also store the email from shipping info if available
        if (order.shippingInfo && order.shippingInfo.email) {
            order.userEmail = order.shippingInfo.email;
            console.log("Added guest email from shipping info:", order.userEmail);
        }
    }
    
    // Get all orders from localStorage
    let allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    console.log("Existing orders in localStorage:", allOrders.length);
    
    // Check if order already exists
    const existingOrderIndex = allOrders.findIndex(o => o.id === order.id);
    
    if (existingOrderIndex >= 0) {
        // Update existing order
        allOrders[existingOrderIndex] = order;
        console.log("Updated existing order in localStorage:", order.id);
    } else {
        // Add new order
        allOrders.push(order);
        console.log("Added new order to localStorage:", order.id);
    }
    
    // Save back to localStorage
    localStorage.setItem('orders', JSON.stringify(allOrders));
    
    // Verify order was saved
    const verifyOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const savedOrder = verifyOrders.find(o => o.id === order.id);
    if (savedOrder) {
        console.log("Order verified in localStorage:", order.id);
    } else {
        console.error("Failed to save order to localStorage!");
    }
}

/**
 * Displays the order confirmation details
 */
function displayOrderConfirmation() {
    // Get order from session storage
    const orderJSON = sessionStorage.getItem('lastOrder');
    
    if (!orderJSON) {
        // If no order in session storage, check if order ID is in URL params
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        
        if (orderId) {
            // Try to load order from localStorage by ID
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            const order = orders.find(o => o.id === orderId);
            
            if (order) {
                displayOrderDetails(order);
            } else {
                showOrderNotFound();
            }
        } else {
            showOrderNotFound();
        }
    } else {
        // Display order from session storage
        const order = JSON.parse(orderJSON);
        displayOrderDetails(order);
    }
}

/**
 * Displays order details on the page
 * @param {Object} order - The order object to display
 */
function displayOrderDetails(order) {
    // Set order information
    document.getElementById('orderIdValue').textContent = order.id;
    document.getElementById('orderDateValue').textContent = formatDate(order.orderDate);
    document.getElementById('paymentMethodValue').textContent = formatPaymentMethod(order.paymentMethod);
    document.getElementById('orderStatusValue').textContent = capitalizeFirstLetter(order.status);
    
    // Set shipping information
    const shippingAddressHTML = `
        ${order.shippingInfo.fullName}<br>
        ${order.shippingInfo.address}<br>
        ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}<br>
        Phone: ${order.shippingInfo.phone}<br>
        Email: ${order.shippingInfo.email}
    `;
    document.getElementById('shippingAddressValue').innerHTML = shippingAddressHTML;
    
    // Set order products
    const orderProductsList = document.getElementById('orderProductsList');
    let productsHTML = '';
    
    order.items.forEach(item => {
        productsHTML += `
            <div class="order-product">
                <div class="product-details">
                    <div class="product-name">${item.name}</div>
                    <div class="product-quantity">Quantity: ${item.quantity}</div>
                </div>
                <div class="product-price">₹${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
    });
    
    orderProductsList.innerHTML = productsHTML;
    
    // Set order summary
    document.getElementById('subtotalValue').textContent = `₹${order.subtotal.toFixed(2)}`;
    document.getElementById('shippingValue').textContent = order.shipping > 0 ? `₹${order.shipping.toFixed(2)}` : 'FREE';
    document.getElementById('totalValue').textContent = `₹${order.total.toFixed(2)}`;
    
    // Set estimated delivery
    document.getElementById('estimatedDeliveryValue').textContent = formatDate(order.estimatedDelivery);

    // IMPORTANT: Save the order to localStorage
    saveOrderToLocalStorage(order);
}

/**
 * Shows a message when order is not found
 */
function showOrderNotFound() {
    const confirmationContent = document.querySelector('.confirmation-content');
    
    if (confirmationContent) {
        confirmationContent.innerHTML = `
            <div class="order-not-found">
                <h3>Order Not Found</h3>
                <p>We couldn't find your order information. Please check your email for order details or contact customer support.</p>
                <div class="action-buttons">
                    <a href="index.html" class="action-button">Return to Home</a>
                </div>
            </div>
        `;
    }
}

/**
 * Formats a date string into a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
    };
    
    return date.toLocaleDateString('en-IN', options);
}

/**
 * Formats payment method to be more readable
 * @param {string} method - Payment method
 * @returns {string} - Formatted payment method
 */
function formatPaymentMethod(method) {
    switch(method) {
        case 'creditCard':
            return 'Credit/Debit Card';
        case 'upi':
            return 'UPI Payment';
        case 'cod':
            return 'Cash on Delivery';
        default:
            return capitalizeFirstLetter(method);
    }
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Prints the invoice
 */
function printInvoice() {
    window.print();
}