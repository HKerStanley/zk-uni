const rlp = require('rlp');
const headerData = require('./headers.json');
const transactions = require('./transaction.json');
const { rpcWrapper, getReceiptProof } = require('../scripts/utils');

const { expect } = require('chai');

let MMRVerifier, HarmonyProver;
let prover, mmrVerifier;

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

/**
 * The HarmonyProver is being used for verifying users transferred and locked assets
 * in the bridge contract on Harmony blockchain
 */
describe('HarmonyProver', function () {
    beforeEach(async function () {
        MMRVerifier = await ethers.getContractFactory("MMRVerifier");
        mmrVerifier = await MMRVerifier.deploy();
        await mmrVerifier.deployed();

        // await HarmonyProver.link('MMRVerifier', mmrVerifier);
        HarmonyProver = await ethers.getContractFactory(
            "HarmonyProver",
            {
                libraries: {
                    MMRVerifier: mmrVerifier.address
                }
            }
        );
        prover = await HarmonyProver.deploy();
        await prover.deployed();
    });

    /**
     * The prover should be able to get the same block header hash
     * from header data as the header hash value of the header data
     */
    it('parse rlp block header', async function () {
        let header = await prover.toBlockHeader(hexToBytes(headerData.rlpheader));
        expect(header.hash).to.equal(headerData.hash);
    });

    /**
     * The transaction header should be included and the same
     * as the header hash in the transaction proof generated by the Harmony prover
     */
    it('parse transaction receipt proof', async function () {
        let callback = getReceiptProof;
        let callbackArgs = [
            process.env.LOCALNET,
            prover,
            transactions.hash
        ];
        let isTxn = true;
        let txProof = await rpcWrapper(
            transactions.hash,
            isTxn,
            callback,
            callbackArgs
        );
        console.log(txProof);
        expect(txProof.header.hash).to.equal(transactions.header);

        // let response = await prover.getBlockRlpData(txProof.header);
        // console.log(response);

        // let res = await test.bar([123, "abc", "0xD6dDd996B2d5B7DB22306654FD548bA2A58693AC"]);
        // // console.log(res);
    });
});

let TokenLockerOnEthereum, tokenLocker;
let HarmonyLightClient, lightclient;

/**
 * The TokenLocker should be able to take the proof from user and block header data
 * from the relayer and verify if the transaction is valid and recorded on Harmony
 * This can be done by simply verifying the MMR root of given epoch and block header
 */
describe('TokenLocker', function () {
    beforeEach(async function () {
        TokenLockerOnEthereum = await ethers.getContractFactory("TokenLockerOnEthereum");
        tokenLocker = await MMRVerifier.deploy();
        await tokenLocker.deployed();

        await tokenLocker.bind(tokenLocker.address);

        // // await HarmonyProver.link('MMRVerifier', mmrVerifier);
        // HarmonyProver = await ethers.getContractFactory(
        //     "HarmonyProver",
        //     {
        //         libraries: {
        //             MMRVerifier: mmrVerifier.address
        //         }
        //     }
        // );
        // prover = await HarmonyProver.deploy();
        // await prover.deployed();

        
    });

    it('issue map token test', async function () {
        
    });

    it('lock test', async function () {
        
    });

    it('unlock test', async function () {
        
    });

    it('light client upgrade test', async function () {
        
    });
});