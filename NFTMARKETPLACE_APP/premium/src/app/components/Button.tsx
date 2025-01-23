'use client'

import { ConnectButton, useActiveAccount, useSwitchActiveWalletChain } from "thirdweb/react";
import { client } from "../client";
import { IconType } from "react-icons";
import { createWallet } from "thirdweb/wallets";
import styles from '../styles/ConnectButton.module.css';
import { anvil, polygonAmoy } from "thirdweb/chains";
import { useWindowWidth } from "@react-hook/window-size";
import { useMemo } from "react";
import  {generatePayload, isLoggedIn, login} from "../actions/login";
import { logout } from "../actions/logout";
import { defineChain} from "thirdweb";



interface ButtonProps {
    actionLabel?: string;
    onClick?: () => void;   
    disabled?: boolean;
    variant?: 'connect';
    primaryConnect?: boolean;
    icon?: IconType;
    classNames?: string;
    defaultConnectButton?: boolean;
    
}

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.trustwallet.app"),
  createWallet("com.coinbase.wallet"),
  createWallet("app.phantom"),
];

export default function Button({
    actionLabel, 
    onClick, 
    disabled, 
    variant,
    primaryConnect,
    icon: Icon,
    classNames,
    defaultConnectButton
}: ButtonProps) {
  
  const width = useWindowWidth();
  const switchChain = useSwitchActiveWalletChain();
  const account = useActiveAccount();
  
  const Width = useMemo(() => {
    if( primaryConnect) {return "100%"}
    if (width >= 1024) {
      return "160px";
    } else if (width >= 768) {
      return "144px";
    } else {
      return "112px";
    }
  }, [width]);

  const Height = useMemo(() => {
   
    if (width >= 768) {
    if( primaryConnect) {return "100%"}
      return "48px";
    }
    if( primaryConnect) {return "100%"}
    return "40px";
  }, [width]);

  const FontSize = useMemo(() => {
    if( primaryConnect) {return "12px"}
    if (width >= 768) {
      return "14px";
    }
    return "12px";
  }, [width]);

  const defaultConnectStyle = useMemo(() => {
    if (defaultConnectButton === true) {
      return styles.defaultConnectButton;
    }
    return styles.connectButton;
  }, [defaultConnectButton]);


  const chain = defineChain({
  id: 80002,
  rpc: "https://polygon-amoy.g.alchemy.com/v2/8w2qoqibC8Swp9qjQ5KdZI4jRjf7H8E5",
  nativeCurrency: {
    name: "Polygon Amoy",
    symbol: "POL",
    decimals: 18,
  },
});

  const handleConnect = () => {
    console.log("Connecting...");
    switchChain(chain).then(() => {onClick && onClick()})
      .catch((error) => console.error("Failed to switch chain:", error));
      
   
   
  };

  return (
    
    variant === "connect" ? (
      <ConnectButton
        client={client}
        wallets={wallets}
        auth={{
          isLoggedIn: async (address) => {
            
              const authResult = await isLoggedIn(address);
              if (!authResult) {
                return false;
              }
             else {
              return true;
          }
            
          },
         doLogin: async (params) => {
          await login(params);  
         }, 
         getLoginPayload: async ({address}) => 
          await generatePayload({address}),
         doLogout: async () => {
          console.log("logging out")
          await logout()
         }
         

        }}
        connectModal={{
          size: "compact",
          title: "Connect wallet",
          showThirdwebBranding: false,
        }}
        connectButton={{
          label: "Connect",
          className: primaryConnect? "" : defaultConnectStyle,
          style: {
            color:"white",
            minWidth: "96px",
            minHeight: "40px",
            width: Width,
            height: Height,
            fontSize: FontSize,
            padding: "12px 16px",
            fontWeight: primaryConnect ? "900" : "500",
            borderRadius: `${primaryConnect && '0px 0px 5px 5px'}`,
            backgroundColor: primaryConnect ? "black": ""
          },
          
        }}
         signInButton={{
          label: "Sign in",
          className: primaryConnect? "" : defaultConnectStyle,
          style: {
            color:"white",
            minWidth: "96px",
            minHeight: "40px",
            width: Width,
            height: Height,
            fontSize: FontSize,
            padding: "12px 16px",
            fontWeight: primaryConnect ? "900" : "500",
            borderRadius: `${primaryConnect && '0px 0px 5px 5px'}`,
            backgroundColor: primaryConnect ? "black": ""
          },
          
        }}
        detailsButton={{

    style: {
      width: Width,
      borderRadius: `${primaryConnect && '0px 0px 5px 5px'}`,
      maxWidth:  Width,
    },
  }}
        onConnect={handleConnect}
      />
    ) : (
      <button
        onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        disabled={disabled}
        className={`relative disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer text-center ${classNames}`}
      >
        {Icon && (<Icon size={24} className="absolute left-4 top-3" />)}
        {actionLabel}
      </button>
    )
  );
}