import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { RecordPage } from '@/pages/RecordPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { HappinessPage } from '@/pages/HappinessPage';
import { AnalysisPage } from '@/pages/AnalysisPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<RecordPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="happiness" element={<HappinessPage />} />
          <Route path="analysis" element={<AnalysisPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
