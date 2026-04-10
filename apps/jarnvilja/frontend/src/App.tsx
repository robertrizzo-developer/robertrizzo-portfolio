import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { MemberDashboardPage } from '@/pages/MemberDashboardPage'
import { HomePage } from '@/pages/HomePage'
import { TrainersPage } from '@/pages/TrainersPage'
import { SchedulePage } from '@/pages/SchedulePage'
import { AboutClubPage } from '@/pages/AboutClubPage'
import { ContactPage } from '@/pages/ContactPage'
import { FaqPage } from '@/pages/FaqPage'
import { AboutProjectPage } from '@/pages/AboutProjectPage'
import { MembershipPage } from '@/pages/MembershipPage'
import { ProfileEditPage } from '@/pages/ProfileEditPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/om-klubben" element={<AboutClubPage />} />
        <Route path="/tranare" element={<TrainersPage />} />
        <Route path="/schema" element={<SchedulePage />} />
        <Route path="/bli-medlem" element={<MembershipPage />} />
        <Route path="/kontakt" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/om-projektet" element={<AboutProjectPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/app" element={<MemberDashboardPage />} />
        <Route path="/app/profil" element={<ProfileEditPage />} />
      </Routes>
    </Layout>
  )
}
