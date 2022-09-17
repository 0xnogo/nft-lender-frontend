import { useAccount } from 'wagmi';
import { Liquidate } from '../../components/Liquidate/Liquidate';
import { Mint } from '../../components/Mint/Mint';
import { Oracle } from '../../components/Oracle/Oracle';

export const Admin = (props: any): JSX.Element => {
  const {isConnected} = useAccount();
  
  return (<>
    {isConnected && 
      <div className="grid grid-cols-3 gap-4">
        <Mint />
        <Oracle />
        <Liquidate />
      </div>}
    {!isConnected && 
      <div className='flex flex-col justify-center items-center w-full'>
        <div className='p-4 bg-gray-800 gap-y-4 rounded-md w-1/3 text-center justify-items-center self-center'>Please connect your wallet.</div>
      </div>}
  </>)
}