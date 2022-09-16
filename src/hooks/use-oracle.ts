import { BigNumber, ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import oracleJSON from '../assets/abis/OracleNftFloor.json';
import { DUMMYNFT_CONTRACT_ADDRESS } from './use-dummynft';

const ORACLE_CONTRACT_ABI = new Interface(oracleJSON.abi);
export const ORACLE_CONTRACT_ADDRESS = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512';

export function useSetFloorPrice(floorPrice: string, onSuccessHandler?: () => void): any {
  const { config, error } = usePrepareContractWrite({
    addressOrName: ORACLE_CONTRACT_ADDRESS,
    contractInterface: ORACLE_CONTRACT_ABI,
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

export function useGetFloorPrice(forAddress: string | undefined = DUMMYNFT_CONTRACT_ADDRESS): {floorPrice: BigNumber, isError: boolean, refetch: (options?: any) => any} {
  const { data, isError, refetch } = useContractRead({
    addressOrName: ORACLE_CONTRACT_ADDRESS,
    contractInterface: ORACLE_CONTRACT_ABI,
    functionName: 'getFloorPrice',
    args: forAddress,
    watch: true,
    cacheTime: 0
  })

  const floorPrice = data ? BigNumber.from(data) : BigNumber.from(0);
  console.log(floorPrice.toString());
  
  return { floorPrice, isError, refetch };
}