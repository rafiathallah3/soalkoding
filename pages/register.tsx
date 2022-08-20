import Link from "next/link"

export default function Register() {
    return (
        <div className='h-100 min-vh-100' style={{background: "linear-gradient(rgb(36, 36, 36), rgb(34, 34, 36))"}}>
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5" style={{backgroundColor: "rgb(34, 35, 36)"}}>
                            <div className="card-body p-4 p-sm-5">
                                <h3 className="card-title text-center text-white mb-5">Soalkoding.com</h3>
                                <form method='POST' action='/api/login'>
                                    <div className="form-floating mb-3">
                                        <input type="email" name='email' className="form-control border-secondary text-white" style={{backgroundColor: "rgb(43, 43, 43)"}} id="floatingInput" placeholder="name@example.com" required/>
                                        <label htmlFor="floatingInput" style={{color: "grey"}}>Email</label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input type="text" name='username' className="form-control border-secondary text-white" style={{backgroundColor: "rgb(43, 43, 43)"}} id="floatingInput" placeholder="Username" required/>
                                        <label htmlFor="floatingInput" style={{color: "grey"}}>Username</label>
                                    </div>
                                    
                                    <div className="form-floating mb-3">
                                        <input type="password" name='password' className="form-control border-secondary text-white" style={{backgroundColor: "rgb(43, 43, 43)"}} id="floatingPassword" placeholder="Password" required/>
                                        <label htmlFor="floatingPassword" style={{color: "grey"}}>Password</label>
                                    </div>
                                    
                                    <div className="d-grid">
                                        <input className="btn btn-success" type="submit" value={"Masuk"} />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <p style={{color: "rgb(120, 120, 120)"}}>Sudah punya akun? <Link href="/login"><a style={{color: "rgb(120, 120, 120)"}}>Masuk!</a></Link></p>
                                    </div>
                                    <hr className="my-4 text-white" />

                                    <div className="d-grid">
                                        <button className="btn btn-dark" style={{backgroundColor: "rgb(41, 41, 41)"}}>
                                            <i className="bi bi-github"></i> Masuk dengan GitHub
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}