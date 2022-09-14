import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useAccount } from 'wagmi';
import { useBorrow } from '../../hooks/use-borrow';

import { useGetFullDebt, useMaxAmountLoan } from '../../hooks/use-nftlender';
import { Button } from '../UI/Button/Button';
import { Container } from '../UI/Container/Container';

const inputStyle = "rounded-md bg-black p-4 focus:outline-none outline outline-1 outline-black hover:outline-1 hover:outline-blue-900"

const truncateAndConvertBNtoString = (bn: BigNumber): string => {
  const remainder = bn.mod(1e14);
  return formatEther(bn.sub(remainder)); 
}

export const Borrow = (props: any): JSX.Element => {
  // internal state
  const [borrowAmount, setBorrowAmount] = useState<string>("");
  const { address } = useAccount()

  const {maxAmountLoan} = useMaxAmountLoan(address);
  const {fullDebt} = useGetFullDebt(address);

  const [debounceBorrowAmount] = useDebounce(borrowAmount, 500);

  const withdrawAmountLeft = maxAmountLoan.sub(fullDebt);
  const isValid = BigNumber.from(parseEther(Boolean(debounceBorrowAmount) ? debounceBorrowAmount : '0')).lte(withdrawAmountLeft);

  // borrow
  const {borrow, isLoadingBorrow, isSuccessBorrow, refetchPrepareBorrow} = useBorrow(debounceBorrowAmount, () => {
    setBorrowAmount("")
    refetchPrepareBorrow?.();
  });

  const onChangeAmountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBorrowAmount(e.target.value);
  };

  const onBorrowHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    borrow?.();
  };

  const buttonText = (): string => {
    if (isLoadingBorrow) return "Borrowing..."
    if (!isValid) return "Amount asked exceeding maximum allowed";
    return "Borrow"
  }

  return (
    <Container title="Borrow">
      <form className="flex flex-col gap-y-2">
        <p>Maximum allowed to borrow: {truncateAndConvertBNtoString(withdrawAmountLeft)} ETH</p>
        <input 
          placeholder="Borrow amount in ETH" 
          id="borrowAmount" 
          value={borrowAmount} 
          onChange={(e) => onChangeAmountHandler(e)} 
          className={inputStyle + (isValid ? "" : " outline-red-900 hover:outline-red-900 focus:outline-1 focus:outline-red-900")} />
        <Button disabled={!borrow || !isValid} text={buttonText()} onClickHandler={onBorrowHandler} style="btn-primary" styleAdded="w-1/3 self-center"/>
      </form>
    </Container>);
}