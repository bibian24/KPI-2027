import { store } from './store.js';
import { initRealtimeSync } from './config.js';
import { LoginComponent } from './components/Login.js';
import { TaskTableComponent } from './components/TaskTable.js';

// Kích hoạt tính năng đồng bộ đám mây thời gian thực 24/7[cite: 3, 5]
initRealtimeSync();

const appContainer = document.getElementById('app');

function renderMainDashboard(userName) {
  appContainer.className = "w-full min-h-screen bg-slate-100 flex flex-col";
  
  appContainer.innerHTML = `
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

    <main class="p-6 max-w-7xl mx-auto w-full">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
        <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          📅 BẢNG KẾ HOẠCH PHÂN CÔNG TUẦN (WEEKLY PLAN)
        </h2>
        <div id="tableContainer"></div>
      </div>
    </main>
  `;

  const tableContainer = document.getElementById('tableContainer');
  if (tableContainer) {
    new TaskTableComponent(tableContainer);
  }
}

// Khởi tạo hiển thị màn hình đăng nhập trước[cite: 3]
if (appContainer) {
  new LoginComponent(appContainer, (user) => {
    renderMainDashboard(user);
  });
}
```[cite: 3]

#### Bước 3: Cập nhật lên GitHub
1. Copy đoạn mã trên dán đè vào file `src/main.js` trực tiếp trên trang GitHub (hoặc cập nhật qua git).
2. Nhớ ấn **Commit changes** để lưu lại.
3. Đợi khoảng 1-2 phút để GitHub Pages tự động build lại trang web, sau đó bạn bấm **Ctrl + F5** tại trang web của mình để xóa bộ nhớ đệm (cache) và kiểm tra lại thành quả.
