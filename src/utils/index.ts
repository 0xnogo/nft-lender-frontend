import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

export const shrinkAddress = (address?: string): string => {
  if (address === undefined) {
    return '';
  }
  return address.slice(0, 4) + '...' + address.slice(-4);
}

export const truncateAndConvertBNtoString = (bn: BigNumber | undefined): string => {
  if (!bn) return "0.0";
  const remainder = bn.mod(1e14);
  return formatEther(bn.sub(remainder)); 
}

export const fromSecToFormattedDate = (seconds: BigNumber): string => { 
  const time = new Date(seconds.mul(1000).toNumber())
  return time.toLocaleString('en-GB',{timeZone:'UTC'});
}