import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Web3 from 'web3';
import nftContract from './nftContract';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [mintAmount, setMintAmount] = useState(1); 
  const [isConnected, setIsConnected] = useState(false); // New state for connection status
  const [mintedNFTs, setMintedNFTs] = useState([]); // State to store minted NFTs


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.requestAccounts();
        setAccounts(accounts);

        const instance = nftContract(web3Instance);
        setContract(instance);

        setIsConnected(true); // Set connection status to true after successful connection

      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Web3 not found');
    }
  };

  const promptForMintAmount = () => {
    const userAmount = prompt("Enter the number of NFTs you want to mint:", mintAmount);
    const parsedAmount = parseInt(userAmount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Invalid number of NFTs. Please enter a positive integer.");
    } else {
      setMintAmount(parsedAmount);
    }
  }; 

  const mint = async () => {
        try {
            const costPerNFT = Web3.utils.toWei('0.05', 'ether');
            const totalCost = (costPerNFT * mintAmount).toString();

            await contract.methods.mint(accounts[0], mintAmount).send({
                from: accounts[0],
                value: totalCost,
            });

            const supplyAfterMint = await contract.methods.totalSupply().call();
            console.log("Supply After Mint:", supplyAfterMint);

            const newMintedNFTs = [];
            for (let i = 0; i < mintAmount; i++) {
                const tokenId = parseInt(supplyAfterMint) - i;
                const metadata = await fetchTokenMetadata(tokenId);
                newMintedNFTs.push(metadata);
            }

            setMintedNFTs(prevNFTs => [...prevNFTs, ...newMintedNFTs]);
        } catch (error) {
            console.error("Minting failed!", error);
        }
    };


  const getTotalSupply = async () => {
      try {
          const supply = await contract.methods.totalSupply().call();
          console.log("Total Supply:", supply);
          return supply;
      } catch (error) {
          console.error("Error fetching total supply:", error);
      }
  };



  const fetchTokenMetadata = async (tokenId) => {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/QmevFgzoo9cEfTXs6YUEbZNAwjp9LTT9f5h1vgea5N9AqY/${tokenId}.json`);
    console.log(response);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const metadata = await response.json();

    // Convert IPFS image URL to HTTP URL
    if (metadata.image.startsWith("ipfs://")) {
      metadata.image = `https://gateway.pinata.cloud/ipfs/${metadata.image.split('ipfs://')[1]}`;
    }

    console.log(metadata);
    return metadata; // Returns the entire metadata object
  };


 return (
     <div className="first-one">
       <h1>Mint My Ride</h1>
       {isConnected ? (
         <div className="page-container">
           <div className="container">
             <div className="wallet-status">
               <p className="text">Your Wallet is connected</p>
               <FontAwesomeIcon icon={faCircleCheck} style={{ color: '#63E6BE' }} />
             </div>
             <button onClick={promptForMintAmount} className="prompt-button">Set Mint Amount</button>
             <button onClick={mint} className="mint-button">Mint {mintAmount} NFT(s)</button>
             {/* Display minted NFTs */}
             <div className="minted-nfts">
                 {mintedNFTs.length > 0 ? (
                     <div className="nft-grid">
                         {mintedNFTs.map((nft, index) => (
                             <div key={index} className="nft-item">
                                 <img src={nft.image} alt={nft.name} className="nft-image" />
                                 <h3>{nft.name}</h3>
                             </div>
                         ))}
                     </div>
                 ) : (
                     <p>No NFTs minted yet.</p>
                 )}
             </div>

           </div>
         </div>
       ) : (
         <div className="connect-button-container">
           <button onClick={connectWallet} className="connect-button">Connect Wallet</button>
         </div>
       )}
     </div>
   );
 }


  export default App;
