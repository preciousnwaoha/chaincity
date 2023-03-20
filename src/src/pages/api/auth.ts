// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const envConfig = require("dotenv").config();
const Ably = require("ably");
const ABLY_API_KEY = process.env.ABLY_API_KEY;

const totalPlayers = 4

const realtime = Ably.Realtime({
    key: ABLY_API_KEY,
    echoMessages: false,
  });
  


type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    const tokenParams = { clientId: uniqueId() };
    realtime.auth.createTokenRequest(tokenParams, function (err: any, tokenRequest: any) {
      if (err) {
        res
          .status(500)
          .send("Error requesting token: " + JSON.stringify(err));
      } else {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(tokenRequest));
      }
    });
}
