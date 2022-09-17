import { Tab } from '@headlessui/react';
import { useAccount } from 'wagmi';

import { Borrow } from '../../components/Borrow/Borrow';
import { Deposit } from '../../components/Deposit/Deposit';
import { Reimburse } from '../../components/Reimburse/Reimburse';
import { Withdraw } from '../../components/Withdraw/Withdraw';

function classNames(...classes : any[]) {
  return classes.filter(Boolean).join(' ')
}

const content = [
  {title: "Deposit", element: <Deposit />},
  {title: "Borrow", element: <Borrow />},
  {title: "Withdraw", element: <Withdraw />},
  {title: "Reimburse", element: <Reimburse />},
]

export const Manage = (props: any) => {
  const {isConnected} = useAccount();

  return (
    <div className="flex flex-col justify-center items-center w-full">
    {isConnected &&
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 w-full">
          {content.map((item, i) => {
            return (
              <Tab
              key={i}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
            {item.title}
            </Tab>)
          })}
        </Tab.List>
        <Tab.Panels className="mt-2 w-full">
          {content.map((item, i) => {
            return (
              <Tab.Panel
                key={i}
                className={classNames(
                  'rounded-xl',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
              >
                {item.element}
              </Tab.Panel>
            )
          })}
        </Tab.Panels>
      </Tab.Group>}
      {!isConnected && <div className='p-4 bg-gray-800 gap-y-4 rounded-md w-1/3 text-center justify-items-center self-center'>Please connect your wallet.</div>}
    </div>);
}