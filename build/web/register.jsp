<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Đăng ký</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="css/register.css">
    </head>
    <body>
        <div class="background">
            <div class="logo">
                <span class="logo-text">ToPlan</span>
            </div>
            <div class="icon-decorations">
                <i class="fas fa-star icon-1"></i>
                <i class="fas fa-circle icon-2"></i>
                <i class="fas fa-heart icon-3"></i>
                <i class="fas fa-star icon-4"></i>
            </div>
            <div class="cube"></div>
            <div class="cube cube-2"></div>
        </div>
        <div class="container">
            <h2>Đăng ký người dùng</h2>
            <% if (request.getAttribute("error") != null) { %>
                <p class="error-message"><%= request.getAttribute("error") %></p>
            <% } %>
            <form action="register" method="post">
                <div class="input-group">
                    <i class="fas fa-envelope"></i>
                    <input type="email" name="email" placeholder="Email" required>
                </div>
                <div class="input-group">
                    <i class="fas fa-lock"></i>
                    <input type="password" name="password" placeholder="Mật khẩu" required>
                </div>
                <div class="input-group">
                    <i class="fas fa-user"></i>
                    <input type="text" name="username" placeholder="Tên người dùng">
                </div>
                <button type="submit" class="submit-btn">Đăng ký</button>
                <a href="login.jsp" class="link">Đã có tài khoản? Đăng nhập</a>
            </form>
            <div class="decorations">
                <div class="circle"></div>
                <div class="curve"></div>
            </div>
        </div>
    </body>
</html>