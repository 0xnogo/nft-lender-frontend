import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { BigNumber, ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { Fragment, useState } from 'react';
import { useAccount } from 'wagmi';

import { useGetDebtAmountForLoan, useGetFullDebt, useGetLoans } from '../../hooks/use-nftlender';
import { useReimburseAllDebt, useReimburseLoan } from '../../hooks/use-reimburse';
import { ILoan } from '../../utils/interfaces';
import { Button } from '../UI/Button/Button';
import { Container } from '../UI/Container/Container';

const fromSecToFormattedDate = (seconds: BigNumber): string => {
  const time = new Date(seconds.toNumber())
  return time.toLocaleString('en-GB',{timeZone:'UTC'});
}

const generateTitle = (loan: ILoan): string => {
  return `${formatUnits(loan.amount.toString())} Eth - ${fromSecToFormattedDate(loan.startTime)} (UTC)`;
}

export const Reimburse = (props: any): JSX.Element => {
  const {address} = useAccount();
  const [loanIdSelected, setLoanIdSelected] = useState<number>(0)
  
  const {loans, refetch: refetchLoans} = useGetLoans(address);
  const {fullDebt, refetch: refetchFullDebt} = useGetFullDebt(address);
  const debtAmount: BigNumber = useGetDebtAmountForLoan(address, loans[loanIdSelected]);

  const {reimburseAll, refetchPrepareReimburseAll} = useReimburseAllDebt(address, loans, () => {
    console.log("SUCCESS");
    refetchLoans?.();
    refetchPrepareReimburseAll?.();
  });

  const {reimburseLoan, refetchReimburseLoan} = useReimburseLoan(
    address,
    loanIdSelected,
    loans[loanIdSelected],  
    () => {
      console.log("SUCCESS");
      refetchLoans?.();
      setLoanIdSelected(0);
      refetchReimburseLoan?.();
  });
  
  const onReimburseHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log(debtAmount.add(debtAmount.mul(10).div(100)).toString());
    
    reimburseLoan?.({
      recklesslySetUnpreparedOverrides: {
        value: debtAmount.add(debtAmount.mul(10).div(100)).toString()
      }
    });
  }

  const onReimburseAllHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    refetchFullDebt?.();
    reimburseAll?.({
      recklesslySetUnpreparedOverrides: {
        value: fullDebt.add(fullDebt.mul(10).div(100))
      }
    });
  }

  return (
    <Container title="Reimburse">
      {loans.length !== 0 && 
        <Listbox value={loanIdSelected} onChange={setLoanIdSelected}>
          <div className='relative mt-1'>
            <Listbox.Button className="bg-slate-600 relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">{generateTitle(loans[loanIdSelected])}</span>
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
                {loans.map((loan, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-500 text-white' : 'text-white'}`}
                    value={i}>
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {generateTitle(loan)}
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
      {loans.length === 0 && <p>No loan made</p>}
        
      <Button text="Reimburse" style="btn-primary" onClickHandler={onReimburseHandler} disabled={!reimburseLoan} styleAdded="w-1/3 self-center" />
      <Button text="Reimburse all" style="btn-primary" onClickHandler={onReimburseAllHandler} disabled={!reimburseAll} styleAdded="w-1/3 self-center"/>
    </Container>);
}