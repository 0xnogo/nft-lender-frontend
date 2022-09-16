import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useContractEvent, useContractWrite } from 'wagmi';

import { Button } from '../../components/UI/Button/Button';
import { Container } from '../../components/UI/Container/Container';
import { useGetFullDebtFor, useGetUserInDebt, useLiquidateAll } from '../../hooks/use-liquidate';
import { NFTLENDER_ABI, NFTLENDER_CONTRACT_ADDRESS } from '../../hooks/use-nftlender';

const inputStyle = "rounded-md bg-black p-4 focus:outline-none outline outline-1 outline-black hover:outline-1 hover:outline-blue-900"

export const Liquidate = (props: any): JSX.Element => {
  const [userToLiquidate, setUserToLiquidate] = useState<string>();
  const [userToLiquidateDebounced] = useDebounce(userToLiquidate, 500);
  const {liquidateAll, errorLiquidateAll, isLoadingLiquidateAll, isSuccessLiquidateAll} = useLiquidateAll(userToLiquidateDebounced);
  const potentialTargets = useGetUserInDebt();
  const debtAmount = useGetFullDebtFor(userToLiquidate);

  const onLiquidateHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    liquidateAll?.({
      recklesslySetUnpreparedOverrides: {
        value: debtAmount.add(debtAmount.mul(10).div(100)).toString()
      }
    })
  }

  const buttonText = () => {
    if (errorLiquidateAll) return errorLiquidateAll;
    if (isLoadingLiquidateAll) return "Liquidating...";
    return "Liquidate";
  }

  return (
    <Container title="Liquidate 😈">
      {potentialTargets}
      <form className="flex flex-col gap-y-2">
      <input 
          placeholder="User to liquidate"
          id="userToLiquidateAddress" 
          defaultValue={userToLiquidate} 
          onChange={(e) => setUserToLiquidate(e.target.value)} 
          className={inputStyle} />
      <Button disabled={!liquidateAll} text={buttonText()} onClickHandler={onLiquidateHandler} style="btn-primary" styleAdded="self-center"/>
      </form>
    </Container>)
}