/**
 * src/main.js
 * Tệp khởi chạy chính của ứng dụng
 */

import { store } from './store.js';
import { LoginComponent } from './components/Login.js';
import { TaskTableComponent } from './components/TaskTable.js';

const appContainer = document.getElementById('app');

// Hàm hiển thị giao diện chính sau khi Đăng nhập thành công
function renderMainDashboard(userName) {
  appContainer.className = "w-full min-h-screen bg-slate-100 flex flex-col";
  
  appContainer.innerHTML = `
    <!-- Thanh Header Menu Ngang giống hình bạn gửi -->
    <header class="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 00-9 9v1a1 1 0 001 1h16a1 1 0 001-1v-1a9 9 0 00-9-9z"/></svg>
        </div>
        <div>
          <h1 class="font-extrabold text-slate-800 text-lg leading-none">V2.8 PRO MANAGEMENT</h1>
          <p class="text-xs text-slate-500 font-medium mt-1">${userName}</p>
        </div>
      </div>

      <!-- Menu Tabs -->
      <nav class="flex items-center gap-2">
        <button class="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-lg border border-blue-200 flex items-center gap-1.5 shadow-sm">
          📅 WEEKLY PLAN
        </button>
        <button class="px-4 py-2 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-lg flex items-center gap-1.5">
          ⚠️ TỒN ĐỘNG / PHÁT SINH
        </button>
        <button class="px-4 py-2 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-lg flex items-center gap-1.5">
          📋 FORM BẢO TRÌ
        </button>
        <button class="px-4 py-2 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-lg flex items-center gap-1.5">
          📈 DASHBOARD KPI
        </button>
        <button class="px-4 py-2 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-lg flex items-center gap-1.5">
          ⚙️ CẤU HÌNH ADMIN
        </button>
      </nav>
    </header>

    <!-- Nội dung chính -->
    <main class="p-6 max-w-7xl mx-auto w-full">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
        <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          📅 BẢNG KẾ HOẠCH PHÂN CÔNG TUẦN (WEEKLY PLAN)
        </h2>
        <!-- Nơi gắn Bảng công việc -->
        <div id="tableContainer"></div>
      </div>
    </main>
  `;

  // Gắn Bảng Công Việc vào vị trí
  const tableContainer = document.getElementById('tableContainer');
  new TaskTableComponent(tableContainer);
}

// Khởi chạy: Mặc định hiển thị màn hình Đăng Nhập
new LoginComponent(appContainer, (user) => {
  renderMainDashboard(user);
});