import { BigNumber } from 'ethers';
import {
  erc721ABI,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import { chainConfig } from '../assets/constants';

export function useMint(onSuccessHandler?: () => void): any {
  const { chain } = useNetwork()
  
  const { config, error } = usePrepareContractWrite({
    addressOrName: chainConfig[chain!.id].dummyNFTAddress!,
    contractInterface: chainConfig[chain!.id].dummyNFTABI,
    functionName: 'selfMint',
  });

  const { data, write: mint, isSuccess } = useContractWrite(config);
  const { isLoading: isLoadingMint, isSuccess: isSuccessMint } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
    onSuccess(data) {
      onSuccessHandler?.()
    }
  })

  return {mint, isLoadingMint, isSuccessMint};
}

export function useGetApproved(
  contractAddress: string,
  id: string | number | BigNumber): {addressApproved: string | undefined, error: Error | null, refetch: any} {
  const { data, error, refetch } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: erc721ABI,
    functionName: 'getApproved',
    args: [id],
    enabled: Boolean(id),
  });

  return {addressApproved: data?.toString().toLocaleLowerCase(), error, refetch};
}

export function useGetOwner(
  contractAddress: string,
  id: string | number | BigNumber): {owner: string | undefined, error: Error | null, refetch: any} {
  const { data, error, refetch } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: erc721ABI,
    functionName: 'ownerOf',
    args: [id],
    watch: true,
  });

  return {owner: data?.toString().toLocaleLowerCase(), error, refetch};
}

export function useIsApproved(
  contractAddress: string,
  id: string): {isApproved: boolean, error: Error | null, refetch: any} {
    const { chain } = useNetwork();
    const toAddress = chainConfig[chain!.id].nftLenderAddress;

    const { data, error, refetch } = useContractRead({
      addressOrName: contractAddress,
      contractInterface: erc721ABI,
      functionName: 'getApproved',
      args: [id],
      watch: true,
    });

    let isApproved: boolean = false;
    if (toAddress.toLocaleLowerCase() === data?.toString().toLocaleLowerCase()) {
      isApproved = true;
    }

    return {isApproved, error, refetch};
}

export function useApprove(
  contractAddress: string, 
  toAddress: string,
  id: string,
  onSuccessHandler: () => void,
  isOwner: boolean, 
  isDeposited: boolean,
  owner?: string): 
  {
    approve: any, 
    isLoadingApprove: boolean, 
    isSuccessApprove: boolean, 
    refetchPrepareApprove: (options?: any) => any} { 
      
  const { config, refetch: refetchPrepareApprove } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: erc721ABI,
    functionName: 'approve',
    args: [toAddress, id],
    enabled: Boolean(toAddress) && Boolean(id) && Boolean(owner) && isOwner && !isDeposited,
    onError(err) {
      console.log(err);
      console.log("ERROOOOOOR APPROVE");
    }
  })

  const { data, write: approve } = useContractWrite(config);

  const { isLoading: isLoadingApprove, isSuccess: isSuccessApprove } = useWaitForTransaction({
    confirmations: 1, 
    hash: data?.hash,
    onSuccess(data) {
      onSuccessHandler();
    },
    onError(err) {
      console.log(err);
    },
  })

  return {approve, isLoadingApprove, isSuccessApprove, refetchPrepareApprove};
}