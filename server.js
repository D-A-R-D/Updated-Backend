const express = require('express');
const connectionDb = require("./database/db");
const app = express();
const path = require('path');
var bodyParser = require('body-parser');
const cors= require('cors');


const PORT = process.env.PORT || 5000;

//Template engine
const corsFunc={
    origin:process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsFunc));

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');

connectionDb();

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api/files', require("./routes/files"));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'))
app.listen(PORT, () => {
    console.log("Listening on port ", PORT);
})