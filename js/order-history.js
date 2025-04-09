// order-history.js - Order History functionality for Natural Stone Hub website
// Author: Prathyusha M
// Last Updated: 2025
// Description: Handles displaying, filtering, and managing order history

// =========================================
// Order History Implementation
// =========================================

// order-history.js - Order History functionality for Natural Stone Hub

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.order-history-container');
  
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
    if (!currentUser) {
      container.innerHTML = `
        <div class="login-prompt">
          <p>Please log in to view your order history.</p>
          <button class="login-btn" onclick="openLoginModal()">Login</button>
        </div>
      `;
      return;
    }
  
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = filterUserOrders(allOrders, currentUser);

  
    if (userOrders.length === 0) {
      container.innerHTML = `
        <div class="no-orders-message">You haven't placed any orders yet.</div>
      `;
      return;
    }
  
    container.innerHTML = '';
    userOrders.reverse().forEach(order => {
      const orderCard = createOrderCard(order);
      container.appendChild(orderCard);
    });
  });
  
  /**
   * Creates and returns an order card element
   * @param {Object} order
   * @returns {HTMLElement}
   */
  function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
  
    const statusClass = `status-${order.status.toLowerCase()}`;
  
    const itemSummary = order.items.slice(0, 2).map(item => `
      <div class="order-item-summary">
        <span>${item.name} x${item.quantity}</span>
        <span>₹${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');
  
    const moreItems = order.items.length > 2
      ? `<div class="more-items">+${order.items.length - 2} more item(s)</div>`
      : '';
  
    card.innerHTML = `
      <div class="order-header">
        <div class="order-info">
          <h3>Order ID: ${order.id}</h3>
          <p class="order-date">${formatDate(order.orderDate)}</p>
        </div>
        <div class="order-status ${statusClass}">${capitalizeFirstLetter(order.status)}</div>
      </div>
      <div class="order-details">
        <div class="order-items-summary">
          ${itemSummary}
          ${moreItems}
        </div>
        <div class="order-metadata">
          <div class="metadata-item"><span class="label">Subtotal:</span><span class="value">₹${order.subtotal.toFixed(2)}</span></div>
          <div class="metadata-item"><span class="label">Shipping:</span><span class="value">${order.shipping > 0 ? `₹${order.shipping.toFixed(2)}` : 'FREE'}</span></div>
          <div class="metadata-item"><span class="label">Total:</span><span class="value">₹${order.total.toFixed(2)}</span></div>
          <div class="metadata-item"><span class="label">Delivery By:</span><span class="value">${formatDate(order.estimatedDelivery)}</span></div>
        </div>
      </div>
      <div class="order-actions">
        <button class="view-details-btn" onclick="viewOrderDetails('${order.id}')">View Details</button>
      </div>
    `;
  
    return card;
  }
  
  /**
   * Capitalizes the first letter of a string
   * @param {string} str
   * @returns {string}
   */
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  /**
   * Formats ISO date into a readable format
   * @param {string} dateString
   * @returns {string}
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-IN', options);
  }
  
  /**
   * Opens the login modal
   */
  function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }
  
  /**
   * Handles "View Details" button click
   * Redirects to order confirmation page with orderId in URL
   * @param {string} orderId
   */
  function viewOrderDetails(orderId) {
    window.location.href = `order-confirmation.html?orderId=${orderId}`;
  }  

  document.addEventListener('DOMContentLoaded', function() {
    // Add a diagnostic button
    const container = document.querySelector('.order-history-container');
    if (container) {
        const diagnosticBtn = document.createElement('button');
        diagnosticBtn.innerText = 'Check Order Storage';
        diagnosticBtn.style.padding = '10px 15px';
        diagnosticBtn.style.marginTop = '20px';
        diagnosticBtn.style.backgroundColor = '#3498db';
        diagnosticBtn.style.color = 'white';
        diagnosticBtn.style.border = 'none';
        diagnosticBtn.style.borderRadius = '4px';
        diagnosticBtn.style.cursor = 'pointer';
        
        diagnosticBtn.addEventListener('click', function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
            const lastOrder = JSON.parse(sessionStorage.getItem('lastOrder'));
            
            let message = "===== STORAGE DIAGNOSTIC =====\n";
            message += `Current User: ${currentUser ? JSON.stringify(currentUser) : 'Not logged in'}\n\n`;
            message += `Total Orders in localStorage: ${allOrders.length}\n`;
            message += `Last Order in sessionStorage: ${lastOrder ? 'Yes' : 'No'}\n\n`;
            
            if (allOrders.length > 0) {
                message += "Orders in localStorage:\n";
                allOrders.forEach((order, index) => {
                    message += `${index+1}. ID: ${order.id}, User: ${order.userId || 'none'}\n`;
                });
            }
            
            alert(message);
        });

        // Add the clear storage button
        const clearStorageBtn = document.createElement('button');
        clearStorageBtn.innerText = 'Clear Order Storage';
        clearStorageBtn.style.padding = '10px 15px';
        clearStorageBtn.style.marginTop = '20px';
        clearStorageBtn.style.marginLeft = '10px';
        clearStorageBtn.style.backgroundColor = '#e74c3c';
        clearStorageBtn.style.color = 'white';
        clearStorageBtn.style.border = 'none';
        clearStorageBtn.style.borderRadius = '4px';
        clearStorageBtn.style.cursor = 'pointer';
        clearStorageBtn.addEventListener('click', clearOrderStorage);
        
        container.parentNode.insertBefore(diagnosticBtn, container.nextSibling);
        container.parentNode.insertBefore(clearStorageBtn, diagnosticBtn.nextSibling);
    }
});

function filterUserOrders(allOrders, currentUser) {
    // If user is logged in, show both their user ID matched orders and any guest orders
    // that may have been created with their email
    return allOrders.filter(order => {
      // Match by user ID
      const userIdMatch = order.userId && currentUser.id && order.userId === currentUser.id;
      
      // Match by email (if available)
      const emailMatch = order.userEmail && currentUser.email && order.userEmail === currentUser.email;
      
      // Match guest orders if they contain the user's email in shipping info
      let guestEmailMatch = false;
      if (order.userId && order.userId.startsWith('guest-') && order.shippingInfo && 
          order.shippingInfo.email && currentUser.email &&
          order.shippingInfo.email === currentUser.email) {
        guestEmailMatch = true;
      }
      
      return userIdMatch || emailMatch || guestEmailMatch;
    });
  }

function clearOrderStorage() {
    // Clear orders from localStorage
    localStorage.removeItem('orders');
    
    // Clear last order from sessionStorage
    sessionStorage.removeItem('lastOrder');
    
    // Show confirmation message
    alert("Order storage cleared successfully!");
    
    // Reload the page to reflect changes
    window.location.reload();
}   