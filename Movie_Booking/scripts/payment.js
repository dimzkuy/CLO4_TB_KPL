// Ambil data pesanan dari localStorage
const film = localStorage.getItem("filmDipilih") || "Film";
const kursi = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
const poster = localStorage.getItem("selectedFilmImage") || "";
const jamTayang = localStorage.getItem("selectedShowTime") || "19:00 WIB";
const hargaPerKursi = 45000;
const totalHarga = kursi.length * hargaPerKursi;

// Initialize page when DOM loaded
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("filmTitle").textContent = film;
    document.getElementById("seats").textContent = kursi.join(", ");
    document.getElementById("filmPoster").src = poster;
    document.getElementById("filmPoster").alt = film;
    document.getElementById("showTime").textContent = jamTayang;
    document.getElementById("totalPrice").textContent = "Rp " + totalHarga.toLocaleString("id-ID");
    document.getElementById("amount").value = totalHarga;
});

// Payment methods configuration
const paymentMethods = [
    {
        id: "credit-card",
        icon: '<img src="../img/Credit Card.png" alt="Credit Card" class="w-8 h-8 mb-2">',
        label: "Credit Card"
    },
    {
        id: "paypal",
        icon: '<img src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/paypal.svg" alt="PayPal" class="w-8 h-8 mb-2">',
        label: "PayPal"
    },
    {
        id: "mobile-wallet",
        icon: '<img src="../img/Mobile Wallet.png" alt="Mobile Wallet" class="w-8 h-8 mb-2">',
        label: "Mobile Wallet"
    },
    {
        id: "bank-transfer",
        icon: '<img src="../img/Bank Tranfer.png" alt="Bank Transfer" class="w-8 h-8 mb-2">',
        label: "Bank Transfer"
    }
];

// Global variables
let selectedPayment = null;
const container = document.getElementById("paymentOptions");

// Render payment methods
paymentMethods.forEach((method) => {
    const div = document.createElement("div");
    div.className = "payment-card flex flex-col items-center p-4 cursor-pointer";
    div.innerHTML = `
        ${method.icon}
        <span class="font-medium">${method.label}</span>
    `;
    div.onclick = () => selectPaymentMethod(method.id, div);
    container.appendChild(div);
});

// Select payment method function
function selectPaymentMethod(id, element) {
    selectedPayment = id;
    console.log('Payment method selected:', id); // Debug log
    document.querySelectorAll(".payment-card")
        .forEach((el) => el.classList.remove("active"));
    element.classList.add("active");
}

// ✅ TAMBAHKAN: Fallback notification function
function showFallbackNotification(message, type = 'info') {
    console.log(`Showing ${type} notification:`, message); // Debug log
    
    // Jika NotificationSystem tidak tersedia, gunakan alert
    if (typeof NotificationSystem === 'undefined') {
        console.warn('NotificationSystem not available, using alert');
        alert(message);
        return;
    }
    
    // Gunakan NotificationSystem jika tersedia
    try {
        switch(type) {
            case 'warning':
                NotificationSystem.showWarning(message);
                break;
            case 'error':
                NotificationSystem.showError(message);
                break;
            case 'success':
                NotificationSystem.showSuccess(message);
                break;
            default:
                NotificationSystem.showInfo(message);
        }
    } catch (error) {
        console.error('NotificationSystem error:', error);
        alert(message); // Fallback to alert
    }
}

// Payment button event listener
document.getElementById("payBtn").addEventListener("click", () => {
    console.log('Payment button clicked');
    console.log('Selected payment:', selectedPayment);
    
    // Validation dengan fallback notification
    if (!selectedPayment) {
        showFallbackNotification("Pilih metode pembayaran terlebih dahulu!", 'warning');
        return;
    }
    
    const amount = document.getElementById("amount").value;
    console.log('Amount:', amount);
    
    if (!amount || amount <= 0) {
        showFallbackNotification("Masukkan jumlah pembayaran yang valid!", 'error');
        return;
    }

    console.log('Processing payment...');
    // Process payment using Strategy Pattern
    PaymentStrategy.process(selectedPayment, amount, film);
});

// Strategy Pattern untuk payment processing
const PaymentStrategy = {
    strategies: {
        "credit-card": (amount, film) => {
            showPaymentProcessingNotification(
                `Memproses pembayaran Rp${parseInt(amount).toLocaleString("id-ID")} untuk film "${film}" melalui Credit Card`,
                "credit-card"
            );
        },
        
        "paypal": (amount, film) => {
            showPaymentProcessingNotification(
                `Memproses pembayaran Rp${parseInt(amount).toLocaleString("id-ID")} untuk film "${film}" melalui PayPal`,
                "paypal"
            );
        },
        
        "mobile-wallet": (amount, film) => {
            showPaymentProcessingNotification(
                `Memproses pembayaran Rp${parseInt(amount).toLocaleString("id-ID")} untuk film "${film}" melalui Mobile Wallet`,
                "mobile-wallet"
            );
        },
        
        "bank-transfer": (amount, film) => {
            showPaymentProcessingNotification(
                `Memproses pembayaran Rp${parseInt(amount).toLocaleString("id-ID")} untuk film "${film}" melalui Bank Transfer`,
                "bank-transfer"
            );
        }
    },
    
    process: function(methodId, amount, film) {
        console.log('PaymentStrategy.process called with:', { methodId, amount, film });
        
        if (this.strategies[methodId]) {
            this.strategies[methodId](amount, film);
        } else {
            console.error('Payment method not found:', methodId);
            showFallbackNotification("Metode pembayaran tidak tersedia.", 'error');
        }
    }
};

// Custom payment processing notification
function showPaymentProcessingNotification(message, paymentMethod) {
    console.log('Showing payment processing notification:', { message, paymentMethod });
    
    // Remove existing notification
    const existingNotification = document.querySelector('.payment-processing-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create custom payment notification
    const notification = document.createElement('div');
    notification.className = 'payment-processing-notification';
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #3a0f91 0%, #2d328e 100%);
        color: white;
        padding: 25px 30px;
        border-radius: 16px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        z-index: 10001;
        font-weight: 500;
        font-size: 16px;
        animation: paymentModalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        min-width: 350px;
        max-width: 500px;
        border: 2px solid rgba(255, 193, 7, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    // Payment method icons
    const paymentIcons = {
        'credit-card': '💳',
        'paypal': '💱',
        'mobile-wallet': '📱',
        'bank-transfer': '🏦'
    };
    
    const icon = paymentIcons[paymentMethod] || '💰';
    
    // Notification content
    notification.innerHTML = `
        <div style="
            font-size: 48px;
            margin-bottom: 15px;
            animation: iconSpinPulse 2s ease-in-out infinite;
        ">${icon}</div>
        
        <div style="
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 10px;
            color: #ffc107;
        ">Memproses Pembayaran...</div>
        
        <div style="
            font-size: 14px;
            line-height: 1.5;
            opacity: 0.9;
            margin-bottom: 20px;
        ">${message}</div>
        
        <div style="
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            opacity: 0.8;
        ">
            <div class="loading-dots">
                <span style="animation: loadingDot 1.4s ease-in-out infinite both; animation-delay: 0s;">●</span>
                <span style="animation: loadingDot 1.4s ease-in-out infinite both; animation-delay: 0.2s;">●</span>
                <span style="animation: loadingDot 1.4s ease-in-out infinite both; animation-delay: 0.4s;">●</span>
            </div>
            <span>Mohon tunggu sebentar</span>
        </div>
    `;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(45, 20, 87, 0.8);
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes paymentModalSlideIn {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1) translateY(0);
            }
        }
        
        @keyframes iconSpinPulse {
            0%, 100% {
                transform: scale(1) rotate(0deg);
            }
            25% {
                transform: scale(1.1) rotate(90deg);
            }
            50% {
                transform: scale(1) rotate(180deg);
            }
            75% {
                transform: scale(1.1) rotate(270deg);
            }
        }
        
        @keyframes loadingDot {
            0%, 80%, 100% {
                opacity: 0.3;
                transform: scale(0.8);
            }
            40% {
                opacity: 1;
                transform: scale(1.2);
            }
        }
        
        .loading-dots {
            display: flex;
            gap: 2px;
        }
    `;
    
    // Add elements to DOM
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    document.body.appendChild(notification);
    
    console.log('Payment processing notification displayed');
    
    // Auto-remove and redirect after 3 seconds
    setTimeout(() => {
        console.log('Cleaning up payment notification...');
        
        // Clean up elements
        if (overlay.parentNode) overlay.remove();
        if (notification.parentNode) notification.remove();
        if (style.parentNode) style.remove();
        
        console.log('Showing success notification...');
        
        // Show success notification with fallback
        try {
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.showSuccess("Pembayaran berhasil diproses!");
            } else {
                console.warn('NotificationSystem not available for success message');
            }
        } catch (error) {
            console.error('Error showing success notification:', error);
        }
        
        // Redirect to success page
        setTimeout(() => {
            console.log('Attempting redirect to paymentSuccess.html...');
            console.log('Current location:', window.location.href);
            
            try {
                // Simpan data pembayaran sebelum redirect
                const paymentData = {
                    film: film,
                    seats: kursi,
                    amount: totalHarga,
                    paymentMethod: selectedPayment,
                    timestamp: new Date().toISOString(),
                    status: 'completed'
                };
                localStorage.setItem('lastPayment', JSON.stringify(paymentData));
                console.log('Payment data saved:', paymentData);
                
                // Primary redirect method
                window.location.href = "paymentSuccess.html";
                
                // Fallback redirect methods
                setTimeout(() => {
                    if (window.location.href.includes('payment.html')) {
                        console.log('Primary redirect failed, trying replace method...');
                        window.location.replace("paymentSuccess.html");
                    }
                }, 1000);
                
                setTimeout(() => {
                    if (window.location.href.includes('payment.html')) {
                        console.log('Replace method failed, trying assign method...');
                        window.location.assign("paymentSuccess.html");
                    }
                }, 2000);
                
                setTimeout(() => {
                    if (window.location.href.includes('payment.html')) {
                        console.error('All redirect methods failed');
                        alert('Pembayaran berhasil! Silakan klik OK untuk melanjutkan ke halaman sukses.');
                        window.open('paymentSuccess.html', '_self');
                    }
                }, 3000);
                
            } catch (error) {
                console.error('Redirect error:', error);
                alert('Pembayaran berhasil! Terjadi masalah saat redirect. Silakan refresh halaman.');
            }
        }, 1500);
    }, 3000);
}
