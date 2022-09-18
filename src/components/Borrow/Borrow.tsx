import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { useContext, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useAccount } from 'wagmi';
import { Spinner } from 'flowbite-react';
import { useBorrow } from '../../hooks/use-borrow';
import { useGetFullDebt, useMaxAmountLoan } from '../../hooks/use-nftlender';
import { truncateAndConvertBNtoString } from '../../utils';
import { Button } from '../UI/Button/Button';
import { Container } from '../UI/Container/Container';
import AlertContext from '../../store/alert-context';

const inputStyle = "rounded-md bg-black p-4 focus:outline-none outline outline-1 outline-black hover:outline-1 hover:outline-blue-900";

export const Borrow = (props: any): JSX.Element => {
  // context
  const {onAlertHandler} = useContext(AlertContext);

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
    onAlertHandler({message: "Borrow successful", alertType: "success"})
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

  const generateButtonText = (text: string, isLoading?: boolean) => {
    if (!isValid) return "Amount asked exceeding maximum allowed";
    return isLoading? <><Spinner />Loading...</> : text;
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
      </form>
      <Button disabled={!borrow || !isValid} text={generateButtonText("Borrow", isLoadingBorrow)} onClickHandler={onBorrowHandler} style="btn-primary" styleAdded="w-1/3 self-center"/>
    </Container>);
}