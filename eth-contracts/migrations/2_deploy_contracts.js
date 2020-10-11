// migrating the appropriate contracts
var SquareVerifier = artifacts.require("Verifier");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var HousingERC721Mintable = artifacts.require("HousingERC721Mintable");

module.exports = function(deployer, network) {
	if(network == "develop") {
		deployer.deploy(HousingERC721Mintable);
	}
	deployer.deploy(SquareVerifier).then(() => {
		return deployer.deploy(SolnSquareVerifier, SquareVerifier.address);
	});
};
