const { urlencoded } = require('body-parser');
const express = require('express');
const cluster = require('cluster');
const os = require('os');
const app = express();
const dotenv = require('dotenv');
const Cors = require('cors');
const CookieParser = require('cookie-parser');
const ConnectDatabase = require('./config/database');
const Router = require('./routes/routes');

// Configuration
dotenv.config();
const Port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(Cors());

// Routes
app.get('/', (req, res) => {
    res.send(`Hello I Am AirBnb Server ${process.pid}`);
});

app.use('/api/v1', Router);

// Database Connection
ConnectDatabase();

// Use cluster if not in a worker
if (cluster.isMaster) {
    // Fork workers equal to the number of CPU cores
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }

    // Log when a worker exits and fork a new one
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    // Start the server in each worker
    app.listen(Port, () => {
        console.log(`Worker ${process.pid} is running on port ${Port}`);
    });
}
