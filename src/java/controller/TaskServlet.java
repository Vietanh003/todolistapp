package controller;

import dao.TaskDAO;
import dao.CategoryDAO;
import model.Task;
import model.User;
import model.Attachment;
import model.Category;
import util.DBConnection;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, // 2MB
                 maxFileSize = 1024 * 1024 * 10,      // 10MB
                 maxRequestSize = 1024 * 1024 * 50)   // 50MB
public class TaskServlet extends HttpServlet {
    private TaskDAO taskDAO;
    private CategoryDAO categoryDAO;
    private static final String UPLOAD_DIR = "uploads";

    @Override
    public void init() throws ServletException {
        taskDAO = new TaskDAO();
        categoryDAO = new CategoryDAO();
    }

 @Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    try {
        HttpSession session = request.getSession(false);
        User user = (User) session.getAttribute("user");

        if (user == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        String action = request.getParameter("action");
        Gson gson = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            .create();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if ("getTasks".equals(action)) {
            try {
                String madanhmucStr = request.getParameter("madanhmuc");
                String mucdouutien = request.getParameter("mucdouutien");
                String trangthai = request.getParameter("trangthai");
                String thoigian = request.getParameter("thoigian");

                Integer madanhmuc = (madanhmucStr != null && !madanhmucStr.isEmpty()) ? Integer.parseInt(madanhmucStr) : null;

                List<Task> tasks = taskDAO.getTasks(user.getMaNguoiDung(), madanhmuc, mucdouutien, trangthai, thoigian);
                response.getWriter().write(gson.toJson(tasks));
            } catch (Exception e) {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Lỗi khi lấy danh sách công việc: " + e.getMessage() + "\"}");
            }
        } else if ("getMonthlyStats".equals(action)) {
            try {
                Map<String, Integer> stats = taskDAO.getMonthlyTaskStats(user.getMaNguoiDung());
                response.getWriter().write(gson.toJson(stats));
            } catch (SQLException e) {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Lỗi khi lấy thống kê: " + e.getMessage() + "\"}");
            }
        } else if ("getStatsByPriority".equals(action)) {
            try {
                List<Map<String, Object>> stats = taskDAO.getTaskStatsByPriority(user.getMaNguoiDung());
                response.getWriter().write(gson.toJson(stats));
            } catch (Exception e) {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Lỗi khi lấy thống kê theo mức độ: " + e.getMessage() + "\"}");
            }
        } else if ("getTaskDetails".equals(action)) {
            try {
                String macongviecStr = request.getParameter("macongviec");
                if (macongviecStr == null || macongviecStr.isEmpty()) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().write("{\"error\": \"Mã công việc không hợp lệ\"}");
                    return;
                }

                int macongviec = Integer.parseInt(macongviecStr);
                Task task = taskDAO.getTaskDetails(macongviec);

                if (task == null) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    response.getWriter().write("{\"error\": \"Không tìm thấy công việc\"}");
                    return;
                }

                response.getWriter().write(gson.toJson(task));
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"Mã công việc không hợp lệ: " + e.getMessage() + "\"}");
            } catch (SQLException e) {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Lỗi khi lấy chi tiết công việc: " + e.getMessage() + "\"}");
            }
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Hành động không hợp lệ\"}");
        }
    } catch (Exception e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"error\": \"Lỗi không xác định: " + e.getMessage() + "\"}");
    }
}
@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    request.setCharacterEncoding("UTF-8");

    HttpSession session = request.getSession(false);
    User user = (User) session.getAttribute("user");
    if (user == null) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"success\": false, \"error\": \"Người dùng chưa đăng nhập\"}");
        return;
    }

    String action = request.getParameter("action");
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    TaskDAO taskDAO = new TaskDAO(); // Khởi tạo TaskDAO

    try {
        if ("updateTask".equals(action)) {
            
            String macongviecStr = request.getParameter("macongviec");
            String tieude = request.getParameter("tieude");
            String mota = request.getParameter("mota");
            String madanhmucStr = request.getParameter("madanhmuc");
            String mucdouutien = request.getParameter("mucdouutien");
            String ngayhethanStr = request.getParameter("ngayhethan");
            boolean hasReminder = "on".equals(request.getParameter("hasReminder"));
            String thoigiannhacnhoStr = request.getParameter("thoigiannhacnho");

            if (macongviecStr == null || macongviecStr.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"success\": false, \"error\": \"Mã công việc không hợp lệ\"}");
                return;
            }

            int macongviec = Integer.parseInt(macongviecStr);
            Task task = new Task();
            task.setMacongviec(macongviec);
            task.setManguoidung(user.getMaNguoiDung());
            task.setTieude(tieude);
            task.setMota(mota);
            task.setMucdouutien(mucdouutien);
            if (madanhmucStr != null && !madanhmucStr.isEmpty()) {
                task.setMadanhmuc(Integer.parseInt(madanhmucStr));
            }
            if (ngayhethanStr != null && !ngayhethanStr.isEmpty()) {
                task.setNgayhethan(Timestamp.valueOf(ngayhethanStr.replace("T", " ") + ":00"));
            }

            Timestamp reminderTime = null;
            if (hasReminder && thoigiannhacnhoStr != null && !thoigiannhacnhoStr.isEmpty()) {
                reminderTime = Timestamp.valueOf(thoigiannhacnhoStr.replace("T", " ") + ":00");
            }

            Timestamp currentTime = new Timestamp(System.currentTimeMillis());
            if (task.getNgayhethan() != null && task.getNgayhethan().before(currentTime)) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"success\": false, \"error\": \"Thời gian hết hạn phải sau thời gian hiện tại!\"}");
                return;
            }
            if (reminderTime != null) {
                if (reminderTime.after(task.getNgayhethan())) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().write("{\"success\": false, \"error\": \"Thời gian nhắc nhở phải trước thời gian hết hạn!\"}");
                    return;
                }
                if (reminderTime.before(currentTime)) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().write("{\"success\": false, \"error\": \"Thời gian nhắc nhở phải sau thời gian hiện tại!\"}");
                    return;
                }
                // Nếu trùng ngày với hiện tại, so sánh giờ
                if (reminderTime.toLocalDateTime().toLocalDate().equals(currentTime.toLocalDateTime().toLocalDate())) {
                    if (reminderTime.toLocalDateTime().toLocalTime().isBefore(currentTime.toLocalDateTime().toLocalTime())) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        response.getWriter().write("{\"success\": false, \"error\": \"Thời gian nhắc nhở phải lớn hơn hoặc bằng thời gian hiện tại khi cùng ngày!\"}");
                        return;
                    }
                }
            }

            // Xử lý tệp đính kèm
            Attachment attachment = null;
            Part filePart = request.getPart("attachment");
            if (filePart != null && filePart.getSize() > 0) {
                String fileName = extractFileName(filePart);
                String fileType = filePart.getContentType();
                String uploadPath = getServletContext().getRealPath("") + File.separator + UPLOAD_DIR;
                File uploadDir = new File(uploadPath);
                if (!uploadDir.exists()) uploadDir.mkdir();
                String filePath = uploadPath + File.separator + fileName;
                filePart.write(filePath);

                attachment = new Attachment();
                attachment.setTentep(fileName);
                attachment.setDuongdantep(UPLOAD_DIR + "/" + fileName);
                attachment.setLoaitep(fileType);
            }

            // Cập nhật công việc
            String errorMessage = taskDAO.updateTask(task, hasReminder, reminderTime, attachment);
            if (errorMessage != null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"success\": false, \"error\": \"" + errorMessage + "\"}");
            } else {
                response.getWriter().write("{\"success\": true, \"message\": \"Cập nhật công việc thành công\"}");
            }
        } else if ("deleteTask".equals(action)) {
            String macongviecStr = request.getParameter("macongviec");
            if (macongviecStr == null || macongviecStr.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"success\": false, \"error\": \"Mã công việc không hợp lệ\"}");
                return;
            }

            int macongviec = Integer.parseInt(macongviecStr);
            String errorMessage = taskDAO.deleteTask(macongviec, user.getMaNguoiDung());
            if (errorMessage != null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"success\": false, \"error\": \"" + errorMessage + "\"}");
            } else {
                response.getWriter().write("{\"success\": true, \"message\": \"Xóa công việc thành công\"}");
            }
        } else if ("markAsCompleted".equals(action)) {
            String macongviecStr = request.getParameter("macongviec");
            if (macongviecStr == null || macongviecStr.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"success\": false, \"error\": \"Mã công việc không hợp lệ\"}");
                return;
            }

            int macongviec = Integer.parseInt(macongviecStr);
            boolean success = taskDAO.markTaskAsCompleted(macongviec, user.getMaNguoiDung());
            if (success) {
                response.getWriter().write("{\"success\": true, \"message\": \"Đánh dấu công việc là đã hoàn thành thành công\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"success\": false, \"error\": \"Không thể đánh dấu công việc là đã hoàn thành\"}");
            }
        } else {
            // Xử lý thêm công việc
            String tieude = request.getParameter("tieude");
            String mota = request.getParameter("mota");
            String madanhmucStr = request.getParameter("madanhmuc");
            String mucdouutien = request.getParameter("mucdouutien");
            String ngayhethanStr = request.getParameter("ngayhethan");
            boolean hasReminder = "on".equals(request.getParameter("hasReminder"));
            String thoigiannhacnhoStr = request.getParameter("thoigiannhacnho");

            Task task = new Task();
            task.setManguoidung(user.getMaNguoiDung());
            task.setTieude(tieude);
            task.setMota(mota);
            task.setMucdouutien(mucdouutien);
            if (madanhmucStr != null && !madanhmucStr.isEmpty()) {
                task.setMadanhmuc(Integer.parseInt(madanhmucStr));
            }
            if (ngayhethanStr != null && !ngayhethanStr.isEmpty()) {
                task.setNgayhethan(Timestamp.valueOf(ngayhethanStr.replace("T", " ") + ":00"));
            }

            Timestamp reminderTime = null;
            if (hasReminder && thoigiannhacnhoStr != null && !thoigiannhacnhoStr.isEmpty()) {
                reminderTime = Timestamp.valueOf(thoigiannhacnhoStr.replace("T", " ") + ":00");
            }

            // Kiểm tra thời gian
            Timestamp currentTime = new Timestamp(System.currentTimeMillis());
            if (task.getNgayhethan() != null && task.getNgayhethan().before(currentTime)) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"success\": false, \"error\": \"Thời gian hết hạn phải sau thời gian hiện tại!\"}");
                return;
            }
            if (reminderTime != null) {
                if (reminderTime.after(task.getNgayhethan())) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().write("{\"success\": false, \"error\": \"Thời gian nhắc nhở phải trước thời gian hết hạn!\"}");
                    return;
                }
                if (reminderTime.before(currentTime)) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().write("{\"success\": false, \"error\": \"Thời gian nhắc nhở phải sau thời gian hiện tại!\"}");
                    return;
                }
                // Nếu trùng ngày với hiện tại, so sánh giờ
                if (reminderTime.toLocalDateTime().toLocalDate().equals(currentTime.toLocalDateTime().toLocalDate())) {
                    if (reminderTime.toLocalDateTime().toLocalTime().isBefore(currentTime.toLocalDateTime().toLocalTime())) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        response.getWriter().write("{\"success\": false, \"error\": \"Thời gian nhắc nhở phải lớn hơn hoặc bằng thời gian hiện tại khi cùng ngày!\"}");
                        return;
                    }
                }
            }

            // Xử lý tệp đính kèm
            Attachment attachment = null;
            Part filePart = request.getPart("attachment");
            if (filePart != null && filePart.getSize() > 0) {
                String fileName = extractFileName(filePart);
                String fileType = filePart.getContentType();
                String uploadPath = getServletContext().getRealPath("") + File.separator + UPLOAD_DIR;
                File uploadDir = new File(uploadPath);
                if (!uploadDir.exists()) uploadDir.mkdir();
                String filePath = uploadPath + File.separator + fileName;
                filePart.write(filePath);

                attachment = new Attachment();
                attachment.setTentep(fileName);
                attachment.setDuongdantep(UPLOAD_DIR + "/" + fileName);
                attachment.setLoaitep(fileType);
            }

            // Thêm công việc
            int newTaskId = taskDAO.addTask(task, hasReminder, reminderTime, attachment);
            response.getWriter().write("{\"success\": true, \"newTaskId\": " + newTaskId + ", \"message\": \"Thêm công việc thành công\"}");
        }
    } catch (SQLException e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().write("{\"success\": false, \"error\": \"Lỗi khi xử lý công việc: " + e.getMessage() + "\"}");
    } catch (NumberFormatException e) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.getWriter().write("{\"success\": false, \"error\": \"Dữ liệu không hợp lệ: " + e.getMessage() + "\"}");
    } catch (Exception e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().write("{\"success\": false, \"error\": \"Lỗi không xác định: " + e.getMessage() + "\"}");
    }
}

    private String extractFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] items = contentDisp.split(";");
        for (String s : items) {
            if (s.trim().startsWith("filename")) {
                return s.substring(s.indexOf("=") + 2, s.length() - 1);
            }
        }
        return "";
    }
}