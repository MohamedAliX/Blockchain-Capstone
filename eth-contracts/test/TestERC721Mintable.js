var ERC721MintableComplete = artifacts.require('HousingERC721Mintable');

const NUM_ACCOUNTS = 5;

const TOKEN_URL_PREFIX = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        let instance;
        beforeEach(async function () { 
            instance = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            for(let i = 1; i <= NUM_ACCOUNTS; i++) {
                await instance.mint(accounts[i], i, {from: accounts[0]});
            }
        })

        it('should return total supply', async function () { 
            assert.equal(Number(await instance.totalSupply()), NUM_ACCOUNTS);
        })

        it('should get token balance', async function () { 
            for(let i = 1; i <= NUM_ACCOUNTS; i++) {
                assert.equal(Number(await instance.balanceOf(accounts[i])), 1);
            }
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            for(let i = 1; i <= NUM_ACCOUNTS; i++) {
                assert.equal(await instance.tokenURI(i), `${TOKEN_URL_PREFIX}${i}`);
            }
        })

        it('should transfer token from one owner to another', async function () { 
            assert.equal(await instance.owner(), accounts[0]);
            await instance.transferOwnership(accounts[1], {from: accounts[0]});
            assert.equal(await instance.owner(), accounts[1]);
        })
    });

    describe('have ownership properties', function () {
        let instance;
        beforeEach(async function () { 
            instance = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let errorThrown = false;
            await instance.mint(accounts[1], 1, {from: accounts[1]}).catch(() => errorThrown = true);
            assert.equal(errorThrown, true);
        })

        it('should return contract owner', async function () {
            assert.equal(await instance.owner(), accounts[0]);
        })

    });
})