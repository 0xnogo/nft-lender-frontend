import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { chainConfig } from "../assets/constants";

export function useBorrow(
  borrowAmount: string,
  onSuccessHandler: () => any,): {
    borrow: any,
    isLoadingBorrow: boolean,
    isSuccessBorrow: boolean,
    refetchPrepareBorrow?: () => void} {
      const { chain } = useNetwork()
    const {config, error, refetch: refetchPrepareBorrow} = usePrepareContractWrite({
      addressOrName: chainConfig[chain!.id].nftLenderAddress,
      contractInterface: chainConfig[chain!.id].nftLenderABI,
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