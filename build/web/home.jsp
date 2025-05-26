<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false" %>
<%@ page import="java.util.List" %>
<%@ page import="model.Category" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <title>Trang chủ - ToPlan</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/home.css">
    <script>
        window.contextPath = '${pageContext.request.contextPath}';
    </script>
</head>
<body>
    <%
        model.User user = (model.User) session.getAttribute("user");
        if (user == null) {
            response.sendRedirect("login.jsp");
            return;
        }
    %>
    <jsp:include page="/WEB-INF/views/segments/navbar.jspf" />
    <jsp:include page="/WEB-INF/views/segments/sidebar.jspf" />

    <div class="main-content" id="mainContent">
        <h3 class="text-center">Chào mừng, ${sessionScope.user.tenNguoiDung}!</h3>
        <p class="text-center text-muted">Chọn danh mục để xem công việc</p>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/utils.js"></script>
    <script src="${pageContext.request.contextPath}/js/user.js"></script>
    <script src="${pageContext.request.contextPath}/js/category.js"></script>
    <script src="${pageContext.request.contextPath}/js/sidebar.js"></script>
    <script src="${pageContext.request.contextPath}/js/notification.js"></script>
    <script src="${pageContext.request.contextPath}/js/alert.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            updateNavbar();
            loadCategories();
            loadUserProfile();
            setupSidebar();
            setupViewTasksButton();
            setupViewHomeButton();
            fetchNotifications();
        });
    </script>
</body>
</html>