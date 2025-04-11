package dao;

import model.Task;
import model.Category;
import model.Attachment;
import model.ActivityLog;
import util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TaskDAO {

    // Thêm công việc
    public int addTask(Task task, boolean hasReminder, Timestamp reminderTime, Attachment attachment) throws SQLException {
        String call = "{CALL AddTask(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(call)) {
            stmt.setInt(1, task.getManguoidung());
            stmt.setInt(2, task.getMadanhmuc() != null ? task.getMadanhmuc() : 0);
            stmt.setString(3, task.getTieude());
            stmt.setString(4, task.getMota());
            stmt.setString(5, task.getMucdouutien());
            stmt.setTimestamp(6, task.getNgayhethan());
            stmt.setBoolean(7, hasReminder);
            stmt.setTimestamp(8, reminderTime);
            if (attachment != null) {
                stmt.setString(9, attachment.getTentep());
                stmt.setString(10, attachment.getDuongdantep());
                stmt.setString(11, attachment.getLoaitep());
            } else {
                stmt.setNull(9, Types.VARCHAR);
                stmt.setNull(10, Types.VARCHAR);
                stmt.setNull(11, Types.VARCHAR);
            }
            stmt.registerOutParameter(12, Types.INTEGER);
            stmt.execute();
            return stmt.getInt(12);
        }
    }

    // Lấy danh sách công việc
   public List<Task> getTasks(int manguoidung, Integer madanhmuc) throws SQLException {
    List<Task> tasks = new ArrayList<>();
    String call = "{CALL GetTasks(?, ?)}";

    try (Connection conn = DBConnection.getConnection();
         CallableStatement stmt = conn.prepareCall(call)) {
        stmt.setInt(1, manguoidung);
        if (madanhmuc != null) {
            stmt.setInt(2, madanhmuc);
        } else {
            stmt.setNull(2, java.sql.Types.INTEGER); // Truyền NULL nếu không có madanhmuc
        }
        ResultSet rs = stmt.executeQuery();

        while (rs.next()) {
            Task task = new Task();
            task.setMacongviec(rs.getInt("MACONGVIEC"));
            task.setTieude(rs.getString("TIEUDE"));
            task.setMucdouutien(rs.getString("MUCDOUUTIEN"));
            task.setNgayhethan(rs.getTimestamp("NGAYHETHAN"));
            task.setDahoanthanh(rs.getBoolean("DAHOANTHANH"));
            tasks.add(task);
        }
    }
    return tasks;
}
public Task getTaskDetails(int macongviec) throws SQLException {
    Task task = null;
    String call = "{CALL GetTaskDetails(?)}";

    try (Connection conn = DBConnection.getConnection();
         CallableStatement stmt = conn.prepareCall(call)) {
        stmt.setInt(1, macongviec);
        ResultSet rs = stmt.executeQuery();

        if (rs.next()) {
            task = new Task();
            task.setMacongviec(macongviec);
            task.setTieude(rs.getString("TIEUDE"));
            task.setMota(rs.getString("MOTA"));

            Category category = new Category();
            category.setTen(rs.getString("TEN_DANHMUC"));
            task.setCategory(category);

            task.setMucdouutien(rs.getString("MUCDOUUTIEN"));
            task.setNgayhethan(rs.getTimestamp("NGAYHETHAN"));

            // Lấy trạng thái hoàn thành và ngày hoàn thành
            task.setDahoanthanh(rs.getBoolean("DAHOANTHANH"));
            task.setNgayhoanthanh(rs.getTimestamp("NGAYHOANTHANH"));

            // Khởi tạo danh sách
            task.setNhacNho(new ArrayList<>());
            task.setAttachments(new ArrayList<>());
            task.setActivityLogs(new ArrayList<>());

            // Xử lý thời gian nhắc nhở
            if (rs.getTimestamp("THOIGIANNHACNHO") != null) {
                task.addNhacNho(rs.getTimestamp("THOIGIANNHACNHO"));
            }

            // Xử lý tệp đính kèm
            if (rs.getString("TENTEP") != null) {
                Attachment attachment = new Attachment();
                attachment.setTentep(rs.getString("TENTEP"));
                attachment.setDuongdantep(rs.getString("DUONGDANTEP"));
                attachment.setLoaitep(rs.getString("LOAITEP"));
                task.addAttachment(attachment);
            }

            // Xử lý lịch sử hoạt động từ cột LICH_SU_HOAT_DONG
            String lichSuHoatDong = rs.getString("LICH_SU_HOAT_DONG");
            if (lichSuHoatDong != null && !lichSuHoatDong.isEmpty()) {
                String[] actions = lichSuHoatDong.split(",");
                for (String action : actions) {
                    String[] parts = action.split("\\|");
                    if (parts.length == 2) {
                        String hanhDong = parts[0];
                        String thoiGianStr = parts[1];

                        // Chuyển đổi thời gian từ chuỗi thành Timestamp
                        try {
                            Timestamp thoiGian = Timestamp.valueOf(thoiGianStr);
                            ActivityLog log = new ActivityLog();
                            log.setHanhdong(hanhDong);
                            log.setThoigian(thoiGian);
                            task.getActivityLogs().add(log);
                        } catch (IllegalArgumentException e) {
                            // Ghi log lỗi nếu định dạng thời gian không hợp lệ
                            System.err.println("Lỗi định dạng thời gian: " + thoiGianStr);
                        }
                    }
                }
            }

            // Xử lý các bản ghi tiếp theo (nếu có nhiều nhắc nhở hoặc tệp đính kèm)
            while (rs.next()) {
                // Thêm thời gian nhắc nhở nếu có
                if (rs.getTimestamp("THOIGIANNHACNHO") != null) {
                    task.addNhacNho(rs.getTimestamp("THOIGIANNHACNHO"));
                }

                // Thêm tệp đính kèm nếu có
                if (rs.getString("TENTEP") != null) {
                    Attachment attachment = new Attachment();
                    attachment.setTentep(rs.getString("TENTEP"));
                    attachment.setDuongdantep(rs.getString("DUONGDANTEP"));
                    attachment.setLoaitep(rs.getString("LOAITEP"));
                    task.addAttachment(attachment);
                }
            }
        }
    }
    return task;
}
    // Ghi nhật ký hoạt động
    public void logActivity(int macongviec, int manguoidung, String hanhdong) throws SQLException {
        String call = "{CALL LogActivity(?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(call)) {
            stmt.setInt(1, macongviec);
            stmt.setInt(2, manguoidung);
            stmt.setString(3, hanhdong);
            stmt.execute();
        }
    }

    // Cập nhật công việc
    public String updateTask(Task task, boolean hasReminder, Timestamp reminderTime, Attachment attachment) throws SQLException {
        String call = "{CALL UpdateTask(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(call)) {
            stmt.setInt(1, task.getMacongviec());
            stmt.setInt(2, task.getManguoidung());
            stmt.setInt(3, task.getMadanhmuc() != null ? task.getMadanhmuc() : 0);
            stmt.setString(4, task.getTieude());
            stmt.setString(5, task.getMota());
            stmt.setString(6, task.getMucdouutien());
            stmt.setTimestamp(7, task.getNgayhethan());
            stmt.setBoolean(8, hasReminder);
            stmt.setTimestamp(9, reminderTime);
            if (attachment != null) {
                stmt.setString(10, attachment.getTentep());
                stmt.setString(11, attachment.getDuongdantep());
                stmt.setString(12, attachment.getLoaitep());
            } else {
                stmt.setNull(10, Types.VARCHAR);
                stmt.setNull(11, Types.VARCHAR);
                stmt.setNull(12, Types.VARCHAR);
            }
            stmt.registerOutParameter(13, Types.VARCHAR);
            stmt.execute();
            return stmt.getString(13); // Trả về thông báo lỗi (nếu có)
        }
    }

    // Xóa công việc
    public String deleteTask(int macongviec, int manguoidung) throws SQLException {
        String call = "{CALL DeleteTask(?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(call)) {
            stmt.setInt(1, macongviec);
            stmt.setInt(2, manguoidung);
            stmt.registerOutParameter(3, Types.VARCHAR);
            stmt.execute();
            return stmt.getString(3); // Trả về thông báo lỗi (nếu có)
        }
    }
   
    public boolean markTaskAsCompleted(int macongviec, int manguoidung) throws SQLException {
        String call = "{CALL MarkTaskAsCompleted(?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(call)) {
            // Thiết lập tham số đầu vào
            stmt.setInt(1, macongviec);
            stmt.setInt(2, manguoidung);
            // Đăng ký tham số đầu ra
            stmt.registerOutParameter(3, Types.VARCHAR);
            
            // Thực thi stored procedure
            stmt.execute();
            
            // Lấy thông báo lỗi (nếu có)
            String errorMessage = stmt.getString(3);
            if (errorMessage != null) {
                throw new SQLException(errorMessage);
            }
            
            return true;
        } catch (SQLException e) {
            throw new SQLException("Lỗi khi đánh dấu công việc là đã hoàn thành: " + e.getMessage(), e);
        }
    }
}