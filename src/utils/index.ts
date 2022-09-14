export const shrinkAddress = (address?: string): string => {
  if (address == undefined) {
    return '';
  }
  return address.slice(0, 4) + '...' + address.slice(-4);
}