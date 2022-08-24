export default function Background({ children }: { children: any }) {
    return (
        <div className='h-100 min-vh-100' style={{background: "linear-gradient(rgb(36, 36, 36), rgb(34, 34, 36))"}}>
        {children}
        </div>
    )
}