<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title>Trang chủ</title>
        <link rel="stylesheet" href="css/home.css">
    </head>
    <body>
        <div class="container">
            <% 
                model.User user = (model.User) session.getAttribute("user");
                if (user == null) {
                    response.sendRedirect("login.jsp");
                    return;
                }
            %>
            <h1 class="welcome">Chào mừng, <%= user.getTenNguoiDung() != null ? user.getTenNguoiDung() : user.getEmail() %>!</h1>
            <p>Đây là trang chủ của ứng dụng To-do-list.</p>
            <a href="logout" class="logout">Đăng xuất</a>
        </div>
    </body>
</html