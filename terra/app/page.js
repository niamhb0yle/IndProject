import Image from 'next/image';
import "@fontsource/montserrat";
import Link from "next/link";
import "./components/style.css";
import "./about.js"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between p-24" style={{backgroundColor:"#5CB8FF"}}>
      <div className="z-10 max-w-6.5xl  justify-between text-sm lg:flex">
          <h1 style={{fontFamily:"Montserrat", fontWeight:800, letterSpacing:3.5, fontSize:60, display:"inline", float:"left", padding:15}}>terra</h1>
          <ul className='navbar'>
            <li id='navbarelements'>
              <Link href="/about">
                <p>About us</p>
              </Link>
            </li>
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
    </main>
  )
}
