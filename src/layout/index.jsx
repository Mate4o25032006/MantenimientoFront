function Layout({children}) {
    return (
        <main className="flex flex-col justify-center items-center bg-center bg-[#e1f5fe] h-screen" >
            {children}
        </main>
    )
}

export default Layout