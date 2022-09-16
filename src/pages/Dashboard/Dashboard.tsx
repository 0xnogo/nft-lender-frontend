import { ArchiveBoxArrowDownIcon, CalculatorIcon, CheckIcon, HeartIcon } from '@heroicons/react/20/solid';
import { BigNumber } from 'ethers';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { MetricBox } from '../../components/UI/MetricBox/MetricBox';
import { Table } from '../../components/UI/Table/Table';
import { useGetDeposits, useGetFloorPrice, useGetFullDebt, useGetLoans, useHealthFactor } from '../../hooks/use-nftlender';
import { fromSecToFormattedDate, shrinkAddress, truncateAndConvertBNtoString } from '../../utils';
import { IDeposit, ILoan } from '../../utils/interfaces';

export const Dashboard= (props: any): JSX.Element => {
  const {address} = useAccount();
  const {fullDebt} = useGetFullDebt(address);
  const {healthFactor} = useHealthFactor(address);
  const {deposits} = useGetDeposits(address);
  const {loans} = useGetLoans(address);
  const {floorPrice} = useGetFloorPrice()

  const borrowedAmount = loans.reduce((prev, next) => prev.add(next.amount), BigNumber.from(0));

  const healthFactorDisplay = () => {
    if (loans.length === 0) return 'Safu';
    return (healthFactor.toNumber() / 100).toString();
  }

  // Hardcoded floor price for all nfts - change it with a call to contract or api
  const depositsBody = (deposits: IDeposit[]): any[][] => {
    if (!deposits) return []
    const result = deposits.map(item => {
      return [shrinkAddress(item.address), item.tokenId.toString(), truncateAndConvertBNtoString(floorPrice), fromSecToFormattedDate(item.startTime)]
    })
    return result
  }

  const loansBody = (loans: ILoan[]): any[][] => {
    if (!loans) return []
    const result = loans.map(item => {
      return [truncateAndConvertBNtoString(item.amount), fromSecToFormattedDate(item.startTime)]
    });
    return result
  }

  return <div className='flex flex-col w-full gap-y-10'>
      <div className='flex flex-row justify-center items-center w-full'>
        <div className="grid grid-cols-4 gap-x-2 h-28">
          <MetricBox title="NFT deposited" text={deposits.length.toLocaleString()} icon={<ArchiveBoxArrowDownIcon className="h-10 w-10 text-white" aria-hidden="true"/>}/>
          <MetricBox title="Borrowed amount" text={`${truncateAndConvertBNtoString(borrowedAmount)} ETH`} icon={<CheckIcon className="h-10 w-10 text-white" aria-hidden="true"/>}/>
          <MetricBox title="Interest amount" text={`${truncateAndConvertBNtoString(fullDebt.sub(borrowedAmount))} ETH`} icon={<CalculatorIcon className="h-10 w-10 text-white" aria-hidden="true"/>}/>
          <MetricBox title="Health Factor" text={healthFactorDisplay()} icon={<HeartIcon className="h-10 w-10 text-white" aria-hidden="true"/>}/>
        </div>
      </div>
      <div className='flex justify-around gap-x-2'>
        <Table title='Deposits' headCells={["Collection address", "Token id", "Floor price", "Date of Deposit"]} bodyCells={depositsBody(deposits)} />
        <Table title='Loans' headCells={["Amount", "Start time"]} bodyCells={loansBody(loans)} />
      </div>
    </div>
}