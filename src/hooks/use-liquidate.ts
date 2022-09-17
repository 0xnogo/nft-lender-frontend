import { BigNumber, Contract } from 'ethers';
import { useEffect, useState } from 'react';
import { useContract, useContractWrite, usePrepareContractWrite, useProvider, useWaitForTransaction } from 'wagmi';

import { getDebtAmountForLoan, NFTLENDER_ABI, NFTLENDER_CONTRACT_ADDRESS, useGetLoans, useHealthFactor } from './use-nftlender';

export function useLiquidateAll(
  addressToLiquidate: string | undefined, 
  onSuccessHandler?: () => any):
  {
    liquidateAll: any,
    errorLiquidateAll: string | undefined,
    dataLiquidateAll: any,
    isLoadingLiquidateAll: boolean,
    isSuccessLiquidateAll: boolean,
    refetchLiquidateAll: (options?: any) => any,
  } {

    const debtAmount: BigNumber = useGetFullDebtFor(addressToLiquidate);
    const {healthFactor} = useHealthFactor(addressToLiquidate)
    
    const {config, error, refetch: refetchLiquidateAll} = usePrepareContractWrite({
      addressOrName: NFTLENDER_CONTRACT_ADDRESS,
      contractInterface: NFTLENDER_ABI,
      functionName: 'liquidateAll',
      args: [addressToLiquidate],
      enabled: Boolean(addressToLiquidate) && healthFactor.lte(BigNumber.from(100)),
      overrides: {
        value: debtAmount
      }
    });

    let errorLiquidateAll = undefined;
    if (Boolean(addressToLiquidate) && !healthFactor.lte(BigNumber.from(100))) {
      errorLiquidateAll = "Not under collateralized";
    }
    
    const { data: dataLiquidateAll, write: liquidateAll } = useContractWrite(config);
    const { isLoading: isLoadingLiquidateAll, isSuccess: isSuccessLiquidateAll } = useWaitForTransaction({
      confirmations: 1,
      hash: dataLiquidateAll?.hash,
      onSuccess(data) {
        onSuccessHandler?.()
      }
    })

    return {liquidateAll, errorLiquidateAll, dataLiquidateAll, isLoadingLiquidateAll, isSuccessLiquidateAll, refetchLiquidateAll};
}

export const useGetUserInDebt = (): string[] => {
  const [users, setUsers] = useState<string[]>([]);

  const provider = useProvider();
  const contract: Contract = useContract({
    addressOrName: NFTLENDER_CONTRACT_ADDRESS,
    contractInterface: NFTLENDER_ABI,
    signerOrProvider: provider
  })

  useEffect(() => {
    const fetchEvent = async () => {        
      const borrowFilter = contract.filters.Borrow();
      const events = await contract.queryFilter(borrowFilter);
      
      const filtered: string[] = events.reduce((acc: string[], item) => {
        if (!acc.includes(item.args!["from"])) {
          acc.push(item.args!["from"])
        }
        return acc;
      }, [])
      setUsers(filtered);
    }
    try {
      fetchEvent()
    } catch (e) {
      console.log(e);
    }

  }, [])

  return users;
}

export const useGetFullDebtFor = (address: string | undefined): BigNumber => {
  const {loans} = useGetLoans(address);

  const fullDebt = loans.reduce((acc, loan) => {
    return acc.add(getDebtAmountForLoan(loan))
  }, BigNumber.from('0'))

  return fullDebt;
}