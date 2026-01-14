import React from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import NewSessionPage from './pages/NewSessionPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { AuthProvider } from './contexts/AuthContext';
import QuestionPaperPage from './pages/QuestionPaperPage';
import ProfilePage from './pages/ProfilePage';
import GroupQuizPage from './pages/GroupQuizPage';
import CareerGuidancePage from './pages/CareerGuidancePage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import MindMapPage from './pages/MindMapPage';
import GeminiLivePage from './pages/GeminiLivePage';
import VivaPage from './pages/VivaPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PremiumPage from './pages/PremiumPage';
import VisualExplanationPage from './pages/VisualExplanationPage';
import LiveDebatePage from './pages/LiveDebatePage';
import { ContentProvider } from './contexts/ContentContext';
import ChapterConquestPage from './pages/ChapterConquestPage';
import SearchStatusIndicator from './components/app/SearchStatusIndicator';
import DashboardPage from './pages/DashboardPage';
import AILabAssistantPage from './pages/AILabAssistantPage';
import HistoricalChatPage from './pages/HistoricalChatPage';
import PoetryProseAnalysisPage from './pages/PoetryProseAnalysisPage';
import ConceptAnalogyPage from './pages/ConceptAnalogyPage';
import EthicalDilemmaPage from './pages/EthicalDilemmaPage';
import WhatIfHistoryPage from './pages/WhatIfHistoryPage';
import ExamPredictorPage from './pages/ExamPredictorPage';
import RealWorldApplicationPage from './pages/RealWorldApplicationPage';
import PersonalizedLearningPathPage from './pages/PersonalizedLearningPathPage';
import DigitalLabPage from './pages/DigitalLabPage';

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full py-20 px-0 md:px-0">
        <Routes>
          {/* Default to App HQ */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/app" element={<DashboardPage />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          <Route path="/new-session" element={<NewSessionPage />} />
          <Route path="/question-paper" element={<QuestionPaperPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/group-quiz" element={<GroupQuizPage />} />
          <Route path="/career-guidance" element={<CareerGuidancePage />} />
          <Route path="/study-planner" element={<StudyPlannerPage />} />
          <Route path="/mind-map" element={<MindMapPage />} />
          <Route path="/gemini-live" element={<GeminiLivePage />} />
          <Route path="/viva" element={<VivaPage />} />
          <Route path="/visual-explanation" element={<VisualExplanationPage />} />
          <Route path="/live-debate" element={<LiveDebatePage />} />
          <Route path="/chapter-conquest" element={<ChapterConquestPage />} />
          <Route path="/digital-lab" element={<DigitalLabPage />} />
          
          <Route path="/ai-lab-assistant" element={<AILabAssistantPage />} />
          <Route path="/historical-chat" element={<HistoricalChatPage />} />
          <Route path="/poetry-prose-analysis" element={<PoetryProseAnalysisPage />} />
          <Route path="/concept-analogy" element={<ConceptAnalogyPage />} />
          <Route path="/ethical-dilemma" element={<EthicalDilemmaPage />} />
          <Route path="/what-if-history" element={<WhatIfHistoryPage />} />
          <Route path="/exam-predictor" element={<ExamPredictorPage />} />
          <Route path="/real-world-applications" element={<RealWorldApplicationPage />} />
          <Route path="/personalized-learning-path" element={<PersonalizedLearningPathPage />} />
          
          <Route path="/contact" element={<div className="container mx-auto px-4"><ContactPage /></div>} />
          <Route path="/about" element={<div className="container mx-auto px-4"><AboutPage /></div>} />
          <Route path="/privacy-policy" element={<div className="container mx-auto px-4"><PrivacyPolicyPage /></div>} />
          <Route path="/premium" element={<div className="container mx-auto px-4"><PremiumPage /></div>} />
        </Routes>
      </main>
      <Footer />
      <SearchStatusIndicator />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
          <ContentProvider>
            <AppContent />
          </ContentProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;