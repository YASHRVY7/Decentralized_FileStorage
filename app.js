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
        "indexed": false,
        "internalType": "string",
        "name": "fileName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
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
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "fileAccessList",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
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
        "internalType": "string",
        "name": "fileName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
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
      },
      {
        "internalType": "string",
        "name": "fileName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
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
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "getFileDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "fileName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
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
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "getFileAccessList",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
  ] ; // Copy from build/contracts/FileStorage.json
const contractAddress = "0x4dFa3d640aE3c9cADA68BdE0E4A8FB848a936Be0"; // Replace with your deployed contract address
let contract;
let accounts;
document.getElementById('connectMetamask').addEventListener('click', async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      accounts = await web3.eth.getAccounts();
      web3.eth.defaultAccount = accounts[0];

      // Initialize the smart contract
      contract = new web3.eth.Contract(contractABI, contractAddress);
      console.log("Contract Initialized:", contract);

      alert(`Connected to MetaMask with account: ${accounts[0]}`);

      // Load files and shared access list for the connected account
      loadFilesForAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      alert('Error connecting to MetaMask.');
    }
  } else {
    alert('MetaMask not detected! Please install MetaMask.');
  }
});

// Upload File to Pinata and store hash in smart contract
// Upload File to Pinata and store hash in smart contract
document.getElementById('uploadButton').addEventListener('click', async () => {
  const file = document.getElementById('fileInput').files[0];
  const fileName = document.getElementById('fileNameInput').value.trim();
  const description = document.getElementById('descriptionInput').value.trim();

  if (!file || !fileName || !description) {
    return alert('Please select a file and provide a name and description.');
  }

  try {
    // Upload file to Pinata
    const fileHash = await uploadToPinata(file);
    console.log("IPFS Hash:", fileHash);

    // Call smart contract to upload file
    await contract.methods.uploadFile(fileHash, fileName, description).send({
      from: accounts[0],
      gas: 3000000, // Increase gas limit if necessary
    });
    alert(`File uploaded to IPFS with hash: ${fileHash}`);

    // Reload files for the connected account
    loadFilesForAccount(accounts[0]);

    // Clear the form fields
    document.getElementById('fileInput').value = '';
    document.getElementById('fileNameInput').value = '';
    document.getElementById('descriptionInput').value = '';
  } catch (error) {
    console.error(error);
    alert('Error uploading file to Pinata or interacting with the smart contract.');
  }
});

// Share File Access
document.getElementById('shareButton').addEventListener('click', () => {
  const modal = new bootstrap.Modal(document.getElementById('shareModal'));
  modal.show();
});

document.getElementById('grantAccessButton').addEventListener('click', async () => {
  const receiver = document.getElementById('receiverAddress').value.trim();
  const fileHash = document.getElementById('shareFileHash').value.trim();

  if (!web3.utils.isAddress(receiver)) {
    return alert('Invalid Ethereum address.');
  }

  if (!fileHash) {
    return alert('Please enter a valid file hash.');
  }

  try {
    // Call smart contract to grant access
    await contract.methods.grantAccess(fileHash, receiver).send({
      from: accounts[0],
      gas: 3000000, // Increase gas limit if necessary
    });
    alert(`Access granted to ${receiver} for file hash: ${fileHash}`);

    // Reload files and shared access list for the connected account
    loadFilesForAccount(accounts[0]);

    // Clear the form fields
    document.getElementById('receiverAddress').value = '';
    document.getElementById('shareFileHash').value = '';

    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('shareModal'));
    modal.hide();
  } catch (error) {
    console.error(error);
    alert('Error granting access.');
  }
});

// Access Shared File
document.getElementById('accessFileButton').addEventListener('click', async () => {
  const sender = document.getElementById('senderAddress').value.trim();
  const fileHash = document.getElementById('fileHashInput').value.trim();

  // Validate inputs
  if (!web3.utils.isAddress(sender)) {
    return alert('Invalid Ethereum address for sender.');
  }

  if (!fileHash) {
    return alert('Please enter a valid file hash.');
  }

  try {
    // Check if the user has access to the file
    const hasAccess = await contract.methods.hasAccess(fileHash, accounts[0]).call();
    if (hasAccess) {
      // Fetch file details
      const fileDetails = await contract.methods.getFileDetails(fileHash).call();
      console.log("File Details:", fileDetails);

      // Access properties directly
      const fileName = fileDetails.fileName;
      const description = fileDetails.description;
      const timestamp = fileDetails.timestamp; // BigNumber
      const owner = fileDetails.owner;

      // Convert timestamp to readable date
      const date = new Date(Number(timestamp) * 1000).toLocaleString();

      // Create a Download Button
      const downloadButton = `
        <button class="btn btn-sm btn-success" onclick="downloadFile('${fileHash}')">
          <i class="bi bi-download"></i> Download
        </button>
      `;

      // Append a new row to the table
      const row = `
        <tr>
          <td>${owner}</td>
          <td>${fileName}</td>
          <td>${description}</td>
          <td>${fileHash}</td>
          <td>${downloadButton}</td>
        </tr>
      `;
      const fileListTable = document.getElementById('fileListTable');
      fileListTable.innerHTML += row;

      // Notify the user
      alert(`You have access to the file. It has been added to your file list.`);

      // Clear the form fields
      document.getElementById('senderAddress').value = '';
      document.getElementById('fileHashInput').value = '';
    } else {
      alert('You do not have access to this file.');
    }
  } catch (error) {
    console.error('Error checking access:', error);
    alert('An error occurred while checking access.');
  }
});

// Load files uploaded by the connected account and shared access list
async function loadFilesForAccount(account) {
  try {
    const fileHashes = await contract.methods.getFilesByUser(account).call();
    console.log("File Hashes:", fileHashes);

    // Clear previous entries in both tables
    const fileListTable = document.getElementById('fileListTable');
    const sharedAccessTable = document.getElementById('sharedAccessTable');
    fileListTable.innerHTML = '';
    sharedAccessTable.innerHTML = '';

    if (!Array.isArray(fileHashes) || fileHashes.length === 0) {
      fileListTable.innerHTML = '<tr><td colspan="5">No files uploaded yet.</td></tr>';
      sharedAccessTable.innerHTML = '<tr><td colspan="2">No files shared yet.</td></tr>';
      return;
    }

    for (const fileHash of fileHashes) {
      try {
        const fileDetails = await contract.methods.getFileDetails(fileHash).call();
        console.log("File Details:", fileDetails);

        const fileName = fileDetails.fileName;
        const description = fileDetails.description;
        const timestamp = fileDetails.timestamp;
        const owner = fileDetails.owner;

        const date = new Date(Number(timestamp) * 1000).toLocaleString();

        // Create a Download Button
        const downloadButton = `
          <button class="btn btn-sm btn-success" onclick="downloadFile('${fileHash}')">
            <i class="bi bi-download"></i> Download
          </button>
        `;

        // Append a new row to the Uploaded Files table
        const row = `
          <tr>
            <td>${owner}</td>
            <td>${fileName}</td>
            <td>${description}</td>
            <td>${fileHash}</td>
            <td>${downloadButton}</td>
          </tr>
        `;
        fileListTable.innerHTML += row;

        // Fetch the list of addresses with access
        const accessList = await contract.methods.getFileAccessList(fileHash).call();
        console.log(`Access List for ${fileHash}:`, accessList);

        if (accessList.length > 0) {
          // Append a new row to the Shared Access List table
          const sharedRow = `
            <tr>
              <td>${fileHash}</td>
              <td>${accessList.join(", ")}</td>
            </tr>
          `;
          sharedAccessTable.innerHTML += sharedRow;
        }
      } catch (error) {
        console.error(`Error fetching details for file hash: ${fileHash}`, error);
      }
    }
  } catch (error) {
    console.error('Error loading files:', error);
    alert('Error loading files.');
  }
}

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
    console.log("Pinata Response:", result); // Log the full response
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw error;
  }
}

// Download File from IPFS
// Download File from IPFS
async function downloadFile(fileHash) {
  const ipfsGatewayUrl = `https://ipfs.io/ipfs/${fileHash}`;
  try {
    // Fetch the file from the IPFS gateway
    const response = await fetch(ipfsGatewayUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Get the file as a blob
    const blob = await response.blob();

    // Create a temporary anchor element to trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Extract the file name from the Content-Disposition header or use the file hash as a fallback
    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = fileHash; // Default to file hash
    if (contentDisposition && contentDisposition.includes('filename=')) {
      fileName = contentDisposition.split('filename=')[1].split(';')[0].replace(/['"]/g, '');
    }

    // Set the download attribute to trigger the download
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Clean up
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('Error downloading file.');
  }
}