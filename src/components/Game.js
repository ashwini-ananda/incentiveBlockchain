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
  },
  {
    name: '2',
    img: '/images/2.png'
  },
  {
    name: '3',
    img: '/images/3.jpg'
  },
  {
    name: '4',
    img: '/images/4.png'
  },
  {
    name: '5',
    img: '/images/5.jpg'
  },
  // {
  //   name: '6',
  //   img: '/images/6.png'
  // },
  {
    name: '7',
    img: '/images/7.jpg'
  },
  {
    name: '8',
    img: '/images/8.png'
  },
  {
    name: '9',
    img: '/images/9.png'
  },
]

class Game extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.setState({ cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random()) })
  }

  async loadWeb3() {
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
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // Load smart contract
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


  cardSelect= async (cardId) => {
    this.state.tries = this.state.tries+1;
    let tries = this.state.tries;
    console.log("Tries: "+tries)
    let flag=0;

    for(let i=0; i<this.state.showCards.length;i++ ){
      if(this.state.showCards[i].name === this.state.cardArray[cardId].name) {
        flag=1;
        this.state.matchesFound++;
        console.log("Matches: "+this.state.matchesFound++)

        this.state.showCards.splice(i,1)
        // console.log("yes")

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

        if (this.state.showCards.length===0)
        alert('You found them all!')

        break;
      }
   
    }
    if(flag===0){
        window.alert("Oops! Try again")
    }
      
  }
  constructor(props) {

    super(props)
    // this.goHome = this.goHome.bind(this)


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
      pickFromCards: []
    }
    // this.timeoutFn()

    // setTimeout(function () {
    //   this.timeoutFn = this.timeoutFn.bind(this)  
    // }, 5000);
    // this.self.hideCards = true

    // Shuffle array

    // Get sub-array of first 5 elements after shuffled
    // this.setState.showCards = shuffled.slice(0, 5);
    // for(let i = 0; i < this.state.showCards.length; i++){
    //   console.log(this.state.showCards[i]);
    // }
    var shuffled = CARD_ARRAY.sort(() => 0.5 - Math.random()).slice(0, 5);
    this.state.showCards = shuffled
    console.log(this.state.showCards)

  

    setTimeout(function () {
      document.getElementById('afterFive').style.display = 'none'

    }, 0);
    setTimeout(function () {
      document.getElementById('beforeFive').style.display = 'none'
      document.getElementById('afterFive').style.display = 'inline-block'
    }, 5000);

  }
  
  // goHome() {
  //   this.props.history.push('/')
  // }  

  timeoutFn() {
    setTimeout(function () {
      this.state.hideCard = true;
      // this.timeoutFn = this.timeoutFn.bind(this)  
    }, 5000);
  }
  

  

  render() {


    // function ElementsList() {
    //   // this.state.elements = [];

    //   for (let i = 0; i < 5; i++) {
    //     this.state.elements.push(<img src={'/images/blank.png'} />);
    //   }

    //   return this.state.elements;
    // }

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
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h3 id="heading" className="one">Shopping List: A Memory Game</h3><br/>

                <p>Look closely...</p>
                <div className="grid mb-6 " id='beforeFive'>
                  {
                    this.state.showCards.map((index) => <img src={index.img} />)
                  }
                </div>

                <div className="grid mb-4 " id='afterFive'>
                <p>Which one's did you see?</p>

                  {/* <div >
                    <ElementsList />
                  </div> */}

                  {this.state.cardArray.map((card, key) => {
                    return (
                      <img
                        key={key}
                        src={CARD_ARRAY[key].img}
                        data-id={key}
                        onClick={(event) => {
                          let cardId = event.target.getAttribute('data-id')
                          this.cardSelect(cardId)
                          // if (!this.state.cardsWon.includes(cardId.toString())) {
                          //   this.flipCard(cardId)
                          // }
                        }}
                      />
                      
                    )
                  })}

                </div>
                

              </div>
              {/* <h5>Total Tries:<span id="result">&nbsp;{this.state.tries}</span></h5>
              <h5>Total Matches:<span id="result">&nbsp;{this.state.matchesFound}</span></h5> */}
            </main>
            

          </div>
        </div>
      </div>
    );
  }
}

export default Game;
