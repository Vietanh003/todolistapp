package dao;

import java.sql.ResultSet;
import model.User;
import util.DBConnection;
import util.OperationResult; 
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

public class UserDAO {
    // Phương thức đăng ký
    public OperationResult registerUser(User user) {
        String sql = "{CALL CreateUser(?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {
            stmt.setString(1, user.getEmail());
            stmt.setString(2, user.getMatKhau());
            stmt.setString(3, user.getTenNguoiDung());
            stmt.executeUpdate();
            return new OperationResult(true, "Đăng ký thành công!");
        } catch (SQLException e) {
            String errorMessage = e.getSQLState().equals("23000") ? "Email đã tồn tại!" : "Lỗi: " + e.getMessage();
            return new OperationResult(false, errorMessage);
        }
    }

    // Phương thức đăng nhập
    public User loginUser(String email, String matKhau) {
        String sql = "{CALL LoginUser(?, ?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {
            // Đặt tham số đầu vào
            stmt.setString(1, email);
            stmt.setString(2, matKhau);
            // Đăng ký tham số đầu ra
            stmt.registerOutParameter(3, Types.INTEGER); // p_manguoidung
            stmt.registerOutParameter(4, Types.VARCHAR); // p_tennguoidung
            // Thực thi
            stmt.execute();

            // Lấy kết quả
            int maNguoiDung = stmt.getInt(3);
            String tenNguoiDung = stmt.getString(4);

            if (maNguoiDung != -1) {
                User user = new User(maNguoiDung, email, matKhau, tenNguoiDung, null, null);
                return user;
            } else {
                return null; // Đăng nhập thất bại
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    // Phương thức lấy thông tin người dùng
    public User getUserInfo(int manguoidung) throws SQLException {
        User user = null;
        String call = "{CALL GetUserInfo(?)}";

        try (var conn = DBConnection.getConnection();
             var stmt = conn.prepareCall(call)) {
            stmt.setInt(1, manguoidung);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                user = new User();
                user.setMaNguoiDung(rs.getInt("MANGUOIDUNG"));
                user.setEmail(rs.getString("EMAIL"));
                user.setTenNguoiDung(rs.getString("TENNGUOIDUNG"));
                user.setNgayTao(rs.getTimestamp("NGAYTAO"));
                user.setDuongDanAnhDaiDien(rs.getString("DUONGDANANHDAIDIEN"));
            }
        }
        return user;
    }

    public OperationResult updateUserInfo(int maNguoiDung, String email, String tenNguoiDung, String duongDanAnhDaiDien) {
    String sql = "{CALL UpdateUserInfo(?, ?, ?, ?, ?)}";
    try (Connection conn = DBConnection.getConnection();
         CallableStatement stmt = conn.prepareCall(sql)) {
        // Kiểm tra dữ liệu đầu vào
        if (email == null || email.trim().isEmpty() || tenNguoiDung == null || tenNguoiDung.trim().isEmpty()) {
            return new OperationResult(false, "Email hoặc tên người dùng không được để trống.");
        }

        // Đặt tham số đầu vào
        stmt.setInt(1, maNguoiDung);
        stmt.setString(2, email);
        stmt.setString(3, tenNguoiDung);
        stmt.setString(4, duongDanAnhDaiDien);
        // Đăng ký tham số đầu ra
        stmt.registerOutParameter(5, Types.VARCHAR); // p_message
        // Thực thi
        stmt.execute();

        // Lấy thông báo kết quả
        String message = stmt.getString(5);
        if (message.equals("Cập nhật thông tin người dùng thành công.")) {
            return new OperationResult(true, message);
        } else {
            return new OperationResult(false, message);
        }
    } catch (SQLException e) {
        String errorMessage = e.getMessage();
        if (errorMessage.contains("Email đã được sử dụng bởi người dùng khác.")) {
            return new OperationResult(false, "Email đã được sử dụng bởi người dùng khác.");
        } else if (errorMessage.contains("Người dùng không tồn tại.")) {
            return new OperationResult(false, "Người dùng không tồn tại.");
        } else {
            return new OperationResult(false, "Lỗi: " + errorMessage);
        }
    }
}
    // Phương thức lấy danh sách người dùng trừ người dùng hiện tại
    public Map<Integer, String> getUsersExceptCurrent(int maNguoiDung) {
        Map<Integer, String> users = new HashMap<>();
        String sql = "{CALL GetUsersExceptCurrent(?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {
            stmt.setInt(1, maNguoiDung);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                int userId = rs.getInt("MANGUOIDUNG");
                String tenNguoiDung = rs.getString("TENNGUOIDUNG");
                users.put(userId, tenNguoiDung);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return users;
    }
    // Phương thức đổi mật khẩu
    public OperationResult changeUserPassword(int maNguoiDung, String currentPassword, String newPassword) {
        String sql = "{CALL ChangeUserPassword(?, ?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {
            // Đặt tham số đầu vào
            stmt.setInt(1, maNguoiDung);
            stmt.setString(2, currentPassword);
            stmt.setString(3, newPassword);
            // Đăng ký tham số đầu ra
            stmt.registerOutParameter(4, Types.VARCHAR); // p_message
            // Thực thi
            stmt.execute();

            // Lấy thông báo kết quả
            String message = stmt.getString(4);
            if (message.equals("Đổi mật khẩu thành công.")) {
                return new OperationResult(true, message);
            } else {
                return new OperationResult(false, message);
            }
        } catch (SQLException e) {
            String errorMessage = e.getMessage();
            if (errorMessage.contains("Người dùng không tồn tại.")) {
                return new OperationResult(false, "Người dùng không tồn tại.");
            } else if (errorMessage.contains("Mật khẩu hiện tại không đúng.")) {
                return new OperationResult(false, "Mật khẩu hiện tại không đúng.");
            } else if (errorMessage.contains("Mật khẩu mới phải khác mật khẩu hiện tại.")) {
                return new OperationResult(false, "Mật khẩu mới phải khác mật khẩu hiện tại.");
            } else {
                return new OperationResult(false, "Lỗi: " + errorMessage);
            }
        }
    }
    public Map<Integer, String> searchUsers(int currentUserId, String searchTerm) {
    Map<Integer, String> users = new HashMap<>();
    String sql = "{CALL SearchUsers(?, ?)}"; // Giả sử có stored procedure
    try (Connection conn = DBConnection.getConnection();
         CallableStatement stmt = conn.prepareCall(sql)) {
        stmt.setInt(1, currentUserId);
        stmt.setString(2, "%" + searchTerm + "%");
        ResultSet rs = stmt.executeQuery();
        while (rs.next()) {
            int userId = rs.getInt("MANGUOIDUNG");
            String tenNguoiDung = rs.getString("TENNGUOIDUNG");
            users.put(userId, tenNguoiDung);
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return users;
}
}
