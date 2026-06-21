/* ==========================================
   VIJAYADURGA AQUAFOODS
   script.js
========================================== */

const CART_KEY = "va-cart";
const LOCATION_KEY = "va-location";

// Hyderabad delivery area configuration
const HYDERABAD_CENTER = { latitude: 17.3645, longitude: 78.4867 };
const DELIVERY_RADIUS_KM = 30; // Delivery radius in kilometers

const CATEGORIES = [
    {
        id: 'fresh-fish',
        label: 'Fresh Fish',
        description: 'Top-quality fish delivered every day, fresh from trusted suppliers.'
    },
    {
        id: 'prawns',
        label: 'Prawns',
        description: 'Premium prawns packed with flavor and texture for every recipe.'
    },
    {
        id: 'crabs',
        label: 'Crabs',
        description: 'Delicious crabs for a flavorful seafood feast.'
    }
];

const PRODUCTS = [
    {
        id: 'p1',
        category: 'prawns',
        name: 'Tiger Prawns',
        price: 699,
        image: 'assets/images/product1.jpg'
    },
    {
        id: 'p2',
        category: 'fresh-fish',
        name: 'Fresh Rohu',
        price: 349,
        image: 'assets/images/product2.jpg'
    },
    {
        id: 'p3',
        category: 'crabs',
        name: 'Sea Crab',
        price: 899,
        image: 'assets/images/product3.jpg'
    }
];

function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const countElements = document.querySelectorAll(".cart-count");
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countElements.forEach((el) => {
        el.textContent = totalItems;
    });
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
}

function getSavedLocation() {
    const saved = localStorage.getItem(LOCATION_KEY);
    return saved ? JSON.parse(saved) : null;
}

function saveLocation(location) {
    localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
}

function isWithinHyderabadDeliveryArea(latitude, longitude) {
    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (latitude - HYDERABAD_CENTER.latitude) * Math.PI / 180;
    const dLon = (longitude - HYDERABAD_CENTER.longitude) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(HYDERABAD_CENTER.latitude * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= DELIVERY_RADIUS_KM;
}

function isHyderabadAddress(address) {
    const hyderabadKeywords = ['hyderabad', 'hyd', 'secunderabad'];
    const lowerAddress = address.toLowerCase();
    return hyderabadKeywords.some(keyword => lowerAddress.includes(keyword));
}

const REGISTERED_USERS_KEY = 'registeredUsers';
const SIGNUP_PHONE_PREFILL_KEY = 'signupPhonePrefill';

function getRegisteredUsers() {
    const users = localStorage.getItem(REGISTERED_USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function saveRegisteredUsers(users) {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

function getUserByMobile(mobile) {
    if (!mobile) return null;
    const users = getRegisteredUsers();
    return users.find((user) => user.phone === mobile || user.mobile === mobile);
}

function addRegisteredUser(user) {
    if (!user || !user.phone) return;
    const users = getRegisteredUsers();
    const existingIndex = users.findIndex((stored) => stored.phone === user.phone || stored.mobile === user.phone);

    if (existingIndex !== -1) {
        users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
        users.push(user);
    }

    saveRegisteredUsers(users);
}

function displayLocation() {
    const messageEl = document.querySelector('#location-message');
    if (!messageEl) return;

    const savedLocation = getSavedLocation();
    if (!savedLocation) {
        messageEl.textContent = 'Tap the button to set your delivery location for faster checkout.';
        return;
    }

    if (savedLocation.address) {
        messageEl.textContent = `Delivery location saved: ${savedLocation.address}`;
        return;
    }

    messageEl.textContent = `Delivery location saved: ${savedLocation.latitude}, ${savedLocation.longitude} (±${savedLocation.accuracy}m)`;
}

function requestLocation() {
    const messageEl = document.querySelector('#location-message');
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        if (messageEl) messageEl.textContent = 'Geolocation is not supported in your browser.';
        return;
    }

    if (messageEl) messageEl.textContent = 'Checking location…';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            if (!isWithinHyderabadDeliveryArea(lat, lng)) {
                window.location.href = 'delivery-not-available.html';
                return;
            }
            
            const location = {
                latitude: lat.toFixed(5),
                longitude: lng.toFixed(5),
                accuracy: Math.round(position.coords.accuracy),
            };
            saveLocation(location);
            displayLocation();
            alert('Location detected and saved successfully.');
        },
        (error) => {
            let message = 'Unable to detect location. Please enter your address manually.';
            if (error.code === error.PERMISSION_DENIED) {
                message = 'Location permission denied. Please enter your address manually.';
            }
            alert(message);
            if (messageEl) messageEl.textContent = message;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        }
    );
}

function initializeLocationFeature() {
    const detectButton = document.querySelector('#detect-location-btn');
    const saveButton = document.querySelector('#save-location-btn');
    const manualInput = document.querySelector('#manual-location-input');

    displayLocation();

    if (detectButton) {
        detectButton.addEventListener('click', requestLocation);
    }

    if (saveButton && manualInput) {
        saveButton.addEventListener('click', () => {
            const address = manualInput.value.trim();
            if (!address) {
                alert('Please enter your city or address before saving.');
                return;
            }
            if (!isHyderabadAddress(address)) {
                window.location.href = 'delivery-not-available.html';
                return;
            }
            saveLocation({ address });
            displayLocation();
            manualInput.value = '';
            alert('Delivery location saved successfully.');
        });
    }
}

function renderProductCards(products) {
    return products
        .map(
            (product) => `
                <div class="category-product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <span>★★★★★</span>
                    <h4>₹${product.price} / kg</h4>
                    <button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add To Cart</button>
                </div>
            `
        )
        .join("");
}

function initializeCartButtons() {
    const buttons = document.querySelectorAll(".add-to-cart-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: Number(button.dataset.price),
                image: button.dataset.image,
            };
            addToCart(product);
            alert(`${product.name} has been added to your cart.`);
        });
    });
}

function renderCartPage() {
    const cartContainer = document.querySelector(".cart-container");
    if (!cartContainer) return;
    const cart = getCart();
    if (!cart.length) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add items to your cart and they will appear here.</p>
                <a class="primary-btn" href="index.html">Continue Shopping</a>
            </div>
        `;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    let itemsHtml = "";
    cart.forEach((item) => {
        itemsHtml += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Price: ₹${item.price} / kg</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Item total: ₹${item.price * item.quantity}</p>
                    <div class="cart-item-actions">
                        <button class="cart-remove-btn" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });

    cartContainer.innerHTML = `
        <div class="cart-items">${itemsHtml}</div>
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <p><span>Subtotal</span><strong>₹${subtotal}</strong></p>
            <p><span>Estimated Tax</span><strong>₹${tax}</strong></p>
            <p><span>Total</span><strong>₹${total}</strong></p>
            <button class="primary-btn">Proceed to Checkout</button>
        </div>
    `;

    const removeButtons = document.querySelectorAll(".cart-remove-btn");
    removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const newCart = cart.filter((item) => item.id !== id);
            saveCart(newCart);
            renderCartPage();
        });
    });
}

function renderCategoryPage() {
    const categoryContent = document.querySelector('.category-page-content');
    const categorySidebar = document.querySelector('.category-sidebar');
    if (!categoryContent || !categorySidebar) return;

    const params = new URLSearchParams(window.location.search);
    const selectedId = params.get('category') || 'fresh-fish';
    const selectedCategory = CATEGORIES.find((category) => category.id === selectedId) || CATEGORIES[0];
    const categoryProducts = PRODUCTS.filter((product) => product.category === selectedCategory.id);

    categorySidebar.innerHTML = `
        <h3>All Categories</h3>
        ${CATEGORIES
            .map(
                (category) => `
                    <a href="category.html?category=${category.id}" class="${category.id === selectedCategory.id ? 'active' : ''}">
                        ${category.label}
                    </a>
                `
            )
            .join('')}
    `;

    categoryContent.innerHTML = `
        <div class="category-page-header">
            <h2>${selectedCategory.label}</h2>
            <p>${selectedCategory.description}</p>
        </div>
        <div class="category-products">
            ${renderProductCards(categoryProducts)}
        </div>
    `;

    initializeCartButtons();
}

function renderSearchPage() {
    const searchSection = document.querySelector('.search-page');
    if (!searchSection) return;

    const searchInput = document.querySelector('.search-input');
    const resultsContainer = document.querySelector('.search-results');
    if (!searchInput || !resultsContainer) return;

    function updateResults() {
        const query = searchInput.value.trim().toLowerCase();
        const filtered = query
            ? PRODUCTS.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
            )
            : PRODUCTS;

        if (!filtered.length) {
            resultsContainer.innerHTML = `
                <div class="empty-cart">
                    <h3>No products match your search.</h3>
                    <p>Try another keyword, like fish, prawns, or crabs.</p>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = `
            <div class="search-results-grid">
                ${renderProductCards(filtered)}
            </div>
        `;

        initializeCartButtons();
    }

    searchInput.addEventListener('input', updateResults);
    updateResults();
}

document.addEventListener("DOMContentLoaded", () => {

    initializeNavbar();

    initializeRevealAnimation();

    initializeSmoothScroll();

    initializeProductCards();

    initializeNewsletter();

    initializeScrollTop();

    initializeHeroParallax();

    initializeCartButtons();

    updateCartCount();

    initializeLocationFeature();

    renderCartPage();

    renderCategoryPage();

    renderSearchPage();

    checkUserLoginStatus();

});

/* ==========================================
User Login Status
========================================== */

function checkUserLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');

    if (isLoggedIn === 'true' && currentUser) {
        const user = JSON.parse(currentUser);
        
        if (loginBtn) {
            loginBtn.textContent = `👤 ${user.name || 'Account'}`;
            loginBtn.href = 'account.html';
            loginBtn.style.color = '#00a8d8';
            loginBtn.style.fontWeight = '600';
        }
        
        if (signupBtn) {
            signupBtn.style.display = 'none';
        }
    }
}

/* ==========================================
Navbar
========================================== */

function initializeNavbar() {

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 60) {

            navbar.style.background = "rgba(255,255,255,.95)";
            navbar.style.boxShadow = "0 15px 40px rgba(0,0,0,.12)";
            navbar.style.marginTop = "10px";

        } else {

            navbar.style.background = "rgba(255,255,255,.75)";
            navbar.style.boxShadow = "0 8px 30px rgba(0,0,0,.08)";
            navbar.style.marginTop = "20px";

        }

    });

}

/* ==========================================
Reveal Animation
========================================== */

function initializeRevealAnimation() {

    const elements = document.querySelectorAll(
        ".category-card,.product-card,.feature,.section-title,.hero-left,.hero-right"
    );

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform = "translateY(0px)";

                }

            });

        },

        {

            threshold: .2

        }

    );

    elements.forEach((element) => {

        element.style.opacity = "0";

        element.style.transform = "translateY(50px)";

        element.style.transition = "all .8s ease";

        observer.observe(element);

    });

}

/* ==========================================
Smooth Scroll
========================================== */

function initializeSmoothScroll() {

    const links = document.querySelectorAll("a[href^='#']");

    links.forEach((link) => {

        link.addEventListener("click", (e) => {

            e.preventDefault();

            const target = document.querySelector(link.getAttribute("href"));

            if (target) {

                target.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    });

}

/* ==========================================
Product Card Hover
========================================== */

function initializeProductCards() {

    const cards = document.querySelectorAll(".product-card");

    cards.forEach((card) => {

        card.addEventListener("mousemove", (e) => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;

            const y = e.clientY - rect.top;

            const rotateY = ((x / rect.width) - .5) * 10;

            const rotateX = ((y / rect.height) - .5) * -10;

            card.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-8px)`;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";

        });

    });

}

/* ==========================================
Newsletter
========================================== */

function initializeNewsletter() {

    const button = document.querySelector(".newsletter button");

    const input = document.querySelector(".newsletter input");

    if (!button) return;

    button.addEventListener("click", () => {

        const email = input.value.trim();

        const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;

        if (!pattern.test(email)) {

            alert("Please enter a valid email address.");

            return;

        }

        alert("Thank you for subscribing!");

        input.value = "";

    });

}

/* ==========================================
Scroll Top Button
========================================== */

function initializeScrollTop() {

    const button = document.createElement("button");

    button.innerHTML = "↑";

    button.className = "scrollTop";

    document.body.appendChild(button);

    button.style.position = "fixed";

    button.style.right = "30px";

    button.style.bottom = "30px";

    button.style.width = "55px";

    button.style.height = "55px";

    button.style.borderRadius = "50%";

    button.style.background = "#005B99";

    button.style.color = "#fff";

    button.style.fontSize = "22px";

    button.style.border = "none";

    button.style.cursor = "pointer";

    button.style.display = "none";

    button.style.zIndex = "999";

    button.style.boxShadow = "0 10px 30px rgba(0,0,0,.2)";

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            button.style.display = "block";

        } else {

            button.style.display = "none";

        }

    });

    button.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/* ==========================================
Hero Parallax
========================================== */

function initializeHeroParallax() {

    const heroImage = document.querySelector(".hero-right img");

    if (!heroImage) return;

    window.addEventListener("mousemove", (e) => {

        const x = (window.innerWidth / 2 - e.clientX) / 40;

        const y = (window.innerHeight / 2 - e.clientY) / 40;

        heroImage.style.transform =
            `translate(${x}px, ${y}px)`;

    });

}

/* ==========================================
Loading Animation
========================================== */

window.addEventListener("load", () => {

    document.body.style.opacity = "0";

    setTimeout(() => {

        document.body.style.transition = ".7s";

        document.body.style.opacity = "1";

    }, 100);

});

function initializeOTPLogin() {
    const signupForm = document.querySelector('#signup-form');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullname = document.querySelector('#fullname').value.trim();
        const email = document.querySelector('#email').value.trim();
        const phone = document.querySelector('#phone').value.trim();
        const password = document.querySelector('#password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;
        const termsCheck = document.querySelector('#terms-check').checked;

        // Validation
        if (!fullname || !email || !phone || !password) {
            alert('Please fill all fields');
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (!termsCheck) {
            alert('Please agree to the Terms & Conditions');
            return;
        }

        // Store signup data in localStorage registered users
        const signupData = {
            name: fullname,
            fullname,
            email,
            phone,
            password,
            createdAt: new Date().toISOString()
        };

        try {
            addRegisteredUser(signupData);
            alert('Account created successfully! Please login with your phone number.');
            window.location.href = 'login.html';
        } catch (error) {
            alert('Error creating account: ' + error.message);
        }
    });
}

/* ==========================================
Google Authentication
========================================== */

function initializeGoogleAuth() {
    const googleLoginBtn = document.querySelector('#google-login-btn');
    const googleSignupBtn = document.querySelector('#google-signup-btn');

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleGoogleAuth('login');
        });
    }

    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleGoogleAuth('signup');
        });
    }
}

function handleGoogleAuth(action) {
    // Simulated Google OAuth flow
    // In production, this would use Firebase Google Auth
    
    const mockGoogleUser = {
        name: 'Google User',
        email: 'user@gmail.com',
        mobile: '9876543210',
        provider: 'google'
    };

    // Show a prompt for mobile number (required for our system)
    const mobile = prompt('Enter your 10-digit mobile number:');
    
    if (!mobile) {
        alert('Mobile number is required');
        return;
    }

    if (!/^\d{10}$/.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }

    // Create user session
    const userData = {
        name: mockGoogleUser.name,
        email: mockGoogleUser.email,
        mobile: mobile,
        provider: 'google',
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('userMobile', mobile);

    if (action === 'signup') {
        // Store signup data as well
        const signupData = {
            fullname: mockGoogleUser.name,
            email: mockGoogleUser.email,
            phone: mobile,
            provider: 'google',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('pendingSignup', JSON.stringify(signupData));
    }

    addRegisteredUser({
        name: mockGoogleUser.name,
        email: mockGoogleUser.email,
        phone: mobile,
        provider: 'google',
        createdAt: new Date().toISOString()
    });

    alert(`Welcome ${mockGoogleUser.name}! Redirecting to home...`);
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}

function initializeSignupPrefill() {
    const phoneInput = document.querySelector('#phone');
    const signupPhone = localStorage.getItem(SIGNUP_PHONE_PREFILL_KEY);

    if (phoneInput && signupPhone) {
        phoneInput.value = signupPhone;
        localStorage.removeItem(SIGNUP_PHONE_PREFILL_KEY);
    }
}

/* ==========================================
OTP Login System
========================================== */

function initializeSignupForm() {

    const sendOtpBtn = document.querySelector('#send-otp-btn');
    const resendOtpBtn = document.querySelector('#resend-otp-btn');
    const loginBtn = document.querySelector('#login-btn');
    const mobileStep = document.querySelector('#mobile-step');
    const otpStep = document.querySelector('#otp-step');
    const mobileInput = document.querySelector('#mobile');
    const otpInput = document.querySelector('#otp');
    const timerSpan = document.querySelector('#timer');

    if (!sendOtpBtn) return;

    let otpTimer = null;
    let currentOtp = null;

    function startTimer() {
        let timeLeft = 60;
        timerSpan.textContent = timeLeft;
        resendOtpBtn.disabled = true;

        otpTimer = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = timeLeft;

            if (timeLeft === 0) {
                clearInterval(otpTimer);
                resendOtpBtn.disabled = false;
            }
        }, 1000);
    }

    function validateMobile(mobile) {
        return /^\d{10}$/.test(mobile);
    }

    sendOtpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const mobile = mobileInput.value.trim();

        if (!validateMobile(mobile)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        // Simulate OTP generation
        currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for testing: ${currentOtp}`);

        // Show OTP step
        mobileStep.style.display = 'none';
        otpStep.style.display = 'block';
        loginBtn.style.display = 'block';

        alert(`OTP sent to ${mobile}\n\nFor testing, OTP is: ${currentOtp}`);

        startTimer();
    });

    resendOtpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const mobile = mobileInput.value.trim();

        currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`New OTP for testing: ${currentOtp}`);

        alert(`OTP resent to ${mobile}\n\nFor testing, OTP is: ${currentOtp}`);

        otpInput.value = '';
        startTimer();
    });

    document.querySelector('#login-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const enteredOtp = otpInput.value.trim();

        if (!enteredOtp || enteredOtp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            return;
        }

        if (enteredOtp === currentOtp) {
            const userMobile = mobileInput.value;
            const existingUser = getUserByMobile(userMobile);

            if (!existingUser) {
                localStorage.setItem(SIGNUP_PHONE_PREFILL_KEY, userMobile);
                alert('Mobile number not registered yet. Redirecting to signup...');
                window.location.href = 'signup.html';
                return;
            }

            alert('Login successful! Redirecting...');
            localStorage.setItem('userMobile', userMobile);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loginTime', new Date().toISOString());

            localStorage.setItem('currentUser', JSON.stringify({
                name: existingUser.name || existingUser.fullname || 'User',
                email: existingUser.email || '',
                mobile: userMobile,
                loginTime: new Date().toISOString()
            }));

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            alert('Invalid OTP. Please try again.');
            otpInput.value = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeOTPLogin();
    initializeSignupPrefill();
    initializeSignupForm();
    initializeGoogleAuth();
});