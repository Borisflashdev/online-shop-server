const express = require('express');
const cors  = require('cors');
const app = express();

const connectDB = require('./db/connect');
require('dotenv').config();
const uri = process.env.MONGO_URI;

const eventRouter = require('./routes/events');
const notFoundMiddleware = require('./middleware/not-found');

// middleware
app.use(express.static('./public'));
app.use(express.json());
app.use(cors());

app.use('/api/v1', eventRouter);

app.use(notFoundMiddleware);

const port = 5005;

const start = async () => {
    try {
        await connectDB(uri);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();