import { BigNumber, BigNumberish, ethers } from 'ethers';
import { Interface, parseUnits } from 'ethers/lib/utils';
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import nftLenderJSON from '../assets/abis/NFTLender.json';

const NFTLENDER_ABI = new Interface(nftLenderJSON.abi);
export const NFTLENDER_CONTRACT_ADDRESS = '0xdde78e6202518ff4936b5302cc2891ec180e8bff';

export function useGetFloorPrice(): {data: BigNumberish | undefined, isError: boolean, refetch: <TPageData>(options?: any) => any} {
  const { data, isError, refetch } = useContractRead({
    addressOrName: NFTLENDER_CONTRACT_ADDRESS,
    contractInterface: NFTLENDER_ABI,
    functionName: 'getFloorPrice',
    args: '0xa0ee7a142d267c1f36714e4a8f75612f20a79720',
  })

  return { data, isError, refetch };
}

export function useMaxAmountLoan(forAddress: string | undefined): {maxAmountLoan: BigNumberish, error: Error | null, refetch: <TPageData>(options?: any) => any} {
  const { data, error, refetch } = useContractRead({
    addressOrName: NFTLENDER_CONTRACT_ADDRESS,
    contractInterface: nftLenderJSON.abi,
    functionName: 'maxAmountLoan',
    args: forAddress!,
    enabled: Boolean(forAddress),
    watch: true
  })

  console.log(error);

  const maxAmountLoan: BigNumberish = data? BigNumber.from(data) : BigNumber.from(0);
  
  return { maxAmountLoan, error, refetch };
}

export function useDeposit(
  address: string, 
  id: string | number,
  onSuccessHandler: () => any,
  isApproved: boolean,
  isDeposited: boolean):
  {
    deposit: any,
    dataDeposit: any,
    isLoadingDeposit: boolean,
    isSuccessDeposit: boolean,
    refetchPrepareDeposit: <TPageData>(options?: any) => any,
  } {   
  const {config, refetch: refetchPrepareDeposit} = usePrepareContractWrite({
    addressOrName: NFTLENDER_CONTRACT_ADDRESS,
    contractInterface: NFTLENDER_ABI,
    functionName: 'deposit',
    args: [address, ethers.BigNumber.from(id === '' ? 0 : id)],
    enabled: Boolean(id) && Boolean(address) && isApproved && !isDeposited,
    onError(err) {
      console.log(err);
      console.log("ERROOOOOOR");
    }
  })

  const { data: dataDeposit, write: deposit } = useContractWrite(config);
  const { isLoading: isLoadingDeposit, isSuccess: isSuccessDeposit } = useWaitForTransaction({
    confirmations: 1,
    hash: dataDeposit?.hash,
    onSuccess(data) {
      onSuccessHandler()
    }
  })

  return {deposit, dataDeposit, isLoadingDeposit, isSuccessDeposit, refetchPrepareDeposit};
}

export function useBorrow(
  borrowAmount: string): {
    borrow: any,
    isLoadingBorrow: boolean,
    isSuccessBorrow: boolean,
    refetchPrepareBorrow: () => any} {
  const {config, error, refetch: refetchPrepareBorrow} = usePrepareContractWrite({
    addressOrName: NFTLENDER_CONTRACT_ADDRESS,
    contractInterface: NFTLENDER_ABI,
    functionName: 'borrow',
    args: [borrowAmount === '' ? BigNumber.from(0) : parseUnits(borrowAmount)]
  })

  const {data, write: borrow} = useContractWrite(config);
  const { isLoading: isLoadingBorrow, isSuccess: isSuccessBorrow } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
    onSuccess() {
      console.log("SUCCESS")
    }
  });

  return {borrow, isLoadingBorrow, isSuccessBorrow, refetchPrepareBorrow};
}