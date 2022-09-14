import { BigNumber } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { erc721ABI, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import dummyNFTJSON from '../assets/abis/DummyNFT.json';
import { NFTLENDER_CONTRACT_ADDRESS } from './use-nftlender';

const DUMMYNFT_CONTRACT_ABI = new Interface(dummyNFTJSON.abi);
export const DUMMYNFT_CONTRACT_ADDRESS = '0xd2d5e508c82efc205cafa4ad969a4395babce026';

export function useMintPrepare(): any {
  const { config, error } = usePrepareContractWrite({
    addressOrName: DUMMYNFT_CONTRACT_ADDRESS,
    contractInterface: DUMMYNFT_CONTRACT_ABI,
    functionName: 'selfMint',
  });

  return [config, error];
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
  id: string,
  toAddress: string = NFTLENDER_CONTRACT_ADDRESS): {isApproved: boolean, error: Error | null, refetch: any} {
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