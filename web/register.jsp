<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Đăng ký</title>
        <link rel="stylesheet" href="css/register.css">
    </head>
    <body>
        <div class="container">
            <h2>Đăng ký người dùng</h2>
            <% if (request.getAttribute("error") != null) { %>
                <p class="error-message"><%= request.getAttribute("error") %></p>
            <% } %>
            <form action="register" method="post">
                <label>Email:</label>
                <input type="email" name="email" required>
                <label>Mật khẩu:</label>
                <input type="password" name="password" required>
                <label>Tên người dùng:</label>
                <input type="text" name="username">
                <input type="submit" value="Đăng ký">
                <a href="login.jsp">Đã có tài khoản? Đăng nhập</a>
            </form>
        </div>
    </body>
</html>