import React, { Component } from 'react';
// import {useCallback} from 'react';
// import Web3 from 'web3'
import './App.css';
// import MemoryToken from '../abis/MemoryToken.json'
import { BrowserRouter as Router, Switch, Routes,Route, Link } from 'react-router-dom';
import Model from './Model';
import Game from './Game';

// import App from './App';
// import {useNavigate} from 'react-router-dom';
// import {withRouter} from 'react-router-dom'




class App extends Component {



render() {


return (
  <div>
      <Router>
           <div className="App">
            <ul className="App-header" id="list">
              
              <li>
                <Link to="/model">Blockchain Model</Link>
              </li>

              <li>
                <Link to="/game">Blockchain Game</Link>
              </li>
            </ul>
           <Routes>
                 <Route exact path='/model' element={< Model />}></Route>
                 <Route exact path='/game' element={< Game />}></Route>

          </Routes>
          </div>
       </Router>
  </div>
);
}
}

export default App;
