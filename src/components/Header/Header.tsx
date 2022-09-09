import { NavLink } from "react-router-dom"
import { Profile } from "../Profile/Profile"
import { Nav } from "../UI/Nav/Nav"

export const Header = (props: any) => {
  return (
    <Nav connect={<Profile />}/>)
}