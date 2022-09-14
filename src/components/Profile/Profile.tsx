import { 
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName, } from 'wagmi';
import { shrinkAddress } from '../../utils';
import { Button } from '../UI/Button/Button';

export const Profile = (props: any): JSX.Element => {
  const { address, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: address })
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect();

  const commontStyle = 'flex flex-row justify-end items-center gap-x-2.5'

  if (isConnected) {
    return (
      <div className={commontStyle}>
        {ensAvatar && <img src={ensAvatar} alt="ENS Avatar" />}
        <div>{ensName ? `${ensName} (${shrinkAddress(address)})` : shrinkAddress(address)}</div>
        <Button style="btn-primary" onClickHandler={() => disconnect()} text="Disconnect"/>
      </div>
    )
  }

  return (
    <div className={commontStyle}>
      {connectors.map((connector) => {
        return <Button
          style="btn-primary"
          styleAdded=""
          disabled={!connector.ready || (isLoading && connector.id === pendingConnector?.id)} 
          key={connector.id} 
          onClickHandler={() => connect({ connector })} 
          text={connector.name} />
      })}
      {error && <div>{error.message}</div>}
    </div>
  )
}