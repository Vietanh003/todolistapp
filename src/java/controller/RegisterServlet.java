package controller;

import dao.UserDAO;
import dao.UserDAO.RegisterResult;
import model.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {
    private UserDAO userDAO;

    @Override
    public void init() {
        userDAO = new UserDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String username = request.getParameter("username");

        // Kiểm tra dữ liệu đầu vào
        if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
            request.setAttribute("error", "Email và mật khẩu không được để trống!");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        User user = new User(email, password, username);
        RegisterResult result = userDAO.registerUser(user);

        if (result.isSuccess()) {
            response.sendRedirect("login.jsp");
        } else {
            request.setAttribute("error", result.getMessage());
            request.getRequestDispatcher("register.jsp").forward(request, response);
        }
    }
}