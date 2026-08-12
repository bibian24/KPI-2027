/**
 * src/kpiLogic.js
 * Tập hợp các hàm thuần khiết (Pure Functions) tính toán chỉ số KPI & công việc.
 * Tuyệt đối không thao tác trực tiếp với giao diện (DOM/HTML).
 */

/**
 * Thống kê số lượng và tỷ lệ % hoàn thành công việc của một nhân viên
 * @param {Array} tasks - Danh sách tất cả công việc
 * @param {string} memberId - ID hoặc tên của nhân viên cần tính
 * @returns {Object} Đối tượng chứa các chỉ số thống kê
 */
export function calculateTaskStats(tasks = [], memberId = null) {
  if (!Array.isArray(tasks)) {
    return { total: 0, completed: 0, inProgress: 0, pending: 0, completionRate: 0 };
  }

  // Lọc danh sách công việc được giao cho nhân viên (hoặc lấy tất cả nếu không truyền memberId)
  const memberTasks = memberId 
    ? tasks.filter(task => task.assigneeId === memberId || task.assignee === memberId)
    : tasks;

  const total = memberTasks.length;
  if (total === 0) {
    return { total: 0, completed: 0, inProgress: 0, pending: 0, completionRate: 0 };
  }

  const completed = memberTasks.filter(t => t.status === 'Hoàn thành').length;
  const inProgress = memberTasks.filter(t => t.status === 'Đang thực hiện').length;
  const pending = memberTasks.filter(t => t.status === 'Chưa thực hiện' || !t.status).length;

  // Tính tỷ lệ % hoàn thành công việc (làm tròn 2 chữ số thập phân)
  const completionRate = Math.round((completed / total) * 100 * 100) / 100;

  return {
    total,
    completed,
    inProgress,
    pending,
    completionRate
  };
}

/**
 * Tính điểm KPI tổng hợp (kết hợp % công việc và điểm đánh giá thái độ)
 * @param {Array} tasks - Danh sách công việc
 * @param {string} memberId - ID hoặc tên nhân viên
 * @param {number} attitudeScore - Điểm thái độ (thang điểm 1-5, mặc định là 5)
 * @returns {number} Điểm KPI cuối cùng (thang điểm 100)
 */
export function calculateMemberKPI(tasks = [], memberId = null, attitudeScore = 5) {
  const stats = calculateTaskStats(tasks, memberId);
  
  // Quy đổi điểm thái độ về hệ số 100 (Ví dụ: 5/5 -> 100 điểm)
  const normalizedAttitude = Math.min(Math.max(attitudeScore, 0), 5) * 20;

  // Nếu không có công việc nào được giao, lấy 100% điểm thái độ
  if (stats.total === 0) {
    return Math.round(normalizedAttitude * 100) / 100;
  }

  // Công thức kết hợp: 70% Tỷ lệ hoàn thành công việc + 30% Điểm thái độ
  const finalKPI = (stats.completionRate * 0.7) + (normalizedAttitude * 0.3);

  return Math.round(finalKPI * 100) / 100;
}

/**
 * Tổng hợp bảng báo cáo KPI cho toàn bộ danh sách nhân viên
 * @param {Array} tasks - Danh sách công việc
 * @param {Array} members - Danh sách nhân viên
 * @param {Object} attitudeMap - Bảng điểm thái độ dạng { memberId: điểm }
 * @returns {Array} Bảng tổng hợp KPI chi tiết từng nhân viên
 */
export function generateKPIReport(tasks = [], members = [], attitudeMap = {}) {
  if (!Array.isArray(members)) return [];

  return members.map(member => {
    const memberId = member.id || member.name;
    const attitudeScore = attitudeMap[memberId] !== undefined ? attitudeMap[memberId] : 5;
    const stats = calculateTaskStats(tasks, memberId);
    const kpiScore = calculateMemberKPI(tasks, memberId, attitudeScore);

    return {
      memberId,
      memberName: member.name || memberId,
      role: member.role || 'Thành viên',
      totalTasks: stats.total,
      completedTasks: stats.completed,
      inProgressTasks: stats.inProgress,
      completionRate: stats.completionRate,
      attitudeScore,
      kpiScore
    };
  });
}