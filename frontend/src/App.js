import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PatientLogin from './pages/PatientLogin';
import PatientRegister from './pages/PatientRegister';
import DoctorLogin from './pages/DoctorLogin';
import DoctorRegister from './pages/DoctorRegister';
import AdminLogin from './pages/AdminLogin';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import Emergency from './pages/Emergency';
import SmartHospitalDemo from './pages/SmartHospitalDemo';
import HospitalSectors from './pages/HospitalSectors';
import Specialists from './pages/Specialists';
import DeveloperProfile from './pages/DeveloperProfile';
import SurgeryTracker from './pages/SurgeryTracker';
import KioskMode from './pages/KioskMode';
import VirtualNurse from './components/VirtualNurse';
import AIAnalyzer from './pages/AIAnalyzer';
import HealthVault from './pages/HealthVault';
import BloodNexus from './pages/BloodNexus';
import FloorMap from './pages/FloorMap';
import Genomics from './pages/Genomics';
import QuantumSim from './pages/QuantumSim';
import Metaverse from './pages/Metaverse';
import Biometrics from './pages/Biometrics';
import LiveNow from './pages/LiveNow';
import BlockchainAudit from './pages/BlockchainAudit';
import CommandCenter from './pages/CommandCenter';
import Pharmacy from './pages/Pharmacy';
import LabReports from './pages/LabReports';
import Telemedicine from './pages/Telemedicine';
import Billing from './pages/Billing';
import SmartBedVitals from './pages/SmartBedVitals';
import InsuranceAI from './pages/InsuranceAI';
import RegionalAnalytics from './pages/RegionalAnalytics';
import ClinicalSafety from './pages/ClinicalSafety';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/patient-login" element={<Layout><PatientLogin /></Layout>} />
              <Route path="/patient-register" element={<Layout><PatientRegister /></Layout>} />
              <Route path="/doctor-login" element={<Layout><DoctorLogin /></Layout>} />
              <Route path="/doctor-register" element={<Layout><DoctorRegister /></Layout>} />
              <Route path="/admin-login" element={<Layout><AdminLogin /></Layout>} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/book-appointment" element={<Layout><BookAppointment /></Layout>} />
              <Route path="/emergency" element={<Layout><Emergency /></Layout>} />
              <Route path="/smart-demo" element={<Layout><SmartHospitalDemo /></Layout>} />
              <Route path="/ai-center" element={<Layout><SmartHospitalDemo /></Layout>} />
              <Route path="/sectors" element={<Layout><HospitalSectors /></Layout>} />
              <Route path="/specialists" element={<Layout><Specialists /></Layout>} />
              <Route path="/developer" element={<Layout><DeveloperProfile /></Layout>} />
              <Route path="/ai-analyzer" element={<Layout><AIAnalyzer /></Layout>} />
              <Route path="/health-vault" element={<Layout><HealthVault /></Layout>} />
              <Route path="/surgery-tracker" element={<Layout><SurgeryTracker /></Layout>} />
              <Route path="/kiosk" element={<KioskMode />} />
              <Route path="/blood-nexus" element={<Layout><BloodNexus /></Layout>} />
              <Route path="/floor-map" element={<Layout><FloorMap /></Layout>} />
              <Route path="/genomics" element={<Layout><Genomics /></Layout>} />
              <Route path="/quantum-sim" element={<Layout><QuantumSim /></Layout>} />
              <Route path="/metaverse" element={<Layout><Metaverse /></Layout>} />
              <Route path="/biometrics" element={<Layout><Biometrics /></Layout>} />
              <Route path="/live-now" element={<Layout><LiveNow /></Layout>} />
              <Route path="/blockchain" element={<Layout><BlockchainAudit /></Layout>} />
              <Route path="/blockchain-audit" element={<Layout><BlockchainAudit /></Layout>} />
              <Route path="/command-center" element={<CommandCenter />} />
              <Route path="/pharmacy" element={<Layout><Pharmacy /></Layout>} />
              <Route path="/lab-reports" element={<Layout><LabReports /></Layout>} />
              <Route path="/telemedicine" element={<Layout><Telemedicine /></Layout>} />
              <Route path="/billing" element={<Layout><Billing /></Layout>} />
              <Route path="/smart-bed-vitals" element={<Layout><SmartBedVitals /></Layout>} />
              <Route path="/insurance-ai" element={<Layout><InsuranceAI /></Layout>} />
              <Route path="/regional-analytics" element={<Layout><RegionalAnalytics /></Layout>} />
              <Route path="/clinical-safety" element={<Layout><ClinicalSafety /></Layout>} />
            </Routes>
            <VirtualNurse />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
