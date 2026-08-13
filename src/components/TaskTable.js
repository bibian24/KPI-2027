/**
 * src/components/TaskTable.js
 * Bảng Kế Hoạch Phân Công Tuần (WEEKLY PLAN) - Có đầy đủ nút thao tác & Chèn ảnh
 */

import { store } from '../store.js';
import { saveTaskToCloud, compressImage } from '../config.js';

export class TaskTableComponent {
  constructor(containerElement) {
    this.container = containerElement;

    store.subscribe((state) => {
      this.render(state.tasks || []);
    });

    const state = store.getState();
    this.render(state.tasks || []);
  }

  render(tasks = []) {
    this.container.innerHTML = `
      <!-- Thanh công cụ thao tác Weekly Plan giống mẫu đính kèm -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div class="flex items-center gap-2">
          <label class="text-xs font-bold text-slate-600 uppercase">Lọc tuần:</label>
          <select class="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700">
            <option>Tuần hiện tại (Tháng 8/2026)</option>
          </select>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button id="btnAddTask" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5">
            ➕ Thêm việc cho ngày hiện tại
          </button>
          <button class="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm">
            📅 Tạo ngày trực kế tiếp
          </button>
          <button class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm">
            📅 Tạo tuần trực kế tiếp
          </button>
          <button class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm">
            📊 Tải Excel Tuần
          </button>
        </div>
      </div>

      <!-- Khung Bảng Phân Công Công Việc -->
      <div class="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
              <th class="p-3 border-r border-slate-200 text-center">NGÀY</th>
              <th class="p-3 border-r border-slate-200 text-center">CA LÀM</th>
              <th class="p-3 border-r border-slate-200">NHÓM / KHU VỰC</th>
              <th class="p-3 border-r border-slate-200">NỘI DUNG CÔNG VIỆC</th>
              <th class="p-3 border-r border-slate-200 text-center">MINH CHỨNG (ẢNH)</th>
              <th class="p-3 border-r border-slate-200">NGƯỜI THỰC HIỆN</th>
              <th class="p-3 border-r border-slate-200 text-center">TIẾN ĐỘ KPI</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            ${tasks.length === 0 ? `
              <tr>
                <td colspan="7" class="p-8 text-center text-slate-400 font-medium">
                  Chưa có công việc nào trong hệ thống. Hãy bấm nút "Thêm việc cho ngày hiện tại" ở trên.
                </td>
              </tr>
            ` : tasks.map((task) => `
              <tr class="hover:bg-slate-50">
                <td class="p-3 font-semibold text-slate-700 text-center border-r border-slate-100">${task.date || 'Hôm nay'}</td>
                <td class="p-3 text-center border-r border-slate-100">
                  <span class="px-2 py-1 bg-slate-100 rounded text-slate-600 font-bold">${task.shift || 'Ca 1'}</span>
                </td>
                <td class="p-3 border-r border-slate-100 font-medium text-slate-800">${task.area || 'Kỹ thuật chung'}</td>
                <td class="p-3 border-r border-slate-100 font-bold text-slate-900">${task.title}</td>
                <td class="p-3 text-center border-r border-slate-100">
                  ${task.image ? `<img src="${task.image}" class="w-12 h-12 object-cover rounded-lg mx-auto border shadow-sm"/>` : '<span class="text-slate-400">Không có</span>'}
                </td>
                <td class="p-3 border-r border-slate-100 font-semibold text-blue-600">${task.assignee}</td>
                <td class="p-3 text-center">
                  <span class="px-2.5 py-1 rounded-full font-bold ${task.status === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
                    ${task.status || 'Đang thực hiện'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Modal Cửa Sổ Thêm Công Việc Mới -->
      <div id="modalAddTask" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm hidden flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
          <h3 class="text-lg font-bold text-slate-900 border-b pb-3">➕ Thêm Công Việc Mới Mới</h3>
          
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Tên/Nội dung công việc:</label>
            <input type="text" id="inputTitle" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Nhập nội dung công việc...">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Người thực hiện:</label>
              <select id="selectAssignee" class="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="Kỹ thuật viên 1">Kỹ thuật viên 1</option>
                <option value="Kỹ thuật viên 2">Kỹ thuật viên 2</option>
                <option value="Admin - Duty Engineer">Admin - Duty Engineer</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">Khu vực:</label>
              <input type="text" id="inputArea" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ví dụ: Phòng AHU Tầng 3">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">Chèn Ảnh Minh Chứng (Tự động nén siêu nhẹ):</label>
            <input type="file" id="inputImage" accept="image/*" class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t">
            <button id="btnCloseModal" class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">Hủy</button>
            <button id="btnSaveTask" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md">Lưu Công Việc</button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const modal = document.getElementById('modalAddTask');
    const btnAdd = document.getElementById('btnAddTask');
    const btnClose = document.getElementById('btnCloseModal');
    const btnSave = document.getElementById('btnSaveTask');

    if (btnAdd) btnAdd.onclick = () => modal.classList.remove('hidden');
    if (btnClose) btnClose.onclick = () => modal.classList.add('hidden');

    if (btnSave) {
      btnSave.onclick = async () => {
        const title = document.getElementById('inputTitle').value.trim();
        const assignee = document.getElementById('selectAssignee').value;
        const area = document.getElementById('inputArea').value.trim();
        const imageFile = document.getElementById('inputImage').files[0];

        if (!title) {
          alert("Vui lòng nhập tên công việc!");
          return;
        }

        btnSave.innerText = "⏳ Đang lưu dữ liệu...";
        btnSave.disabled = true;

        let compressedBase64 = null;
        if (imageFile) {
          try {
            // Nén ảnh tự động để nộp lên Cloud không bị chặn
            compressedBase64 = await compressImage(imageFile);
          } catch (e) {
            console.error("Lỗi nén ảnh:", e);
          }
        }

        const success = await saveTaskToCloud({
          title,
          assignee,
          area: area || 'Kỹ thuật chung',
          image: compressedBase64,
          status: 'Đang thực hiện',
          date: new Date().toLocaleDateString('vi-VN')
        });

        btnSave.innerText = "Lưu Công Việc";
        btnSave.disabled = false;

        if (success) {
          modal.classList.add('hidden');
          document.getElementById('inputTitle').value = '';
        }
      };
    }
  }
}
