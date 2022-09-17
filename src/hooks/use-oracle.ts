import { BigNumber, ethers } from 'ethers';
import { useContractRead, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import { chainConfig } from '../assets/constants';

export function useSetFloorPrice(floorPrice: string, onSuccessHandler?: () => void): any {
  const { chain } = useNetwork();
  const contracts = chainConfig[chain?.id ?? 5];

  const { config, error } = usePrepareContractWrite({
    addressOrName: contracts.oracleAddress,
    contractInterface: contracts.oracleABI,
    functionName: 'setFloorPrice',
    args: [ethers.utils.parseEther(floorPrice === "" ? '0' : floorPrice)]
  });
  
  const { data, write: setFloorPrice, isSuccess } = useContractWrite(config);
  const { isLoading: isLoadingSetFloorPrice, isSuccess: isSuccessSetFloorPrice } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
    onSuccess(data) {
      console.log("PRICE CHANGE");
      onSuccessHandler?.()
    }
  });

  return {setFloorPrice, isLoadingSetFloorPrice, isSuccessSetFloorPrice};
}

export function useGetFloorPrice(forAddress: string | undefined = chainConfig[1337].oracleAddress): {floorPrice: BigNumber, isError: boolean, refetch: (options?: any) => any} {
  const { chain } = useNetwork();
  const contracts = chainConfig[chain?.id ?? 5];

  const { data, isError, refetch } = useContractRead({
    addressOrName: contracts.oracleAddress,
    contractInterface: contracts.oracleABI,
    functionName: 'getFloorPrice',
    args: forAddress,
    watch: true,
    cacheTime: 0
  })

  const floorPrice = data ? BigNumber.from(data) : BigNumber.from(0);
  
  return { floorPrice, isError, refetch };
}