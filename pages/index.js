import Head from "next/head";
import { useEffect } from "react";


export default function Home() {

  useEffect(() => {
    window.location.href = `/login`
  }, []);

  return (
    <>
      <Head>
        <title>Travel Agency App</title>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
    </>
  );
}
