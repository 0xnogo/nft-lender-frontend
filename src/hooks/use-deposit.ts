import { ethers } from "ethers";
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { chainConfig } from "../assets/constants";

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
    const { chain } = useNetwork();
    const {config, refetch: refetchPrepareDeposit} = usePrepareContractWrite({
      addressOrName: chainConfig[chain!.id].nftLenderAddress,
      contractInterface: chainConfig[chain!.id].nftLenderABI,
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