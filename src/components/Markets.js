import { useSelector , useDispatch } from 'react-redux'
import config from '../config.json'

import {loadTokens} from '../store/interactions'

const Markets = () => {


  const dispatch = useDispatch()

  const provider = useSelector(state=> state.provider.connection)
  const chainId = useSelector(state => state.provider.chainId)

  const markethandler = async (e) =>{
    await loadTokens(provider , (e.target.value).split(",") , dispatch)

  }

  return(
    <div className='component exchange__markets'>
      <div className='component__header'>
       <h2> Select Market </h2>
      </div>
      {config && config[chainId] 
      ? 
      (<select name="markets" id="markets" onChange = {markethandler}> 
      <option value={`${config[chainId].DApp.address},${config[chainId].mETH.address}`} > DApp / mETH </option>
      <option value={`${config[chainId].DApp.address},${config[chainId].mDAI.address}`} > DApp / mDAI </option>
      </select>) 
      : 
      (<div>
        <p> Not deployed to network </p>
       </div>)}
      
      <hr />
    </div>
  )
}

export default Markets;