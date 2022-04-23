import React, { Component } from 'react';
import {useCallback} from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import { BrowserRouter as Router, Switch, Routes,Route, Link } from 'react-router-dom';
import Model from './Model';
// import App from './App';
// import {useNavigate} from 'react-router-dom';
import {withRouter} from 'react-router-dom'

const CARD_ARRAY = [

  {
    name: '1',
    img: '/images/1.png'
  }
]


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    this.state.msg = "Loading Web3 decentralized blockchain Ethereum ledger"
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    // this.state.msg = this.state.msg + "\n Loading blockchain data"
    this.setState({ msg: "\n Loading blockchain data" })


    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.state.msg = this.state.msg + "\n Get my account"

    // Load smart contract
    this.state.msg = this.state.msg + "\n Load smart contract"

    const networkId = await web3.eth.net.getId()
    const networkData = MemoryToken.networks[networkId]
    if (networkData) {
      const abi = MemoryToken.abi
      const address = networkData.address
      const token = new web3.eth.Contract(abi, address)
      this.setState({ token })
      const totalSupply = await token.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load Tokens
    this.state.msg = this.state.msg + "\n Load tokens"

      let balanceOf = await token.methods.balanceOf(accounts[0]).call()
      for (let i = 0; i < balanceOf; i++) {
        let id = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call()
        let tokenURI = await token.methods.tokenURI(id).call()
        this.setState({
          tokenURIs: [...this.state.tokenURIs, tokenURI]
        })
      }
    } else {
      alert('ERR: Smart contract not deployed to on this network')
    }
  }

  wrong(){
    window.alert('Oops! Try again')
    
  }

  correct= async (cardId) => {


    this.state.token.methods.mint(
    this.state.account,
    window.location.origin + CARD_ARRAY[cardId].img.toString()
    )
    .send({ from: this.state.account })
    .on('transactionHash', (hash) => {
      this.setState({
        showCards: [...this.state.showCards]
      })
    })
  
}
constructor(props) {

super(props)

this.state = {
  account: '0x0',
  token: null,
  totalSupply: 0,
  tokenURIs: [],
  cardArray: [],
  matchesFound: 0,
  tries: 0,
  showCards: [],
  hideCards: false,
  pickFromCards: [],
  msg: null
}
var shuffled = CARD_ARRAY.sort(() => 0.5 - Math.random()).slice(0, 5);
this.state.showCards = shuffled

}


render() {


return (
  <div>
    <nav className="navbar fixed-top flex-md-nowrap p-0 shadow">
      <ul className="navbar-nav px-9"></ul>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <small className="text-muted"><span id="account"><strong>Accound ID: </strong> {this.state.account}</span></small>
        </li>
      </ul>
    </nav>



    <div className="container-fluid mt-5">
      <div className="row">
        <div id="mainDiv">
      <nav className="navbar fixed-top flex-md-nowrap p-0 shadow">
      <ul className="navbar-nav px-9"></ul>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <small className="text-muted"><span id="account"><strong>Accound ID: </strong> {this.state.account}</span></small>
        </li>
      </ul>
    </nav>
    
      <h3 id="heading">Blockchain Incentive Model</h3>

      <div id="container">

      <div onClick={this.loadWeb3} id="no1"><a href="#">Load Data</a></div>
      <div id="line1"></div>
      <div onClick={(event) => {
                      
                      this.correct(0)
                      
                    }} id="no1"><a href="#">Verify Answer</a></div>
      <div id="line1"></div>
      <div onClick={this.wrong} id="no1"><a href="#">Correct/ Good Answer</a></div>
      <div id="line1"></div>
      <div id="no1"><a href="#">Incorrect/ Bad Answer</a></div>
      </div>

       
      <br/><br/>
      <div><p id='msg'>... Logging ... <br></br> {this.state.msg}</p></div>
  </div>
        {/* </main> */}
        

      </div>
    </div>
  </div>
);
}
}

export default App;
