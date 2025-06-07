package controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import model.Notification;
import model.User;
import dao.NotificationDAO;

@WebServlet("/NotificationServlet")
public class NotificationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final NotificationDAO notificationDAO = new NotificationDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Kiểm tra người dùng đã đăng nhập
        User user = (User) request.getSession().getAttribute("user");
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Người dùng chưa đăng nhập.\"}");
            return;
        }

        try {
            // Lấy danh sách thông báo của người dùng
            List<Notification> notifications = notificationDAO.getNotificationsForUser(user.getMaNguoiDung());

            // Trả về danh sách thông báo dưới dạng JSON
            response.getWriter().write(new Gson().toJson(notifications));

            // Đánh dấu các thông báo đã gửi
            for (Notification notification : notifications) {
                notificationDAO.markNotificationAsSent(notification.getMaThongBao());
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Lỗi khi lấy danh sách thông báo: " + e.getMessage() + "\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Lỗi không xác định: " + e.getMessage() + "\"}");
        }
    }
}