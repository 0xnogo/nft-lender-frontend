import { Spinner } from 'flowbite-react';
import { useContext } from 'react';

import { Button } from '../../components/UI/Button/Button';
import { Container } from '../../components/UI/Container/Container';
import { useMint } from '../../hooks/use-dummynft';
import AlertContext from '../../store/alert-context';
import { useNetwork } from 'wagmi'
import { chainConfig } from '../../assets/constants';

export const Mint = (props: any): JSX.Element => {
  // context
  const {onAlertHandler} = useContext(AlertContext);
  const { chain } = useNetwork();

  const {mint, isLoadingMint} = useMint((data) => {
    const txHashLink = `https://goerli.etherscan.io/tx/${data["transactionHash"]}`;
    const textAddendum = `Check <a class='font-medium text-blue-500 underline' href='${txHashLink}' target='_blank'>transaction</a> to get the id for the NFT.`
    onAlertHandler({message: `Mint successful. ${textAddendum}`, alertType: "success"});
  });
  
  const onMintHandler = () => {
    mint?.()
  }

  const generateButtonText = (text: string, isLoading?: boolean) => {
    return isLoading? <><Spinner /> Loading...</> : text;
  }
  
  return (
  <Container title="Mint">
    <p>For testing purposes, feel free to mint one NFT of a <a className='font-medium text-blue-500 underline' href={`https://goerli.etherscan.io/address/${chainConfig[chain?.id!].dummyNFTAddress}`} target='_blank'>dummy collection</a> and get the id of the minted NFT to deposit it.</p>
    <p>In theory, all ERC721 can be deposited.</p>
    <Button disabled={!mint} text={generateButtonText("Mint one NFT", isLoadingMint)} onClickHandler={onMintHandler} style="btn-primary" styleAdded="self-center"/>
  </Container>)
}