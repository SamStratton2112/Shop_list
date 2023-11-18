const express = require("express");
const app = express();
const itemRoutes = require('./items');
const ExpressError = require('./error');
const morgan = require('morgan');
const items = require('./fakeDb');

app.use(express.json());
app.use(morgan('dev'))
app.use("/items", itemRoutes);

// handle 404
app.use(function(req,res,next){
    return new ExpressError("Not Found", 404);
});

// handle all errors
app.use((err,req,res,next)=>{
    res.status(err.status||500)
    return res.json({
        error: err.message
    })
})

module.exports = app;