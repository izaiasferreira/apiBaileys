
const Session = require("./schemas/Sessions")

//---------------------------------------------------------------

exports.createSession = async (obj) => {
    var session = await Session.create(obj)
    session.save()
    return session
}

exports.updateSession = async (filter, information) => {
    await Session.findOneAndUpdate(filter, information)
}

exports.getSession = async (filter) => {
    var session = await Session.find(filter)
    if (session.length > 0) {
        return session
    } else {
        return false
    }

}

exports.deleteSession = async (id) => {
    await Session.findOneAndDelete({id:id})
}

//------------------------------------------------------------------------






