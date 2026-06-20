import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import StudyPage from './pages/StudyPage'
import EventsPage from './pages/EventsPage'
import ResourcesPage from './pages/ResourcesPage'
import AboutPage from './pages/AboutPage'
import StudentLiving from './pages/StudentLiving'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="study" element={<StudyPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="living" element={<StudentLiving />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    )
}

export default App
