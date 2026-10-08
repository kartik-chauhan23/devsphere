import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageLoader } from '../components/ui/States';

const L = (loader) => lazy(loader);
const ProtectedRoute = L(() => import('../components/common/ProtectedRoute'));
const Landing = L(() => import('../pages/public/Landing'));
const NotFound = L(() => import('../pages/public/NotFound'));
const AuthLayout = L(() => import('../pages/AuthLayout'));
const AuthPage = L(() => import('../pages/public/AuthPage'));
const Shell = L(() => import('../components/layout/Shell'));
const Dashboard = L(() => import('../features/dashboard/DashboardPage'));
const Projects = L(() => import('../features/projects/ProjectsPage'));
const Tasks = L(() => import('../features/tasks/TasksPage'));
const Notes = L(() => import('../features/notes/NotesPage'));
const Resources = L(() => import('../features/resources/ResourcesPage'));
const Github = L(() => import('../features/github/GithubPage'));
const ApiExplorer = L(() => import('../features/apiExplorer/ApiExplorerPage'));
const Interview = L(() => import('../features/interview/InterviewPage'));
const Assistant = L(() => import('../features/ai/AssistantPage'));
const Settings = L(() => import('../pages/user/SettingsPage'));
const AdminOverview = L(() => import('../features/admin/AdminOverview'));
const Users = L(() => import('../features/admin/UsersPage'));
const Content = L(() => import('../features/admin/ContentPage'));
const Reports = L(() => import('../features/admin/ReportsPage'));
const Logs = L(() => import('../features/admin/LogsPage'));
const Notifications = L(() => import('../features/admin/NotificationsPage'));
const AdminSettings = L(() => import('../features/admin/AdminSettingsPage'));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AuthLayout />}>
          <Route path="login" element={<AuthPage mode="login" />} />
          <Route path="register" element={<AuthPage mode="register" />} />
          <Route element={<ProtectedRoute />}>
            <Route path="app" element={<Shell />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="notes" element={<Notes />} />
              <Route path="resources" element={<Resources />} />
              <Route path="github" element={<Github />} />
              <Route path="api-explorer" element={<ApiExplorer />} />
              <Route path="interview" element={<Interview />} />
              <Route path="assistant" element={<Assistant />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="admin" element={<Shell admin />}>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<Users />} />
              <Route path="content" element={<Content />} />
              <Route path="reports" element={<Reports />} />
              <Route path="logs" element={<Logs />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
