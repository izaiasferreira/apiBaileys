const connectDatabase = require('./connection')
const db = require('./functions')

connectDatabase("mongodb://localhost:27017")

db.updateSession({ companyId: "6286d7c276bb611387730e10" }, { statusConnection: true })