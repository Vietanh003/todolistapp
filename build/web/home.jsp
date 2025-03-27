<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
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
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/home.css">
</head>
<body>
    <%
        // Kiểm tra đăng nhập
        model.User user = (model.User) session.getAttribute("user");
        if (user == null) {
            response.sendRedirect("login.jsp");
            return;
        }
    %>

<!-- ✅ NAVBAR -->
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
        <!-- Nút mở Sidebar -->
        <button class="btn btn-light me-2" id="toggleSidebar">
            <i class="fas fa-bars"></i>
        </button>

        <a class="navbar-brand fw-bold" href="#">ToPlan</a>

        <!-- Dropdown danh mục -->
        <div class="dropdown mx-3">
            <button class="btn btn-light dropdown-toggle" type="button" id="categoryDropdown" data-bs-toggle="dropdown">
                Danh mục công việc
            </button>
            <ul class="dropdown-menu" id="category-list">
                <li><a class="dropdown-item text-muted">Đang tải...</a></li>
            </ul>
        </div>

        <!-- Avatar và User Menu -->
        <div class="dropdown ms-auto">
            <button class="btn btn-light dropdown-toggle d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown">
                <img src="${pageContext.request.contextPath}/img/user-avatar.png" class="rounded-circle me-2" width="40" height="40">
                <span>${sessionScope.user.tenNguoiDung}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#">🔧 Chỉnh sửa thông tin</a></li>
                <li><a class="dropdown-item text-danger" href="logout">🚪 Đăng xuất</a></li>
            </ul>
        </div>
    </div>
</nav>

<!-- ✅ SIDEBAR -->
<div class="sidebar" id="sidebar">
    <button class="btn btn-outline-light w-100 mb-3" id="pinSidebar">
        <i class="fas fa-thumbtack"></i> Ghim Sidebar
    </button>

    <h4>Chào, ${sessionScope.user.tenNguoiDung}!</h4>
    
 <!-- Nút mở Modal trong Sidebar -->
<button class="btn btn-light w-100 mb-3" data-bs-toggle="modal" data-bs-target="#addCategoryModal">
    <i class="fas fa-plus"></i> Thêm danh mục
</button>
<!-- ✅ Modal Thêm Danh Mục -->
<div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true" data-bs-backdrop="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addCategoryModalLabel">Thêm Danh Mục Mới</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="addCategoryForm">
                    <div class="mb-3">
                        <label for="categoryName" class="form-label">Tên danh mục</label>
                        <input type="text" class="form-control" id="categoryName" placeholder="Nhập tên danh mục" required>
                    </div>
                    <div class="mb-3">
                        <label for="categoryColor" class="form-label">Chọn màu sắc</label>
                        <input type="color" class="form-control form-control-color" id="categoryColor" value="#007bff" title="Chọn màu danh mục">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="button" class="btn btn-primary" onclick="addCategory()">Thêm danh mục</button>
            </div>
        </div>
    </div>
</div>
    <a href="logout" class="btn btn-danger w-100 mt-3">
        <i class="fas fa-sign-out-alt"></i> Đăng xuất
    </a>
</div>

<!-- ✅ Nội dung chính -->
<div class="main-content" id="mainContent">
    <h3 class="text-center">Chào mừng, ${sessionScope.user.tenNguoiDung}!</h3>
    <p class="text-center text-muted">Chọn danh mục để xem công việc</p>
</div>

<!-- ✅ JavaScript -->
<script>
document.addEventListener("DOMContentLoaded", function () {
    loadCategories();
    setupSidebar();
});

function loadCategories() {
    fetch("CategoryServlet")
        .then(response => response.json())
        .then(data => {
            let categoryList = document.getElementById("category-list");
            categoryList.innerHTML = ""; // Xóa danh mục cũ

            if (data.length === 0) {
                categoryList.innerHTML = "<li class='dropdown-item text-muted'>Không có danh mục nào</li>";
            } else {
                data.forEach(category => {
                    let li = document.createElement("li");
                    li.className = "dropdown-item d-flex align-items-center justify-content-between";

                    // Chấm tròn màu sắc
                    let colorDot = document.createElement("span");
                    colorDot.className = "category-color me-2";
                    colorDot.style.backgroundColor = category.mausac;
                    colorDot.style.width = "12px";
                    colorDot.style.height = "12px";
                    colorDot.style.borderRadius = "50%";
                    colorDot.style.display = "inline-block";

                    // Tên danh mục
                    let categoryName = document.createElement("span");
                    categoryName.textContent = category.ten;

                    // Nút chỉnh sửa & xóa
                    let buttonsDiv = document.createElement("div");
                    buttonsDiv.className = "category-buttons";
                    buttonsDiv.innerHTML = `
                        <button class="edit-btn btn btn-sm text-warning me-1" onclick="editCategory(${category.madanhmuc}, '${category.ten}', '${category.mausac}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn btn btn-sm text-danger" onclick="deleteCategory(${category.madanhmuc})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    `;

                    // Gộp tất cả vào li
                    li.appendChild(colorDot);
                    li.appendChild(categoryName);
                    li.appendChild(buttonsDiv);

                    categoryList.appendChild(li);
                });
            }
        })
        .catch(error => console.error("Lỗi khi tải danh mục:", error));
}


// ✅ Xử lý Sidebar đóng/mở
function setupSidebar() {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
    const toggleSidebar = document.getElementById("toggleSidebar");
    const pinSidebar = document.getElementById("pinSidebar");

    let isPinned = false;

    toggleSidebar.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");
        mainContent.classList.toggle("expanded");
    });

    pinSidebar.addEventListener("click", function () {
        isPinned = !isPinned;
        sidebar.classList.toggle("pinned", isPinned);
        pinSidebar.innerHTML = isPinned ? `<i class="fas fa-lock"></i> Đã ghim` : `<i class="fas fa-thumbtack"></i> Ghim Sidebar`;
    });
}
function showAddCategoryModal() {
    document.getElementById("addCategoryModal").style.display = "block";
}

function closeAddCategoryModal() {
    document.getElementById("addCategoryModal").style.display = "none";
}

function addCategory() {
    let ten = document.getElementById("categoryName").value.trim();
    let mausac = document.getElementById("categoryColor").value;

    if (!ten) {
        alert("Tên danh mục không được để trống!");
        return;
    }

    fetch("CategoryServlet", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
     body: "ten=" + encodeURIComponent(ten) + "&mausac=" + encodeURIComponent(mausac)

    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert("Thêm danh mục thành công!");
            loadCategories(); // Load lại danh sách
            closeAddCategoryModal();
        } else {
            alert("Lỗi khi thêm danh mục!");
        }
    })
    .catch(error => console.error("Lỗi:", error));
}

</script>

<!-- Bootstrap Scripts -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
