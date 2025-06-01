package dao;

import model.Task;
import model.Category;
import model.Attachment;
import model.ActivityLog;
import util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

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
            stmt.setNull(2, java.sql.Types.INTEGER);
        }

        ResultSet rs = stmt.executeQuery();

        while (rs.next()) {
            Task task = new Task();
            task.setMacongviec(rs.getInt("MACONGVIEC"));
            task.setTieude(rs.getString("TIEUDE"));
            task.setMucdouutien(rs.getString("MUCDOUUTIEN"));
            task.setNgayhethan(rs.getTimestamp("NGAYHETHAN")); // KHÔNG dùng Calendar ở đây
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

        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        if (rs.next()) {
            task = new Task();
            task.setMacongviec(macongviec);
            task.setTieude(rs.getString("TIEUDE"));
            task.setMota(rs.getString("MOTA"));

            Category category = new Category();
            category.setTen(rs.getString("TEN_DANHMUC"));
            task.setCategory(category);

            task.setMucdouutien(rs.getString("MUCDOUUTIEN"));
            task.setNgayhethan(rs.getTimestamp("NGAYHETHAN", calendar));

            task.setDahoanthanh(rs.getBoolean("DAHOANTHANH"));
            task.setNgayhoanthanh(rs.getTimestamp("NGAYHOANTHANH", calendar));

            task.setNhacNho(new ArrayList<>());
            task.setAttachments(new ArrayList<>());
            task.setActivityLogs(new ArrayList<>());

            if (rs.getTimestamp("THOIGIANNHACNHO", calendar) != null) {
                task.addNhacNho(rs.getTimestamp("THOIGIANNHACNHO", calendar));
            }

            if (rs.getString("TENTEP") != null) {
                Attachment attachment = new Attachment();
                attachment.setTentep(rs.getString("TENTEP"));
                attachment.setDuongdantep(rs.getString("DUONGDANTEP"));
                attachment.setLoaitep(rs.getString("LOAITEP"));
                task.addAttachment(attachment);
            }

            String lichSuHoatDong = rs.getString("LICH_SU_HOAT_DONG");
            if (lichSuHoatDong != null && !lichSuHoatDong.isEmpty()) {
                String[] actions = lichSuHoatDong.split(",");
                for (String action : actions) {
                    String[] parts = action.split("\\|");
                    if (parts.length == 2) {
                        String hanhDong = parts[0];
                        String thoiGianStr = parts[1];
                        try {
                            Timestamp thoiGian = Timestamp.valueOf(thoiGianStr);
                            ActivityLog log = new ActivityLog();
                            log.setHanhdong(hanhDong);
                            log.setThoigian(thoiGian);
                            task.getActivityLogs().add(log);
                        } catch (IllegalArgumentException e) {
                            System.err.println("Lỗi định dạng thời gian: " + thoiGianStr);
                        }
                    }
                }
            }

            while (rs.next()) {
                if (rs.getTimestamp("THOIGIANNHACNHO", calendar) != null) {
                    task.addNhacNho(rs.getTimestamp("THOIGIANNHACNHO", calendar));
                }

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