const db = ()=>{
    // Db connection

    const mongoose = require('mongoose');

    const url = process.env.SECRET

    new mongoose.connect(url)
    .then(()=> console.log('DB connection successfully'))
    .catch((e)=> console.log('something went wrong'))

}


module.exports = db;