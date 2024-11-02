import Web3 from 'web3';
import mintContract from './contracts/CARS.json'; // Import the JSON file of your contract

const nftContract = web3 => {
    return new web3.eth.Contract(
        mintContract,  
        // "0xA9aae2CDae58fef266991eD3fFaB7F6C7eDC6A18"
        // "0xd37FCC24689BFDd0722A580AA49EF76BaAaF13E0"
        // "0x2e8021aa783cA1f755597103C3066BD36E6E084a"
        "0x32Fa9C6867A36a30B26055B43c418EFa226A8c00"
    )
}


export default nftContract
