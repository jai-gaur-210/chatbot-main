import './App.css';

import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import config from './config';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import { useState } from 'react';

import { Footer } from "./Components/Footer";


function App() {
  const [showComponent, setShowComponent] = useState(false);

  const handleClick = () => {
    setShowComponent(!showComponent);
  }
  return (
    <div className='home'>
      <button onClick={handleClick}>Chatbot</button>
      {showComponent && <div className='chatbot'>
        Kartik's chatbot
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      </div>}
      
    </div>
  );
}

export default App;
