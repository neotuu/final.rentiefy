import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import BottomNav from './BottomNav'
import InstallPrompt from './InstallPrompt'
import ScrollToTop from './ScrollToTop'
import HelpChatbot from './HelpChatbot'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <InstallPrompt />
      <HelpChatbot />
    </div>
  )
}
