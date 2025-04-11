package dao;
import java.sql.ResultSet;
import model.User;
import util.DBConnection;
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.SQLException;
import java.sql.Types;

public class UserDAO {
    // Lớp RegisterResult (đã có từ trước)
    public class RegisterResult {
        private boolean success;
        private String message;

        public RegisterResult(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
    }

    // Phương thức đăng ký (đã có)
    public RegisterResult registerUser(User user) {
        String sql = "{CALL CreateUser(?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {
            stmt.setString(1, user.getEmail());
            stmt.setString(2, user.getMatKhau());
            stmt.setString(3, user.getTenNguoiDung());
            stmt.executeUpdate();
            return new RegisterResult(true, "Đăng ký thành công!");
        } catch (SQLException e) {
            String errorMessage = e.getSQLState().equals("23000") ? "Email đã tồn tại!" : "Lỗi: " + e.getMessage();
            return new RegisterResult(false, errorMessage);
        }
    }

    // Phương thức đăng nhập mới
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
}