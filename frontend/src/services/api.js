import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create a generic axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token if it exists in localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

/**
 * AUTH SERVICES
 */
export const loginPatient = async (credentials) => {
  const payload = {
    email: credentials.username || credentials.email,
    password: credentials.password
  };
  const response = await apiClient.post('/auth/patients/login', payload);
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({ 
      id: response.data.userId, 
      name: response.data.displayName, 
      role: response.data.role 
    }));
    localStorage.setItem('role', 'PATIENT');
  }
  return response.data;
};

export const registerPatient = async (patientData) => {
  const response = await apiClient.post('/auth/patients/register', patientData);
  return response.data;
};

export const loginDoctor = async (credentials) => {
  const payload = {
    email: credentials.username || credentials.email,
    password: credentials.password
  };
  const response = await apiClient.post('/auth/doctors/login', payload);
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({ 
      id: response.data.userId, 
      name: response.data.displayName, 
      role: response.data.role 
    }));
    localStorage.setItem('role', 'DOCTOR');
  }
  return response.data;
};

export const registerDoctor = async (doctorData) => {
  const response = await apiClient.post('/auth/doctors/register', doctorData);
  return response.data;
};

export const loginAdmin = async (credentials) => {
  // Map username to email for backend DTO compatibility
  const payload = {
    email: credentials.username || credentials.email,
    password: credentials.password
  };
  const response = await apiClient.post('/auth/admin/login', payload);
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({ 
      id: response.data.userId, 
      name: response.data.displayName, 
      role: response.data.role 
    }));
    localStorage.setItem('role', 'ADMIN');
  }
  return response.data;
};

/**
 * PATIENT SERVICES
 */
export const getAllPatients = async () => {
  const response = await apiClient.get('/patients');
  return response.data;
};

export const searchPatients = async (query) => {
  const response = await apiClient.get(`/patients/search?query=${query}`);
  return response.data;
};

export const addFamilyMember = async (patientId, familyData) => {
  const response = await apiClient.post(`/family/add?patientId=${patientId}`, familyData);
  return response.data;
};

export const getFamilyMembers = async (patientId) => {
  const response = await apiClient.get(`/family/patient/${patientId}`);
  return response.data;
};

/**
 * APPOINTMENT SERVICES
 */
export const bookAppointment = async (appointmentData) => {
  const response = await apiClient.post('/appointments/book', appointmentData);
  return response.data;
};

export const getAppointmentAvailability = async (doctorId, date) => {
  const response = await apiClient.get(`/appointments/availability?doctorId=${doctorId}&date=${date}`);
  return response.data;
};

export const getPatientAppointments = async (patientId) => {
  const response = await apiClient.get(`/appointments/patient/${patientId}`);
  return response.data;
};

export const getDoctorAppointments = async (doctorId) => {
  const response = await apiClient.get(`/appointments/doctor/${doctorId}`);
  return response.data;
};

/**
 * DOCTOR & SPECIALIST SERVICES
 */
export const getAllDoctors = async () => {
  const response = await apiClient.get('/doctors');
  return response.data;
};

export const getDoctorsBySpecialization = async (specialization) => {
  const response = await apiClient.get(`/doctors/specialization/${specialization}`);
  return response.data;
};

/**
 * PRESCRIPTION SERVICES
 */
export const addPrescription = async (prescriptionData) => {
  const response = await apiClient.post('/prescriptions', prescriptionData);
  return response.data;
};

export const getPatientPrescriptions = async (patientId) => {
  const response = await apiClient.get(`/prescriptions/patient/${patientId}`);
  return response.data;
};

/**
 * BILLING SERVICES
 */
export const generateBill = async (billingData, consultation, lab, medicine) => {
  const response = await apiClient.post(`/billing/generate?consultationFee=${consultation}&labCharges=${lab}&medicineCharges=${medicine}`, billingData);
  return response.data;
};

export const getPatientBills = async (patientId) => {
  const response = await apiClient.get(`/billing/patient/${patientId}`);
  return response.data;
};

export const payBill = async (billId, mode) => {
  const response = await apiClient.put(`/billing/pay/${billId}?mode=${mode}`);
  return response.data;
};

/**
 * ADMIN & STATS
 */
export const getAdminStats = async () => {
  const response = await apiClient.get('/admin/stats');
  return response.data;
};

export const getAdminSnapshot = async () => {
  const response = await apiClient.get('/admin/stats');
  return response.data;
};

/**
 * AI & ADVANCED CLINICAL SERVICES
 */
export const recommendDoctor = async (symptoms) => {
  const response = await apiClient.post(`/advanced/ai/doctor-recommendation?symptoms=${symptoms}`);
  return response.data;
};

export const predictDisease = async (symptoms) => {
  const response = await apiClient.post(`/advanced/ai/disease-prediction?symptoms=${symptoms}`);
  return response.data;
};

export const analyzePrescription = async (text) => {
  const response = await apiClient.post('/advanced/ai/prescription-analyzer', { text });
  return response.data;
};

export const getChatbotReply = async (question) => {
  const response = await apiClient.post(`/advanced/ai/chatbot?question=${question}`);
  return response.data;
};

export const getPaperlessRecords = async (patientId) => {
  // Composite service to fetch all patient history for the dashboard
  const [prescriptions, bills, family] = await Promise.all([
    getPatientPrescriptions(patientId),
    getPatientBills(patientId),
    getFamilyMembers(patientId)
  ]);
  return { prescriptions, billing: bills, familyMembers: family };
};

/**
 * HOSPITAL OPERATIONS
 */
export const getBeds = async () => {
  const response = await apiClient.get('/advanced/beds');
  return response.data;
};

export const getPharmacyInventory = async () => {
  const response = await apiClient.get('/advanced/pharmacy');
  return response.data;
};

export const getPharmacyItems = getPharmacyInventory;

export const dispenseMedicine = async (medicine, units) => {
  const response = await apiClient.post(`/advanced/pharmacy/dispense?medicine=${medicine}&units=${units}`);
  return response.data;
};

/**
 * SMART AUTOMATION SERVICES
 */
export const getReminderStatus = async () => {
  const response = await apiClient.get('/smart/reminder-status');
  return response.data;
};

export const trackAmbulance = async (ambulanceId) => {
  const response = await apiClient.get(`/ambulance-track/${ambulanceId}`);
  return response.data;
};

export const getLabComparison = async (patientId, testName) => {
  const response = await apiClient.get(`/smart/lab-comparison?patientId=${patientId}&testName=${testName}`);
  return response.data;
};

/**
 * FILE SERVICES
 */
export const uploadFile = async (formData) => {
  const response = await apiClient.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * EMERGENCY SERVICES
 */
export const triggerEmergency = async (emergencyData) => {
  const response = await apiClient.post('/emergency/alert', emergencyData);
  return response.data;
};

export const kioskCheckinByPatient = async (patientId, doctorId) => {
  const response = await apiClient.post(`/advanced/kiosk/checkin?patientId=${patientId}&doctorId=${doctorId}`);
  return response.data;
};

export default apiClient;
