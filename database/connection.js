const mongoose = require('mongoose')
function connectDatabase(url, companyName) {
    mongoose.set("strictQuery", false);
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: companyName.replace(/\s/g, '') + '-sessions'
    })

    const db = mongoose.connection;
    db.on('error', (err) => { console.log(err); })
    db.once('open', () => { console.log("Conectado ao banco!!"); })
}

module.exports = connectDatabase
