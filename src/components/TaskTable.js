/**
 * src/components/TaskTable.js
 * Component hiển thị Bảng danh sách công việc.
 * Tách biệt hoàn toàn, chỉ nhận dữ liệu từ Store và tự vẽ lại khi dữ liệu thay đổi.
 */

import { store } from '../store.js';

export class TaskTableComponent {
  /**
   * Khởi tạo Component với một phần tử HTML làm thẻ chứa (container)
   * @param {HTMLElement} containerElement - Thẻ chứa bảng trên giao diện
   */
  constructor(containerElement) {
    this.container = containerElement;

    if (!this.container) {
      console.error("Không tìm thấy thẻ chứa để vẽ Bảng công việc!");
      return;
    }

    // Đăng ký tự động render lại bảng mỗi khi dữ liệu trong Store có sự thay đổi
    this.unsubscribe = store.subscribe((state) => {
      this.render(state.tasks);
    });

    // Vẽ giao diện lần đầu tiên với dữ liệu hiện tại trong Store
    const initialState = store.getState();
    this.render(initialState.tasks || []);
  }

  /**
   * Hàm render giao diện bảng công việc
   * @param {Array} tasks - Danh sách công việc từ Store
   */
  render(tasks = []) {
    // Nếu chưa có công việc nào, hiển thị thông báo trống
    if (!tasks || tasks.length === 0) {
      this.container.innerHTML = `
        <div style="padding: 24px; text-align: center; background-color: #f9fafb; border: 1px dashed #d1d5db; border-radius: 8px; color: #6b7280; font-family: sans-serif;">
          <p style="margin: 0; font-size: 15px; font-weight: 500;">Chưa có công việc nào trong hệ thống.</p>
        </div>
      `;
      return;
    }

    // Tạo chuỗi HTML cho từng dòng công việc
    const tableRows = tasks.map((task, index) => {
      // Xác định màu sắc nhãn trạng thái
      let statusStyle = 'background-color: #f3f4f6; color: #374151;'; // Mặc định: Chưa thực hiện
      if (task.status === 'Hoàn thành') {
        statusStyle = 'background-color: #d1fae5; color: #065f46;';
      } else if (task.status === 'Đang thực hiện') {
        statusStyle = 'background-color: #fef3c7; color: #92400e;';
      }

      return `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; text-align: center; font-weight: 500; color: #6b7280;">${index + 1}</td>
          <td style="padding: 12px; font-weight: 600; color: #1f2937;">${task.title || 'Không có tên công việc'}</td>
          <td style="padding: 12px; color: #4b5563;">${task.assignee || 'Chưa phân công'}</td>
          <td style="padding: 12px; color: #4b5563;">${task.dueDate || 'Chưa có hạn'}</td>
          <td style="padding: 12px; text-align: center;">
            <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; ${statusStyle}">
              ${task.status || 'Chưa thực hiện'}
            </span>
          </td>
        </tr>
      `;
    }).join('');

    // Khung bảng HTML hoàn chỉnh
    this.container.innerHTML = `
      <div style="overflow-x: auto; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px; text-align: left;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em;">
              <th style="padding: 12px; text-align: center; width: 60px;">STT</th>
              <th style="padding: 12px;">Tên Công Việc</th>
              <th style="padding: 12px;">Người Thực Hiện</th>
              <th style="padding: 12px;">Hạn Hoàn Thành</th>
              <th style="padding: 12px; text-align: center;">Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Hủy lắng nghe khiComponent bị gỡ khỏi giao diện
   */
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}