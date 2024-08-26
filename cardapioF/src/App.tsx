import { useState } from 'react';
import './App.css'
import pngLogin from './assets/pngegg.png'
import { Card } from './components/card/card'
import { useDadosComida } from './hooks/useDadosComida'
import { CreateModal } from './components/create-modal/create-modal';
import { Login } from './components/login/login';
import { Registro } from './components/register/register';

function App() {
  const {data} = useDadosComida();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);


  const handleOpenModal = () => {
    setIsModalOpen(prev => !prev)
  }

  const handleOpenLogin = () => {
    setIsLoginOpen(prev => !prev)
  }

  const handleOpenRegister = ()=>{
    setIsRegisterOpen(prev => !prev)
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginOpen(false)
  }

  const handleRegisterSuccess = () => {
    setIsRegisterOpen(false); 
    handleOpenLogin(); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cozinheiroId');
    localStorage.removeItem('eCozinheiro');
    setIsLoggedIn(false);
  };

  const eCozinheiro = localStorage.getItem('eCozinheiro') === 'true';

  return (
    <div className='container'>
      <div className='header'>
        <h1 id='uaifood'>UAIfood</h1>
        <div className='lc-button'>
          {!isLoggedIn ? (
            <>
              {isLoginOpen && <Login closeModal={handleOpenLogin} onLoginSuccess={handleLoginSuccess} />}
              <button onClick={handleOpenLogin}>Login</button>
              {isRegisterOpen && <Registro closeModal={handleOpenRegister} onRegisterSuccess={handleRegisterSuccess}/>}
              <button onClick={handleOpenRegister}>Cadastrar</button>
            </>
          ): (
            <>
            <img id="pngLogin" src={pngLogin}/>
            <button onClick={handleLogout}> Sair </button>  
            </>
          )}
        </div>
      </div>
      <div className='card-grid'>
        {data?.map(dadoComida => 
          <Card
            nome={dadoComida.nome}
            imagem={dadoComida.imagem}
            preco={dadoComida.preco}
          />
        )}
      </div>
      {isModalOpen && <CreateModal closeModal={handleOpenModal} />}
      {isLoggedIn && eCozinheiro && (  
        <button className='botao-adicionar' onClick={handleOpenModal}> + </button>
      )}
    </div>
  )
}

export default App
