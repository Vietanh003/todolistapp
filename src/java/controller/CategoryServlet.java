package controller;

import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import model.Category;
import model.User;
import dao.CategoryDAO;

@WebServlet("/CategoryServlet")
public class CategoryServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final CategoryDAO categoryDAO = new CategoryDAO();

    // Lấy danh sách danh mục (GET)
@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    User user = (User) request.getSession().getAttribute("user");
    if (user == null) {
        response.sendRedirect("login.jsp");
        return;
    }

    List<Category> categories = categoryDAO.getCategories(user.getMaNguoiDung());

    // Chuyển danh sách thành JSON
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response.getWriter().write(new Gson().toJson(categories));
}



    // Thêm danh mục (POST)
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User user = (User) request.getSession().getAttribute("user");
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"User not logged in\"}");
            return;
        }
// Đặt encoding cho request
    request.setCharacterEncoding("UTF-8");
    
    // Đặt encoding cho response
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
        String ten = request.getParameter("ten");
        String mausac = request.getParameter("mausac");

        boolean success = categoryDAO.addCategory(user.getMaNguoiDung(), ten, mausac);
        response.getWriter().write("{\"success\": " + success + "}");
    }
@Override
protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    User user = (User) request.getSession().getAttribute("user");
    if (user == null) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"success\": false, \"error\": \"User not logged in\"}");
        return;
    }

    // Đọc thủ công nội dung form từ request body (xử lý PUT)
    String body = request.getReader().lines().collect(java.util.stream.Collectors.joining(System.lineSeparator()));
    java.util.Map<String, String> params = new java.util.HashMap<>();
    for (String param : body.split("&")) {
        String[] keyValue = param.split("=");
        if (keyValue.length == 2) {
            String key = java.net.URLDecoder.decode(keyValue[0], "UTF-8");
            String value = java.net.URLDecoder.decode(keyValue[1], "UTF-8");
            params.put(key, value);
        }
    }

    try {
        String madanhmucStr = params.get("madanhmuc");
        if (madanhmucStr == null || madanhmucStr.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\": false, \"error\": \"Mã danh mục không hợp lệ\"}");
            return;
        }

        int madanhmuc = Integer.parseInt(madanhmucStr);

        String ten = params.get("ten");
        if (ten == null || ten.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\": false, \"error\": \"Tên danh mục không được để trống\"}");
            return;
        }

        String mausac = params.getOrDefault("mausac", "#000000");

        boolean success = categoryDAO.updateCategory(madanhmuc, user.getMaNguoiDung(), ten, mausac);
        response.getWriter().write("{\"success\": " + success + (success ? "" : ", \"error\": \"Không thể cập nhật danh mục\"") + "}");
    } catch (NumberFormatException e) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.getWriter().write("{\"success\": false, \"error\": \"Mã danh mục không hợp lệ\"}");
    } catch (Exception e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().write("{\"success\": false, \"error\": \"Lỗi máy chủ: " + e.getMessage() + "\"}");
    }
}

    // Xóa danh mục (DELETE)
  @Override
protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    User user = (User) request.getSession().getAttribute("user");
    if (user == null) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"error\": \"User not logged in\"}");
        return;
    }

    try {
        int madanhmuc = Integer.parseInt(request.getParameter("madanhmuc"));
        
        boolean success = categoryDAO.deleteCategory(madanhmuc, user.getMaNguoiDung());
        if (success) {
            response.getWriter().write("{\"success\": true}");
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Không thể xóa danh mục.\"}");
        }
    } catch (NumberFormatException e) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.getWriter().write("{\"error\": \"madanhmuc không hợp lệ.\"}");
    } catch (Exception e) {
        e.printStackTrace(); // Ghi log lỗi chi tiết trong console Tomcat
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().write("{\"error\": \"Lỗi máy chủ.\"}");
    }
}

}
