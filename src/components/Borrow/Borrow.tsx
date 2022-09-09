import { formatEther } from 'ethers/lib/utils';
import { useState } from 'react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';

import { useBorrowPrepare, useMaxAmountLoan } from '../../hooks/use-nftlender';
import { Button } from '../UI/Button/Button';
import { Container } from '../UI/Container/Container';

export const Borrow = (props: any): JSX.Element => {
  // internal state
  const [borrowAmount, setBorrowAmount] = useState<number | string>(0);
  const { address } = useAccount()

  const {maxAmountLoan} = useMaxAmountLoan(address);
  
  // borrow
  const {config: configBorrow} = useBorrowPrepare(borrowAmount);
  const {data: databorrow, write: borrow} = useContractWrite(configBorrow);
  const { isLoading: isLoadingBorrow, isSuccess: isSuccessBorrow } = useWaitForTransaction({
    confirmations: 1,
    hash: databorrow?.hash,
    onSuccess() {
      console.log("SUCCESS")
    }
  });

  const onChangeAmountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBorrowAmount(e.target.value);
  };

  const onBorrowHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    borrow?.();
  }

  return (
    <Container title="Borrow">
      <form className="flex flex-col gap-y-2">
        <p>Maximum allowed to borrow: {formatEther(maxAmountLoan)} ETH</p>
        <input placeholder="Borrow amount in ETH" id="borrowAmount" defaultValue={borrowAmount} onChange={(e) => onChangeAmountHandler(e)} className="rounded-md bg-black p-4 focus:outline-none outline outline-1 outline-black hover:outline-1 hover:outline-blue-900" />
        <Button disabled={!borrow} text={isLoadingBorrow? "Borrowing" : "Borrow"} onClickHandler={onBorrowHandler} style="btn-primary" />
      </form>
    </Container>);
}