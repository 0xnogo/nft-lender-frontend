import { formatEther } from 'ethers/lib/utils';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { DUMMYNFT_CONTRACT_ADDRESS, useGetOwner } from '../../hooks/use-dummynft';
import { useGetFloorPrice } from '../../hooks/use-nftlender';

export const Dashboard= (props: any): JSX.Element => {
  const [id, setId] = useState(0);
  const {data: floorPrice, isError} = useGetFloorPrice();
  const {isConnected} = useAccount();

  const { owner, error, refetch } = useGetOwner(DUMMYNFT_CONTRACT_ADDRESS, id);

  const content = isError ? 
    <div>Error happened while fetching</div> : 
    <div>Floor price of NFT: { formatEther(floorPrice ? floorPrice! : 0) }</div>

  return <div>
      <div>{isConnected && content}</div>
      <input type="number" className='text-black' value={id} onChange={(e) => setId(parseInt(e.target.value))} />
      <button onClick={() => refetch?.()}>Get owner</button>
      <div>{isConnected && owner}</div>
      <div>{error ? error.message : null}</div>
    </div>
}