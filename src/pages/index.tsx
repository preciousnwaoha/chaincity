import React, {useEffect, useState} from "react"
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
import genericErc20Abi from '@/utils/artifacts/contracts/CITYCoin.json'
import artifact from '@/utils/artifacts/contracts/Chaincity.json'
import { contractActions } from "@/store/contract-slice"
import Stake from "@/components/Stake"
import AddPlayer from "@/components/AddPlayer"
const CONTRACT_ADDRESS = "0x6B834621B5891AaFe77EDea2BC257049013e5C86"
const TOKEN_ADDRESS = "0xC410679CEE6faf3e5D0F99666FCEAa6236564157"


export default function Home() {
  const dispatch = useDispatch()
  const contract = useSelector((state: RootState) => state.contract)

  const [createdGame, setCreatedGame ] = useState(false)
  const [playerStaked, setPlayerStaked] = useState(false);


  useEffect(() => {
    
     const onLoad = async () => {
      // const providerAlt: ethers.providers.AlchemyProvider = await new ethers.providers.AlchemyProvider("goerli", API_KEY);
      // setProvider(providerAlt);
      const provider: ethers.providers.Web3Provider = new       ethers.providers.Web3Provider(window.ethereum!);
      console.log("provider: ", provider)
  
      if (provider !== undefined) {
        const gameContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          artifact.abi,
          provider
        )
        console.log("gameContract: ", gameContract)
        
        const tokenContract = new 
          ethers.Contract(TOKEN_ADDRESS, genericErc20Abi.abi, provider)
        console.log("tokenContract: ", tokenContract)

        
             
        dispatch(contractActions.stageContract({tokenContract, gameContract, provider, }))
      }
      
      

    }

    if(!window.ethereum) {
      return
    } else {
      onLoad()
    }

  }, [])


  const handleCreatedGame = () => {
    setCreatedGame(true)
  }
  const handleStaked = () => {
    setPlayerStaked(true)
  }
  const handleStakedBack = () => {
    setPlayerStaked(false);
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
          {!createdGame && <StartScreen onHandleNewGame={handleCreatedGame} />}
          {(createdGame && !playerStaked ) && <Stake onDone={handleStaked} onBack={handleStakedBack} /> }
          {(createdGame && playerStaked ) && <AddPlayer />}
          
         
        </Box>
      </main>
    </>
  )
}
