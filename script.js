//pro item //
// Get all the product elements
const products = document.querySelectorAll('.pro');

// Add event listener to each product
products.forEach(product => {
    product.addEventListener('click', function() {
        // Get data from the clicked product
        const productName = product.getAttribute('data-name');
        const productBrand = product.getAttribute('data-brand');
        const productPrice = product.getAttribute('data-price');
        const productImg = product.getAttribute('data-img');
        
        // Update the main product details section
        document.querySelector('.single-pro-image img').src = productImg;
        document.querySelector('.single-pro-details h4').textContent = productName;
        document.querySelector('.single-pro-details h2').textContent = `${productPrice}`;
        document.querySelector('.single-pro-details h6').textContent = `Home / ${productBrand}`;
    });
});

// Function to remove item
function removeItem(element) {
    const row = element.closest('tr');
    row.remove();
    updateCartTotal();
}

// Function to update subtotal when quantity changes
function updateSubtotal(element) {
    const row = element.closest('tr');
    const price = parseFloat(row.querySelector('.price').innerText.replace(/,/g, ''));
    const quantity = element.value;
    const subtotal = price * quantity;
    row.querySelector('.subtotal').innerText = subtotal.toLocaleString(); // Update the subtotal field
    updateCartTotal();
}

// Function to update total cart amount
function updateCartTotal() {
    const cartRows = document.querySelectorAll('#cartItems tr');
    let total = 0;
    cartRows.forEach(row => {
        const subtotal = parseFloat(row.querySelector('.subtotal').innerText.replace(/,/g, ''));
        total += subtotal;
    });
    document.getElementById('cartSubtotal').innerText = total.toLocaleString();
    document.getElementById('totalAmount').innerText = total.toLocaleString();
}

// Display coupon options
function showCoupons() {
    document.getElementById('couponList').style.display = 'block';
}

// Select coupon and close the list
function selectCoupon(couponCode) {
    document.getElementById('couponInput').value = couponCode;
    document.getElementById('couponList').style.display = 'none';
}

// Apply selected coupon
function applyCoupon() {
    const couponCode = document.getElementById('couponInput').value;
    let discount = 0;
    const subtotal = parseFloat(document.getElementById('cartSubtotal').innerText.replace(/,/g, ''));
    
    if (couponCode === 'SAVE10' && subtotal > 100000) {
        discount = subtotal * 0.1;
    } else if (couponCode === 'DISCOUNT20' && subtotal > 200000) {
        discount = 20000;
    } else if (couponCode === 'FREESHIP' && subtotal > 50000) {
        // No discount, just free shipping, so leave as is
        discount = 0;
    }

    document.getElementById('discountAmount').innerText = discount.toLocaleString();
    document.getElementById('totalAmount').innerText = (subtotal - discount).toLocaleString();
}

// Proceed to payment function
function openModal() {
    alert("Proceeding to Payment");
}
//coupon//
function applyCoupon() {
    const couponCode = document.getElementById('couponInput').value;
    const subtotal = parseFloat(document.getElementById('cartSubtotal').innerText.replace(/,/g, ''));
    
    let discount = 0;
    let validCoupon = true;

    if (couponCode === 'SAVE10' && subtotal > 100000) {
        discount = subtotal * 0.1;
    } else if (couponCode === 'DISCOUNT20' && subtotal > 200000) {
        discount = 20000;
    } else if (couponCode === 'FREESHIP' && subtotal > 50000) {
        discount = 0;
    } else {
        validCoupon = false;
        alert('Invalid or inapplicable coupon!');
    }

    if (validCoupon) {
        document.getElementById('discountAmount').innerText = discount.toLocaleString();
        document.getElementById('totalAmount').innerText = (subtotal - discount).toLocaleString();
    }
}
//remove item//
function removeItem(element) {
    if (confirm('Are you sure you want to remove this item?')) {
        const row = element.closest('tr');
        row.remove();
        updateCartTotal();
    }
    function openModal() {
        alert("Proceeding to payment.");
    }
}
// payment model//
let selectedPaymentMethod = 'card'; // Default to card payment

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Hide all payment sections
    document.querySelectorAll('.payment-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected payment section
    if (method === 'card') {
        document.getElementById('cardPayment').style.display = 'block';
    } else if (method === 'wallet') {
        document.getElementById('walletPayment').style.display = 'block';
    } else if (method === 'netbanking') {
        document.getElementById('netbankingPayment').style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function openModal() {
    document.getElementById('paymentModal').style.display = 'block';
}

document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    if (selectedPaymentMethod === 'card') {
        processCardPayment();
    } else if (selectedPaymentMethod === 'wallet') {
        // Handle wallet payment logic here
        notifySuccess();
    } else if (selectedPaymentMethod === 'netbanking') {
        // Handle net banking logic here
        notifySuccess();
    }
});

function processCardPayment() {
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    // Use Stripe.js to handle card payments
    // This example assumes you've already set up your backend to create a payment intent
    fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardName, cardNumber, expiryDate, cvv })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            notifySuccess();
        } else {
            alert('Payment failed: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function notifySuccess() {
    document.getElementById('paymentModal').style.display = 'none';
    document.getElementById('paymentSuccess').style.display = 'block';
}

function closeNotification() {
    document.getElementById('paymentSuccess').style.display = 'none';
}


//remove item from local stroage//
function removeItem(element) {
    const row = element.parentElement.parentElement; // Get the parent row
    const productName = row.cells[2].innerText; // Get product name
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove the item from the cart
    cart = cart.filter(item => item.name !== productName);

    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Reload the cart to reflect changes
    loadCart();
}
