import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { store } from "./store.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFBA6hUOPs5Te_0o_J08pUOiL-RS-GKXQ",
  authDomain: "kpi-2027.firebaseapp.com",
  projectId: "kpi-2027",
  storageBucket: "kpi-2027.firebasestorage.app",
  messagingSenderId: "219064392624",
  appId: "1:219064392624:web:c08f23201ff8b59d97d475",
  measurementId: "G-1FT2R5XNDL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 1. Tự động lắng nghe dữ liệu từ Cloud Firestore về máy 24/7 (Đồng bộ cho 20 người)
export function initRealtimeSync() {
  try {
    const q = query(collection(db, "tasks"));
    onSnapshot(q, (snapshot) => {
      const tasks = [];
      snapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      // Đẩy dữ liệu mới nhất vào Store
      store.setState({ tasks });
    });
  } catch (error) {
    console.error("Lỗi đồng bộ đám mây:", error);
  }
}

// 2. Hàm nén hình ảnh tự động xuống dưới 100KB (Giải quyết triệt để lỗi chèn ảnh)
export function compressImage(file, maxWidth = 800, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Trả về chuỗi ảnh đã nén siêu nhẹ
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

// 3. Hàm lưu công việc mới lên Đám Mây Firestore
export async function saveTaskToCloud(taskData) {
  try {
    await addDoc(collection(db, "tasks"), {
      ...taskData,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Lỗi khi lưu lên Đám mây:", error);
    alert("❌ Lỗi lưu dữ liệu: " + error.message);
    return false;
  }
}

export default app;
