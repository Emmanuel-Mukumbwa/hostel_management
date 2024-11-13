import React, { useState } from 'react';

const Payment1 = () => {
    const [registration, setRegistration] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const createOrder = async () => {
        setLoading(true);
        setResponseMessage('');

        const orderData = {
            token: '0fd501ea702625d8e4145ca4db70052e', // Replace with your actual token
            registration: registration,
            amount: amount,
        };

        try {
            const res = await fetch('http://localhost:3001/proxy/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await res.json();
            if (res.ok) {
                setResponseMessage(`Order created successfully: ${JSON.stringify(result)}`);
            } else {
                setResponseMessage(`Order creation failed: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            setResponseMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Airtel Money Payment</h2>
            <input
                type="text"
                placeholder="Registration Number"
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={createOrder} disabled={loading}>
                {loading ? 'Creating Order...' : 'Create Order'}
            </button>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default Payment1;
