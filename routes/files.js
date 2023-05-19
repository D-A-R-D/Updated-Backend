const router = require("express").Router();
const multer = require("multer");
const File = require("../models/file");
const sendMail = require('../services/emailService');
const {
    v4: uuidv4
} = require('uuid');
const path = require("path");

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: function(req, file, cb) {
        const uniqueName = `${Date.now() + '-' + Math.round(Math.random() * 1E9)}` +
            `${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage,
    limit: {
        fileSize: 1000000 * 100
    }

}).single('myfile');

// router.get("/ping", (req, res) => {
//     res.status(200).json({
//         success: true
//     })

// })
router.post('/', (req, res) => {
    ///store file
    upload(req, res, async(err) => {
        //validate request
      console.log(req.file);
        if (!req.file) {
            return res.status(404).json({
                error: "No file attached"
            })
        }
        if (err) {
            return res.status(500).json({
                error: err.message
            })
        }
        //store to database
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        })


        //Response ->link
        const response = await file.save();
        return res.json({
            'link': `${process.env.APP_BASE_URL}/files/${response.uuid}`
        });
    })




})
router.post('/send', async(req, res) => {
    // console.log(req.body);
    const {
        uuid,
        emailTo,
        emailFrom
    } = req.body;
    console.log(req.body);

    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).json({
            error: "Provide all the fields"
        })
    }
    const file = await File.findOne({
        uuid: uuid
    });
    if (file.sender) {
        return res.status(422).json({
            error: "Email already sent"
        })
    }
    file.sender = emailFrom;
    file.recipient = emailTo;
    const response = await file.save();
    //send email

    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: "Joyshare --Share love",
        text: `${emailFrom} to ${emailTo}`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size / 1000) + "KB",
            expires: '24 Hour'
        })
    })
})

module.exports = router;