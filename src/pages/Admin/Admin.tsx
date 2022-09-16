import { Liquidate } from '../../components/Liquidate/Liquidate';
import { Mint } from '../../components/Mint/Mint';
import { Oracle } from '../../components/Oracle/Oracle';

export const Admin = (props: any): JSX.Element => {
  return <div className="grid grid-cols-3 gap-4">
    <Mint />
    <Oracle />
    <Liquidate />
  </div>
}