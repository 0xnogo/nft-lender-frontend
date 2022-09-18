import { ReactNode } from "react";

type ButtonStyle = 'btn-primary' | '';

interface ButtonProps {
  text: ReactNode;
  onClickHandler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
  style: ButtonStyle;
  disabled?: boolean;
  styleAdded?: string;
}

export const Button = (props: ButtonProps): JSX.Element => {

  return (
    <button 
      className={`${props.style} ${props.styleAdded}`} 
      disabled={props.disabled} 
      onClick={props.onClickHandler}>
    {props.text}
  </button>);
}