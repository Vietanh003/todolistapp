<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false" %>

<!DOCTYPE html>
<html lang="vi">
<head>
    <title>Trang Cá Nhân - ToPlan</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/home.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/tasks.css">
    <script>
        window.contextPath = '${pageContext.request.contextPath}';
    </script>
  <style>
    body {
        background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
        min-height: 100vh;
        display: flex;
    }
    #sidebar {
        width: 250px;
        min-height: 100vh;
        background: linear-gradient(135deg, #1e3c72, #2a5298);
        color: white;
        position: fixed;
        top: 56px;
        transition: transform 0.3s ease-in-out;
    }
    #mainContent {
        margin-left: 250px;
        padding: 2rem;
        width: 100%;
        margin-top: 70px;
    }
    .profile-card {
        max-width: 600px;
        margin: 0 auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        border-radius: 15px;
        background: white;
        overflow: hidden;
    }
    .profile-header {
        background: linear-gradient(135deg, #007bff, #00c4b4);
        color: white;
        padding: 2rem;
        text-align: center;
        position: relative;
        z-index: 1; 
    }
    .profile-body {
        padding: 2rem;
        text-align: center;
        padding-top: 3rem; 
    }
    .profile-avatar {
        width: 150px;
        height: 150px;
        border: 5px solid white;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        display: block; /* Đảm bảo ảnh là block để căn giữa */
        margin: 0 auto 1rem; /* Căn giữa và thêm khoảng cách dưới */
    }
    .profile-body h4 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    .profile-body p {
        font-size: 1rem;
        color: #6c757d;
        margin-bottom: 1rem;
    }
    .profile-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    .btn-action {
        padding: 0.5rem 1.5rem;
        font-size: 1rem;
        border-radius: 25px;
        transition: transform 0.2s;
    }
    .btn-action:hover {
        transform: translateY(-2px);
    }
    .modal-content {
        border-radius: 10px;
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
    <div class="profile-card">
        <div class="profile-header">
            <h2 class="mb-0">Trang Cá Nhân</h2>
        </div>
        <div class="profile-body">
            <img id="profileAvatar" src="${pageContext.request.contextPath}/img/user-avatar.png" class="profile-avatar mb-3" alt="Avatar">
            <h4 id="profileUsername">Người dùng</h4>
            <p id="profileEmail" class="text-muted">Email</p>
            <p id="profileCreatedAt" class="text-muted">Ngày tạo</p>
            <div id="profileError" class="text-danger mb-3"></div>
            <div class="profile-actions">
                <button class="btn btn-primary btn-action" data-bs-toggle="modal" data-bs-target="#editProfileModal">
                    <i class="fas fa-edit me-2"></i>Chỉnh sửa thông tin
                </button>
                <button class="btn btn-warning btn-action" data-bs-toggle="modal" data-bs-target="#changePasswordModal">
                    <i class="fas fa-key me-2"></i>Đổi mật khẩu
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Chỉnh sửa thông tin -->
<div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editProfileModalLabel">Chỉnh sửa thông tin</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editProfileForm">
                    <div class="mb-3 text-center">
                        <label for="editAvatar" class="form-label">Ảnh đại diện</label>
                        <img id="previewAvatar" src="${pageContext.request.contextPath}/img/user-avatar.png" class="profile-avatar mb-3" alt="Avatar Preview" style="width: 100px; height: 100px;">
                        <input type="file" class="form-control" id="editAvatar" name="avatar" accept="image/*">
                    </div>
                    <div class="mb-3">
                        <label for="editUsername" class="form-label">Tên người dùng</label>
                        <input type="text" class="form-control" id="editUsername" name="tenNguoiDung" required>
                    </div>
                    <div class="mb-3">
                        <label for="editEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="editEmail" name="email" required>
                    </div>
                    <div id="editProfileError" class="text-danger mb-3"></div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="updateProfile()">Lưu thay đổi</button>
            </div>
        </div>
    </div>
</div>

    <!-- Modal Đổi mật khẩu -->
    <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="changePasswordModalLabel">Đổi mật khẩu</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="changePasswordForm">
                        <div class="mb-3">
                            <label for="currentPassword" class="form-label">Mật khẩu hiện tại</label>
                            <input type="password" class="form-control" id="currentPassword" name="currentPassword" required>
                        </div>
                        <div class="mb-3">
                            <label for="newPassword" class="form-label">Mật khẩu mới</label>
                            <input type="password" class="form-control" id="newPassword" name="newPassword" required>
                        </div>
                        <div class="mb-3">
                            <label for="confirmNewPassword" class="form-label">Xác nhận mật khẩu mới</label>
                            <input type="password" class="form-control" id="confirmNewPassword" name="confirmNewPassword" required>
                        </div>
                        <div id="changePasswordError" class="text-danger mb-3"></div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="changePassword()">Đổi mật khẩu</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/utils.js"></script>
    <script src="${pageContext.request.contextPath}/js/user.js"></script>
    <script src="${pageContext.request.contextPath}/js/category.js"></script>
    <script src="${pageContext.request.contextPath}/js/sidebar.js"></script>
    <script src="${pageContext.request.contextPath}/js/notification.js"></script>
    <script src="${pageContext.request.contextPath}/js/alert.js"></script>
    <script>
// Điền thông tin người dùng vào modal khi mở
document.addEventListener("DOMContentLoaded", function () {
    updateNavbar();
    loadCategories();
    loadUserProfile();
    setupSidebar();
    setupViewTasksButton();
    setupViewHomeButton();
    fetchNotifications();

    // Xử lý sự kiện khi modal chỉnh sửa thông tin được mở
    const editProfileModal = document.getElementById('editProfileModal');
    editProfileModal.addEventListener('show.bs.modal', function () {
        fetch(window.contextPath + '/userInfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi lấy thông tin người dùng');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('editUsername').value = data.tenNguoiDung || '';
            document.getElementById('editEmail').value = data.email || '';
            document.getElementById('previewAvatar').src = data.duongDanAnhDaiDien || (window.contextPath + '/img/user-avatar.png');
            document.getElementById('editAvatar').value = ''; // Xóa tệp ảnh đã chọn trước đó
        })
        .catch(error => {
            console.error('Lỗi:', error);
            document.getElementById('editProfileError').textContent = 'Lỗi khi lấy thông tin: ' + error.message;
        });
    });

    // Xử lý xem trước ảnh đại diện khi chọn tệp
    document.getElementById('editAvatar').addEventListener('change', previewAvatar);
});
    </script>
</body>
</html>