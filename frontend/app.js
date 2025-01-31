// Import Web3 library
const web3 = new Web3(window.ethereum);

// Pinata API credentials (Replace with your actual JWT token)
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4YTQwMDczZS1kZDFjLTQ3OGEtYTJjYi1iNDFhMDFlYzNjNjAiLCJlbWFpbCI6Inlhc2h3YW50aHJ2eTdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjUwMDlkODEzM2ZhYTc3ZTA4ODhmIiwic2NvcGVkS2V5U2VjcmV0IjoiMTk4OGZmOGViOTAwZWJiMzAzMWRjOTAxOWJlNjA3MTc4MGI5Nzk1ZTY4NDU4ZWZjOGYwOWU3MmZiY2U3ZDQ5YSIsImV4cCI6MTc2OTc5NTYzNH0.4bhS2bKC0-yeQ-7ak_DwAhwfRZPoKh4kpa8bXy65GAQ"; // Replace with your Pinata JWT token

// Smart contract ABI and address
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          }
        ],
        "name": "AccessGranted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "FileUploaded",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "accessList",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "name": "files",
        "outputs": [
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "userFiles",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "name": "uploadFile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          }
        ],
        "name": "grantAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "name": "hasAccess",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "name": "getFilesByUser",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      }
  ] ; // Copy from build/contracts/FileStorage.json
const contractAddress = "0x09857CE45117E278cC9af616A8dc7D7F284eB337"; // Replace with your deployed contract address
let contract;

// Initialize variables
let accounts;

// Connect MetaMask
document.getElementById('connectMetamask').addEventListener('click', async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        accounts = await web3.eth.getAccounts();
        web3.eth.defaultAccount = accounts[0];
  
        // Initialize the smart contract
        contract = new web3.eth.Contract(contractABI, contractAddress);
  
        alert(`Connected to MetaMask with account: ${accounts[0]}`);
  
        // Load files for the connected account
        loadFilesForAccount(accounts[0]);
      } catch (error) {
        console.error(error);
        alert('Error connecting to MetaMask.');
      }
    } else {
      alert('MetaMask not detected! Please install MetaMask.');
    }
  });
  
  // Load files uploaded by the connected account
  async function loadFilesForAccount(account) {
    try {
      const fileHashes = await contract.methods.getFilesByUser(account).call();
      const fileList = document.getElementById('fileList');
      fileList.innerHTML = ''; // Clear previous files
  
      fileHashes.forEach((fileHash) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = fileHash;
        fileList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error loading files:', error);
      alert('Error loading files.');
    }
  }
  
  // Upload File to Pinata and store hash in smart contract
  document.getElementById('uploadButton').addEventListener('click', async () => {
    const file = document.getElementById('fileInput').files[0];
    if (!file) return alert('Please select a file.');
  
    try {
      // Upload file to Pinata
      const fileHash = await uploadToPinata(file);
  
      // Call smart contract to upload file
      await contract.methods.uploadFile(fileHash).send({ from: accounts[0] });
      alert(`File uploaded to IPFS with hash: ${fileHash}`);
  
      // Reload files for the connected account
      loadFilesForAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      alert('Error uploading file to Pinata.');
    }
  });
  
  // Share File Access
  document.getElementById('shareButton').addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('shareModal'));
    modal.show();
  });
  
  document.getElementById('grantAccessButton').addEventListener('click', async () => {
    const receiver = document.getElementById('receiverAddress').value;
    const fileHash = document.getElementById('shareFileHash').value;
  
    if (!web3.utils.isAddress(receiver)) {
      return alert('Invalid Ethereum address.');
    }
  
    if (!fileHash || fileHash.trim() === "") {
      return alert('Please enter a valid file hash.');
    }
  
    try {
      // Call smart contract to grant access
      await contract.methods.grantAccess(fileHash, receiver).send({ from: accounts[0] });
      alert(`Access granted to ${receiver} for file hash: ${fileHash}`);
    } catch (error) {
      console.error(error);
      alert('Error granting access.');
    }
  });
  
  // Access Shared File
  document.getElementById('accessFileButton').addEventListener('click', async () => {
    const sender = document.getElementById('senderAddress').value;
    const fileHash = document.getElementById('fileHashInput').value;
  
    if (!web3.utils.isAddress(sender)) {
      return alert('Invalid Ethereum address.');
    }
  
    if (!fileHash || fileHash.trim() === "") {
      return alert('Please enter a valid file hash.');
    }
  
    try {
      // Check if the user has access
      const hasAccess = await contract.methods.hasAccess(fileHash, accounts[0]).call();
      if (hasAccess) {
        alert(`You have access to the file. Download it from IPFS: https://ipfs.io/ipfs/${fileHash}`);
      } else {
        alert('You do not have access to this file.');
      }
    } catch (error) {
      console.error(error);
      alert('Error checking access.');
    }
  });
  
  // Helper function to upload file to Pinata
  async function uploadToPinata(file) {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Pinata API Error:', errorData);
        throw new Error(`Pinata API Error: ${JSON.stringify(errorData)}`);
      }
  
      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error('Error uploading file to Pinata:', error);
      throw error;
    }
  }
// Display uploaded file hash in the UI
function displayFile(fileHash) {
  const fileList = document.getElementById('fileList');
  const listItem = document.createElement('li');
  listItem.className = 'list-group-item';
  listItem.textContent = fileHash;
  fileList.appendChild(listItem);
}