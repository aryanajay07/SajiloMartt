// CallbackHandler.jsx

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { handlePaymentCallback } from '../redux/api/paymentSlice'; // Adjust path as per your project structure

const CallbackHandler = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        const handleCallback = async () => {
            // Assuming Khalti sends callback data as JSON and you handle it here
            const callbackData = await fetch('/api/payment/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // Send necessary data to validate and process the callback
                }),
            });

            const result = await callbackData.json();
            // Handle the result as per your application's logic (update UI, database, etc.)
            dispatch(handlePaymentCallback(result));
            history.push('/payment/complete'); // Redirect to payment completion page
        };

        handleCallback();
    }, [dispatch, history]);

    return (
        <div>
            <p>Processing payment...</p>
        </div>
    );
};

export default CallbackHandler;
