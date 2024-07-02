import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const VerifyPayment = () => {
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const amount = queryParams.get('amount');

        const verifyPayment = async () => {
            const response = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, amount })
            });

            const data = await response.json();
            if (data.idx) {
                alert('Payment successful');
            } else {
                alert('Payment verification failed');
            }
        };

        if (token && amount) {
            verifyPayment();
        }
    }, [location.search]);

    return (
        <div>
            <h1>Verifying Payment...</h1>
        </div>
    );
};

export default VerifyPayment;
