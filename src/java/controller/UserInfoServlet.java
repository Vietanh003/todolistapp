package controller;

import dao.UserDAO;
import model.User;
import util.OperationResult;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.nio.file.Paths;

@WebServlet("/userInfo")
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, // 2MB
                 maxFileSize = 1024 * 1024 * 10,      // 10MB
                 maxRequestSize = 1024 * 1024 * 50)   // 50MB
public class UserInfoServlet extends HttpServlet {
    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Người dùng chưa đăng nhập.\"}");
            return;
        }

        User sessionUser = (User) session.getAttribute("user");
        Gson gson = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            .create();

        try {
            User userInfo = userDAO.getUserInfo(sessionUser.getMaNguoiDung());
            if (userInfo == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"error\": \"Không tìm thấy thông tin người dùng.\"}");
            } else {
                response.getWriter().write(gson.toJson(userInfo));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Lỗi khi lấy thông tin người dùng: " + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.write("{\"error\": \"Người dùng chưa đăng nhập.\"}");
            return;
        }

        User user = (User) session.getAttribute("user");
        int maNguoiDung = user.getMaNguoiDung();

        // Lấy action từ multipart
        String action = null;
        Part actionPart = request.getPart("action");
        if (actionPart != null) {
            action = new String(actionPart.getInputStream().readAllBytes(), "UTF-8");
        }

        Gson gson = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            .create();

        if ("updateProfile".equals(action)) {
            String email = null;
            String tenNguoiDung = null;
            String duongDanAnhDaiDien = user.getDuongDanAnhDaiDien(); // Giữ nguyên ảnh cũ nếu không có ảnh mới

            // Lấy email
            Part emailPart = request.getPart("email");
            if (emailPart != null) {
                email = new String(emailPart.getInputStream().readAllBytes(), "UTF-8");
            }

            // Lấy tenNguoiDung
            Part tenNguoiDungPart = request.getPart("tenNguoiDung");
            if (tenNguoiDungPart != null) {
                tenNguoiDung = new String(tenNguoiDungPart.getInputStream().readAllBytes(), "UTF-8");
            }

            // Xử lý tệp ảnh
            Part filePart = request.getPart("avatar");
            if (filePart != null && filePart.getSize() > 0) {
                String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
                String uploadDir = getServletContext().getRealPath("/uploads");
                File uploadDirFile = new File(uploadDir);
                if (!uploadDirFile.exists()) {
                    uploadDirFile.mkdirs();
                }
                String filePath = uploadDir + File.separator + maNguoiDung + "_" + fileName;
                filePart.write(filePath);
                duongDanAnhDaiDien = "/uploads/" + maNguoiDung + "_" + fileName;
            }

            // Kiểm tra dữ liệu đầu vào
            if (email == null || tenNguoiDung == null) {
                out.write("{\"error\": \"Email hoặc tên người dùng không được để trống.\"}");
                return;
            }

            OperationResult result = userDAO.updateUserInfo(maNguoiDung, email, tenNguoiDung, duongDanAnhDaiDien);
            if (result.isSuccess()) {
                // Cập nhật thông tin trong session
                user.setEmail(email);
                user.setTenNguoiDung(tenNguoiDung);
                user.setDuongDanAnhDaiDien(duongDanAnhDaiDien);
                session.setAttribute("user", user);

                // Lấy thông tin người dùng mới nhất để trả về
                try {
                    User updatedUser = userDAO.getUserInfo(maNguoiDung);
                    out.write(gson.toJson(new Response(true, result.getMessage(), updatedUser)));
                } catch (SQLException e) {
                    out.write("{\"error\": \"Lỗi khi lấy thông tin người dùng sau cập nhật: " + e.getMessage() + "\"}");
                }
            } else {
                out.write("{\"error\": \"" + result.getMessage() + "\"}");
            }
        } else if ("changePassword".equals(action)) {
            String currentPassword = null;
            String newPassword = null;

            // Lấy currentPassword
            Part currentPasswordPart = request.getPart("currentPassword");
            if (currentPasswordPart != null) {
                currentPassword = new String(currentPasswordPart.getInputStream().readAllBytes(), "UTF-8");
            }

            // Lấy newPassword
            Part newPasswordPart = request.getPart("newPassword");
            if (newPasswordPart != null) {
                newPassword = new String(newPasswordPart.getInputStream().readAllBytes(), "UTF-8");
            }

            // Kiểm tra dữ liệu đầu vào
            if (currentPassword == null || newPassword == null) {
                out.write("{\"error\": \"Mật khẩu hiện tại hoặc mật khẩu mới không được để trống.\"}");
                return;
            }

            OperationResult result = userDAO.changeUserPassword(maNguoiDung, currentPassword, newPassword);
            if (result.isSuccess()) {
                // Đăng xuất người dùng sau khi đổi mật khẩu
                session.invalidate();
                out.write("{\"success\": true, \"message\": \"" + result.getMessage() + "\"}");
            } else {
                out.write("{\"error\": \"" + result.getMessage() + "\"}");
            }
        } else {
            out.write("{\"error\": \"Hành động không hợp lệ.\"}");
        }
    }

    // Lớp để trả về phản hồi JSON
    private static class Response {
        boolean success;
        String message;
        User data;

        Response(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        Response(boolean success, String message, User data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }
    }
}