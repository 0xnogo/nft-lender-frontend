import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useNetwork } from 'wagmi';
import { chainConfig } from '../../assets/constants';

import { Button } from '../../components/UI/Button/Button';
import { Container } from '../../components/UI/Container/Container';
import { useGetFloorPrice } from '../../hooks/use-nftlender';
import { useSetFloorPrice } from '../../hooks/use-oracle';
import { shrinkAddress, truncateAndConvertBNtoString } from '../../utils';

const inputStyle = "rounded-md bg-black p-4 focus:outline-none outline outline-1 outline-black hover:outline-1 hover:outline-blue-900"

export const Oracle = (props: any): JSX.Element => {
  const { chain } = useNetwork();
  const [floorPrice, setFloorPriceInput] = useState<string>("");
  const [floorPriceDebounced] = useDebounce(floorPrice, 500);

  const {floorPrice: currentFloorPrice, refetch: refetchFloorPrice} = useGetFloorPrice();
  
  const {setFloorPrice, isLoadingSetFloorPrice, isSuccessSetFloorPrice} = 
      useSetFloorPrice(floorPriceDebounced, () => {refetchFloorPrice?.()});
  
  const onChangeOracleHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setFloorPrice?.()
  }

  return (
    <Container title="Change oracle price">
      <p>Current price: {`${truncateAndConvertBNtoString(currentFloorPrice)} ETH`}</p>
      <form className="flex flex-col gap-y-2">
        <input 
            placeholder={`Floor price of ${shrinkAddress(chainConfig[chain!.id].dummyNFTAddress)}`}
            id="nftAddress" 
            defaultValue={floorPrice} 
            onChange={(e) => setFloorPriceInput(e.target.value)} 
            className={inputStyle} />
      </form>
      <Button disabled={!setFloorPrice} text="Change oracle price" onClickHandler={onChangeOracleHandler} style="btn-primary" styleAdded="self-center"/>
    </Container>)
}