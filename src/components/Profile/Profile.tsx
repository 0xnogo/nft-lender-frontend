import { ConnectKitButton } from 'connectkit';

const commontStyle = 'flex flex-row justify-end items-center gap-x-2.5'

export const Profile = (props: any): JSX.Element => {
  return (
    <div className={commontStyle}>
      <ConnectKitButton />
    </div>
  )
}