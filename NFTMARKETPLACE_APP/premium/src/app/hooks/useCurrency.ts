import { useMemo, useCallback, useEffect, useState } from 'react';
import { readContract, ZERO_ADDRESS } from 'thirdweb';
import useSWR from 'swr';
import { marketContract } from '../contracts/constant';


import { NATIVE_TOKEN } from '../utils/address';

export const fetchCurrencyInfo = async (contractAddress: string) => {
  let response;
    if (contractAddress ==  NATIVE_TOKEN) {
     const address = "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"  //use wrapped matic
          response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`); 
        
    }
    else {
        response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}`);
    }
   
    
          if (!response?.ok) {
            throw new Error(`Failed to fetch token info for ${contractAddress}`);
          }

          const data = await response.json();
          console.log('Fetched token info:', data); // Logging fetched data
          return data;
        }


export const useCurrency = () => {


  const fetchCurrencyAddresses = useCallback(async () => {
      try {
        const datas = await readContract({
          contract: marketContract,
          method: "getAllCurrency"
        });
        const filteredCurrencyAddress = datas.filter(addr => addr !== ZERO_ADDRESS);
        return await Promise.all(filteredCurrencyAddress.map((addr) => fetchCurrencyInfo(addr)));

      } catch (error) {
        console.error("Failed to fetch currency addresses:", error);
      }
    }, []);

    

 

  

  const { data, error, isLoading } = useSWR("currency", fetchCurrencyAddresses, {
    revalidateOnReconnect: true,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateIfStale: false
  });

  const formattedCurrency = data?.map((token) => ({
    value: token.id,
    symbol: token.symbol,
    image: token.image,
    address: token.contract_address === "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0" ? NATIVE_TOKEN : token.contract_address 
  }));

  return {
    formattedCurrency,
    error,
    isLoading
  };
};

