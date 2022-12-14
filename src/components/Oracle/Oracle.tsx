import { Spinner } from 'flowbite-react';
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

  const generateButtonText = (text: string, isLoading?: boolean) => {
    return isLoading? <><Spinner /> Loading...</> : text;
  }

  return (
    <Container title="Change oracle price">
      <p>To trigger liquidation, you can change the NFT floor price. The same price is applied for all NFTs. Ideally, we could have integrated with a real oracle.</p>
      <p>Current price: {`${truncateAndConvertBNtoString(currentFloorPrice)} ETH`}</p>
      <form className="flex flex-col gap-y-2">
        <input 
            placeholder={`Floor price of ${shrinkAddress(chainConfig[chain!.id].dummyNFTAddress)}`}
            id="nftAddress" 
            defaultValue={floorPrice} 
            onChange={(e) => setFloorPriceInput(e.target.value)} 
            className={inputStyle} />
        <Button disabled={!setFloorPrice} text={generateButtonText("Change oracle price", isLoadingSetFloorPrice)} onClickHandler={onChangeOracleHandler} style="btn-primary" styleAdded="self-center"/>
      </form>
    </Container>)
}