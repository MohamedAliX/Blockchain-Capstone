pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract ISquareVerifier {
    function verifyTx(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c, uint[2] memory input
        ) public view returns (bool r);
}



// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is HousingERC721Mintable {

    ISquareVerifier public verifier;

    constructor(address verifierAddress) public {
        verifier = ISquareVerifier(verifierAddress);
    }


// TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint[2] a;
        uint[2][2] b;
        uint[2] c;
        uint[2] input;
        uint256 index;
        address owner;
        bool exists;
    }


// TODO define an array of the above struct
    Solution[] private solutionsArr;


// TODO define a mapping to store unique solutions submitted
    mapping(uint256 => Solution) solutionsMapping;

    function solutionOwnerOf(uint256 input) public view returns (address) {
        return solutionsMapping[input].owner;
    }


// TODO Create an event to emit when a solution is added
    event SolutionAdded(address indexed owner, uint256 indexed solutionsArrIndex, uint[2] indexed input, uint[2] a, uint[2][2] b, uint[2] c);


// TODO Create a function to add the solutions to the array and emit the event
    function _verifySnarkProof(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) internal view {
        require(!solutionsMapping[input[0]].exists, strConcat("Solution for input ", uint2str(input[0]), " already exists"));
        require(verifier.verifyTx(a, b, c, input), "Invalid solution.. didn't pass");
    }

    function _addSolutionToArrayAndEmitEvent(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, uint256 tokenId) internal {
        Solution memory sol = Solution(a, b, c, input, solutionsArr.length, ownerOf(tokenId) == address(0) ? owner() : ownerOf(tokenId), true);
        solutionsMapping[sol.input[0]] = sol;
        solutionsArr.push(sol);
        emit SolutionAdded(sol.owner, sol.index, sol.input, sol.a, sol.b, sol.c);
    }

    function addSolutionToArrayAndEmitEvent(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, uint256 tokenId) public onlyOwner whenNotPaused {
        _verifySnarkProof(a, b, c, input);
        _addSolutionToArrayAndEmitEvent(a, b, c, input, tokenId);
    }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function mint(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input, address to, uint256 tokenId) public onlyOwner whenNotPaused {
        _verifySnarkProof(a, b, c, input);
        super.mint(to, tokenId);
        _addSolutionToArrayAndEmitEvent(a, b, c, input, tokenId);
    }
}
  


























