import { ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { NFTLENDER_ABI, NFTLENDER_CONTRACT_ADDRESS } from "./use-nftlender";

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
    refetchPrepareDeposit: (options?: any) => any,
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