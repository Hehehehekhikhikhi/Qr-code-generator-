// QR Code Generator
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const qrContent = document.getElementById('qr-content');
    const qrSize = document.getElementById('qr-size');
    const qrColor = document.getElementById('qr-color');
    const qrBgColor = document.getElementById('qr-bg-color');
    const qrMargin = document.getElementById('qr-margin');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const qrCodeContainer = document.getElementById('qr-code-container');
    
    let qrCode = null;
    
    // Generate QR Code
    generateBtn.addEventListener('click', generateQRCode);
    
    // Generate QR Code function
    function generateQRCode() {
        const content = qrContent.value.trim();
        
        if (!content) {
            showNotification('Please enter content to generate QR code', 'error');
            return;
        }
        
        // Clear previous QR code
        if (qrCode) {
            qrCode.clear();
            qrCodeContainer.innerHTML = '';
        }
        
        // Create new QR code
        qrCode = new QRCode(qrCodeContainer, {
            text: content,
            width: parseInt(qrSize.value),
            height: parseInt(qrSize.value),
            colorDark: qrColor.value,
            colorLight: qrBgColor.value,
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Enable download button
        downloadBtn.disabled = false;
        
        // Add smooth appearance
        qrCodeContainer.style.opacity = '0';
        setTimeout(() => {
            qrCodeContainer.style.transition = 'opacity 0.5s';
            qrCodeContainer.style.opacity = '1';
        }, 100);
        
        showNotification('QR code generated successfully!', 'success');
    }
    
    // Download QR Code
    downloadBtn.addEventListener('click', downloadQRCode);
    
    function downloadQRCode() {
        if (!qrCode) {
            showNotification('Please generate a QR code first', 'error');
            return;
        }
        
        const canvas = qrCodeContainer.querySelector('canvas');
        if (!canvas) {
            showNotification('QR code not found', 'error');
            return;
        }
        
        // Create download link
        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showNotification('QR code downloaded successfully!', 'success');
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Notification function
    function showNotification(message, type) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        notification.style.transform = 'translateX(150%)';
        notification.style.transition = 'transform 0.3s ease';
        
        // Set background color based on type
        if (type === 'success') {
            notification.style.background = 'linear-gradient(90deg, #48bb78, #38a169)';
        } else {
            notification.style.background = 'linear-gradient(90deg, #f56565, #e53e3e)';
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Add subtle animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards for animation
    document.querySelectorAll('.glass-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(card);
    });
    
    // Add input validation
    qrContent.addEventListener('input', function() {
        if (this.value.trim().length > 0) {
            this.style.borderColor = '#48bb78';
        } else {
            this.style.borderColor = '';
        }
    });
    
    // Add keyboard shortcut (Ctrl+Enter to generate)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            generateQRCode();
        }
    });
    
    // Initialize with example content
    qrContent.value = 'https://example.com';
    generateQRCode();
});
