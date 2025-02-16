const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const express = require("express");
const port = 3000;
const limit = 5000000000;

if (cluster.isMaster) {
    console.log(`Number of CPUs: ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const app = express();
    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    app.get("/api/:n", function (req, res) {
        let n = parseInt(req.params.n);
        let count = 0;
        if (n > limit) n = limit;

        for (let i = 0; i <= n; i++) {
            count += i;
        }
        res.send(`Final count is ${count}`);
    });

    app.listen(port, () => {
        console.log(`Worker ${process.pid} running on port ${port}`);
    });
}