import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import router from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors('*'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api-v1', router);

app.use('*', (req, res)=> {
    res.status(404).json({
        status: '404 Not found',
        message: 'Route not found',
    });    
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});