package dao;

import model.Task;
import model.Category;
import model.Attachment;
import model.ActivityLog;
import util.DBConnection; // Thêm import cho DBConnection
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
public List<Task> getTasksOverview(int manguoidung) throws SQLException {
    List<Task> tasks = new ArrayList<>();
    String call = "{CALL GetTasksOverview(?)}";
    
    try (Connection conn = DBConnection.getConnection();
         CallableStatement stmt = conn.prepareCall(call)) {
        stmt.setInt(1, manguoidung);
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

        // Chỉ lấy một nhiệm vụ duy nhất
        if (rs.next()) {
            task = new Task();
            task.setMacongviec(macongviec);
            task.setTieude(rs.getString("TIEUDE"));
            task.setMota(rs.getString("MOTA"));

            // Lấy danh mục
            Category category = new Category();
            category.setTen(rs.getString("TEN"));
            task.setCategory(category);

            task.setMucdouutien(rs.getString("MUCDOUUTIEN"));
            task.setNgayhethan(rs.getTimestamp("NGAYHETHAN"));

            // Khởi tạo các danh sách
            task.setNhacNho(new ArrayList<>());
            task.setAttachments(new ArrayList<>());
            task.setActivityLogs(new ArrayList<>());

            // Lấy thông tin thời gian nhắc nhở
            if (rs.getTimestamp("THOIGIANNHACNHO") != null) {
                task.addNhacNho(rs.getTimestamp("THOIGIANNHACNHO"));
            }

            // Lấy danh sách tệp đính kèm
            if (rs.getString("TENTEP") != null) {
                Attachment attachment = new Attachment();
                attachment.setTentep(rs.getString("TENTEP"));
                attachment.setDuongdantep(rs.getString("DUONGDANTEP"));
                attachment.setLoaitep(rs.getString("LOAITEP"));
                task.addAttachment(attachment);
            }

            // Lấy danh sách nhật ký hoạt động
            if (rs.getString("HANHDONG") != null) {
                ActivityLog log = new ActivityLog();
                log.setHanhdong(rs.getString("HANHDONG"));
                log.setThoigian(rs.getTimestamp("THOIGIAN"));
                task.getActivityLogs().add(log);
            }

            // Tiếp tục lấy các hàng tiếp theo nếu có (cho danh sách nhắc nhở, tệp đính kèm, nhật ký)
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

                // Thêm nhật ký hoạt động nếu có
                if (rs.getString("HANHDONG") != null) {
                    ActivityLog log = new ActivityLog();
                    log.setHanhdong(rs.getString("HANHDONG"));
                    log.setThoigian(rs.getTimestamp("THOIGIAN"));
                    task.getActivityLogs().add(log);
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
}