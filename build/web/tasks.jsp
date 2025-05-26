<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <title>Danh Sách Công Việc - ToPlan</title>
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
     <jsp:include page="/WEB-INF/views/segments/footer.jspf" />

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

    <!-- Modal Thêm Danh Mục -->
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
 <!-- Modal chỉnh sửa danh mục -->
    <div class="modal fade" id="editCategoryModal" tabindex="-1" aria-labelledby="editCategoryModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editCategoryModalLabel">Chỉnh sửa danh mục</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editCategoryForm">
                        <input type="hidden" id="editCategoryId" name="madanhmuc">
                        <div class="mb-3">
                            <label for="editCategoryIdDisplay" class="form-label">Mã danh mục</label>
                            <input type="text" class="form-control" id="editCategoryIdDisplay" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="editCategoryName" class="form-label">Tên danh mục</label>
                            <input type="text" class="form-control" id="editCategoryName" name="ten" required>
                        </div>
                        <div class="mb-3">
                            <label for="editCategoryColor" class="form-label">Màu sắc</label>
                            <input type="color" class="form-control form-control-color" id="editCategoryColor" name="mausac" value="#000000">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="saveCategory()">Lưu thay đổi</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Thêm Công Việc -->
    <div class="modal fade" id="addTaskModal" tabindex="-1" aria-labelledby="addTaskModalLabel" aria-hidden="true" data-bs-backdrop="false">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addTaskModalLabel">Thêm Công Việc</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addTaskForm" enctype="multipart/form-data">
                        <div class="mb-3">
                            <label for="taskTitle" class="form-label">Tiêu đề</label>
                            <input type="text" class="form-control" id="taskTitle" name="tieude" required>
                        </div>
                        <div class="mb-3">
                            <label for="taskDescription" class="form-label">Mô tả</label>
                            <textarea class="form-control" id="taskDescription" name="mota" rows="3"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="taskCategory" class="form-label">Danh mục</label>
                            <select class="form-select" id="taskCategory" name="madanhmuc">
                                <option value="">Không chọn</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="taskPriority" class="form-label">Mức độ ưu tiên</label>
                            <select class="form-select" id="taskPriority" name="mucdouutien">
                                <option value="Thấp">Thấp</option>
                                <option value="Trung Bình" selected>Trung bình</option>
                                <option value="Cao">Cao</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="taskDueDate" class="form-label">Ngày hết hạn</label>
                            <input type="datetime-local" class="form-control" id="taskDueDate" name="ngayhethan">
                        </div>
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="taskReminder" name="hasReminder">
                            <label class="form-check-label" for="taskReminder">Gửi thông báo</label>
                        </div>
                        <div class="mb-3" id="reminderDateDiv" style="display: none;">
                            <label for="reminderDate" class="form-label">Thời gian nhắc nhở</label>
                            <input type="datetime-local" class="form-control" id="reminderDate" name="thoigiannhacnho">
                        </div>
                        <div class="mb-3">
                            <label for="taskAttachment" class="form-label">Tệp đính kèm</label>
                            <input type="file" class="form-control" id="taskAttachment" name="attachment">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" onclick="addTask()">Thêm</button>
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
                        <!-- Nút Đánh dấu là đã hoàn thành -->
                        <button type="button" id="markCompleteBtn" class="btn btn-action btn-success" style="display: none;" onclick="markTaskAsCompleted(document.getElementById('taskDetailsModal').dataset.macongviec)">
                            <i class="fas fa-check me-1"></i> Đã hoàn thành
                        </button>
                        <!-- Nút Sửa -->
                        <button type="button" class="btn btn-action btn-edit" onclick="editTask(document.getElementById('taskDetailsModal').dataset.macongviec)">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <!-- Nút Xóa -->
                        <button type="button" class="btn btn-action btn-delete" onclick="deleteTask(document.getElementById('taskDetailsModal').dataset.macongviec)">
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

    <!-- Modal chỉnh sửa công việc -->
    <div class="modal fade" id="editTaskModal" tabindex="-1" aria-labelledby="editTaskModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editTaskModalLabel">Chỉnh Sửa Công Việc</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editTaskForm" enctype="multipart/form-data">
                        <input type="hidden" id="editTaskId" name="macongviec">
                        <div class="mb-3">
                            <label for="editTieude" class="form-label">Tiêu đề</label>
                            <input type="text" class="form-control" id="editTieude" name="tieude" required>
                        </div>
                        <div class="mb-3">
                            <label for="editMota" class="form-label">Mô tả</label>
                            <textarea class="form-control" id="editMota" name="mota"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="editMadanhmuc" class="form-label">Danh mục</label>
                            <select class="form-control" id="editMadanhmuc" name="madanhmuc">
                                <option value="">Không có danh mục</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editMucdouutien" class="form-label">Mức độ ưu tiên</label>
                            <select class="form-control" id="editMucdouutien" name="mucdouutien" required>
                                <option value="Thấp">Thấp</option>
                                <option value="Trung Bình">Trung Bình</option>
                                <option value="Cao">Cao</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editNgayhethan" class="form-label">Ngày hết hạn</label>
                            <input type="datetime-local" class="form-control" id="editNgayhethan" name="ngayhethan" required>
                        </div>
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="editHasReminder" name="hasReminder">
                            <label class="form-check-label" for="editHasReminder">Có nhắc nhở</label>
                        </div>
                        <div class="mb-3">
                            <label for="editThoigiannhacnho" class="form-label">Thời gian nhắc nhở</label>
                            <input type="datetime-local" class="form-control" id="editThoigiannhacnho" name="thoigiannhacnho">
                        </div>
                        <div class="mb-3">
                            <label for="editAttachment" class="form-label">Tệp đính kèm</label>
                            <input type="file" class="form-control" id="editAttachment" name="attachment">
                        </div>
                        <button type="submit" class="btn btn-primary">Lưu</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/utils.js"></script>
    <script src="${pageContext.request.contextPath}/js/user.js"></script>
    <script src="${pageContext.request.contextPath}/js/category.js"></script>
    <script src="${pageContext.request.contextPath}/js/sidebar.js"></script>
    <script src="${pageContext.request.contextPath}/js/task.js"></script>
    <script src="${pageContext.request.contextPath}/js/notification.js"></script>
    <script src="${pageContext.request.contextPath}/js/alert.js"></script>
    <script src="${pageContext.request.contextPath}/js/quotes.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            updateNavbar();
            loadCategories();
            loadUserProfile();
            loadCategoriesForEdit();
            setupSidebar();
            setupTaskForm();
            setupViewTasksButton();
            setupViewHomeButton();
            loadTasks();
            fetchNotifications();

            const taskCategorySelect = document.getElementById('taskCategory');
            if (taskCategorySelect) {
                fetchCategories().then(categories => {
                    taskCategorySelect.innerHTML = '<option value="">Không chọn</option>';
                    if (!categories || categories.length === 0) {
                        taskCategorySelect.innerHTML += '<option value="" disabled>Không có danh mục nào</option>';
                    } else {
                        categories.forEach(category => {
                            const option = document.createElement('option');
                            option.value = category.madanhmuc;
                            option.textContent = category.ten;
                            taskCategorySelect.appendChild(option);
                        });
                    }
                }).catch(error => {
                    console.error('Lỗi khi tải danh mục:', error);
                    taskCategorySelect.innerHTML = '<option value="" disabled>Lỗi khi tải danh mục</option>';
                });
            }
        });
    </script>
</body>
</html>