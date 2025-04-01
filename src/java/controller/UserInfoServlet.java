package controller;

import model.User;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/userInfo")
public class UserInfoServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        PrintWriter out = response.getWriter();

        if (session != null && session.getAttribute("user") != null) {
            User user = (User) session.getAttribute("user");
            String username = user.getTenNguoiDung() != null ? user.getTenNguoiDung() : "";
            out.print("{\"username\": \"" + username + "\"}");
        } else {
            out.print("{\"username\": \"\"}");
        }
        out.flush();
    }
}