import { BigNumber, ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { IDeposit, ILoan } from "../utils/interfaces";
import { NFTLENDER_ABI, NFTLENDER_CONTRACT_ADDRESS, useGetDebtAmountForLoan, useGetFullDebt, useHealthFactor } from "./use-nftlender";

export function useReimburseLoan(
  fromAddress: string | undefined, 
  loanId: number | undefined,
  loan: ILoan,
  onSuccessHandler: () => any):
  {
    reimburseLoan: any,
    dataReimburseLoan: any,
    isLoadingReimburseLoan: boolean,
    isSuccessReimburseLoan: boolean,
    refetchReimburseLoan: (options?: any) => any,
  } {
    const debtAmount: BigNumber = useGetDebtAmountForLoan(fromAddress, loan);
    
    const {config, error, refetch: refetchReimburseLoan} = usePrepareContractWrite({
      addressOrName: NFTLENDER_CONTRACT_ADDRESS,
      contractInterface: NFTLENDER_ABI,
      functionName: 'reimburseLoan',
      args: [ethers.BigNumber.from(Boolean(loanId) ? loanId : 0)],
      overrides: {
        from: fromAddress,
        value: debtAmount
      },
      enabled: Boolean(fromAddress),
      onError(err) {
        console.log("ERROOOOOOR");
        console.log(err);
        
      }
    });

    const { data: dataReimburseLoan, write: reimburseLoan } = useContractWrite(config);
    const { isLoading: isLoadingReimburseLoan, isSuccess: isSuccessReimburseLoan } = useWaitForTransaction({
      confirmations: 1,
      hash: dataReimburseLoan?.hash,
      onSuccess(data) {
        onSuccessHandler()
      }
    });

    return {reimburseLoan, dataReimburseLoan, isLoadingReimburseLoan, isSuccessReimburseLoan, refetchReimburseLoan};
}

export const useReimburseAllDebt = (
  address: string | undefined,
  loans: ILoan[],
  onSuccessHandler: () => any):
  {
    reimburseAll: any,
    dataReimburseAll: any,
    isLoadingReimburseAll: boolean,
    isSuccessReimburseAll: boolean,
    refetchPrepareReimburseAll: (options?: any) => any,
  } => {
    const {fullDebt, refetch} = useGetFullDebt(address);
    
    const {config, error, refetch: refetchPrepareReimburseAll} = usePrepareContractWrite({
      addressOrName: NFTLENDER_CONTRACT_ADDRESS,
      contractInterface: NFTLENDER_ABI,
      functionName: 'reimburseAllDebt',
      enabled: Boolean(address) && Boolean(fullDebt) && loans.length !== 0,
      overrides: {
        value: fullDebt
      }
    })

    const { data: dataReimburseAll, write: reimburseAll } = useContractWrite(config);
    
    const { isLoading: isLoadingReimburseAll, isSuccess: isSuccessReimburseAll } = useWaitForTransaction({
      confirmations: 1,
      hash: dataReimburseAll?.hash,
      onSuccess(data) {
        onSuccessHandler()
      },
      onError(err) {
        console.log(err);
        
      }
    })    

    return {reimburseAll, dataReimburseAll, isLoadingReimburseAll, isSuccessReimburseAll, refetchPrepareReimburseAll};
}