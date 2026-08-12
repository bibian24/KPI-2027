/**
 * src/store.js
 * Lớp Quản Lý Trạng Thái Tập Trung (Centralized Store)
 * Lưu giữ: user, members, tasks, kpiData, backlogs
 * Cung cấp cơ chế subscribe để giao diện tự động cập nhật khi dữ liệu thay đổi.
 */

class Store {
  // Trạng thái dữ liệu nội bộ của ứng dụng
  #state = {
    user: null,        // Thông tin người dùng đang đăng nhập
    members: [],       // Danh sách thành viên / nhân viên
    tasks: [],         // Danh sách công việc tuần
    backlogs: [],      // Danh sách tồn đọng
    kpiData: {},       // Dữ liệu kết quả & điểm KPI
    isLoading: false   // Trạng thái đang tải dữ liệu
  };

  // Danh sách các hàm giao diện đăng ký lắng nghe thay đổi
  #listeners = [];

  /**
   * Lấy bản sao trạng thái dữ liệu hiện tại (Chỉ đọc - An toàn tuyệt đối)
   */
  getState() {
    return structuredClone(this.#state);
  }

  /**
   * Cập nhật dữ liệu mới vào Store
   * @param {Object} newState - Đối tượng chứa các phần dữ liệu cần cập nhật
   */
  setState(newState) {
    // Trộn dữ liệu cũ với dữ liệu mới
    this.#state = {
      ...this.#state,
      ...newState
    };

    // Tự động thông báo tới tất cả các màn hình/giao diện đang lắng nghe
    this.#notify();
  }

  /**
   * Đăng ký một màn hình/thành phần giao diện để tự động vẽ lại khi dữ liệu thay đổi
   * @param {Function} listener - Hàm sẽ chạy khi dữ liệu thay đổi
   * @returns {Function} Hàm để hủy đăng ký khi không cần thiết
   */
  subscribe(listener) {
    if (typeof listener === "function") {
      this.#listeners.push(listener);
    }

    // Trả về hàm dùng để hủy lắng nghe (unsubscribe)
    return () => {
      this.#listeners = this.#listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Gửi thông báo đến tất cả các listener
   */
  #notify() {
    const snapshot = this.getState();
    this.#listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (error) {
        console.error("Lỗi khi cập nhật giao diện từ Store:", error);
      }
    });
  }
}

// Khởi tạo một đối tượng Store duy nhất dùng chung cho toàn bộ ứng dụng
export const store = new Store();
export default store;