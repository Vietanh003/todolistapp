package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import model.Notification;
import util.DBConnection;

public class NotificationDAO {

    // Lấy danh sách thông báo của người dùng
    public List<Notification> getNotificationsForUser(int maNguoiDung) throws SQLException {
        List<Notification> notifications = new ArrayList<>();
        String sql = "{CALL GetNotificationsForUser(?)}";

        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {

            stmt.setInt(1, maNguoiDung);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Notification notification = new Notification(
                    rs.getInt("MATHONGBAO"),
                    rs.getInt("MACONGVIEC"),
                    rs.getInt("MANGUOIDUNG"),
                    rs.getTimestamp("THOIGIANNHACNHO"),
                    rs.getString("TIEUDE"),
                    rs.getString("MOTA")
                );
                notifications.add(notification);
            }
        }
        return notifications;
    }

    // Cập nhật trạng thái DAGUI của thông báo
    public void markNotificationAsSent(int maThongBao) throws SQLException {
        String sql = "UPDATE THONGBAO SET DAGUI = 1 WHERE MATHONGBAO = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, maThongBao);
            int rowsAffected = stmt.executeUpdate();
            if (rowsAffected == 0) {
                throw new SQLException("Không thể cập nhật trạng thái thông báo. Thông báo không tồn tại.");
            }
        }
    }
}