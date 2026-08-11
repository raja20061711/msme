import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScanCenterPage } from './pages/ScanCenterPage';
import { EmailScannerPage } from './pages/scanners/EmailScannerPage';
import { UrlScannerPage } from './pages/scanners/UrlScannerPage';
import { InvoiceScannerPage } from './pages/scanners/InvoiceScannerPage';
import { PaymentScannerPage } from './pages/scanners/PaymentScannerPage';
import { QrScannerPage } from './pages/scanners/QrScannerPage';
import { ResultPage } from './pages/ResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Dashboard Layout Routes */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/scan" element={<ScanCenterPage />} />
            <Route path="/scan/email" element={<EmailScannerPage />} />
            <Route path="/scan/url" element={<UrlScannerPage />} />
            <Route path="/scan/invoice" element={<InvoiceScannerPage />} />
            <Route path="/scan/payment" element={<PaymentScannerPage />} />
            <Route path="/scan/qr" element={<QrScannerPage />} />
            <Route path="/results/:id" element={<ResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
