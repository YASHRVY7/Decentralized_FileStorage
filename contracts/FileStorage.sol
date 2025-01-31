// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string ipfsHash;
        address owner;
    }

    // Mapping from file hash to file details
    mapping(string => File) public files;

    // Mapping from user address to their uploaded file hashes
    mapping(address => string[]) public userFiles;

    // Access control mapping
    mapping(string => mapping(address => bool)) public accessList;

    event FileUploaded(string indexed ipfsHash, address indexed owner);
    event AccessGranted(string indexed ipfsHash, address indexed sender, address indexed receiver);

    // Upload a file and associate it with the uploader's address
    function uploadFile(string memory ipfsHash) public {
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
        files[ipfsHash] = File(ipfsHash, msg.sender);
        userFiles[msg.sender].push(ipfsHash); // Associate file with the uploader
        emit FileUploaded(ipfsHash, msg.sender);
    }

    // Grant access to another user
    function grantAccess(string memory ipfsHash, address receiver) public {
        require(files[ipfsHash].owner == msg.sender, "Only the owner can grant access");
        accessList[ipfsHash][receiver] = true;
        emit AccessGranted(ipfsHash, msg.sender, receiver);
    }

    // Check if a user has access to a file
    function hasAccess(string memory ipfsHash, address user) public view returns (bool) {
        return accessList[ipfsHash][user];
    }

    // Get all file hashes uploaded by a specific user
    function getFilesByUser(address user) public view returns (string[] memory) {
        return userFiles[user];
    }
}