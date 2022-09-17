import { Link, NavLink } from "react-router-dom"

export const Nav = (props: any): JSX.Element => {


  let activeStyle = 'underline underline-offset-8';

  return <div className="flex flex-row justify-around items-center min-h-full bg-gray-800 h-16 px-4">
    <div className="basis-1/5 font-bold text-3xl"><Link to="/">NFTLender</Link></div>
    <div className="basis-1/5">
      <ul className="list-none flex flex-row justify-evenly">
        <li className="font-semibold"><NavLink to="/" end className={({isActive}) => isActive? activeStyle : undefined }>Dashboard</NavLink></li>
        <li className="font-semibold"><NavLink to="/manage" className={({isActive}) => isActive? activeStyle : undefined }>Manage</NavLink></li>
        <li className="font-semibold"><NavLink to="/Admin" className={({isActive}) => isActive? activeStyle : undefined }>Admin</NavLink></li>
      </ul>
    </div>
    <div className="basis-3/5">{props.connect}</div>
  </div>
}