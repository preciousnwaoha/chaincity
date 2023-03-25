import React, {useEffect, useState} from "react"

import { useRouter } from 'next/router'
import Plate from '@/components/Plate'
import Head from 'next/head'
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import { useDispatch, useSelector } from 'react-redux'
import { gameActions } from '@/store/game-slice'
import { PLAYERS_DUM } from '@/utils/dummy-data'
import { LANDS, LAND_SETS } from '@/utils/monopoly-data'
import { RootState } from "@/store"
import PlayerSelection from '@/components/PlayerSelection'
import EnterGame from "@/components/EnterGame"
import StartScreen from "@/components/StartScreen"
import SettingsSetup from "@/components/SettingsSetup"
import {ethers} from 'ethers';
import genericErc20Abi from '@/utils/artifacts/contracts/Chainlink.json'
import artifact from '@/utils/artifacts/contracts/Chainlink.json'
import { contractActions } from "@/store/contract-slice"
const CONTRACT_ADDRESS = "0x6B77674E52b5e65363cF11e4839dFA80157207E6"
const TOKEN_ADDRESS = "0x6B77674E52b5e65363cF11e4839dFA80157207E6"


export default function Home() {
  const router = useRouter()
  const dispatch = useDispatch()
  const contract = useSelector((state: RootState) => state.contract)

  const [gameIsSet, setGameIsSet] = useState(false)
  const [showEnterGame, setShowEnterGame] = useState(false)
  const [showSettingsSetup, setShowSettingsSetup] = useState(false)


  

  const toggelGameIsSet = () => {
    setGameIsSet(prev => !prev)
  }

  const handlePlayerSelectionDone = () => {
    setShowSettingsSetup(true)
  }

  const handleEnterGame = () => {
    router.push("/game")
  }


  useEffect(() => {
    
     const onLoad = async () => {
      // const providerAlt: ethers.providers.AlchemyProvider = await new ethers.providers.AlchemyProvider("goerli", API_KEY);
      // setProvider(providerAlt);
      const provider: ethers.providers.Web3Provider = new       ethers.providers.Web3Provider(window.ethereum!);
      console.log("provider: ", provider)
  
      if (provider !== undefined) {
        // const chainlinkContract = new ethers.Contract(
        //   CONTRACT_ADDRESS,
        //   artifact.abi,
        //   provider
        // )
        // console.log("chainlinkContract: ", chainlinkContract)
        
             const tokenContract = new 
         ethers.Contract(TOKEN_ADDRESS, genericErc20Abi.abi, provider)
             console.log("tokenContract: ", tokenContract)
             
             dispatch(contractActions.stageContract({tokenContract, provider}))
      }
      
      

    }

    if(!window.ethereum) {
      return
    } else {
      onLoad()
    }

  }, [])

  const handleBackToPlayerSeclection = () => {
    setShowSettingsSetup(false)
  }


  return (
    <>
      <Head>
        <title>Chaincity</title>
        <meta name="description" content="Play monopoly on the blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <Box>
          {!gameIsSet && <StartScreen onHandleNewGame={toggelGameIsSet} />}
          
          {(gameIsSet && !showEnterGame && !showSettingsSetup)&& <PlayerSelection onBack={toggelGameIsSet} onDone={handlePlayerSelectionDone} />}
          {showSettingsSetup && <SettingsSetup onDone={handleEnterGame} onBack={handleBackToPlayerSeclection} />}

        </Box>
      </main>
    </>
  )
}
