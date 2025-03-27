package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import model.Category;
import util.DBConnection;

public class CategoryDAO {

    // Lấy danh sách danh mục của người dùng
    public List<Category> getCategories(int userId) {
        List<Category> categories = new ArrayList<>();
        String sql = "{CALL GetCategories(?)}";

        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {

            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Category category = new Category();
                category.setMadanhmuc(rs.getInt("MADANHMUC"));
                category.setTen(rs.getString("TEN"));
                category.setMausac(rs.getString("MAUSAC"));
                categories.add(category);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return categories;
    }

    // Thêm danh mục
    public boolean addCategory(int userId, String ten, String mausac) {
        String sql = "{CALL AddCategory(?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {

            stmt.setInt(1, userId);
            stmt.setString(2, ten);
            stmt.setString(3, mausac);

            return stmt.executeUpdate() > 0; // Kiểm tra xem có thêm thành công không

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Cập nhật danh mục
    public boolean updateCategory(int madanhmuc, int userId, String ten, String mausac) {
        String sql = "{CALL UpdateCategory(?, ?, ?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {

            stmt.setInt(1, madanhmuc);
            stmt.setInt(2, userId);
            stmt.setString(3, ten);
            stmt.setString(4, mausac);

            return stmt.executeUpdate() > 0; // Trả về true nếu cập nhật thành công

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Xóa danh mục
    public boolean deleteCategory(int madanhmuc, int userId) {
        String sql = "{CALL DeleteCategory(?, ?)}";
        try (Connection conn = DBConnection.getConnection();
             CallableStatement stmt = conn.prepareCall(sql)) {

            stmt.setInt(1, madanhmuc);
            stmt.setInt(2, userId);

            return stmt.executeUpdate() > 0; // Trả về true nếu xóa thành công

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
