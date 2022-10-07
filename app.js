const express = require('express');
const cors  = require('cors');
const app = express();

const connectDB = require('./db/connect');
require('dotenv').config();
const uri = process.env.MONGO_URI;

const eventRouter = require('./routes/events');
const authRouter = require('./routes/auth');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.json());
app.use(cors());

app.use('/api/v1', authRouter);
app.use('/api/v1', eventRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5005;

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