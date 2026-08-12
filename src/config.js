import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Thông số kết nối Firebase dự án kpi-2027 của bạn
const firebaseConfig = {
  apiKey: "AIzaSyBFBA6hUOPs5Te_0o_J08pUOiL-RS-GKXQ",
  authDomain: "kpi-2027.firebaseapp.com",
  projectId: "kpi-2027",
  storageBucket: "kpi-2027.firebasestorage.app",
  messagingSenderId: "219064392624",
  appId: "1:219064392624:web:c08f23201ff8b59d97d475",
  measurementId: "G-1FT2R5XNDL"
};

// 1. Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// 2. Khởi tạo cơ sở dữ liệu Cloud Firestore và xuất ra (export) để các file khác sử dụng
export const db = getFirestore(app);

// 3. Khởi tạo Analytics theo dõi lượt truy cập
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;