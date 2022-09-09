import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { Button } from "../../components/UI/Button/Button"
import { useMintPrepare } from "../../hooks/use-dummynft";

export const Admin = (props: any): JSX.Element => {
  const [config, error] = useMintPrepare();
  const { write: mint, isSuccess } = useContractWrite(config);
  
  const onMintHandler = () => {
    mint?.()
  }

  return <div>
    <Button disabled={!mint} text="Mint" onClickHandler={onMintHandler} style="btn-primary"/>
  </div>
}