const express = require('express');
const router = express.Router();
const Khalti = require('khalti-node');
require('dotenv').config();

const khalti = new Khalti({
    publicKey: process.env.KHALTI_PUBLIC_KEY,
    secretKey: process.env.KHALTI_SECRET_KEY,
});

router.post('/initiate', async (req, res) => {
    try {
        // Process request to initiate payment, get pidx and payment_url
        const { amount, orderId } = req.body; // Adjust based on your data

        const response = await khalti.webCheckout({
            amount,
            productIdentity: orderId,
            productName: 'Order Payment', // Replace with actual product name
            productUrl: `https://localhost:5173/order/${orderId}`, // Replace with actual product URL
        });

        res.json({
            pidx: response.pidx,
            payment_url: response.payment_url,
        });
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ error: 'Error initiating payment' });
    }
});

router.post('/callback', async (req, res) => {
    try {
        // Handle callback from Khalti
        const { token } = req.body; // Adjust based on Khalti's callback data
        const verificationData = await khalti.verifyPayment(token);

        res.json({ message: 'Payment callback received and processed' });
    } catch (error) {
        console.error('Error processing payment callback:', error);
        res.status(500).json({ error: 'Error processing payment callback' });
    }
});
app.put('/api/orders/:orderId/pay', async (req, res) => {
    const { orderId } = req.params;
    const paymentDetails = req.body;

    try {
        if (!paymentDetails || !paymentDetails.idx) {
            return res.status(400).json({ error: 'Invalid payment details' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: paymentDetails.idx,
            status: paymentDetails.status,
            update_time: paymentDetails.update_time,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
