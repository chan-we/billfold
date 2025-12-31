import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/common/Layout';
import { AuthGuard } from '@/components/AuthGuard';
import { AddBillPage } from '@/pages/Bills/AddBill';
import { BillsPage } from '@/pages/Bills';
import { EditBillPage } from '@/pages/Bills/EditBill';
import { StatisticsPage } from '@/pages/Statistics';

function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/bills" replace />} />
            <Route path="/bills" element={<BillsPage />} />
            <Route path="/bills/add" element={<AddBillPage />} />
            <Route path="/bills/:id/edit" element={<EditBillPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
          </Routes>
        </Layout>
      </AuthGuard>
    </BrowserRouter>
  );
}

export default App;
