import { Route, Routes } from 'react-router-dom';
import { AuthWrapper } from './components/wrappers/AuthWrapper';
import { useAxiosInterceptorBridge } from './components/wrappers/AxiosInterceptorBridge';
import { CommonWrapper } from './components/wrappers/CommonWrapper';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { CoursePage } from './pages/CoursePage';
import { AssignmentPage } from './pages/AssignmentPage';
import { ProgressPage } from './pages/ProgressPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  useAxiosInterceptorBridge();

  return (
    <CommonWrapper>
      <AuthWrapper>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/courses/:courseId" element={<CoursePage />} />
            <Route
              path="/assignments/:assignmentId"
              element={<AssignmentPage />}
            />
            <Route path="/progress" element={<ProgressPage />} />
          </Route>

          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthWrapper>
    </CommonWrapper>
  );
}

export default App;
