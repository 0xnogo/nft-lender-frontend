import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Spinner } from 'flowbite-react';
import { Fragment, useContext, useState } from 'react';
import { useAccount } from 'wagmi';

import { useGetDeposits, useGetFullDebt } from '../../hooks/use-nftlender';
import { useWithdraw, useWithdrawAll } from '../../hooks/use-withdraw';
import AlertContext from '../../store/alert-context';
import { shrinkAddress } from '../../utils';
import { IDeposit } from '../../utils/interfaces';
import { Button } from '../UI/Button/Button';
import { Container } from '../UI/Container/Container';

const generateTitle = (deposit: IDeposit): string => {
  return `token id: ${deposit.tokenId} - ${shrinkAddress(deposit.address)}`;
}
export const Withdraw = (props: any): JSX.Element => {
  // context
  const {onAlertHandler} = useContext(AlertContext);
  
  const {address} = useAccount();
  const [idSelected, setIdSelected] = useState<number>(0)
  
  const {deposits, refetch: refetchDeposits} = useGetDeposits(address);
  const {fullDebt, refetch: refetchFullDebt} = useGetFullDebt(address);

  const {withdrawAll, isLoadingWithdrawAll, refetchPrepareWithdrawAll} = useWithdrawAll(address, deposits, () => {
    onAlertHandler({message: "Withdraw all and reimburse successful", alertType: "success"})
    refetchDeposits?.();
    refetchPrepareWithdrawAll?.();
  });

  const {withdraw, isLoadingWithdraw, refetchPrepareWithdraw} = useWithdraw(
    deposits[idSelected]?.address, 
    address,
    deposits[idSelected]?.tokenId, 
    () => {
      onAlertHandler({message: "Withdraw successful", alertType: "success"})
      refetchDeposits?.();
      setIdSelected(0);
      refetchPrepareWithdraw?.();
  });
  
  const onWithdrawHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    withdraw?.();
  }

  const onWithdrawAllHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    refetchFullDebt?.();
    withdrawAll?.({
      recklesslySetUnpreparedOverrides: {
        value: fullDebt.add(fullDebt.mul(10).div(100))
      }
    });
  }

  const generateButtonText = (text: string, isLoading?: boolean) => {
    return isLoading? <><Spinner />Loading...</> : text;
  }

  return (
    <Container title="Withdraw">
      {deposits.length !== 0 && 
        <Listbox value={idSelected} onChange={setIdSelected}>
          <div className='relative mt-1'>
            <Listbox.Button className="bg-slate-600 relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">{generateTitle(deposits[idSelected])}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
              </span>
            </Listbox.Button>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
              <Listbox.Options className="bg-slate-600 absolute mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {deposits.map((deposit, i) => (
                  <Listbox.Option
                    key={deposit.tokenId + deposit.address}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-500 text-white' : 'text-white'}`}
                    value={i}>
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {generateTitle(deposit)}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                            <CheckIcon className="h-5 w-5 text-white" aria-hidden="true"/>
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      }
      {deposits.length === 0 && <p>No deposit made</p>}
        
      <Button text={generateButtonText("Withdraw", isLoadingWithdraw)} style="btn-primary" onClickHandler={onWithdrawHandler} disabled={!withdraw} styleAdded="w-1/3 self-center" />
      <Button text={generateButtonText("Withdraw and reimburse all", isLoadingWithdrawAll)} style="btn-primary" onClickHandler={onWithdrawAllHandler} disabled={!withdrawAll} styleAdded="w-1/3 self-center"/>
    </Container>);
}