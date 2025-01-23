export const ipfsToHttp = (ipfsUri: string) => {
  console.log(ipfsUri);
    const gateway = "https://ipfs.io/ipfs/";
    return ipfsUri?.replace("ipfs://", gateway);
  }