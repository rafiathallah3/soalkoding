import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head';
import Script from 'next/script'


function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		require("bootstrap/dist/js/bootstrap.bundle.min.js");
	}, []);

	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/soalkoding.png" />
			</Head>
			<Script strategy='lazyOnload' src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
			<Script strategy='lazyOnload' id='google-analytics'>
				{`
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
			  
				gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');			  
				`}
			</Script>
			<Component {...pageProps} />
		</>
	)
}

export default MyApp
