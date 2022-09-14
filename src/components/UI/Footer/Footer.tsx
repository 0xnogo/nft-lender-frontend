export const Footer = (props: any): JSX.Element => {
  return (
    <footer className="p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 m-10 mt-0">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022 <a href="https://nftlender.com/" className="hover:underline">NFTLender™</a>. All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">About</a>
          </li>
          <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">Privacy Policy</a>
          </li>
          <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">Licensing</a>
          </li>
          <li>
              <a href="#" className="hover:underline">Contact</a>
          </li>
      </ul> 
    </footer>
  )
}