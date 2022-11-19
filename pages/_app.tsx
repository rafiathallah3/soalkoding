import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head';


function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		require("bootstrap/dist/js/bootstrap.bundle.min.js");
	}, []);

	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/soalkoding.png" />
			</Head>
			<Component {...pageProps} />
		</>
	)
}

export default MyApp
