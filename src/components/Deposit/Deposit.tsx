import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useAccount } from 'wagmi';
import { useDeposit } from '../../hooks/use-deposit';

import { DUMMYNFT_CONTRACT_ADDRESS, useApprove, useGetOwner, useIsApproved } from '../../hooks/use-dummynft';
import { NFTLENDER_CONTRACT_ADDRESS } from '../../hooks/use-nftlender';
import { Button } from '../UI/Button/Button';
import { Container } from '../UI/Container/Container';

const inputStyle = "rounded-md bg-black p-4 focus:outline-none outline outline-1 outline-black hover:outline-1 hover:outline-blue-900"

// 1 - make this example working with this hacky approach (all in the same component)
// 2 - create hook with form state
export const Deposit: React.FC<{}> = (props) => {
  // state
  const [nftAddress, setNftAddress] = useState(DUMMYNFT_CONTRACT_ADDRESS);
  const [nftId, setNftId] = useState("");
  const { address } = useAccount()

  const [debounceNftAddress] = useDebounce(nftAddress, 500);
  const [debounceNftId] = useDebounce(nftId, 500);

  // nft data
  const {isApproved, refetch: refetchIsApproved} = useIsApproved(debounceNftAddress, debounceNftId);
  const {owner, refetch: refetchGetOwner} = useGetOwner(debounceNftAddress, debounceNftId);
  const isDeposited = owner === NFTLENDER_CONTRACT_ADDRESS;
  const isOwner = owner === address?.toLocaleLowerCase();

  // deposit
  const {deposit, isLoadingDeposit, refetchPrepareDeposit} = 
    useDeposit(debounceNftAddress, debounceNftId, () => {
      refetchGetOwner?.()
    }, isApproved, isDeposited);

  // approve
  const {approve, isLoadingApprove} = 
    useApprove(debounceNftAddress, NFTLENDER_CONTRACT_ADDRESS, debounceNftId, () => {
      refetchIsApproved?.();
      refetchPrepareDeposit?.();
    }, isOwner, isDeposited, owner);

  const onDepositHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    deposit?.()
  }

  const onApproveHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();   
    approve?.()
  }

  return (
    <Container title="Deposit">
      <form className="flex flex-col gap-y-2">
        <input 
          placeholder="NFT address" 
          id="nftAddress" 
          defaultValue={nftAddress} 
          onChange={(e) => setNftAddress(e.target.value)} 
          className={inputStyle} />
        <input 
          placeholder="NFT id" 
          id="nftId" 
          defaultValue={nftId} 
          onChange={(e) => setNftId(e.target.value)} 
          className={inputStyle} />
        {isApproved && !isDeposited && <Button disabled={!deposit} text={isLoadingDeposit ? "Depositing..." : "Deposit"} onClickHandler={onDepositHandler} style="btn-primary" styleAdded="w-1/3 self-center"/>}
        {!isApproved && !isDeposited && <Button disabled={!approve} text={isLoadingApprove ? 'Approving...' : 'Approve'} onClickHandler={onApproveHandler} style="btn-primary" styleAdded="w-1/3 self-center"/>}
        {isDeposited && <Button disabled={isDeposited} text="Already deposited" onClickHandler={() => {}} style="btn-primary" styleAdded="w-1/3 self-center"/>}
      </form>
    </Container>);
}
