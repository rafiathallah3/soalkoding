import type { NextApiRequest, NextApiResponse, NextPage } from 'next'
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { UpdateInfoAkun } from '../services/Servis';
import { HasilDapatinUser, TipeProfile } from '../types/tipe';
import Head from 'next/head';

export async function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
	const DapatinUser = await UpdateInfoAkun(req, res, true) as HasilDapatinUser;
	// if (DapatinUser.redirect !== undefined) return DapatinUser;

	return {
		props: {
			profile: {
				username: DapatinUser.username ?? null,
				gambar: DapatinUser.gambarurl ?? null
			}
		}
	}
}

const Home = ({ profile }: { profile: TipeProfile }) => {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Soalkoding</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Navbar profile={profile} />
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

export default Home
