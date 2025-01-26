import { getContract, defineChain} from "thirdweb";
import { client } from "../client";
import { chain } from "../constant"; 




export const Contract = (addr: string) => {
    return getContract({
        address: addr,
        chain,
        client
        
    });

}