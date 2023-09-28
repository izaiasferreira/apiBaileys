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

const ddisArray = [
    { country: 'Estados UnphoneNumberos', code: '1' },
    { country: 'Canadá', code: '1' },
    { country: 'Reino UnphoneNumbero', code: '44' },
    { country: 'Austrália', code: '61' },
    { country: 'Índia', code: '91' },
    { country: 'França', code: '33' },
    { country: 'Alemanha', code: '49' },
    { country: 'Brasil', code: '55' },
    { country: 'Japão', code: '81' },
    { country: 'Itália', code: '39' },
    { country: 'Espanha', code: '34' },
    { country: 'México', code: '52' },
    { country: 'Canadá', code: '1' },
    { country: 'Rússia', code: '7' },
    { country: 'China', code: '86' },
    { country: 'Argentina', code: '54' },
    { country: 'Chile', code: '56' },
    { country: 'Colômbia', code: '57' },
    { country: 'Peru', code: '51' },
    { country: 'Venezuela', code: '58' }
    // Adicione mais países e códigos DDI conforme necessário
];

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
        var a = new Baileys('Baileys API', '001')
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
    var verify = formatPhoneNumber(data.phoneNumber, ddisArray)
    if (globalVars.instances && data?.text && verify) {
        var response = await globalVars.instances.sendMessageText(verify, data.text)
        res.status(200).json(response)
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageImage', async (req, res) => {
    var data = req.body
    var verify = formatPhoneNumber(data.phoneNumber, ddisArray)
    if (globalVars.instances && verify && data?.text && data?.url) {
        var response = await globalVars.instances.sendMessageImage(verify, data.text, data.url)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageSticker', async (req, res) => {
    var data = req.body
    var verify = formatPhoneNumber(data.phoneNumber, ddisArray)
    if (globalVars.instances && verify && data?.url) {
        var response = await globalVars.instances.sendMessageSticker(verify, data.url)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageAudio', async (req, res) => {
    var data = req.body
    var verify = formatPhoneNumber(data.phoneNumber, ddisArray)
    if (globalVars.instances && verify && data?.url && data?.isNew) {
        var response = await globalVars.instances.sendMessageAudio(verify, data.url, data.isNew)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageVphoneNumbereo', async (req, res) => {
    var data = req.body
    var verify = formatPhoneNumber(data.phoneNumber, ddisArray)
    if (globalVars.instances && verify && data?.text && data?.url && data?.isGif) {
        var response = await globalVars.instances.sendMessageVphoneNumbereo(verify, data.text, data.url, data.isGif)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});
app.post('/sendMessageDocument', async (req, res) => {
    var data = req.body
    var verify = formatPhoneNumber(data.phoneNumber, ddisArray)
    if (globalVars.instances && verify && data?.fileName && data?.url && data?.extension && data?.text && verify) {
        var response = await globalVars.instances.sendMessageDocument(verify, data.fileName, data.url, data.extension, data.text).catch(err => console.log(err))
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});


// app.post('/sendMessageResponseText', async (req, res) => {
//     var data = req.body
//     if (globalVars.instances && verify && data?.text && data?.msg) {
//         var response = await globalVars.instances.sendMessageResponseText(verify, data.text, data.msg)
//         res.status(200).json(response).end()
//     } else {
//         res.status(400).end()
//     }
// });
// app.post('/sendMessageResponseImage', async (req, res) => {
//     var data = req.body
//     if (globalVars.instances && verify && data?.url && data?.msg) {
//         var response = await globalVars.instances.sendMessageResponseImage(verify, data.text || null, data.url, data.msg)
//         res.status(200).json(response).end()
//     } else {
//         res.status(400).end()
//     }
// });
// app.post('/sendMessageResponseSticker', async (req, res) => {
//     var data = req.body
//     if (globalVars.instances && verify && data?.url && data?.msg) {
//         var response = await globalVars.instances.sendMessageResponseSticker(verify, data.url, data.msg)
//         res.status(200).json(response).end()
//     } else {
//         res.status(400).end()
//     }
// });
// app.post('/sendMessageResponseAudio', async (req, res) => {
//     var data = req.body
//     if (globalVars.instances && verify && data?.url && data?.msg && data?.isNew) {
//         var response = await globalVars.instances.sendMessageResponseAudio(verify, data.url, data.isNew || false, data.msg)
//         res.status(200).json(response).end()
//     } else {
//         res.status(400).end()
//     }
// });
// app.post('/sendMessageResponseVphoneNumbereo', async (req, res) => {
//     var data = req.body
//     if (globalVars.instances && verify && data?.url && data?.msg) {
//         var response = await globalVars.instances.sendMessageResponseVphoneNumbereo(verify, data.text || null, data.url, data.isGif || false, data.msg)
//         res.status(200).json(response).end()
//     } else {
//         res.status(400).end()
//     }
// });
// app.post('/sendMessageResponseDocument', async (req, res) => {
//     var data = req.body
//     if (globalVars.instances && verify && data?.fileName && data?.url && data?.extension && data?.msg) {
//         var response = await globalVars.instances.sendMessageDocument(verify, data.fileName, data.url, data.extension, data.text, data.msg)
//         res.status(200).json(response).end()
//     } else {
//         res.status(400).end()
//     }
// });

app.post('/deleteMessage', async (req, res) => {
    const { phoneNumber, msg, type } = req.body
    var verify = formatPhoneNumber(phoneNumber, ddisArray)
    if (globalVars.instances && msg && msg.msg && type && phoneNumber && verify) {
        var response = await globalVars.instances.deleteMessage(verify, msg.msg, type)
        res.status(200).json(response).end()
    } else {
        res.send(null).end()
    }
});

app.post('/verifyExistsNumber', async (req, res) => {
    const { phoneNumber } = req.body
    var verify = formatPhoneNumber(phoneNumber, ddisArray)
    if (globalVars.instances && phoneNumber && verify) {
        var status = await globalVars.instances.veriyExistsNumber(verify)
        res.status(200).json(status).end()
    } else {
        res.status(204).end()
    }
});

app.post('/getProfilePic', async (req, res) => {
    const { phoneNumber } = req.body
    if (globalVars.instances && phoneNumber) {
        var status = await globalVars?.instances[index]?.getProfilePic(phoneNumber)
        res.status(200).json(status).end()
    } else {
        res.status(204).end()
    }
});



httpServer.listen(port, () => {
    console.log(`ServphoneNumberor Rodando na porta ${port}`);
});


globalVars.io.on('connection', (socket) => {
    console.log('Socket Conectado');
})

function formatPhoneNumber(phoneNumber, ddis) {
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    const number = formattedNumber.slice(-8);
    const remainder = formattedNumber.slice(0, -8);
    const string = '@s.whatsapp.net';

    const ddi = remainder.slice(0, 2);
    const ddiTwo = remainder.slice(0, 1);
    const ddd = remainder.slice(2);

    const verifyOne = ddis.map((ddi) => ddi.code).includes(ddi);
    const verifyTwo = ddis.map((ddi) => ddi.code).includes(ddiTwo);

    if (remainder.length === 5 && (verifyOne || verifyTwo) && ddd.length <= 3 && ddd.length > 1) {
        return ddi + ddd + number + string;
    } else if (remainder.length === 4 && (verifyOne || verifyTwo) && ddd.length <= 3 && ddd.length > 1) {
        return ddi + ddd + number + string;
    } else if (remainder.length === 3 && verifyOne && ddd.length <= 3 && ddd.length > 1) {
        return ddi + ddd + number + string;
    }

    return false;
}