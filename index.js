const express = require("express");
const app = express();
const cors = require('cors')
const rateLimit = require("express-rate-limit");

const userRouter = require("./routes/userRoutes");
const goalRouter = require("./routes/goalRoutes");
const taskRouter = require("./routes/taskRoutes");

app.use(cors());
app.use(express.json());

//Limit request from the same IP
const limiter=rateLimit({
    max:100,
    windowMs:60*60*100,
    message:'Too many request from this IP. Please try again in an hour'
})

app.use('/api', limiter)

app.get("/", (req, res) => {
  return res.send(`Welcome to Goals tracker...`);
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/goals", goalRouter);
app.use("/api/v1/tasks", taskRouter);

module.exports = app;
