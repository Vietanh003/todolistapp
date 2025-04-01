<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <title>Danh Sách Công Việc - ToPlan</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/home.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/tasks.css">
    <style>
        .task-details .detail-item {
            margin-bottom: 15px;
        }
        .task-details .detail-item label {
            font-weight: bold;
            color: #495057;
        }
        .task-details .attachments, .task-details .activity-logs {
            margin-top: 20px;
        }
        .task-details .attachments ul, .task-details .activity-logs ul {
            list-style: none;
            padding: 0;
        }
        .task-details .attachments li, .task-details .activity-logs li {
            padding: 10px;
            background-color: #fff;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        /* Tùy chỉnh nút trong modal-header */
        .modal-header .btn-action {
            margin-left: 10px;
            transition: all 0.3s ease;
        }
        .modal-header .btn-action:hover {
            transform: scale(1.1);
        }
        .modal-header .btn-edit {
            background-color: #ffc107;
            border-color: #ffc107;
            color: #fff;
        }
        .modal-header .btn-delete {
            background-color: #dc3545;
            border-color: #dc3545;
            color: #fff;
        }
    </style>
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
        <h2 class="mb-4">Danh Sách Công Việc</h2>
        <div class="task-grid" id="taskGrid">
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal hiển thị chi tiết công việc -->
    <div class="modal fade" id="taskDetailsModal" tabindex="-1" aria-labelledby="taskDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="taskDetailsModalLabel">Chi Tiết Công Việc</h5>
                    <div class="d-flex align-items-center">
                        <!-- Nút Sửa -->
                        <button type="button" class="btn btn-action btn-edit" onclick="editTask()">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <!-- Nút Xóa -->
                        <button type="button" class="btn btn-action btn-delete" onclick="deleteTask()">
                            <i class="fas fa-trash-alt"></i> Xóa
                        </button>
                        <!-- Nút Đóng -->
                        <button type="button" class="btn-close ms-2" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-body task-details">
                    <div id="taskInfo">
                        <div class="text-center">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Đang tải...</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/layout.js"></script>
    <script>
        // Placeholder cho hàm editTask
        function editTask() {
            alert('Chức năng sửa công việc đang được phát triển!');
            // TODO: Triển khai logic sửa công việc (mở modal chỉnh sửa hoặc chuyển hướng)
        }

        // Placeholder cho hàm deleteTask
        function deleteTask() {
            if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
                alert('Chức năng xóa công việc đang được phát triển!');
                // TODO: Triển khai logic xóa công việc (gửi yêu cầu đến server và làm mới danh sách)
            }
        }
    </script>
</body>
</html>