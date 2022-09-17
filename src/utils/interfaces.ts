import { BigNumber } from "ethers";
import { Interface } from "ethers/lib/utils";

export interface IDeposit {
  address: string;
  tokenId: BigNumber;
  startTime: BigNumber;
}

export interface ILoan {
  amount: BigNumber;
  startTime: BigNumber;
  lastReimbursment: BigNumber;
}

export interface IChainConfig {
	[key: number]: {
		rpcUrl: string
		nftLenderAddress: string
		oracleAddress: string
		dummyNFTAddress: string | undefined
    nftLenderABI: Interface
		oracleABI: Interface
		dummyNFTABI: Interface
	}
}