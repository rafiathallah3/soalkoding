import type { NextPage } from 'next'
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
	const router = useRouter();

	return (
		<>
			<Navbar profile={{}} />
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
