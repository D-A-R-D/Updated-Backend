const File=require("./models/file");
const connectionDb = require("./database/db");
const fs= require('fs');
const path = require("path");
connectionDb();
async function CronFunc(){
    const pastDate= new Date(Date.now()-24*60*60*1000);
    const files =await File.find({
        createdAt:{$lt:pastDate}
    });
    if(files.length){
        for(const file of files){
            try{
            console.log(file.filename);
            fs.unlinkSync(file.path);
            await file.remove();
            console.log(`file deleted succesfully ${file.filename}`);
            }
            catch (err){
                console.log(`${err}`);
            }
        }
        console.log("clicking");
    }
    
}
// fetchData().then(()=>{
//     console.log(`file deleted successfully`);
//     process.exit();
// })
module .exports=CronFunc;