import { BigNumber, ethers } from 'ethers';
import { useContractRead, useNetwork } from 'wagmi';
import { chainConfig } from '../assets/constants';

import { IDeposit, ILoan } from '../utils/interfaces';

export const INTEREST_RATE = 316887385;

export function useGetFloorPrice(forAddress?: string | undefined): {floorPrice: BigNumber, isError: boolean, refetch: (options?: any) => any} {
  const { chain } = useNetwork()
  let contracts = chainConfig[chain?.id ?? 5] ?? chainConfig[5];

  forAddress = contracts.dummyNFTAddress;

  const { data, isError, refetch } = useContractRead({
    addressOrName: contracts.nftLenderAddress,
    contractInterface: contracts.nftLenderABI,
    functionName: 'getFloorPrice',
    args: [forAddress],
    watch: true,
    cacheTime: 0
  })

  const floorPrice = data ? BigNumber.from(data) : BigNumber.from(0);
  
  return { floorPrice, isError, refetch };
}

export function useMaxAmountLoan(forAddress: string | undefined): {maxAmountLoan: BigNumber, error: Error | null, refetch: (options?: any) => any} {
  const { chain } = useNetwork()
  let contracts = chainConfig[chain?.id ?? 5] ?? chainConfig[5];
  const { data, error, refetch } = useContractRead({
    addressOrName: contracts.nftLenderAddress,
    contractInterface: contracts.nftLenderABI,
    functionName: 'maxAmountLoan',
    args: [forAddress!],
    enabled: Boolean(forAddress),
    watch: true
  })

  const maxAmountLoan: BigNumber = data ? BigNumber.from(data) : BigNumber.from(0);
  
  return { maxAmountLoan, error, refetch };
}

export function useGetFullDebt(forAddress: string | undefined): {fullDebt: BigNumber, error: Error | null, refetch: (options?: any) => any} {
  const { chain } = useNetwork()
  let contracts = chainConfig[chain?.id ?? 5] ?? chainConfig[5];
    
  const { data, error, refetch } = useContractRead({
    addressOrName: contracts.nftLenderAddress,
    contractInterface: contracts.nftLenderABI,
    functionName: 'getFullDebt',
    enabled: Boolean(forAddress),
    overrides: { from: forAddress },
    watch: true,
    cacheTime: 0
  });
  
  const fullDebt: BigNumber = data? BigNumber.from(data): BigNumber.from(0);
  
  return { fullDebt, error, refetch };
}

export function useWithdrawAmountLeft(forAddress: string | undefined): BigNumber {
  const {maxAmountLoan} = useMaxAmountLoan(forAddress);
  const {fullDebt} = useGetFullDebt(forAddress);

  return maxAmountLoan.sub(fullDebt);
}

export function useHealthFactor(
  forAddress: string | undefined,
  nftToWithdraw?: {contractAddress: string | undefined, id: BigNumber | undefined}): {healthFactor: BigNumber, refetchHealthFactor: any} {
    const { chain } = useNetwork();
    let contracts = chainConfig[chain?.id ?? 5] ?? chainConfig[5];
    
    const { data, error, refetch: refetchHealthFactor } = useContractRead({
      addressOrName: contracts.nftLenderAddress,
      contractInterface: contracts.nftLenderABI,
      functionName: 'getHealthFactor',
      enabled: Boolean(forAddress) && !nftToWithdraw,
      overrides: { from: forAddress },
      watch: true
    });

    const {deposits} = useGetDeposits(forAddress);
    const {fullDebt} = useGetFullDebt(forAddress);
    const {floorPrice} = useGetFloorPrice(nftToWithdraw?.contractAddress)
    
    if (!nftToWithdraw) {
      const healthFactor: BigNumber = data? BigNumber.from(data) : BigNumber.from(0);
      return { healthFactor, refetchHealthFactor };
    } else {
      if (fullDebt.eq(BigNumber.from('0'))) {
        return { healthFactor: BigNumber.from('0'), refetchHealthFactor };
      }
  
      let collateral = deposits.reduce((prevVal, currVal) => {   
        if (nftToWithdraw!.contractAddress! === currVal.address && nftToWithdraw!.id!.eq(currVal.tokenId)) {
          return prevVal;
        }
        return prevVal.add(floorPrice);
      }, BigNumber.from('0'));
      
      const liquidationThreshold = collateral
        .mul(BigNumber.from('8000'))
        .div(BigNumber.from('100'));
  
      return { healthFactor: liquidationThreshold.div(fullDebt), refetchHealthFactor };
    }
}

export function useGetDeposits(forAddress: string | undefined): {deposits: IDeposit[], error: Error | null, refetch: (options?: any) => any} {
  const { chain } = useNetwork();
  let contracts = chainConfig[chain?.id ?? 5] ?? chainConfig[5];

  const { data, error, refetch } = useContractRead({
    addressOrName: contracts.nftLenderAddress,
    contractInterface: contracts.nftLenderABI,
    functionName: 'getDepositFor',
    args: [forAddress],
    enabled: Boolean(forAddress),
    watch: true,
  });

  let deposits: IDeposit[];
  
  if (data) {
    deposits = data!.map(item => {
      return {address: item[0], tokenId: item[1], startTime: item[2]}
    });
  } else {
    deposits = [];
  }  
  
  return { deposits, error, refetch };
}

export function useGetLoans(forAddress: string | undefined): {loans: ILoan[], error: Error | null, refetch: (options?: any) => any} {
  const { chain } = useNetwork()
  let contracts = chainConfig[chain?.id ?? 5] ?? chainConfig[5];
  
  const { data, error, refetch } = useContractRead({
    addressOrName: contracts.nftLenderAddress,
    contractInterface: contracts.nftLenderABI,
    functionName: 'getLoanFor',
    args: [forAddress],
    enabled: Boolean(forAddress),
    watch: true,
    cacheTime: 0
  });

  let loans: ILoan[];

  if (data) {
    loans = data!.map(item => {
      return {amount: item[0], startTime: item[1], lastReimbursment: item[2]}
    });
  } else {
    loans = [];
  }
  
  return { loans, error, refetch };
}

export const useGetDebtAmountForLoan = (address: string | undefined, loan?: ILoan): BigNumber => {
  return getDebtAmountForLoan(loan);
}

export const getDebtAmountForLoan = (loan?: ILoan): BigNumber => {
  if (loan) {
    const timeElapsed = BigNumber.from(Date.now()).div(1_000).sub(loan.lastReimbursment);
    const interest = loan.amount.div(ethers.utils.parseUnits("1", 15)).mul(INTEREST_RATE);
    const fee = timeElapsed.mul(interest)
  
    return loan.amount.add(fee);
  }

  return BigNumber.from(0);
}


