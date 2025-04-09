// order-history.js - Order History functionality for Natural Stone Hub website
// Author: Prathyusha M
// Last Updated: 2025
// Description: Handles displaying, filtering, and managing order history

// =========================================
// Order History Implementation
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login page if not logged in
        showLoginPrompt();
        return;
    }
    
    // Initialize mock data if no orders exist (for testing/demo purposes)
    initializeMockOrdersIfNeeded();
    
    // Load and display orders
    loadOrderHistory();
    
    // Update cart icon if present
    updateCartIcon();
});

/**
 * Initialize mock order data if none exists (for demo purposes)
 */
function initializeMockOrdersIfNeeded() {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Only add mock data if there are no orders for the current user
    const userOrders = allOrders.filter(order => order.userId === currentUser.id);
    
    if (userOrders.length === 0) {
        // Create sample order
        const mockOrder = {
            id: 'ORD' + Date.now().toString().substring(6),
            userId: currentUser.id,
            orderDate: new Date().toISOString(),
            paymentMethod: 'creditCard',
            status: 'processing',
            items: [
                {
                    id: 'product1',
                    name: 'Marble Countertop (White Carrara)',
                    price: 12500,
                    quantity: 1
                },
                {
                    id: 'product2',
                    name: 'Granite Floor Tiles',
                    price: 2300,
                    quantity: 2
                }
            ],
            subtotal: 17100,
            shipping: 500,
            total: 17600,
            shippingInfo: {
                fullName: currentUser.name || 'John Doe',
                address: '123 Stone Avenue',
                city: 'Bangalore',
                state: 'Karnataka',
                zipCode: '560001',
                phone: '9876543210',
                email: currentUser.email || 'customer@example.com'
            },
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        };
        
        // Add mock order to orders array
        allOrders.push(mockOrder);
        
        // Save to localStorage
        localStorage.setItem('orders', JSON.stringify(allOrders));
        
        // Also save to sessionStorage so it appears in order confirmation
        sessionStorage.setItem('lastOrder', JSON.stringify(mockOrder));
    }
}

/**
 * Shows login prompt for non-logged in users
 */
function showLoginPrompt() {
    const orderHistoryContainer = document.querySelector('.order-history-container');
    
    if (orderHistoryContainer) {
        orderHistoryContainer.innerHTML = `
            <div class="login-prompt">
                <p>Please login to view your order history.</p>
                <button class="login-btn">Login</button>
            </div>
        `;
        
        // Add event listener to login button
        const loginBtn = document.querySelector('.login-btn');
        loginBtn.addEventListener('click', () => {
            // Open login modal if it exists
            const loginModal = document.getElementById('login-modal');
            if (loginModal) {
                loginModal.style.display = 'flex';
            } else {
                window.location.href = 'login.html';
            }
        });
    }
}

/**
 * Loads and displays order history for the current user
 */
function loadOrderHistory() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Filter orders for current user
    const userOrders = allOrders.filter(order => order.userId === currentUser.id);
    
    const orderHistoryContainer = document.querySelector('.order-history-container');
    
    if (orderHistoryContainer) {
        if (userOrders.length === 0) {
            orderHistoryContainer.innerHTML = `
                <div class="no-orders-message">You haven't placed any orders yet.</div>
            `;
            return;
        }
        
        // Sort orders by date (newest first)
        userOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        
        let ordersHTML = '';
        
        userOrders.forEach(order => {
            const orderDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const estimatedDelivery = new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            let orderStatusClass = '';
            switch (order.status) {
                case 'pending':
                    orderStatusClass = 'status-pending';
                    break;
                case 'processing':
                    orderStatusClass = 'status-processing';
                    break;
                case 'shipped':
                    orderStatusClass = 'status-shipped';
                    break;
                case 'delivered':
                    orderStatusClass = 'status-delivered';
                    break;
                case 'cancelled':
                    orderStatusClass = 'status-cancelled';
                    break;
            }
            
            ordersHTML += `
                <div class="order-card" data-order-id="${order.id}">
                    <div class="order-header">
                        <div class="order-info">
                            <h3>Order #${order.id}</h3>
                            <p class="order-date">Placed on ${orderDate}</p>
                        </div>
                        <div class="order-status ${orderStatusClass}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                    </div>
                    
                    <div class="order-details">
                        <div class="order-items-summary">
            `;
            
            // Add up to 3 items, then show a "more" indicator if there are additional items
            const displayItems = order.items.slice(0, 3);
            const remainingItems = order.items.length - displayItems.length;
            
            displayItems.forEach(item => {
                ordersHTML += `
                    <div class="order-item-summary">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">x${item.quantity}</span>
                    </div>
                `;
            });
            
            if (remainingItems > 0) {
                ordersHTML += `
                    <div class="more-items">
                        +${remainingItems} more item${remainingItems > 1 ? 's' : ''}
                    </div>
                `;
            }
            
            ordersHTML += `
                        </div>
                        
                        <div class="order-metadata">
                            <div class="metadata-item">
                                <span class="label">Total:</span>
                                <span class="value">₹${order.total.toFixed(2)}</span>
                            </div>
                            <div class="metadata-item">
                                <span class="label">Shipping:</span>
                                <span class="value">${order.shipping > 0 ? `₹${order.shipping.toFixed(2)}` : 'FREE'}</span>
                            </div>
                            <div class="metadata-item">
                                <span class="label">Payment Method:</span>
                                <span class="value">${formatPaymentMethod(order.paymentMethod)}</span>
                            </div>
                            <div class="metadata-item">
                                <span class="label">Est. Delivery:</span>
                                <span class="value">${estimatedDelivery}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-actions">
                        <button class="view-details-btn" data-order-id="${order.id}">View Details</button>
                        ${order.status === 'pending' || order.status === 'processing' ? `<button class="cancel-order-btn" data-order-id="${order.id}">Cancel Order</button>` : ''}
                    </div>
                </div>
            `;
        });
        
        orderHistoryContainer.innerHTML = ordersHTML;
        
        // Add event listeners to buttons
        const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
        viewDetailsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.dataset.orderId;
                viewOrderDetails(orderId);
            });
        });
        
        const cancelOrderButtons = document.querySelectorAll('.cancel-order-btn');
        cancelOrderButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.dataset.orderId;
                cancelOrder(orderId);
            });
        });
    }
}

/**
 * Formats payment method for display
 * @param {string} method - Payment method ID
 * @returns {string} - Formatted payment method name
 */
function formatPaymentMethod(method) {
    switch (method) {
        case 'creditCard':
            return 'Credit/Debit Card';
        case 'upi':
            return 'UPI';
        case 'cod':
            return 'Cash on Delivery';
        default:
            return method;
    }
}

/**
 * Opens order details view for a specific order
 * @param {string} orderId - ID of the order to view
 */
function viewOrderDetails(orderId) {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = allOrders.find(o => o.id === orderId);
    
    if (!order) {
        showNotification(null, 'Order not found', 'error');
        return;
    }
    
    // Create modal for order details
    const modal = document.createElement('div');
    modal.className = 'modal order-details-modal';
    modal.setAttribute('role', 'dialog');
    modal.style.display = 'flex';
    
    const orderDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const estimatedDelivery = new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    let itemsHTML = '';
    order.items.forEach(item => {
        itemsHTML += `
            <div class="detail-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-quantity">x${item.quantity}</span>
                </div>
                <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="modal-content order-details-content">
            <div class="modal-header">
                <h2>Order #${order.id}</h2>
                <a href="#" class="modal-close" aria-label="Close">&times;</a>
            </div>
            <div class="modal-body">
                <div class="order-info-section">
                    <div class="order-status-info">
                        <p class="order-placed">Placed on ${orderDate}</p>
                        <p class="order-status ${order.status}">Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                    </div>
                    
                    <h3>Items</h3>
                    <div class="order-items-list">
                        ${itemsHTML}
                    </div>
                    
                    <div class="order-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>₹${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Shipping:</span>
                            <span>${order.shipping > 0 ? `₹${order.shipping.toFixed(2)}` : 'FREE'}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span>₹${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="order-address-payment">
                        <div class="shipping-info">
                            <h3>Shipping Address</h3>
                            <p>${order.shippingInfo.fullName}</p>
                            <p>${order.shippingInfo.address}</p>
                            <p>${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}</p>
                            <p>Phone: ${order.shippingInfo.phone}</p>
                        </div>
                        
                        <div class="payment-info">
                            <h3>Payment Information</h3>
                            <p>Method: ${formatPaymentMethod(order.paymentMethod)}</p>
                            <p>Estimated Delivery: ${estimatedDelivery}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                ${order.status === 'pending' || order.status === 'processing' ? `<button class="cancel-order-btn" data-order-id="${order.id}">Cancel Order</button>` : ''}
                <button class="close-modal-btn">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeButtons = modal.querySelectorAll('.modal-close, .close-modal-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.removeChild(modal);
        });
    });
    
    const cancelBtn = modal.querySelector('.cancel-order-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            const orderId = e.target.dataset.orderId;
            document.body.removeChild(modal);
            cancelOrder(orderId);
        });
    }
}

/**
 * Cancels an order
 * @param {string} orderId - ID of the order to cancel
 */
function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) {
        return;
    }
    
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        showNotification(null, 'Order not found', 'error');
        return;
    }
    
    // Update order status
    allOrders[orderIndex].status = 'cancelled';
    
    // Save updated orders
    localStorage.setItem('orders', JSON.stringify(allOrders));
    
    // Show success message
    showNotification(null, 'Order cancelled successfully', 'success');
    
    // Reload order history
    loadOrderHistory();
}

/**
 * Updates cart count in the header
 */
function updateCartIcon() {
    const cartCountElement = document.querySelector('.cart-count');
    if (!cartCountElement) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElement.textContent = itemCount;
    cartCountElement.style.display = itemCount > 0 ? 'flex' : 'none';
}

/**
 * Shows a notification message
 * @param {HTMLElement} element - Element to show notification near
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