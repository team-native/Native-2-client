import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/pages/HomePage';
import ServiceIntroPage from '@/pages/ServiceIntroPage';
import ChatAnalysisUploadPage from '@/pages/ChatAnalysisUploadPage';
import ChatAnalysisProgressPage from '@/pages/ChatAnalysisProgressPage';
import ChatAnalysisResultPage from '@/pages/ChatAnalysisResultPage';
import AccountCheckPage from '@/pages/AccountCheckPage';
import AccountCheckResultPage from '@/pages/AccountCheckResultPage';
import TransferAmountPage from '@/pages/TransferAmountPage';
import TransferChecklistPage from '@/pages/TransferChecklistPage';
import FamilySharePage from '@/pages/FamilySharePage';
import HistoryPage from '@/pages/HistoryPage';
import HistoryDetailPage from '@/pages/HistoryDetailPage';
import HelpPage from '@/pages/HelpPage';
import FaqPage from '@/pages/FaqPage';
import RiskExpressionsPage from '@/pages/RiskExpressionsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { ROUTES } from '@/constants/nav';

export const router = createBrowserRouter([
  { element: <MainLayout />, children: [
    { path: ROUTES.home, element: <HomePage /> },
    { path: ROUTES.serviceIntro, element: <ServiceIntroPage /> },
    { path: ROUTES.chatAnalysisUpload, element: <ChatAnalysisUploadPage /> },
    { path: ROUTES.chatAnalysisProgress, element: <ChatAnalysisProgressPage /> },
    { path: ROUTES.chatAnalysisResult, element: <ChatAnalysisResultPage /> },
    { path: ROUTES.accountCheck, element: <AccountCheckPage /> },
    { path: ROUTES.accountCheckResult, element: <AccountCheckResultPage /> },
    { path: ROUTES.transferAmount, element: <TransferAmountPage /> },
    { path: ROUTES.transferChecklist, element: <TransferChecklistPage /> },
    { path: ROUTES.familyShare, element: <FamilySharePage /> },
    { path: ROUTES.history, element: <HistoryPage /> },
    { path: ROUTES.historyDetail, element: <HistoryDetailPage /> },
    { path: ROUTES.help, element: <HelpPage /> },
    { path: ROUTES.faq, element: <FaqPage /> },
    { path: ROUTES.riskExpressions, element: <RiskExpressionsPage /> },
    { path: '*', element: <NotFoundPage /> },
  ]},
]);
