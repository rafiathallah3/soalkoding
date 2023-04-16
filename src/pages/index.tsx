import { Inter } from 'next/font/google'
import clientPromise from '../../lib/mongodb';
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest } from 'next';
import Head from 'next/head';
import Navbar from '../../components/navbar';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { ApakahSudahMasuk } from '../../lib/Servis';
import { IAkun } from '../../types/tipe';

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
    const session = await ApakahSudahMasuk(req);
    return session
}

export default function Home({ Akun }: { Akun: IAkun | null }) {
	const router = useRouter();

  	return (
		<>
			<Head>
				<title>Soalkoding</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar profile={Akun} />
			<div className='container'>
				<div className='d-flex align-items-center justify-content-center flex-column' style={{ paddingRight: "10rem", paddingLeft: "10rem", height: "50vh" }}>
					<h1 className='text-white mb-3'>Soalkoding</h1>
					<p className='text-white text-center' style={{ fontSize: "24px" }}>Soalkoding adalah website yang bisa membantu kamu dalam mengembangin logika dalam koding</p>
					<button className={styles.tombolbergabung} onClick={() => router.push("/register")}>Bergabung</button>
				</div>
			</div>
		</>
  	)
}
