const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

const proof = require('./proofs/proof_1');

contract('Test SolnSquareVerifier', accounts => {

    describe('test proof and housing tokens', function () {
        let instance;
        beforeEach(async function () {
            const snarkVerifier = await artifacts.require('Verifier').new({from: accounts[0]});
            this.contract = await SolnSquareVerifier.new(snarkVerifier.address, {from: accounts[0]});
            instance = this.contract;
        });

// Test if a new solution can be added for contract - SolnSquareVerifier
        it('a new solution can be added', async function () {
            assert.equal(await instance.solutionOwnerOf(proof.inputs[0]), 0);
            await instance.addSolutionToArrayAndEmitEvent(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, 1, {from: accounts[0]});
            assert.equal(await instance.solutionOwnerOf(proof.inputs[0]), accounts[0]);
        });

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('an ERC721 token can be minted', async function () {
            await instance.mint(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, accounts[1], 1, {from: accounts[0]});
        });

        it('same proof can\'t be reused', async function () {
            let errorThrown = false;
            await instance.mint(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, accounts[1], 1, {from: accounts[0]});
            await instance.mint(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, accounts[1], 1, {from: accounts[0]}).catch(() => errorThrown = true);
            assert.equal(errorThrown, true);
        });
	});

});
