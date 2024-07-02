import React from 'react';

const Payment = () => {
    const handlePayment = async () => {
        const response = await fetch('/api/initiate-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: 1000, // Amount in NPR
                productIdentity: '123456',
                productName: 'Product Name',
                returnUrl: 'http://localhost:5000/verify-payment',
                vendorPublicKey: 'VENDOR_PUBLIC_KEY'
            })
        });

        const data = await response.json();
        if (data.payment_url) {
            window.location.href = data.payment_url;
        } else {
            alert('Payment initiation failed');
        }
    };

    return (
        <div>
            <button onClick={handlePayment}>Pay with Khalti</button>
        </div>
    );
};

export default Payment;
