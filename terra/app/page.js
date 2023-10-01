import Image from 'next/image';
import "@fontsource/montserrat";
import Link from "next/link";
import "./components/style.css";
import "./about.js"

export default function Home() {
  return (
    <body classname='body'>
      <div>
          <h1 id='logo'>terra</h1>
          <ul className='navbar'>
            <li id='navbarelements'>
              <Link href="/about">
                <p>Sign up</p>
              </Link>
            </li>
            <li id='navbarelements'>
              <Link href="/login">
                <p>Log in</p>
              </Link>
            </li>
          </ul>
      </div>
    </body>
  )
}
