
import Dashboard from "./Dashboard";
import { redirect } from "next/navigation";
import { getAuthResult } from "../actions/login";
import { cookies } from "next/headers";



export default  async function Marketplace () {

  try {
     
       const cookie = cookies();   
      const jwt = cookie.get("jwt")?.value; 
     

     
      if (!jwt) {
        redirect("/marketplace?redirected=true"); 
           
           
          }

    
      const authResult = await getAuthResult(jwt);
  
      if (!authResult.valid) {
       redirect("/marketplace?redirected=true"); 
      }
      
    return (
      <>
        <section className="min-h-[100vh] bg-gray-700">
          <Dashboard />
        </section>
      </>
    );
  
  
  
    
  } catch(error) {
     console.error("Error in middleware", error);
      // showToast("Please log in", "Connect your wallet to login.");
       redirect("/marketplace?redirected=true"); 
  }
  
 
 
}
