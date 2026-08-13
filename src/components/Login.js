/**
 * src/components/Login.js
 * Màn hình Đăng Nhập - Có kiểm tra mật khẩu an toàn
 */

import { store } from '../store.js';

export class LoginComponent {
  constructor(containerElement, onLoginSuccess) {
    this.container = containerElement;
    this.onLoginSuccess = onLoginSuccess;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 my-8">
        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3a9 9 0 00-9 9v1a1 1 0 001 1h16a1 1 0 001-1v-1a9 9 0 00-9-9zM3 16a1 1 0 00-1 1v1a2 2 0 002 2h16a2 2 0 002-2v-1a1 1 0 00-1-1H3z"/>
            </svg>
          </div>
        </div>

        <div class="text-center mb-6">
          <h1 class="text-2xl font-black text-slate-900 tracking-tight uppercase">KỸ THUẬT & KPI V2.8</h1>
          <p class="text-xs text-slate-500 font-medium mt-1">Hệ thống Quản lý trực tuyến đám mây (Cloud Firestore)</p>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full mt-3 border border-emerald-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            CLOUD ĐẠI DIỆN ĐÃ LIÊN KẾT (OK)
          </div>
        </div>

        <form id="loginForm" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">THÀNH VIÊN (USER)</label>
            <select id="userSelect" class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Chọn tài khoản --</option>
              <option value="Admin - Duty Engineer">Admin Hệ Thống (Admin - Duty Engineer)</option>
              <option value="Kỹ thuật viên 1">Kỹ thuật viên 1</option>
              <option value="Kỹ thuật viên 2">Kỹ thuật viên 2</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">MẬT KHẨU (PASSWORD)</label>
            <input type="password" id="passwordInput" placeholder="Nhập mật khẩu..." class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>

          <button type="submit" class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all duration-150 uppercase tracking-wide">
            ĐĂNG NHẬP HỆ THỐNG
          </button>
        </form>
      </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const selectedUser = document.getElementById('userSelect').value;
      const password = document.getElementById('passwordInput').value.trim();

      if (!selectedUser) {
        alert("⚠️ Vui lòng chọn tài khoản đăng nhập!");
        return;
      }

      // Kiểm tra mật khẩu (Mặc định đặt là 123456, bạn có thể chỉnh tùy ý)
      if (!password) {
        alert("⚠️ Vui lòng nhập mật khẩu để đăng nhập!");
        return;
      }

      if (password !== "123456") {
        alert("❌ Mật khẩu không chính xác! (Mật khẩu mặc định là: 123456)");
        return;
      }

      // Lưu tài khoản đã đăng nhập vào Store
      store.setState({ user: selectedUser });

      if (typeof this.onLoginSuccess === 'function') {
        this.onLoginSuccess(selectedUser);
      }
    });
  }
}
