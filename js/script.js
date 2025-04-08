// script.js - Main JavaScript file for Natural Stone Hub website
// Author: Prathyusha M
// Last Updated: 2025
// Description: Implements dynamic menu, form validation, local storage, and event handling

// =========================================
// Dynamic Menu Implementation
// Creates an animated sliding menu panel
// =========================================
const createDynamicMenu = () => {
    const menuData = [
        { id: 'index.html', text: 'Home', icon: 'fa-home' },
        { id: 'about.html', text: 'About Us', icon: 'fa-info-circle' },
        { id: 'products.html', text: 'Products', icon: 'fa-boxes' },
        { id: 'products-catalog.html', text: 'Products Catalog', icon: 'fa-th' },
        { id: 'services.html', text: 'Services', icon: 'fa-concierge-bell' },
        { id: 'testimonials.html', text: 'Testimonials', icon: 'fa-quote-right' },
        { id: 'contact.html', text: 'Contact', icon: 'fa-envelope' },
        { id: 'login.html', text: 'Login', icon: 'fa-sign-in-alt' },
        { id: 'register.html', text: 'Register', icon: 'fa-user-plus' }
    ];

    // Create menu container
    const menuPanel = document.createElement('div');
    menuPanel.className = 'dynamic-menu';
    menuPanel.style.cssText = `
        position: fixed;
        top: 0;
        left: -300px;
        width: 300px;
        height: 100vh;
        background: rgba(44, 62, 80, 0.95);
        transition: left 0.3s ease;
        z-index: 1001;
        padding: 20px;
        box-shadow: 2px 0 5px rgba(0,0,0,0.2);
    `;

    // Create menu content
    const menuContent = menuData.map(item => `
        <a href="${item.id}" class="menu-item">
            <i class="fas ${item.icon}"></i>
            <span>${item.text}</span>
        </a>
    `).join('');

    menuPanel.innerHTML = menuContent;
    document.body.appendChild(menuPanel);

    // Add menu toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'menu-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1002;
        background: #e74c3c;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s ease;
    `;

    document.body.appendChild(toggleBtn);

    // Add menu item styling
    const style = document.createElement('style');
    style.textContent = `
        .menu-item {
            display: flex;
            align-items: center;
            padding: 15px;
            color: white;
            text-decoration: none;
            transition: background 0.3s ease;
            border-radius: 5px;
            margin-bottom: 5px;
        }
        .menu-item:hover {
            background: #e74c3c;
        }
        .menu-item i {
            margin-right: 15px;
            width: 20px;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    // Event Handlers
    let isMenuOpen = false;

    toggleBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        menuPanel.style.left = isMenuOpen ? '0' : '-300px';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !menuPanel.contains(e.target) && e.target !== toggleBtn) {
            isMenuOpen = false;
            menuPanel.style.left = '-300px';
        }
    });
};

// Add password visibility toggle to all password fields
function addPasswordToggle() {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    
    passwordFields.forEach(passwordField => {
        // Create container for password field and icon
        const container = document.createElement('div');
        container.style.cssText = `
            position: relative;
            width: 100%;
            display: flex;
            align-items: center;
        `;
        
        // Wrap password field in container
        passwordField.parentNode.insertBefore(container, passwordField);
        container.appendChild(passwordField);
        
        // Style password field
        passwordField.style.cssText = `
            width: 100%;
            padding-right: 35px; /* Make room for the icon */
        `;
        
        // Create eye icon container
        const eyeIcon = document.createElement('span');
        eyeIcon.innerHTML = '<i class="fas fa-eye"></i>';
        eyeIcon.className = 'password-toggle';
        eyeIcon.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #666;
            padding: 5px;
            z-index: 1;
        `;
        
        container.appendChild(eyeIcon);
        
        // Toggle password visibility
        eyeIcon.addEventListener('click', () => {
            const type = passwordField.getAttribute('type');
            passwordField.setAttribute('type', type === 'password' ? 'text' : 'password');
            eyeIcon.innerHTML = type === 'password' ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
    });
}

// =========================================
// Form Validation Implementation
// Real-time validation for all forms
// =========================================
const setupFormValidation = () => {
    const forms = document.querySelectorAll('form');
    
    const validationRules = {
        'text': {
            pattern: '[A-Za-z\\s]{2,}',
            message: 'Please enter at least 2 characters, letters only'
        },
        'email': {
            pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
            message: 'Please enter a valid email address'
        },
        'password': {
            pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$',
            message: 'Password must include at least one letter, one number, and one special character (minimum 8 characters)'
        },
        'phone': {
            pattern: '^\\+?[0-9]{10,}$',
            message: 'Please enter a valid phone number with at least 10 digits'
        }
    };

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Create validation message element
            const validationMsg = document.createElement('span');
            validationMsg.className = 'validation-message';
            validationMsg.style.cssText = `
                color: #e74c3c;
                font-size: 0.8em;
                margin-top: 5px;
                display: none;
            `;
            input.parentNode.insertBefore(validationMsg, input.nextSibling);

            // Real-time validation
            input.addEventListener('input', () => {
                const inputType = input.getAttribute('type');
                const rule = validationRules[inputType] || validationRules['text'];
                
                const isValid = new RegExp(rule.pattern).test(input.value);
                validationMsg.style.display = isValid ? 'none' : 'block';
                validationMsg.textContent = isValid ? '' : rule.message;
                
                input.style.borderColor = isValid ? '#ddd' : '#e74c3c';
                
                // Additional validation for confirm password
                if (inputType === 'password' && input.placeholder === 'Confirm Password') {
                    const passwordInput = input.form.querySelector('input[placeholder="Password"]');
                    if (passwordInput && input.value !== passwordInput.value) {
                        validationMsg.style.display = 'block';
                        validationMsg.textContent = 'Passwords do not match';
                        input.style.borderColor = '#e74c3c';
                    }
                }
            });
        });
    });
};

// =========================================
// User Authentication Management
// Handles user display, logout, and tracking
// =========================================

// Store current user session information
let currentUser = null;

/**
 * Updates the UI to show logged-in user information
 * @param {string} email - User's email from login
 */
function updateUserUI(email) {
    // Get user info from registration data
    const registeredUsers = JSON.parse(localStorage.getItem('register_responses') || '[]');
    const userInfo = registeredUsers.find(user => (user.email || user.Email) === email);
    
    if (!userInfo) return;
    
    // Store current user info
    currentUser = {
        name: userInfo.name || userInfo.Name || email,
        email: email,
        loginTime: new Date().toLocaleString()
    };
    
    // Create user info display container if it doesn't exist
    let userContainer = document.querySelector('.user-info-container');
    if (!userContainer) {
        userContainer = document.createElement('div');
        userContainer.className = 'user-info-container';
        userContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(44, 62, 80, 0.95);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        document.body.appendChild(userContainer);
    }
    
    // Update container content
    userContainer.innerHTML = `
        <span>Welcome, ${currentUser.name}</span>
        <button id="logoutBtn" class="logout-btn" style="
            background: #e74c3c;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        ">Logout</button>
    `;
    
    // Add logout button functionality
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

/**
 * Handles user logout process
 */
function handleLogout() {
    if (currentUser) {
        // Save logout record
        const logoutRecord = {
            name: currentUser.name,
            email: currentUser.email,
            loginTime: currentUser.loginTime,
            logoutTime: new Date().toLocaleString()
        };
        
        // Save to localStorage
        const logoutRecords = JSON.parse(localStorage.getItem('logout_records') || '[]');
        logoutRecords.push(logoutRecord);
        localStorage.setItem('logout_records', JSON.stringify(logoutRecords));
        
        // Clear current user
        currentUser = null;
        
        // Remove user info container
        const userContainer = document.querySelector('.user-info-container');
        if (userContainer) {
            userContainer.remove();
        }
        
        // Show logout notification
        const notification = document.createElement('div');
        notification.textContent = 'Logged out successfully!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 1000;
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => notification.remove(), 3000);
        
        // Redirect to home page or refresh
        window.location.reload();
    }
}

/**
 * Displays user login/logout history
 * @param {HTMLElement} container - Container element for displaying records
 */
function displayUserHistory(container) {
    const logoutRecords = JSON.parse(localStorage.getItem('logout_records') || '[]');
    
    if (logoutRecords.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No login history available</p>';
        return;
    }
    
    let tableHTML = `
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
                <tr style="background: #2c3e50; color: white;">
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Name</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Email</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Login Time</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Logout Time</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    logoutRecords.forEach((record, index) => {
        const rowStyle = index % 2 === 0 ? 'background: #f9f9f9;' : '';
        tableHTML += `
            <tr style="${rowStyle}">
                <td style="padding: 10px; border: 1px solid #ddd;">${record.name}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${record.email}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${record.loginTime}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${record.logoutTime}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
        <div style="text-align: right; margin-top: 15px;">
            <button class="clear-history-btn" style="padding: 8px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Clear History
            </button>
        </div>
    `;
    
    container.innerHTML = tableHTML;
    
    // Add clear history functionality
    container.querySelector('.clear-history-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all login history?')) {
            localStorage.removeItem('logout_records');
            displayUserHistory(container);
        }
    });
}

// =========================================
// Form Data Local Storage Implementation
// This code handles:
// 1. Storing form submissions in localStorage
// 2. Displaying saved responses in dynamic tables
// 3. Adding "View Responses" buttons to forms
// =========================================
// Set up local storage functionality for all forms
function setupLocalStorage() {
    // Target the login, register and contact forms - BOTH modal and standalone versions
    const loginForms = document.querySelectorAll('form.auth-form');
    const contactForm = document.querySelector('.contact-form');
    
    // Configure each login/register form with local storage capability
    loginForms.forEach(form => {
        const isLoginForm = form.querySelector('input[placeholder="Password"]') && !form.querySelector('input[placeholder="Confirm Password"]');
        const isRegisterForm = form.querySelector('input[placeholder="Confirm Password"]');
        
        if (isLoginForm) {
            setupFormStorage(form, 'login_responses');
        } else if (isRegisterForm) {
            setupFormStorage(form, 'register_responses');
        }
    });
    
    // Setup contact form if it exists
    if (contactForm) setupFormStorage(contactForm, 'contact_responses');
}

/**
 * Sets up local storage and response display for a specific form
 * @param {HTMLElement} form - The form element to set up
 * @param {string} storageKey - Key to use in localStorage
 */
function setupFormStorage(form, storageKey) {
    // Create container for displaying stored responses if not already present
    let responseContainer = form.parentNode.querySelector('.response-container');
    if (!responseContainer) {
        responseContainer = document.createElement('div');
        responseContainer.className = 'response-container';
        responseContainer.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            max-height: 300px;
            overflow-y: auto;
            display: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        form.parentNode.appendChild(responseContainer);
    }
    
    // Create "View Responses" button if not already present
    if (!form.querySelector('.view-responses-btn')) {
        const viewResponsesBtn = document.createElement('button');
        viewResponsesBtn.textContent = 'View Responses';
        viewResponsesBtn.className = 'view-responses-btn';
        viewResponsesBtn.type = 'button';
        viewResponsesBtn.style.cssText = `
            padding: 0.8rem 1.5rem;
            background: #2c3e50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 15px;
            transition: background 0.3s;
        `;
        form.appendChild(viewResponsesBtn);
        
        // View Responses button functionality
        viewResponsesBtn.addEventListener('click', function() {
            const isVisible = responseContainer.style.display === 'block';
            responseContainer.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                displayStoredResponses(responseContainer, storageKey);
            }
        });
    }

    // Add Login History button only for login forms
    if (storageKey === 'login_responses' && !form.querySelector('.view-history-btn')) {
        const viewHistoryBtn = document.createElement('button');
        viewHistoryBtn.textContent = 'View Login History';
        viewHistoryBtn.className = 'view-history-btn';
        viewHistoryBtn.type = 'button';
        viewHistoryBtn.style.cssText = `
            padding: 0.8rem 1.5rem;
            background: #2c3e50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 15px;
            margin-left: 10px;
        `;
        form.appendChild(viewHistoryBtn);
    
        viewHistoryBtn.addEventListener('click', function() {
            const isVisible = responseContainer.style.display === 'block';
            responseContainer.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                displayUserHistory(responseContainer);
            }
        });
    }
    
    // Make sure the form's submit event is only attached once
    if (!form.hasAttribute('data-submit-attached')) {
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form before proceeding
            if (!validateForm(form)) {
                return;
            }

            // For other forms (registration, contact, etc.)
            const formData = {};
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                const key = input.name || input.placeholder || input.type;
                formData[key] = input.value;
            });
            
            formData.timestamp = new Date().toLocaleString();
            
            // Special handling for registration
            if (storageKey === 'register_responses') {
                const email = form.querySelector('input[type="email"]').value;
                
                // Check if user already exists
                const existingUsers = JSON.parse(localStorage.getItem(storageKey) || '[]');
                const userExists = existingUsers.some(user => {
                    const userEmail = user.email || user.Email;
                    return userEmail === email;
                });
                
                if (userExists) {
                    showNotification(form, 'This email is already registered. Please login instead.', 'error');
                    
                    // Automatically open login modal after 2 seconds
                    setTimeout(() => {
                        const loginModal = document.querySelector('#login-modal');
                        if (loginModal) {
                            const currentModal = form.closest('.modal');
                            if (currentModal) {
                                currentModal.style.display = 'none';
                            }
                            loginModal.style.display = 'flex';
                        }
                    }, 2000);
                    
                    return;
                }
                
                // Save new registration
                saveToLocalStorage(storageKey, formData);
                showNotification(form, 'Registration successful! Please login.', 'success');
                
                // Refresh page after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
            
            // Special handling for login form
            else if (storageKey === 'login_responses') {
                const email = form.querySelector('input[type="email"]').value;
                const password = form.querySelector('input[type="password"]').value;
                
                // Get registered users from storage
                const registeredUsers = JSON.parse(localStorage.getItem('register_responses') || '[]');
                
                // First check if email exists at all
                const userEmailExists = registeredUsers.some(user => {
                    const userEmail = user.email || user.Email;
                    return userEmail === email;
                });
                
                // Then check if credentials match
                const userExists = registeredUsers.some(user => {
                    const userEmail = user.email || user.Email;
                    const userPassword = user.password || user.Password;
                    return userEmail === email && userPassword === password;
                });
                
                // Add login status to formData
                formData.status = userExists ? 'Success' : 'Failed';
                
                // Save the login attempt regardless of success/failure
                saveToLocalStorage(storageKey, formData);

                if (!userEmailExists) {
                    // User not registered at all
                    showNotification(form, 'User not registered. Please register first.', 'error');
                    
                    // After 2 seconds, redirect to register page
                    setTimeout(() => {
                        window.location.href = 'register.html';
                    }, 2000);
                    return;
                } else if (!userExists) {
                    // User registered but wrong password
                    showNotification(form, 'Invalid password. Please try again.', 'error');
                    return;
                } else {
                    // Successful login
                    showNotification(form, 'Login successful! Redirecting to homepage...', 'success');
                    updateUserUI(email);
                    
                    // Close modal if present
                    const modal = form.closest('.modal');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                    
                    // Redirect to index.html after 1.5 seconds
                    //setTimeout(() => {
                        //window.location.href = 'index.html';
                    //}, 1500);
                }
            }
            // For contact form and any other regular form
            else {
                saveToLocalStorage(storageKey, formData);
                showNotification(form, 'Your message has been sent successfully!', 'success');
            }
            
            form.reset();
        });
        form.setAttribute('data-submit-attached', 'true');
    }
}

/**
 * Shows a temporary notification message after form submission
 * @param {HTMLElement} form - The form element
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success' or 'error')
 */
function showNotification(form, message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    // Set color based on notification type
    const bgColor = type === 'success' ? '#27ae60' : '#e74c3c';
    
    notification.style.cssText = `
        background: ${bgColor};
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
        margin-top: 10px;
        text-align: center;
    `;
    
    form.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            if (notification.parentNode === form) {
                form.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

/**
 * Validates all required fields in a form
 * @param {HTMLElement} form - Form to validate
 * @returns {boolean} - Whether form is valid
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            // Highlight invalid field
            input.style.borderColor = '#e74c3c';
            
            // Find or create validation message
            let validationMsg = input.nextElementSibling;
            if (!validationMsg || !validationMsg.classList.contains('validation-message')) {
                validationMsg = document.createElement('span');
                validationMsg.className = 'validation-message';
                input.parentNode.insertBefore(validationMsg, input.nextSibling);
            }
            validationMsg.textContent = 'This field is required';
            validationMsg.style.display = 'block';
        }
    });
    
    return isValid;
}

/**
 * Saves form data to localStorage
 * @param {string} key - Storage key
 * @param {object} data - Data to store
 */
function saveToLocalStorage(key, data) {
    // Get existing data or initialize empty array
    const existingData = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Add new data
    existingData.push(data);
    
    // Save back to localStorage
    localStorage.setItem(key, JSON.stringify(existingData));
}

/**
 * Displays stored responses in a table
 * @param {HTMLElement} container - Where to display the table
 * @param {string} storageKey - Key to retrieve data from localStorage
 */
function displayStoredResponses(container, storageKey) {
    const responses = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (responses.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No responses submitted yet</p>';
        return;
    }
    
    // Get all unique fields across all responses (except timestamp)
    const allFields = new Set();
    responses.forEach(response => {
        Object.keys(response).forEach(key => {
            if (key !== 'timestamp') allFields.add(key);
        });
    });
    
    // Format field names for display (capitalize, remove underscores)
    const formatFieldName = (field) => {
        return field
            .split(/[_-]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    
    // Create table HTML
    let tableHTML = `
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
        <thead>
            <tr style="background: #2c3e50; color: white;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Timestamp</th>
                ${Array.from(allFields).map(field => 
                    `<th style="padding: 10px; text-align: left; border: 1px solid #ddd;">${formatFieldName(field)}</th>`
                ).join('')}
            </tr>
        </thead>
        <tbody>
    `;
    
    // Add rows for each response
    responses.forEach((response, index) => {
        const rowStyle = index % 2 === 0 ? 'background: #f9f9f9;' : '';
        
        tableHTML += `
        <tr style="${rowStyle}">
            <td style="padding: 10px; border: 1px solid #ddd;">${response.timestamp}</td>
            ${Array.from(allFields).map(field => 
                `<td style="padding: 10px; border: 1px solid #ddd;">${response[field] || '-'}</td>`
            ).join('')}
        </tr>
        `;
    });
    
    tableHTML += `
        </tbody>
    </table>
    `;
    
    // Add clear button
    tableHTML += `
    <div style="text-align: right; margin-top: 15px;">
        <button class="clear-data-btn" style="padding: 8px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Clear All Data
        </button>
    </div>
    `;
    
    // Update container and add event listener for clear button
    container.innerHTML = tableHTML;
    
    // Add event listener for clear button
    const clearBtn = container.querySelector('.clear-data-btn');
    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all stored responses?')) {
            localStorage.removeItem(storageKey);
            displayStoredResponses(container, storageKey);
        }
    });
}

/**
 * Shows a temporary notification message after form submission
 * @param {HTMLElement} form - The form element
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success' or 'error')
 */
function showNotification(form, message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    // Set color based on notification type
    const bgColor = type === 'success' ? '#27ae60' : '#e74c3c';
    
    notification.style.cssText = `
        background: ${bgColor};
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
        margin-top: 10px;
        text-align: center;
    `;
    
    form.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            if (notification.parentNode === form) {
                form.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// =========================================
// Event Handling Implementation
// Sets up various event listeners
// =========================================
const setupEventHandlers = () => {
    // Alert on logo click
    document.querySelector('.logo').addEventListener('click', () => {
        alert('Welcome to Natural Stone Hub!');
    });

    // Confirm before form submission
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!confirm('Are you sure you want to submit this form?')) {
                e.preventDefault();
            }
        });
    });

    // Hover effect on product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
};

// =========================================
// Initialize all features
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    createDynamicMenu();
    setupFormValidation();
    setupLocalStorage();
    setupEventHandlers();
    addPasswordToggle();
});