import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Script from 'next/script';
import { deleteCookie, getCookie } from 'cookies-next';
import { TipeNotifikasi } from '../../types/tipe';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
		require("bootstrap/dist/js/bootstrap.bundle.min.js");
		const notif = (getCookie("notif") === undefined ? undefined : JSON.parse(getCookie("notif") as string)) as TipeNotifikasi | undefined;
		if(notif !== undefined) {
			toast(notif.pesan, { hideProgressBar: false, type: notif.status, position: "top-right" });
		}
		deleteCookie('notif');
	}, []);
  return (
    <SessionProvider session={pageProps.session}>
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
      <ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
			/>
    </SessionProvider>
  )
}
