require('dotenv').config();
const express = require('express');
const cors = require('cors');
var logger = require('morgan');
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const Baileys = require('./class/InstanceBaileys')
const globalVars = require('./globalVars')
const path = require('path')
const publicDirectoryPath = path.join(__dirname, './public')
const port = 3000

globalVars.io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

app.use(cors())
app.use(express.json())
app.use(logger('dev'));
app.use(express.static(publicDirectoryPath))
app.use(express.static('public'))
app.use(express.static('files'))


app.get('/', async (req, res) => {
    return res.render('./public/index.html', { data: response.data });
});

app.get('/instances', (req, res) => {
    res.status(200).json(globalVars.instances)
});
app.get('/statusConnection', (req, res) => {
    if (globalVars.instances) {
        res.status(200).json(globalVars?.instances._statusConnection)
    } else {
        res.status(400).end()
    }
});

app.post('/startConnection', async (req, res) => {
    if (!globalVars.instances) {
        var a = new Baileys('Minha API', '001')
        globalVars.instances = a
        globalVars.instances.connectOnWhatsapp()
        res.status(200).end()
    } else {
        res.status(400).end()
    }
});

app.post('/disconnect', async (req, res) => {
    await globalVars?.instances?.end(true)
    res.status(200).end()
});

app.post('/sendMessageText', async (req, res) => {
    var data = req.body

    if (globalVars.instances && data?.text && data?.id) {
        var response = await globalVars.instances.sendMessageText(data.id, data.text)
        res.status(200).json(response)
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageImage', async (req, res) => {
    var data = req.body
    if (globalVars.instances && data?.id && data?.text && data?.url) {
        var response = await globalVars.instances.sendMessageImage(data.id, data.text, data.url)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageSticker', async (req, res) => {
    var data = req.body
    if (globalVars.instances && data?.id && data?.url) {
        var response = await globalVars.instances.sendMessageSticker(data.id, data.url)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageAudio', async (req, res) => {

    var data = req.body


    if (globalVars.instances && data?.id && data?.url && data?.isNew) {
        var response = await globalVars.instances.sendMessageAudio(data.id, data.url, data.isNew)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageVideo', async (req, res) => {

    var data = req.body
    if (globalVars.instances && data?.id && data?.text && data?.url && data?.isGif) {
        var response = await globalVars.instances.sendMessageVideo(data.id, data.text, data.url, data.isGif)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageDocument', async (req, res) => {

    var data = req.body
    if (globalVars.instances && data?.id && data?.fileName && data?.url && data?.extension && data?.text) {
        var response = await globalVars.instances.sendMessageDocument(data.id, data.fileName, data.url, data.extension, data.text).catch(err => console.log(err))
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});


app.post('/sendMessageResponseText', async (req, res) => {
    var data = req.body
    if (globalVars.instances && data?.id && data?.text && data?.msg) {
        var response = await globalVars.instances.sendMessageResponseText(data.id, data.text, data.msg)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageResponseImage', async (req, res) => {
    var data = req.body
    if (globalVars.instances && data?.id && data?.url && data?.msg) {
        var response = await globalVars.instances.sendMessageResponseImage(data.id, data.text || null, data.url, data.msg)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageResponseSticker', async (req, res) => {
    var data = req.body
    if (globalVars.instances && data?.id && data?.url && data?.msg) {
        var response = await globalVars.instances.sendMessageResponseSticker(data.id, data.url, data.msg)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageResponseAudio', async (req, res) => {
    var data = req.body
    if (globalVars.instances && data?.id && data?.url && data?.msg && data?.isNew) {
        var response = await globalVars.instances.sendMessageResponseAudio(data.id, data.url, data.isNew || false, data.msg)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageResponseVideo', async (req, res) => {
    var data = req.body
    if (globalVars.instances && data?.id && data?.url && data?.msg) {
        var response = await globalVars.instances.sendMessageResponseVideo(data.id, data.text || null, data.url, data.isGif || false, data.msg)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageResponseDocument', async (req, res) => {
    var data = req.body
    if (globalVars.instances && data?.id && data?.fileName && data?.url && data?.extension && data?.msg) {
        var response = await globalVars.instances.sendMessageDocument(data.id, data.fileName, data.url, data.extension, data.text, data.msg)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});

app.post('/deleteMessage', async (req, res) => {
    const { id, msg, type } = req.body
    if (globalVars.instances && msg && msg.msg && type && id) {
        var response = await globalVars.instances.deleteMessage(id, msg.msg, type)
        res.status(200).json(response).end()
    } else {
        res.send(null).end()
    }
});

app.post('/verifyExistsNumber', async (req, res) => {
    const { id } = req.body
    if (globalVars.instances && id) {
        var status = await globalVars.instances.veriyExistsNumber(id)
        res.status(200).json(status).end()
    } else {
        res.status(204).end()
    }
});

app.post('/getProfilePic', async (req, res) => {
    const { id } = req.body
    if (globalVars.instances && id) {
        var status = await globalVars?.instances[index]?.getProfilePic(id)
        res.status(200).json(status).end()
    } else {
        res.status(204).end()
    }
});



httpServer.listen(port, () => {
    console.log(`Servidor Rodando na porta ${port}`);
});


globalVars.io.on('connection', (socket) => {
    console.log('Socket Conectado');
})