const File=require("./models/file");
const connectionDb = require("./database/db");
const fs= require('fs');
const path = require("path");
connectionDb();
async function fetchData(){
    const pastDate= new Date(Date.now()-24*60*60*1000);
    const files =File.findOne({
        "uuid":"1850eead-b697-4508-93af-f6a538efcbbf"
    })
    // if(files.length){
    //     for(const file of files){
    //         try{
    //             console.log(file.filename);
    //         fs.unlinkSync(file.path);
    //         await file.remove();
    //         console.log(`file deleted succesfully ${file.filename}`);
    //         }
    //         catch (err){
    //             console.log(`${err}`);
    //         }
    //     }
    // }
    console.log(files.paths.path);
    // fs.unlinkSync(file.path);
    // await file.remove();

}
fetchData();