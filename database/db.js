const mongoose = require("mongoose");
require("dotenv").config();

function ConnectDb() {
    //Database Connection
    mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true,
        // useFindAndModify: true
    });

    const connection = mongoose.connection;

    connection.once('open', () => {
        console.log("Database connected");
    }).on('error', (err) => {
        console.log(err);
    })
}
module.exports = ConnectDb;