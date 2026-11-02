import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LanguageSelection from './pages/LanguageSelection';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import LearningContent from './pages/LearningContent';
import Profile from './pages/Profile';
import Games from './pages/Games';
import api from './services/api';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If the user is not authenticated, send them to launchpad as a guest landing page
  return user ? children : <Navigate to="/launchpad" />;
}

function SelectedLanguageRedirect({ basePath, fallbackLanguage }) {
  const [targetPath, setTargetPath] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchSelectedLanguage = async () => {
      try {
        const response = await api.get('/languages/user/selected');
        const languageId = response.data?.selectedLanguage?.id || fallbackLanguage;
        if (mounted) {
          setTargetPath(`${basePath}/${languageId}`);
        }
      } catch (error) {
        if (mounted) {
          setTargetPath(`${basePath}/${fallbackLanguage}`);
        }
      }
    };

    fetchSelectedLanguage();
    return () => {
      mounted = false;
    };
  }, [basePath, fallbackLanguage]);

  if (!targetPath) {
    return <div>Loading...</div>;
  }

  return <Navigate to={targetPath} replace />;
}

function App() {
  const [defaultLanguage, setDefaultLanguage] = useState('python');
  const [showIntro, setShowIntro] = useState(true);
  const { user, loading } = useAuth();

  useEffect(() => {
    let mounted = true;
    const fetchSelected = async () => {
      if (user) {
        try {
          const res = await api.get('/languages/user/selected');
          if (mounted && res.data.selectedLanguage) {
            setDefaultLanguage(res.data.selectedLanguage.id);
          }
        } catch (e) {
          // ignore
        }
      }
    };

    fetchSelected();
    return () => { mounted = false; };
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {showIntro && (
        <div className="intro-overlay">
          <div className="intro-content">
            <img
              className="intro-gif"
              src="/assets/Arcade.gif"
              alt="Arcade animation"
            />
            <h1 className="intro-title">WHERE PLAY BEGINS, CODE FOLLOWS</h1>
          </div>
        </div>
      )}

      <Routes>
        {/* Public launchpad route for guests */}
        <Route path="/" element={<Navigate to={user ? '/hub' : '/launchpad'} replace />} />
        <Route path="launchpad" element={user ? <Navigate to="/hub" replace /> : <LearningContent />} />
        <Route path="cpp" element={<LearningContent />} />
        <Route path="java" element={<LearningContent />} />
        <Route path="python" element={<LearningContent />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/hub" replace />} />
          <Route path="hub" element={<Dashboard />} />
          <Route path="learning" element={<LearningContent />} />
          <Route path="learning/cpp" element={<LearningContent />} />
          <Route path="learning/java" element={<LearningContent />} />
          <Route path="learning/python" element={<LearningContent />} />
          <Route path="languages" element={<LanguageSelection />} />

          {/* Redirect incomplete routes to user's selected/default language */}
          <Route path="tasks" element={<SelectedLanguageRedirect basePath="/tasks" fallbackLanguage={defaultLanguage} />} />

          {/* Actual routes with language parameter */}
          <Route path="tasks/:language" element={<Tasks />} />
          <Route path="task/:taskId" element={<TaskDetail />} />
          <Route path="games" element={<Games />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={user ? '/hub' : '/launchpad'} replace />} />
      </Routes>

      <style>{`
        .intro-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top, rgba(14, 165, 233, 0.2), transparent 35%),
                      linear-gradient(135deg, #020617 0%, #071326 55%, #0f1d3b 100%);
          backdrop-filter: blur(12px);
          animation: introFadeOut 3.8s ease forwards;
          pointer-events: none;
        }

        .intro-content {
          text-align: center;
          color: #e0f7ff;
          padding: 24px;
        }

        .intro-gif {
          width: min(320px, 80vw);
          max-width: 360px;
          border-radius: 18px;
          box-shadow: 0 0 80px rgba(0, 255, 255, 0.25);
          margin-bottom: 24px;
          animation: gifFloat 2.8s ease-in-out infinite alternate;
        }

        .intro-title {
          margin: 0;
          font-size: clamp(2.5rem, 4vw, 4.8rem);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          line-height: 1.05;
          text-shadow: 0 0 28px rgba(56, 189, 248, 0.45), 0 0 60px rgba(0, 238, 255, 0.15);
          animation: titlePulse 3.4s ease-in-out forwards;
        }

        @keyframes gifFloat {
          from { transform: translateY(0px) scale(1); }
          to { transform: translateY(-12px) scale(1.02); }
        }

        @keyframes titlePulse {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          40% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes introFadeOut {
          0%, 80% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </>
  );
}

export default App;
