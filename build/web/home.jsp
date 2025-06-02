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
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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

<div class="main-content container-fluid">
    <h3 class="text-center mb-2">Chào mừng, ${sessionScope.user.tenNguoiDung}!</h3>
    <p class="text-center text-muted">Hãy theo dõi tiến trình công việc của bạn</p>

    <!-- Thống kê -->
    <div class="row mb-4">
        <div class="col-md-4">
            <canvas id="taskStatsChart" width="100" height="100"></canvas>
        </div>
        <div class="col-md-9">
            <div class="table-container">
                <h5 class="text-center mb-3">Số lượng công việc theo mức độ ưu tiên</h5>
                <table id="taskPriorityTable" class="table table-bordered table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Mức độ ưu tiên</th>
                            <th>Hoàn thành</th>
                            <th>Chưa hoàn thành</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Dữ liệu sẽ được thêm bởi JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Câu nói hay -->
    <div class="quote-container text-center bg-light p-3 rounded shadow-sm">
        <blockquote id="lifeQuote" class="mb-0 text-dark fw-semibold"></blockquote>
    </div>
</div>

<!-- Scripts -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${pageContext.request.contextPath}/js/utils.js"></script>
<script src="${pageContext.request.contextPath}/js/task.js"></script>
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
        loadMonthlyStats();
        loadStatsByPriority(); // Gọi hàm để hiển thị bảng
        showRandomQuote();
    });

    function showRandomQuote() {
        const quotes = [
            "Hãy sống như thể bạn sẽ chết vào ngày mai. Học như thể bạn sẽ sống mãi mãi. – Mahatma Gandhi",
            "Thành công không đến từ những gì bạn làm thỉnh thoảng, mà đến từ những gì bạn làm nhất quán.",
            "Cuộc sống không phải là chờ đợi cơn bão qua đi, mà là học cách nhảy múa trong mưa.",
            "Người duy nhất bạn nên cố gắng vượt qua chính là con người của ngày hôm qua.",
            "Đừng đếm những gì bạn đã mất. Hãy trân trọng những gì bạn còn và cố gắng cho những gì sắp tới."
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById('lifeQuote').textContent = quote;
    }

</script>
</body>
</html>