import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import JudgeManagementPage from "./pages/JudgeManagementPage";
import JudgeLoginPage from "./pages/JudgeLoginPage";
import EntriesManagementPage from "./pages/EntriesManagementPage";
import JudgeDashboardPage from "./pages/JudgeDashboardPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import CertificatePage from "./pages/CertificatePage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/edit-event/:eventId" element={<EditEventPage />} />
        <Route path="/manage-judges" element={<JudgeManagementPage />} />
        <Route path="/judge-login" element={<JudgeLoginPage />} />
        <Route path="/manage-entries" element={<EntriesManagementPage />} />
        <Route path="/judge-dashboard" element={<JudgeDashboardPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;