import { useState, useMemo, useEffect } from "react";
import { ConnectionProvider,  WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider,  WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;
require("@solana/wallet-adapter-react-ui/styles.css");

  

let receiver;
export default function Home() {

  const endpoint = web3.clusterApiUrl("devnet");
  const wallets = useMemo(() => [], []);
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(null);
  const [connected, setconnected] = useState(false);
  
  const handleChange = event => {
    setMessage(event.target.value);

    console.log('value is:', event.target.value);
  };
  
  async function get_bal (connection, publicKey) {
    setBalance(await connection.getBalance(publicKey))
  }

  function sendSol (publicKey, sendTransaction, connection) {
    
    
    const transaction = new web3.Transaction();
    const recipientPubKey = 'DtjJAembjiCEeH9QmtoiYtDWunFZAsmFVQSZ29CbRadV'
    receiver = message
     console.log(receiver);
    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: receiver,
      lamports: LAMPORTS_PER_SOL,
    });

    transaction.add(sendSolInstruction)
    sendTransaction(transaction, connection).then((sig) => {
      console.log(sig);
      get_bal(connection, publicKey)
    });
  }

 function VisitShop() {
    const { publicKey, sendTransaction  } = useWallet();
    const { connection } = useConnection();
    setconnected(true)
    if (publicKey != null) {
      const base58Pubkey = publicKey.toBase58();
      // console.log(connection.getBalance);
     get_bal(connection, publicKey)
      // console.log(base58Pubkey); 
      // console.log(balance);
      return(
        <div className="send_sol">
          <button onClick={() => {
            sendSol(publicKey, sendTransaction, connection)
          }}>send sol</button>
        </div>
      )
    }
    
    }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <WalletMultiButton />
          <VisitShop />
          <p>{balance ? `Balance: ${balance / LAMPORTS_PER_SOL} SOL` : ""}</p>
          <div>
            <label id="message">Recepients Address:</label>
      <input type="text" id="message" name="message" onChange={handleChange} value={message}/>
      {/* <h2>Message: {message}</h2> */}
    </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}