import './home.css'
import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import CentralArea from '../components/CentralArea'
import IconButton from '../components/IconButton'
import ButtonModel from '../components/ButtonModel'
import InputText from '../components/InputText'
import QRCodeComp from "react-qr-code";
import { Ring, Waveform } from '@uiball/loaders'
import axios from 'axios';
export default function Home() {
  const backUrl = new URL(window.location.href).origin /* `http://localhost:3001` */
  const socket = io(backUrl);
  const [connection, setConnection] = useState('disconnected')
  useEffect(() => {

    axios.get(`${backUrl}/statusConnection`).then(response => {
      if (response.data) {
        setConnection(response.data)
      }

    }).catch(error => {
      setConnection('disconnected')
    });

  }, []);

  socket?.on('disconnect', () => {
    window.location.reload()
  })
  socket?.on('statusConnection', (status) => {
    console.log(status);
    setConnection(status)
  })
  socket?.off('notification').on('notification', (message) => {
    if (message.erro) {
      alert(message.text)
    }
  })
  function connect() {
    axios.post(`${backUrl}/startConnection`)
  }
  function disconnect() {
    axios.post(`${backUrl}/disconnect`)
  }
  function stateConnection(status) {
    if (status === 'connected') {
      return <Connected />
    } else if (!status || status === 'disconnected') {
      return <Disconnected />
    } else {
      return <QRcode qr={status} />
    }

  }

  function buttonState(status) {
    if (status === 'connected') {
      return 'Desconectar'
    } else if (!status || status === 'disconnected') {
      return 'Conectar'
    } else {
      return <Waveform
        size={30}
        lineWeight={5}
        speed={2}
        color="white"
      />
    }

  }
  return (
    <div className='home-container'>
      <div className="buttons-nav" style={{ position: 'absolute' }}>
      </div>
      <CentralArea>

        <div className="header">

        </div>

        <div className="body">
          <div className="form">
          </div>
          <div className="status">
            {connection ? stateConnection(connection) : null}
          </div>
          <ButtonModel disabled={connection !== 'connected' || connection !== 'disconnected' ? false : true} onClick={() => {
            if (connection !== 'connected') {
              connect()
            } else {
              disconnect()
            }

          }}>{connection ? buttonState(connection) : 'Conectar'}</ButtonModel>
        </div>
      </CentralArea >
    </div >
  )


}

function Connected() {
  return (
    <div className="connected-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem' }}>
      <h1 style={{ color: 'var(--tree-color)' }}>Conectado</h1>
      <lord-icon
        src="https://cdn.lordicon.com/tqywkdcz.json"
        trigger="loop"
        delay="2000"
        colors="primary:#16c79e,secondary:#3080e8,tertiary:#0a5c49,quaternary:#66ee78"
        style={{ width: '250px', height: '250px' }}>
      </lord-icon>
    </div>
  )
}

function Disconnected() {
  return (
    <div className="connected-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem' }}>
      <h1 style={{ color: 'var(--danger-color)' }}>Desconectado</h1>
      <lord-icon
        src="https://cdn.lordicon.com/wwneckwc.json"
        trigger="loop"
        delay="2000"
        colors="primary:#911710,secondary:#e83a30"
        style={{ width: '250px', height: '250px' }}>
      </lord-icon>
    </div>
  )
}

function QRcode({ qr }) {
  if (qr) {
    return (
      <div className='qrcode-container'>
        <div className='qrcode-content'>
          <span className='title'> <strong>Como se conectar:</strong></span>
          <span className='text-steps'>1 - Abra o Whatsapp {'>'} Configurações {'>'} Aparelhos Conectados; <br />
            2 - Clique em Conectar dispositivo; <br />
            3 - Leia o QRCode abaixo.
          </span>
          <div className="qrcode-image">
            <span className='logo-qrcode'> <img src="./img/simbol-outline.png" alt="" /></span>
            <QRCodeComp value={qr.padEnd(220)} bgColor='#FFFFFF' fgColor='#000000' />
          </div>
          <span className='text-min'></span>
          <span className='text-min'>Caso a conexão não seja bem sucedida, tente de 3 a 5 vezes uma nova reconexão antes de <a href="https://wa.me/5586995726999"> entrar em contato com o suporte.</a></span>
        </div>
      </div>
    )
  }
  if (!qr) {
    return (
      <div className='qrcode-container'>
        <div className='qrcode-content'>
          <div className="qr-code-default">
            <span><Ring
              size={60}
              lineWeight={5}
              speed={2}
              color="blue"
            /></span>
          </div>
        </div>
      </div>
    )
  }
}