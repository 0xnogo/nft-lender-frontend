import { useState } from 'react';

import { Borrow } from '../../components/Borrow/Borrow';
import { Deposit } from '../../components/Deposit/Deposit';
import { Withdraw } from '../../components/Withdraw/Withdraw';


export const Manage: React.FC<{}> = (props) => {

return <div className="grid grid-cols-3 gap-4">
    <Deposit />
    <Borrow />
    <Withdraw />
  </div>
}