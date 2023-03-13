# Among Us: Real Life Edition

## Setup (right after pulling this repo)

1. `cd client` and `npm install`
2. `cd ..`
3. `cd server` and `npm install`
4. Create a `.env` file inside the `client` folder, and put a single line inside:
   ```
   SERVER_ADDR=<IP address>:2567
   ```
   Replace `<IP address>` with the address your server will run on. To get this, go to your server and run either `ipconfig` on Windows or `ipconfig getifaddr en0` on Mac. (The `2567` is the port used by Colyseus, for now.)

## To start the server

1. `cd server`
2. `npm start` to do regular start, OR `npm run dev` to start the server with [nodemon](https://www.npmjs.com/package/nodemon)

## To start the client

1. `cd client`
2. `npx expo start` and follow on-screen instructions
3. Make sure client and server are on the same local network
