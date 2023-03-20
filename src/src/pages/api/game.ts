const envConfig = require("dotenv").config();
const Ably = require("ably");
const ABLY_API_KEY = process.env.ABLY_API_KEY;

const totalPlayers = 4

const ably = new Ably.Realtime.Promise(ABLY_API_KEY);



//create a uniqueId to assign to clients on auth
const uniqueId = function () {
    return "id-" + totalPlayers + Math.random().toString(36).substr(2, 16);
  };

// wrapper for async functions
const ablyRealtimePromiseExample = async () => {
    // Connect to Ably
    await ably.connection.once('connected');
    console.log('Connected to Ably!');

    // get the channel to subscribe to
    const channel = ably.channels.get('quickstart');


    /* 
    Subscribe to a channel. 
    The promise resolves when the channel is attached 
    (and resolves synchronously if the channel is already attached).
    */
    await channel.subscribe('greeting', (message: any) => {
    console.log('Received a greeting message in realtime: ' + message.data)
    });

    // Publish a message or two
    await channel.publish('greeting', 'hello!');

    ably.close(); // runs synchronously
console.log('Closed the connection to Ably.');
}