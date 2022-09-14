import { BigNumber, ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { IDeposit } from "../utils/interfaces";
import { NFTLENDER_ABI, NFTLENDER_CONTRACT_ADDRESS, useGetFullDebt, useHealthFactor } from "./use-nftlender";

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
    const {healthFactor} = useHealthFactor(fromAddress, {contractAddress, id});
    console.log(healthFactor);
    
    const {config, refetch: refetchPrepareWithdraw} = usePrepareContractWrite({
      addressOrName: NFTLENDER_CONTRACT_ADDRESS,
      contractInterface: NFTLENDER_ABI,
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
    const {fullDebt, refetch} = useGetFullDebt(address);
    
    const {config, error, refetch: refetchPrepareWithdrawAll} = usePrepareContractWrite({
      addressOrName: NFTLENDER_CONTRACT_ADDRESS,
      contractInterface: NFTLENDER_ABI,
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