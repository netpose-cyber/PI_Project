
const Web3 = require('web3');
const fs = require('fs');

const web3 = new Web3('https://pi-network-node-url');  
const account = web3.eth.accounts.privateKeyToAccount('YOUR_PRIVATE_KEY');  
web3.eth.accounts.wallet.add(account);

const contractABI = JSON.parse(fs.readFileSync('./build/PiRewardContract.abi', 'utf8'));
const contractBytecode = fs.readFileSync('./build/PiRewardContract.bin', 'utf8');

const deploy = async () => {
    const contract = new web3.eth.Contract(contractABI);
    const deployedContract = await contract.deploy({ data: contractBytecode })
        .send({ from: account.address, gas: 3000000 });
    
    console.log('Contract deployed at:', deployedContract.options.address);
};

deploy();
