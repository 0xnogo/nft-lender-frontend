import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { useBorrow, useMaxAmountLoan } from '../../hooks/use-nftlender';
import { Button } from '../UI/Button/Button';
import { Container } from '../UI/Container/Container';

const inputStyle = "rounded-md bg-black p-4 focus:outline-none outline outline-1 outline-black hover:outline-1 hover:outline-blue-900"

export const Borrow = (props: any): JSX.Element => {
  // internal state
  const [borrowAmount, setBorrowAmount] = useState<string>("");
  const { address } = useAccount()

  const {maxAmountLoan} = useMaxAmountLoan(address);

  const isValid = BigNumber.from(parseEther(Boolean(borrowAmount) ? borrowAmount : '0')).lte(maxAmountLoan);
  
  // borrow
  const {borrow, isLoadingBorrow, isSuccessBorrow} = useBorrow(borrowAmount);

  const onChangeAmountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBorrowAmount(e.target.value);
  };

  const onBorrowHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    borrow?.();
  }

  const buttonText = (): string => {
    if (isLoadingBorrow) return "Borrowing..."

    if (!isValid) return "Amount asked exceeding maximum allowed";

    return "Borrow"
  }

  return (
    <Container title="Borrow">
      <form className="flex flex-col gap-y-2">
        <p>Maximum allowed to borrow: {formatEther(maxAmountLoan)} ETH</p>
        <input 
          placeholder="Borrow amount in ETH" 
          id="borrowAmount" 
          defaultValue={borrowAmount} 
          onChange={(e) => onChangeAmountHandler(e)} 
          className={inputStyle + (isValid ? "" : " outline-red-900 hover:outline-red-900 focus:outline-1 focus:outline-red-900")} />
        <Button disabled={!borrow} text={buttonText()} onClickHandler={onBorrowHandler} style="btn-primary" />
      </form>
    </Container>);
}