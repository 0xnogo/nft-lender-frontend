import { BigNumber, ethers } from "ethers";
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { chainConfig } from "../assets/constants";
import { IDeposit } from "../utils/interfaces";
import { useGetFullDebt, useHealthFactor } from "./use-nftlender";

export function useWithdraw(
  contractAddress: string | undefined, 
  fromAddress: string | undefined, 
  id: BigNumber | undefined,
  onSuccessHandler: () => any):
  {
    withdraw: any,
    dataWithdraw: any,
    isLoadingWithdraw: boolean,
    isSuccessWithdraw: boolean,
    refetchPrepareWithdraw: (options?: any) => any,
  } {   
    const { chain } = useNetwork();
    const {healthFactor} = useHealthFactor(fromAddress, {contractAddress, id});
        
    const {config, refetch: refetchPrepareWithdraw} = usePrepareContractWrite({
      addressOrName: chainConfig[chain!.id].nftLenderAddress,
      contractInterface: chainConfig[chain!.id].nftLenderABI,
      functionName: 'withdraw',
      args: [contractAddress, ethers.BigNumber.from(Boolean(id) ? id : 0)],
      enabled: Boolean(id) && Boolean(contractAddress) && healthFactor.gt(BigNumber.from('100')),
      onError(err) {
        console.log("ERROOOOOOR");
      }
    });

    const { data: dataWithdraw, write: withdraw } = useContractWrite(config);
    const { isLoading: isLoadingWithdraw, isSuccess: isSuccessWithdraw } = useWaitForTransaction({
      confirmations: 1,
      hash: dataWithdraw?.hash,
      onSuccess(data) {
        onSuccessHandler()
      }
    });

    return {withdraw, dataWithdraw, isLoadingWithdraw, isSuccessWithdraw, refetchPrepareWithdraw};
}

export const useWithdrawAll = (
  address: string | undefined,
  deposits: IDeposit[],
  onSuccessHandler: () => any):
  {
    withdrawAll: any,
    dataWithdrawAll: any,
    isLoadingWithdrawAll: boolean,
    isSuccessWithdrawAll: boolean,
    refetchPrepareWithdrawAll: (options?: any) => any,
  } => {
    const { chain } = useNetwork();
    const {fullDebt, refetch} = useGetFullDebt(address);
    
    const {config, error, refetch: refetchPrepareWithdrawAll} = usePrepareContractWrite({
      addressOrName: chainConfig[chain!.id].nftLenderAddress,
      contractInterface: chainConfig[chain!.id].nftLenderABI,
      functionName: 'withdrawAndReimburseAll',
      enabled: Boolean(address) && Boolean(fullDebt) && deposits.length !== 0,
      overrides: {
        value: fullDebt
      }
    })

    const { data: dataWithdrawAll, write: withdrawAll } = useContractWrite(config);
    
    const { isLoading: isLoadingWithdrawAll, isSuccess: isSuccessWithdrawAll } = useWaitForTransaction({
      confirmations: 1,
      hash: dataWithdrawAll?.hash,
      onSuccess(data) {
        onSuccessHandler()
      },
      onError(err) {
        console.log(err);
        
      }
    })    

    return {withdrawAll, dataWithdrawAll, isLoadingWithdrawAll, isSuccessWithdrawAll, refetchPrepareWithdrawAll};
}