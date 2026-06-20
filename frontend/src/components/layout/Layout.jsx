import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../../context/ThemeContext'

const Layout = () => {
    const { theme } = useTheme();

    return (
        <div className={`${theme === 'dark' ? 'dark' : ''}`}>
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text-main transition-colors duration-500">
                <Navbar />
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
                <ThemeToggle />
            </div>
        </div>
    )
}

export default Layout
