import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { NFTLENDER_ABI, NFTLENDER_CONTRACT_ADDRESS } from "./use-nftlender";

export function useBorrow(
  borrowAmount: string,
  onSuccessHandler: () => any,): {
    borrow: any,
    isLoadingBorrow: boolean,
    isSuccessBorrow: boolean,
    refetchPrepareBorrow?: () => void} {
  const {config, error, refetch: refetchPrepareBorrow} = usePrepareContractWrite({
    addressOrName: NFTLENDER_CONTRACT_ADDRESS,
    contractInterface: NFTLENDER_ABI,
    functionName: 'borrow',
    args: [borrowAmount === '' ? BigNumber.from(0) : parseUnits(borrowAmount)],
    cacheTime: 0,
    enabled: Boolean(borrowAmount)
  })

  const {data, write: borrow} = useContractWrite(config);
  const { isLoading: isLoadingBorrow, isSuccess: isSuccessBorrow } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
    onSuccess() {
      console.log("SUCCESS");
      onSuccessHandler?.();
    }
  });

  return {borrow, isLoadingBorrow, isSuccessBorrow, refetchPrepareBorrow};
}