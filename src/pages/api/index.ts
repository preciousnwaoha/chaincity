// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const MIN_PLAYERS_TO_START_GAME = 4

let peopleAccessingTheWebsite = 4

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: any
) {
    res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (++peopleAccessingTheWebsite > MIN_PLAYERS_TO_START_GAME) {
    res.sendFile(__dirname + "/views/gameRoomFull.html");
  } else {
    res.sendFile(__dirname + "/views/intro.html");
  }
}
