// PaymentComponent.jsx

import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initiatePayment } from '../redux/api/paymentSlice'; // Adjust path as per your project structure

const PaymentComponent = () => {
    const dispatch = useDispatch();
    const { pidx, payment_url } = useSelector((state) => state.payment); // Redux state where you store pidx and payment_url

    const history = useHistory();

    useEffect(() => {
        dispatch(initiatePayment()); // Action to initiate payment, fetch pidx and payment_url
    }, [dispatch]);

    useEffect(() => {
        if (payment_url) {
            window.location.replace(payment_url); // Redirect user to Khalti payment page
        }
    }, [payment_url]);

    return (
        <div>
            <p>Redirecting to Khalti payment page...</p>
        </div>
    );
};

export default PaymentComponent;
