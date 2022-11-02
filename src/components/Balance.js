import { useEffect , useState , useRef } from 'react';
import { useSelector , useDispatch } from 'react-redux'
import dapp from '../assets/dapp.svg'
import eth from '../assets/eth.svg'


import {loadBalances , transferTokens} from '../store/interactions'

const Balance = () => {
 
  const [isDeposit , setIsDeposit] = useState(true)
  const [token1TransferAmount , setToken1TransferAmount] = useState(0)
  const [token2TransferAmount , setToken2TransferAmount] = useState(0)

  const dispatch = useDispatch()

  const exchange = useSelector(state=>state.exchange.contract)
  const exchangeBalances = useSelector(state=>state.exchange.balances)
  const transferInProgress = useSelector(state=>state.exchange.transferInProgress)

  const provider = useSelector(state=>state.provider.connection)
  const symbols = useSelector(state=>state.tokens.symbols)
  const tokens = useSelector(state=>state.tokens.contracts)
  const tokenBalances = useSelector(state=>state.tokens.balances) 

  const account = useSelector(state=>state.provider.account)


  const depositRef =useRef(null)
  const withdrawRef =useRef(null)

  const tabHandler = (e) =>{
    if(e.target.className !== depositRef.current.className){
      e.target.className = 'tab tab--active'
      depositRef.current.className = 'tab' 
      setIsDeposit(false)
    } else{
      e.target.className = 'tab tab--active'
      withdrawRef.current.className = 'tab'
      setIsDeposit(true)
    }
 }

  const amountHandler = (e,token)=>{
    if(token.address === tokens[0].address){
      setToken1TransferAmount(e.target.value)
    }
    else{
      setToken2TransferAmount(e.target.value)
    }
  }

  //step 1 :do transfer
  //step 2 : notify app that transfer is pending 
  //step 3 : get confirmation from blockchain that trasfer was successful
  //step 4 : notify app that trasnsfer was ssuccessful
  //step 5 : handle transfer fails - notify app

  const depositHandler = (e,token )=> {
    e.preventDefault()

    if(token.address === tokens[0].address){
      transferTokens(provider , exchange , 'Deposit', token , token1TransferAmount , dispatch)
      setToken1TransferAmount(0)
   }else{
      transferTokens(provider , exchange , 'Deposit', token , token2TransferAmount , dispatch)
      setToken2TransferAmount(0)
   }
 }


   useEffect(() =>{
    if(exchange && tokens[0] && tokens[1] && account){
      loadBalances(exchange , tokens , account , dispatch)
    }
   }, [exchange , tokens , account , transferInProgress] )
   // if any of these variables change call the laodBlances again (reload the component (refetch the balances))


  return (
    <div className='component exchange__transfers'>
      <div className='component__header flex-between'>
        <h2>Balance</h2>
        <div className='tabs'>
          <button onClick={tabHandler} ref={depositRef} className='tab tab--active'>Deposit</button>
          <button onClick={tabHandler} ref={withdrawRef} className='tab'>Withdraw</button>
        </div>
      </div>

      {/* Deposit/Withdraw Component 1 (DApp) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
        <p> <small> Token </small><br/><img src={dapp} alt="Token Logo" />{symbols && symbols[0]}</p>
        <p> <small> Wallet </small> <br/> {tokenBalances && tokenBalances[0]}</p>
        <p><small> Exchange </small> <br/> {exchangeBalances && exchangeBalances[0]}</p>

        </div>

        <form onSubmit = {(e) => depositHandler(e,tokens[0])}>
          <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
          <input 
          type="text" 
          id='token0' 
          placeholder='0.0000' 
          value={token1TransferAmount === 0 ? '' : token1TransferAmount}
          onChange={(e) => amountHandler(e ,tokens[0])} />

          <button className='button' type='submit'>
            {isDeposit ? (
              <span>Deposit</span>
              ) 
              : (
              <span>Withdraw</span>
              )}
          </button>
        </form>
      </div>

      <hr />

      {/* Deposit/Withdraw Component 2 (mETH) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
        <p> <small> Token </small><br/><img src={eth} alt="Token Logo" />{symbols && symbols[1]}</p>
        <p> <small> Wallet </small> <br/> {tokenBalances && tokenBalances[1]}</p>
        <p><small> Exchange </small> <br/> {exchangeBalances && exchangeBalances[1]}</p>


        </div>

        <form onSubmit = {(e) => depositHandler(e,tokens[1])}>
          <label htmlFor="token1"></label>
          <input 
          type="text"
           id='token1' 
           placeholder='0.0000'
           value = {token2TransferAmount === 0 ? '' : token2TransferAmount}
           onChange={(e) =>amountHandler(e , tokens[1])}
           />

          <button className='button' type='submit'>
            {isDeposit ? (
              <span>Deposit</span>
              ) 
              : (
              <span>Withdraw</span>
              )}
          </button>
        </form>
      </div>

      <hr />
    </div>
  );
}

export default Balance;