require('dotenv').config();
const makeWASocket = require('@whiskeysockets/baileys').default
const { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = require('@whiskeysockets/baileys')
const { checkPath } = require('../utils/check.js')
const path = require('path');
const P = require('pino')
const fs = require('fs')

const globalVars = require('../globalVars.js');

class Baileys {
    constructor(name, id) {
        this._name = name
        this._id = id
        this._locationFileAuth = './sessionsWA/'
        this._nameFileAuth = name + "-" + id
        this._statusConnection = null
        this._sock = null
        this._phoneNumber = null
        this._countQRCode = 0
        this._countReconnect = 0
    }

    async connectOnWhatsapp() {
        const { version } = await fetchLatestBaileysVersion()
        checkPath(this._locationFileAuth)
        const { state, saveCreds } = await useMultiFileAuthState(this._locationFileAuth + this._nameFileAuth)
        const config = {
            browser: Browsers.appropriate('GPT'),
            syncFullHistory: false,
            printQRInTerminal: false,
            connectTimeoutMs: 60_000,
            auth: state,
            logger: P({ level: 'error' }),
            version,
            async getMessage() {
                return { conversation: 'oi' };
            }
        }
        this._sock = makeWASocket(config)
        config.browser[0] = this._name + '(by @izaias.sferreira)'
        this.connectionUpdate(this._sock.ev)
        this._sock.ev.on('creds.update', saveCreds)
    }

    connectionUpdate(sock) {
        sock.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
            if (qr) {
                if (this._countQRCode === 5) {
                    this._sock.ev.removeAllListeners()
                    this.end(true)
                    this._countQRCode = 0
                    this._statusConnection = false
                    globalVars.io.emit('statusConnection', 'disconnected')
                } else {
                    this._statusConnection = qr
                    this._countQRCode++
                    globalVars.io.emit('statusConnection', qr)
                }
            }

            if (connection === 'close') {
                const shouldRecnnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
                if (shouldRecnnect) {
                    if (lastDisconnect.error?.output?.statusCode === 401 && this._countReconnect > 3) {
                        this.end()
                        this.connectOnWhatsapp()
                        globalVars.io.emit('statusConnection', 'disconnected')
                        this._statusConnection = 'disconnected'
                    } else if ((lastDisconnect.error?.output?.statusCode === 410 || lastDisconnect.error?.output?.statusCode === 408) && this._countReconnect > 3) {
                        this.end()
                        this.connectOnWhatsapp()
                        this._statusConnection = 'disconnected'
                    } else {
                        this.connectOnWhatsapp()
                        this._countReconnect++
                    }

                }

                if (shouldRecnnect === false) {
                    if (this._countReconnect > 3) {
                        this.end()
                    } else {
                        this.connectOnWhatsapp()
                        this._countReconnect++
                    }

                }
            }

            if (connection === 'open') {
                this._phoneNumber = this._sock.user.id.substring(0, 12)
                console.log('O NÚMERO ', this._phoneNumber, ' FOI CONECTADO AO WHATSAPP')
                this._countQRCode = 0
                this._statusConnection = 'connected'
                globalVars.io.emit('statusConnection', 'connected')
            }
        })
    }


    async end(logout) {
        if (this._sock && this._locationFileAuth && this._nameFileAuth) {
            this._countQRCode = 0
            this._sock.ev.removeAllListeners('connection.update')
            if (logout) { this._sock.logout() }
            this._sock.end()
            this._sock.ev.removeAllListeners('connection.update')
            deleteFolderRecursive(this._locationFileAuth + this._nameFileAuth)
            globalVars.instances = null
            globalVars.io.emit('statusConnection', 'disconnected')
        }
    }
    async getProfilePic(jid) {
        return await this._sock.profilePictureUrl(jid, 'image')
    }

    //--------------------------------------------------------
    async sendMessageText(id, message) {
        if (this._sock) {
            var response = await this._sock.sendMessage(id, { text: message }).catch((err) => console.log(err))
            return response
        }

    }

    async sendMessageImage(id, text, url) {
        if (this._sock) {
            var response = await this._sock.sendMessage(id, {
                caption: text || null,
                image: {
                    url: url,
                }
            }).catch((err) => console.log(err))
            return response
        }
    }

    async sendMessageAudio(id, url, isNew) {
        if (this._sock) {
            var response = await this._sock.sendMessage(
                id,
                { audio: { url: url }, mimetype: 'audio/mp4', ptt: isNew || false },
                { url: url }, // can send mp3, mp4, & ogg
            )
            return response
        }
    }

    async sendMessageVideo(id, text, url, isGif) {
        if (this._sock) {
            var response = await this._sock.sendMessage(id, {
                caption: text || null,
                video: {
                    url: url,
                },
                mimetype: 'video/mp4',
                gifPlayback: isGif || false
            }).catch((err) => console.log(err))
            return response
        }
    }

    async sendMessageDocument(id, fileName, url, extension, text) {
        if (this._sock) {
            var response = await this._sock.sendMessage(id, {
                caption: text,
                fileName: fileName || "document." + extension,
                mimetype: 'application/' + extension,
                document: {
                    url: url
                }
            }).catch((err) => console.log(err))
            return response
        }
    }

    async sendMessageButtons(id, buttons, title, description, footer) {
        if (this._sock) {
            var count = 0
            var buttonsToSend = buttons.map(buttom => {
                count++
                return {
                    index: count - 1,
                    quickReplyButton: { id: buttom.id, displayText: buttom.text }
                }
            })
            const templateButtons = {
                text: `*${title || '_'}*\n\n${description || ''}`,
                footer: footer,
                templateButtons: buttonsToSend
            }
            var response = await this._sock.sendMessage(id, templateButtons).catch((err) => console.log(err))
            return response
        }
    }

    async sendMessageLink(id, message) {
        if (this._sock) {
            var response = await this._sock.sendMessage(id, { text: message })
            return response
        }
    }

    async deleteMessage(jid, msg, type) {
        const { key, fromMe, messageTimestamp } = msg
        if (this._sock) {
            var response = null
            if (type) {
                response = await this._sock.sendMessage(jid, { delete: key })
            }
            if (!type) {
                response = await this._sock.chatModify({ clear: { messages: [{ id: key.id, fromMe: fromMe, timestamp: messageTimestamp }] } }, jid, [])

            }
            return response
        }
    }

    async sendMessageResponseText(jid, text, msg) {
        if (this._sock) {
            var response = await this._sock.sendMessage(jid, { text: text }, { quoted: msg })
            return response
        }
    }

    async sendMessageResponseImage(id, text, url, msg) {
        if (this._sock) {
            var response = await this._sock.sendMessage(id, {
                caption: text || null,
                image: {
                    url: url,
                }
            }, { quoted: msg }).catch((err) => console.log(err))
            return response
        }
    }

    async sendMessageResponseAudio(id, url, isNew, msg) {
        if (this._sock) {
            var response = await this._sock.sendMessage(
                id,
                { audio: { url: url }, mimetype: 'audio/mp4', ptt: isNew || false },
                { url: url }, // can send mp3, mp4, & ogg
                { quoted: msg })
            return response
        }
    }

    async sendMessageResponseVideo(id, text, url, isGif, msg) {
        if (this._sock) {
            var response = await this._sock.sendMessage(id, {
                caption: text || null,
                video: {
                    url: url,
                },
                mimetype: 'video/mp4',
                gifPlayback: isGif || false
            }, { quoted: msg }).catch((err) => console.log(err))
            return response
        }
    }

    async sendMessageResponseDocument(id, fileName, url, extension, text, msg) {
        if (this._sock && url && msg) {
            var response = await this._sock.sendMessage(id, {
                caption: text || null,
                fileName: fileName || `document.${extension}`,
                mimetype: 'application/' + extension,
                document: {
                    url: url
                }
            }, { quoted: msg }).catch((err) => console.log(err))
            return response
        }
    }

    async veriyExistsNumber(jid) {
        if (jid && this._sock) {
            const value = await this._sock.onWhatsApp(jid);
            return value[0]
        }
    }
}

module.exports = Baileys;


function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // Recursivamente, chama a função para excluir subpastas
                deleteFolderRecursive(curPath);
            } else {
                // Exclui o arquivo
                fs.unlinkSync(curPath);
            }
        });
        // Exclui a pasta vazia
        fs.rmdirSync(folderPath);
        console.log(`Pasta ${folderPath} excluída com sucesso.`);
    } else {
        console.log(`A pasta ${folderPath} não existe.`);
    }
}