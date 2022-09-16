import { Button } from '../../components/UI/Button/Button';
import { Container } from '../../components/UI/Container/Container';
import { useMint } from '../../hooks/use-dummynft';

export const Mint = (props: any): JSX.Element => {
  const {mint, isSuccessMint, isLoadingMint} = useMint();
  
  const onMintHandler = () => {
    mint?.()
  }
  
  return (
  <Container title="Mint">
    <Button disabled={!mint} text="Mint one NFT" onClickHandler={onMintHandler} style="btn-primary" styleAdded="self-center"/>
  </Container>)
}