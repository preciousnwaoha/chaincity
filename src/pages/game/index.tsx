import Plate from '@/components/Plate'
import Head from 'next/head'
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Players from '@/components/Players'
import Bank from '@/components/Bank'
import Logs from '@/components/Logs'
import Button from '@mui/material/Button'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useRouter } from 'next/router'

export default function Game() {
  const router = useRouter()
  const game = useSelector((state: RootState) => state.game)

  const {playing} = game


  return (
    <>
      <Head>
        <title>Monopoly | Chaincity</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        {!playing ? <Button onClick={() => router.push("/")}>BACK TO HOME</Button> : <Grid container sx={{
          width: "100vw",
          height: "100vh",
        }}>
          <Grid item md={8} sx={{
          height: "100%",
        }}>
            <Plate divisions={24} />
          </Grid>

          <Grid item md={4} sx={{
          height: "100%",
        }}>
              <Box sx={{
                width: "100%",
                height: "100%",
                outline: "1px solid blue"
              }}>
                <Players />
                <Bank />
                <Logs />
              </Box>
          </Grid>

        </Grid>}
       
      </main>
    </>
  )
}
