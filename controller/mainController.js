const Express = require('express');


export const test = (req, res) => {
    res.status(201).json({
        success: true
    })
}