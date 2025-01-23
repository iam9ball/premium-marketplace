'use server'
import { GenerateLoginPayloadParams, signLoginPayload, VerifyLoginPayloadParams } from 'thirdweb/auth';
import { Account, generateAccount, privateKeyToAccount } from 'thirdweb/wallets';
import { cookies } from 'next/headers';
import { getAddress } from 'thirdweb';
import { refreshJWT } from "thirdweb/utils";
import { createAuth } from 'thirdweb/auth';
import { client } from '../client';

const privateKey = process.env.PRIVATE_KEY!;
 
const auth = createAuth({
    adminAccount: privateKey ?  privateKeyToAccount({client, privateKey}) : await generateAccount({client}),
    domain: process.env.DOMAIN! || 'localhost:3000',
    client,
    jwt: {
        expirationTimeSeconds: 60 * 60 * 24 * 7
    },
    login: {
        statement: `Welcome to ${process.env.DOMAIN! || 'localhost:3000'}, Sign the message to login`
        
    }


});

 


// const handleLogin = async (address: string, account: Account) => {
//     try {
    
//     const jwtValue = cookies().get('jwt')?.value;
//     if (!jwtValue) {
//       handleLoginPayload(address, account);
//     }
//     else {
//         const authResult = await getAuthResult(jwtValue);
//         if (!authResult?.valid) {
//             handleLoginPayload(address, account);
//         }
//         else {
//             const jwt = await refreshJWT({
//                 account,
//                 jwt: jwtValue,
//                 expirationTime: 1000 * 60 * 60,
//             });

//             cookies().set('jwt', jwt, {httpOnly: true, secure: true, sameSite: 'strict'});
           
//         }
//   }


//     // Verify current JWT

//  } catch (error) {
//     console.error(error);
//     // return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
//   }
// }

// export default handleLogin;

    



// const handleLoginPayload = async (address: string, account: Account) => {

//     try {
//         // 1. generate a login payload for a client on the server side
//         const loginPayload = await auth.generatePayload({ address});

//         // 2. sign the login payload by the client
//         const {signature, payload} = await signLoginPayload({payload: loginPayload, account});

//         // 3. verify the login payload that the client sends back later
//         const verifiedPayload = await auth.verifyPayload({ payload, signature});

//         if (verifiedPayload.valid) {
//             // 4. generate a JWT for the client
//         const jwt = await auth.generateJWT({ payload: verifiedPayload.payload });

        
//         // 5. set the JWT in the cookies
//         cookies().set('jwt', jwt, {httpOnly: true, secure: true, sameSite: 'strict'});
//  }
//     } catch (error) {
//         console.error(error);
        
//     }



// }



export async function generatePayload(options: GenerateLoginPayloadParams) {
        return await auth.generatePayload(options);
   
}

export async function login(payload: VerifyLoginPayloadParams) {
    const verifiedPayload = await auth.verifyPayload(payload);
    if(verifiedPayload.valid) {
        const jwt = await auth.generateJWT({ payload: verifiedPayload.payload });
        cookies().set('jwt', jwt, {httpOnly: true, secure: true, sameSite: 'strict'});
    }
}


export async function isLoggedIn(address: string) {

    try {
   
        // if no address is passed then return false
        if (!address) {
            return false;
        }
        // check if the user is logged in by checking the cookies
        const jwt = cookies().get('jwt');
        
        // if the jwt is not present then return false
        if (!jwt) {
            return false;
        }

        // verify the jwt
        const authResult = await auth.verifyJWT({ jwt: jwt.value });

        // if the result is not valid return false

        if(!authResult.valid) {
            return false;
        }
        
        // check if the address in the jwt is the same as the address passed
        if (getAddress(authResult.parsedJWT.sub) !== getAddress(address)) {
            return false;
        }
        // we are logged in
        return true;
        
    } catch (error) {
        console.error(error);
        
    }

 
}

export async function getAuthResult(jwtValue: string) {

    try {
     const authResult = await auth.verifyJWT({ jwt: jwtValue });

    if (!authResult.valid) {
        return {valid: false, parsedJWT: null};
    }
    return authResult;
    } catch (error) {
        console.error(error);
        
    }
    
}





