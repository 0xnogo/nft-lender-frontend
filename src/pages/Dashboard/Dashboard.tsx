import { ArchiveBoxArrowDownIcon, CalculatorIcon, CheckIcon, HeartIcon } from '@heroicons/react/20/solid';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';
import { Card } from 'flowbite-react';

import { MetricBox } from '../../components/UI/MetricBox/MetricBox';
import { Table } from '../../components/UI/Table/Table';
import { useGetDeposits, useGetFloorPrice, useGetFullDebt, useGetLoans, useHealthFactor } from '../../hooks/use-nftlender';
import { fromSecToFormattedDate, shrinkAddress, truncateAndConvertBNtoString } from '../../utils';
import { IDeposit, ILoan } from '../../utils/interfaces';

import {ReactComponent as GithubLogo} from '../../assets/images/github-logo.svg';
import {ReactComponent as TwitterLogo} from '../../assets/images/twitter-logo.svg';

export const Dashboard= (props: any): JSX.Element => {
  const {address} = useAccount();
  const {fullDebt} = useGetFullDebt(address);
  const {healthFactor} = useHealthFactor(address);
  const {deposits} = useGetDeposits(address);
  const {loans} = useGetLoans(address);
  const {floorPrice} = useGetFloorPrice()

  const {isConnected} = useAccount();

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

  return <div className='flex flex-col w-full gap-y-10 text-gray-700 dark:text-gray-400'>
      <div className='grid grid-cols-2 gap-x-2'>
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            About this project
          </h5>
          <p className="font-normal">
            NFTLender is a playground nft-based lending protocol. In simple world, you can deposit your NFTs as collateral. Each NFT will weight based on the floor price of the collection. With that, borrow ETH from the protocol, reimburse your loans and get liquidated 🤑.
          </p>
          <p>Risk Parameters:</p>
          <ul className='list-disc list-inside'>
            <li>Interest rate: 10% yearly</li>
            <li>LTV: 75% yearly</li>
            <li>Liquidation threshold: 10% yearly</li>
          </ul>
        </Card>
        <Card>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            About me
          </h5>
          <p>👋 Hey, I'm nogo a <span className='italic'>Mix Development Artist</span>.</p>
          <p>💻 I'm interested in web3 with a focus on DeFi, optimization and security.</p>
          <p>👷‍♂️ I'm currently building projects around web3 to learn and have fun.</p>
          <p>#️⃣ Current project count: 1</p>
          <div className='flex justify-center gap-x-4 my-2'>
            <a href="https://github.com/0xnogo" target="_blank"><GithubLogo fill='white' className='w-14 h-14' /></a>
            <a href="https://twitter.com/0xnogo" target="_blank"><TwitterLogo fill='white' className='w-14 h-14'/></a>
          </div>
        </Card>
      </div>
      {isConnected && <div className='flex flex-row justify-center items-center w-full'>
        <div className="grid grid-cols-4 gap-x-2 h-28">
          <MetricBox title="NFT deposited" text={deposits.length.toLocaleString()} icon={<ArchiveBoxArrowDownIcon className="h-10 w-10 text-white" aria-hidden="true"/>}/>
          <MetricBox title="Borrowed amount" text={`${truncateAndConvertBNtoString(borrowedAmount)} ETH`} icon={<CheckIcon className="h-10 w-10 text-white" aria-hidden="true"/>}/>
          <MetricBox title="Interest amount" text={`${truncateAndConvertBNtoString(fullDebt.sub(borrowedAmount))} ETH`} icon={<CalculatorIcon className="h-10 w-10 text-white" aria-hidden="true"/>}/>
          <MetricBox title="Health Factor" text={healthFactorDisplay()} icon={<HeartIcon className="h-10 w-10 text-white" aria-hidden="true"/>}/>
        </div>
      </div>}
      {isConnected && <div className='flex justify-around gap-x-2'>
        <Table title='Deposits' headCells={["Collection address", "Token id", "Floor price", "Date of Deposit"]} bodyCells={depositsBody(deposits)} />
        <Table title='Loans' headCells={["Amount", "Start time"]} bodyCells={loansBody(loans)} />
      </div>}
      {!isConnected && <div className='text-white p-4 bg-gray-800 gap-y-4 rounded-md w-1/3 text-center justify-items-center self-center'>Please connect your wallet. (Goerli)</div>}
    </div>
}