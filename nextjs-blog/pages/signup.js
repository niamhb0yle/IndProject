import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

export default function SignUp() {
    return (
      <>
        <Head>
          <title>Sign Up</title>
        </Head>
        <h1>Sign up</h1>
        <h2>
          <Link href="/">← Back to home</Link>
        </h2>
      </>
    );
}