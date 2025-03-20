<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Đăng nhập</title>
        <link rel="stylesheet" href="css/login.css">
    </head>
    <body>
        <div class="container">
            <h2>Đăng nhập</h2>
            <% if (request.getAttribute("error") != null) { %>
                <p class="error-message"><%= request.getAttribute("error") %></p>
            <% } %>
            <form action="login" method="post">
                <label>Email:</label>
                <input type="email" name="email" required>
                <label>Mật khẩu:</label>
                <input type="password" name="password" required>
                <input type="submit" value="Đăng nhập">
                <a href="register.jsp">Chưa có tài khoản? Đăng ký</a>
            </form>
        </div>
    </body>
</html>