const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'payment_gateway'
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL Database.");
});

// API to handle payment data
app.post('/api/payment', (req, res) => {
    const { cardName, cardNumber, expiryDate, cvv, walletType, bankSelect } = req.body;
    
    const paymentMethod = walletType ? 'wallet' : bankSelect ? 'netbanking' : 'card';
    const query = `INSERT INTO payments (method, card_name, card_number, expiry_date, cvv, wallet_type, bank_select) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [paymentMethod, cardName, cardNumber, expiryDate, cvv, walletType, bankSelect], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Payment could not be processed" });
        } else {
            res.json({ success: true, message: "Payment recorded successfully" });
        }
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
