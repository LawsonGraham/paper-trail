export function useMoralis() {
    // Moralis Initialization
    let Moralis;
    if (typeof window !== `undefined`) {
      Moralis = require("moralis");
      Moralis.initialize(process.env.PT_MORALIS_APPLICATION_ID);
      Moralis.serverURL = process.env.PT_MORALIS_SERVER_URL;
    }
    return { Moralis };
  }