import { BigNumber } from "ethers";

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