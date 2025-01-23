import { getContract, defineChain} from "thirdweb";
import { anvil, polygonAmoy } from "thirdweb/chains";
import { client } from "../client";


const chain = defineChain({
  id: 80002,
  rpc: "https://polygon-amoy.g.alchemy.com/v2/8w2qoqibC8Swp9qjQ5KdZI4jRjf7H8E5",
  nativeCurrency: {
    name: "Polygon Amoy",
    symbol: "POL",
    decimals: 18,
  },
});

export const Contract = (addr: string) => {
    return getContract({
        address: addr,
        chain,
        client
        
    });

}