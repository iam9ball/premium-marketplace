import WeaveDB from "weavedb-sdk"
 
const db = new WeaveDB({ contractTxId: process.env.WEAVEDB_CONTRACT_TX_ID, network: "testnet"})
await db.init()

// const { identity } = await db.createTempAddress();

// export default db;