import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Button } from '../../components/UI/Button/Button';
import { Container } from '../../components/UI/Container/Container';
import { useGetFullDebtFor, useGetUserInDebt, useLiquidateAll } from '../../hooks/use-liquidate';
import { shrinkAddress } from '../../utils';

const inputStyle = "rounded-md bg-black p-4 focus:outline-none outline outline-1 outline-black hover:outline-1 hover:outline-blue-900"

export const Liquidate = (props: any): JSX.Element => {
  const potentialTargets = useGetUserInDebt();

  const [userToLiquidateId, setUserToLiquidateId] = useState<number>(0);
  
  const [userToLiquidateDebounced] = useDebounce(potentialTargets[userToLiquidateId], 500);
  const {liquidateAll, errorLiquidateAll, isLoadingLiquidateAll, isSuccessLiquidateAll} = useLiquidateAll(userToLiquidateDebounced);
  const debtAmount = useGetFullDebtFor(potentialTargets[userToLiquidateId]);

  const onLiquidateHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    liquidateAll?.({
      recklesslySetUnpreparedOverrides: {
        value: debtAmount.add(debtAmount.mul(10).div(100)).toString()
      }
    })
  }

  const buttonText = () => {    
    if (errorLiquidateAll) return errorLiquidateAll;
    if (isLoadingLiquidateAll) return "Liquidating...";
    return "Liquidate";
  }

  return (
    <Container title="Liquidate 😈">
      <p>Liquidate users positions by reimbursing their loans and you will get back the NFTs deposited at a discount. The following list gives you potential targets. You have to check if they are under-collateralized to liquidate.</p>

      {potentialTargets.length !== 0 && 
        <div>
          <p className="italic text-xs">Potential users to liquidate</p>
          <Listbox value={userToLiquidateId} onChange={setUserToLiquidateId}>
            <div className='relative mt-1'>
              <Listbox.Button className="bg-slate-600 relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{shrinkAddress(potentialTargets[userToLiquidateId])}</span>
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
                  {potentialTargets.map((target, i) => (
                    <Listbox.Option
                      key={i}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-500 text-white' : 'text-white'}`}
                      value={i}>
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {shrinkAddress(potentialTargets[i])}
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
        </div>
      }
      {potentialTargets.length === 0 && 
        <p>No potential targets to liquidate.</p>
      }
      <Button disabled={!liquidateAll} text={buttonText()} onClickHandler={onLiquidateHandler} style="btn-primary" styleAdded="self-center"/>
    </Container>)
}