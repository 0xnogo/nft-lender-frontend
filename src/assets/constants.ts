import { Interface } from "ethers/lib/utils";
import { IChainConfig } from "../utils/interfaces";
import nftLenderJSON from '../assets/abis/NFTLender.json';
import oracleJSON from '../assets/abis/OracleNftFloor.json';
import dummyNFTJSON from '../assets/abis/DummyNFT.json';

const GOERLI_ANKR_ID = process.env.REACT_APP_GOERLI_ANKR_ID
const GOERLI_ANKR_RPC: string = `https://rpc.ankr.com/eth_goerli/${GOERLI_ANKR_ID}`

const NFTLENDER_ABI = new Interface(nftLenderJSON.abi);
const ORACLE_CONTRACT_ABI = new Interface(oracleJSON.abi);
const DUMMYNFT_CONTRACT_ABI = new Interface(dummyNFTJSON.abi);

export const chainConfig: IChainConfig = {
	1337: {
		rpcUrl: "http://localhost:8545",
		nftLenderAddress: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
		oracleAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
		dummyNFTAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    nftLenderABI: NFTLENDER_ABI,
		oracleABI: ORACLE_CONTRACT_ABI,
		dummyNFTABI: DUMMYNFT_CONTRACT_ABI
	},
	5: {
    rpcUrl: GOERLI_ANKR_RPC,
		nftLenderAddress: '0x643de5253975d289c5966342094f9be8dbbbdba7',
		oracleAddress: '0x146d51b7c31bd7ef2577bb0c247f63741ba981e7',
		dummyNFTAddress: '0x8db9ec083bc954c57991b33bdd96ddaf9eca027c',
    nftLenderABI: NFTLENDER_ABI,
		oracleABI: ORACLE_CONTRACT_ABI,
		dummyNFTABI: DUMMYNFT_CONTRACT_ABI
	}
}