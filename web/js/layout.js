/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


/* global bootstrap */

document.addEventListener("DOMContentLoaded", function () {
    loadCategories();
    updateNavbar();
    loadCategoriesForEdit();
    loadTaskDetails();
    setupSidebar();
    loadUserInfo();
    setupTaskForm();
    setupViewTasksButton();
    setupViewHomeButton();
    loadTasks();
   fetchCategories()
        .then(categories => {
            const taskCategorySelect = document.getElementById('taskCategory');
            taskCategorySelect.innerHTML = '<option value="">Không chọn</option>'; // Reset dropdown

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
        })
        .catch(error => {
            console.error('Lỗi khi tải danh mục:', error);
            const taskCategorySelect = document.getElementById('taskCategory');
            taskCategorySelect.innerHTML = '<option value="" disabled>Lỗi khi tải danh mục</option>';
        });
});
function fetchCategories() {
    return fetch('tasks?action=getCategoryIdsAndNames')
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách danh mục');
            }
            return response.json();
        });
}
function loadCategories() {
    fetch("CategoryServlet")
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách danh mục');
            }
            return response.json();
        })
        .then(data => {
            let categoryList = document.getElementById("category-list");
            categoryList.innerHTML = "";

            // Thêm mục "Tất cả danh mục" để hiển thị tất cả công việc
            let allCategoriesItem = document.createElement("li");
            allCategoriesItem.className = "dropdown-item d-flex align-items-center";
            allCategoriesItem.style.cursor = "pointer";
            allCategoriesItem.innerHTML = `
                <span class="category-color me-2" style="background-color: #000; width: 12px; height: 12px; border-radius: 50%; display: inline-block;"></span>
                <span>Tất cả danh mục</span>
            `;
            allCategoriesItem.onclick = () => loadTasks(); // Gọi loadTasks() để lấy tất cả công việc
            categoryList.appendChild(allCategoriesItem);

            // Nếu không có danh mục, hiển thị thông báo
            if (data.length === 0) {
                let noCategoryItem = document.createElement("li");
                noCategoryItem.className = "dropdown-item text-muted";
                noCategoryItem.textContent = "Không có danh mục nào";
                categoryList.appendChild(noCategoryItem);
                return;
            }

            // Hiển thị danh sách danh mục
            data.forEach(category => {
                let li = document.createElement("li");
                li.className = "dropdown-item d-flex align-items-center justify-content-between";
                li.style.cursor = "pointer"; // Thêm con trỏ để biểu thị có thể click

                // Tạo phần hiển thị màu và tên danh mục
                let categoryInfo = document.createElement("div");
                categoryInfo.className = "d-flex align-items-center flex-grow-1";
                let colorDot = document.createElement("span");
                colorDot.className = "category-color me-2";
                colorDot.style.backgroundColor = category.mausac || '#000'; // Mặc định màu đen nếu không có mausac
                colorDot.style.width = "12px";
                colorDot.style.height = "12px";
                colorDot.style.borderRadius = "50%";
                colorDot.style.display = "inline-block";
                let categoryName = document.createElement("span");
                categoryName.textContent = category.ten;

                // Gắn sự kiện click vào phần màu và tên để lấy công việc
                categoryInfo.onclick = (e) => {
                    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                    loadTasks(category.madanhmuc); // Gọi loadTasks với madanhmuc
                };

                categoryInfo.appendChild(colorDot);
                categoryInfo.appendChild(categoryName);

                // Tạo phần nút chỉnh sửa và xóa
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

                // Ngăn sự kiện click trên nút lan ra phần categoryInfo
                buttonsDiv.onclick = (e) => e.stopPropagation();

                li.appendChild(categoryInfo);
                li.appendChild(buttonsDiv);
                categoryList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải danh mục:", error);
            let categoryList = document.getElementById("category-list");
            categoryList.innerHTML = `<li class="dropdown-item text-danger">Lỗi khi tải danh mục: ${error.message}</li>`;
        });
}
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
        pinSidebar.innerHTML = isPinned ? `<i class="fas fa-lock"></i> Đã ghim` : `<i class="fas fa-thumbtack"></i> Ghim`;
    });
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
            loadCategories();
            bootstrap.Modal.getInstance(document.getElementById("addCategoryModal")).hide();
        } else {
            alert("Lỗi khi thêm danh mục!");
        }
    })
    .catch(error => console.error("Lỗi:", error));
}
// Hàm lấy thông tin người dùng từ UserInfoServlet
function loadUserInfo() {
    fetch(`${window.location.pathname.replace(/\/[^/]*$/, '')}/userInfo`)
        .then(response => response.json())
        .then(data => {
            const userDropdown = document.getElementById("userDropdown");
            if (data.username && userDropdown) {
                const usernameSpan = userDropdown.querySelector("span");
                if (usernameSpan) {
                    usernameSpan.textContent = data.username;
                }
            } else {
                // Nếu không có username, hiển thị nút đăng nhập
                const dropdown = userDropdown.parentElement;
                dropdown.innerHTML = '<a href="login.jsp" class="btn btn-light">Đăng nhập</a>';
            }
        })
        .catch(error => console.error("Lỗi khi lấy thông tin người dùng:", error));
}
function setupTaskForm() {
    const taskReminder = document.getElementById("taskReminder");
    const reminderDateDiv = document.getElementById("reminderDateDiv");

    taskReminder.addEventListener("change", function () {
        reminderDateDiv.style.display = this.checked ? "block" : "none";
    });
}

function addTask() {
    const form = document.getElementById("addTaskForm");
    const formData = new FormData(form);

    fetch("tasks", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert("Thêm công việc thành công!");
            bootstrap.Modal.getInstance(document.getElementById("addTaskModal")).hide();
            window.location.reload();
        } else {
            alert("Lỗi khi thêm công việc!");
        }
    })
    .catch(error => console.error("Lỗi:", error));
}
function setupViewTasksButton() {
    const viewTasksBtn = document.getElementById("viewTasksBtn");
    if (viewTasksBtn) {
        viewTasksBtn.addEventListener("click", function () {
            window.location.href = "tasks.jsp"; // Chuyển hướng đến /tasks
        });
    }
}
function setupViewHomeButton() {
    const viewTasksBtn = document.getElementById("viewHomeBtn");
    if (viewTasksBtn) {
        viewTasksBtn.addEventListener("click", function () {
            window.location.href = "home.jsp"; // Chuyển hướng đến /tasks
        });
    }
}
// Hàm tải danh sách công việc
function loadTasks(madanhmuc = null) {
    const taskGrid = document.getElementById('taskGrid');
    // Hiển thị spinner loading
    taskGrid.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Đang tải...</span></div></div>';

    // Tạo URL với tham số madanhmuc nếu có
    const url = madanhmuc ? `tasks?action=getTasks&madanhmuc=${madanhmuc}` : 'tasks?action=getTasks';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.error || 'Lỗi khi lấy danh sách công việc');
                });
            }
            return response.json();
        })
        .then(tasks => {
            taskGrid.innerHTML = '';

            if (tasks.length === 0) {
                taskGrid.innerHTML = '<p class="text-muted text-center">Bạn chưa có công việc nào. Nhấn "Thêm Công Việc" để bắt đầu!</p>';
                return;
            }

            tasks.forEach(task => {
                const taskCard = document.createElement('div');
                const priorityClass = getPriorityClass(task.mucdouutien);

                taskCard.className = `task-card ${priorityClass} ${task.dahoanthanh ? 'completed' : ''}`;
                taskCard.onclick = () => {
                    const modal = new bootstrap.Modal(document.getElementById('taskDetailsModal'));
                    // Lưu macongviec vào modal
                    document.getElementById('taskDetailsModal').dataset.macongviec = task.macongviec;
                    modal.show();
                    loadTaskDetails(task.macongviec);
                };

                taskCard.innerHTML = `
                    <div class="priority ${priorityClass}">${task.mucdouutien || 'Không xác định'}</div>
                    <div class="title">${task.tieude || 'Không có tiêu đề'}</div>
                    <div class="due-date"><i class="fas fa-calendar-alt"></i> Hạn: ${task.ngayhethan ? formatDate(task.ngayhethan) : 'Không có'}</div>
                    <div class="status"><i class="fas ${task.dahoanthanh ? 'fa-check-circle text-success' : 'fa-hourglass-half text-warning'}"></i> ${task.dahoanthanh ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</div>
                `;

                taskGrid.appendChild(taskCard);
            });
        })
        .catch(error => {
            console.error('Lỗi:', error);
            taskGrid.innerHTML = `<p class="text-danger text-center">Lỗi khi tải danh sách công việc: ${error.message}</p>`;
        });
}

// Hàm lấy lớp CSS cho mức độ ưu tiên
function getPriorityClass(priority) {
    if (!priority || typeof priority !== 'string') {
        return 'priority-thap';
    }

    switch (priority.toLowerCase()) {
        case 'thấp':
            return 'priority-thap';
        case 'trung bình':
            return 'priority-trung-binh';
        case 'cao':
            return 'priority-cao';
        default:
            return 'priority-thap';
    }
}

// Hàm định dạng ngày tháng
function formatDate(dateString) {
    if (!dateString) return "Không có ngày";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function loadTaskDetails(macongviec) {
    // Kiểm tra macongviec
    if (!macongviec) {
        document.getElementById('taskInfo').innerHTML = '<p class="text-danger">Mã công việc không hợp lệ.</p>';
        return;
    }

    const taskDetailsModal = document.getElementById('taskDetailsModal');
    const taskInfo = document.getElementById('taskInfo');
    const markCompleteBtn = document.getElementById('markCompleteBtn');

    // Lưu macongviec vào dataset của modal
    taskDetailsModal.dataset.macongviec = macongviec;

    fetch(`tasks?action=getTaskDetails&macongviec=${macongviec}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi lấy chi tiết công việc');
            }
            return response.json();
        })
        .then(task => {
            taskInfo.innerHTML = ''; // Xóa spinner

            if (!task) {
                taskInfo.innerHTML = '<p class="text-danger">Không tìm thấy công việc.</p>';
                return;
            }

            // Hiển thị/ẩn nút "Đã hoàn thành" dựa trên trạng thái DAHOANTHANH
            if (task.dahoanthanh) {
                markCompleteBtn.style.display = 'none';
            } else {
                markCompleteBtn.style.display = 'inline-block';
            }

            // Hiển thị thông tin chi tiết với giao diện Bootstrap
            taskInfo.innerHTML = `
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">
                            <i class="fas fa-tasks me-2"></i>${task.tieude || 'Không có tiêu đề'}
                        </h5>
                        <span class="badge ${
                            task.mucdouutien === 'Cao' ? 'bg-danger' :
                            task.mucdouutien === 'Trung Bình' ? 'bg-warning' :
                            'bg-success'
                        }">
                            ${task.mucdouutien || 'Không xác định'}
                        </span>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <h6 class="text-muted">
                                <i class="fas fa-align-left me-2"></i>Mô tả
                            </h6>
                            <p class="card-text">${task.mota || 'Không có mô tả'}</p>
                        </div>
                        <div class="mb-3">
                            <h6 class="text-muted">
                                <i class="fas fa-folder me-2"></i>Danh mục
                            </h6>
                            <p class="card-text">${task.category && task.category.ten ? task.category.ten : 'Không có danh mục'}</p>
                        </div>
                        <div class="mb-3">
                            <h6 class="text-muted">
                                <i class="fas fa-calendar-alt me-2"></i>Ngày hết hạn
                            </h6>
                            <p class="card-text">${task.ngayhethan ? formatDate(task.ngayhethan) : 'Không có ngày hết hạn'}</p>
                        </div>
                        <div class="mb-3">
                            <h6 class="text-muted">
                                <i class="fas fa-check-circle me-2"></i>Trạng thái
                            </h6>
                            <p class="card-text">${task.dahoanthanh ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</p>
                        </div>
                        ${
                            task.dahoanthanh && task.ngayhoanthanh ? `
                            <div class="mb-3">
                                <h6 class="text-muted">
                                    <i class="fas fa-calendar-check me-2"></i>Ngày hoàn thành
                                </h6>
                                <p class="card-text">${formatDate(task.ngayhoanthanh)}</p>
                            </div>` : ''
                        }
                        <div class="mb-3">
                            <h6 class="text-muted">
                                <i class="fas fa-bell me-2"></i>Thời gian nhắc nhở
                            </h6>
                            <ul class="list-group">
                                ${
                                    task.nhacNho && task.nhacNho.length > 0
                                        ? task.nhacNho.map(time => `
                                            <li class="list-group-item d-flex align-items-center">
                                                <i class="fas fa-clock me-2 text-primary"></i>
                                                ${formatDate(time)}
                                            </li>`).join('')
                                        : '<li class="list-group-item text-muted">Không có nhắc nhở</li>'
                                }
                            </ul>
                        </div>
                        <div class="mb-3">
                            <h6 class="text-muted">
                                <i class="fas fa-paperclip me-2"></i>Tệp đính kèm
                            </h6>
                            <ul class="list-group">
                                ${
                                    task.attachments && task.attachments.length > 0
                                        ? task.attachments.map(attachment => `
                                            <li class="list-group-item d-flex align-items-center">
                                                <i class="fas fa-file me-2 text-success"></i>
                                                <a href="${attachment.duongdantep}" target="_blank" class="text-decoration-none">${attachment.tentep}</a>
                                                <span class="ms-2 text-muted">(${attachment.loaitep})</span>
                                            </li>`).join('')
                                        : '<li class="list-group-item text-muted">Không có tệp đính kèm</li>'
                                }
                            </ul>
                        </div>
                        <div class="mb-3">
                            <h6 class="text-muted">
                                <i class="fas fa-history me-2"></i>Nhật ký hoạt động
                            </h6>
                            <ul class="list-group">
                                ${
                                    task.activityLogs && task.activityLogs.length > 0
                                        ? task.activityLogs.map(log => `
                                            <li class="list-group-item d-flex align-items-center">
                                                <i class="fas fa-check-circle me-2 text-info"></i>
                                                ${log.hanhdong} - <span class="text-muted">${formatDate(log.thoigian)}</span>
                                            </li>`).join('')
                                        : '<li class="list-group-item text-muted">Không có nhật ký hoạt động</li>'
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Lỗi:', error);
            document.getElementById('taskInfo').innerHTML = '<p class="text-danger">Lỗi khi tải chi tiết công việc.</p>';
        });
}
// Hàm lấy class theo mức độ ưu tiên
function getPriorityClass(priority) {
    // Kiểm tra giá trị đầu vào
    if (!priority || typeof priority !== 'string') {
        return 'priority-thap'; // Trả về lớp mặc định nếu priority không hợp lệ
    }

    switch (priority.toLowerCase()) {
        case 'thấp':
            return 'priority-thap';
        case 'trung bình':
            return 'priority-trung-binh';
        case 'cao':
            return 'priority-cao';
        default:
            return 'priority-thap'; // Trả về lớp mặc định thay vì chuỗi rỗng
    }
}
// Hàm định dạng ngày tháng
function formatDate(dateString) {
    if (!dateString) return "Không có ngày";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function editTask(macongviec) {
    if (!macongviec || macongviec === "undefined") {
        alert("Mã công việc không hợp lệ.");
        return;
    }

    fetch(`tasks?action=getTaskDetails&macongviec=${macongviec}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Lỗi khi lấy chi tiết công việc");
            }
            return response.json();
        })
        .then(task => {
            // Hiển thị modal chỉnh sửa
            const editModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
            // Điền dữ liệu vào form
            document.getElementById('editTaskId').value = macongviec;
            document.getElementById('editTieude').value = task.tieude;
            document.getElementById('editMota').value = task.mota;
            document.getElementById('editMadanhmuc').value = task.category ? task.category.madanhmuc : "";
            document.getElementById('editMucdouutien').value = task.mucdouutien;
            document.getElementById('editNgayhethan').value = task.ngayhethan ? new Date(task.ngayhethan).toISOString().slice(0, 16) : "";
            document.getElementById('editHasReminder').checked = task.nhacNho && task.nhacNho.length > 0;
            document.getElementById('editThoigiannhacnho').value = task.nhacNho && task.nhacNho.length > 0 ? new Date(task.nhacNho[0]).toISOString().slice(0, 16) : "";
            editModal.show();
        })
        .catch(error => {
            console.error("Lỗi:", error);
            alert("Lỗi khi lấy chi tiết công việc.");
        });
}

// Hàm xử lý khi người dùng gửi form chỉnh sửa
document.getElementById('editTaskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    formData.append("action", "updateTask");

    fetch("tasks", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Lỗi: " + data.error);
        } else {
            alert(data.message);
            bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
            bootstrap.Modal.getInstance(document.getElementById('taskDetailsModal')).hide();
            loadTasks();
        }
    })
    .catch(error => {
        console.error("Lỗi:", error);
        alert("Lỗi khi cập nhật công việc.");
    });
});
function loadCategoriesForEdit() {
    fetch('tasks?action=getCategoryIdsAndNames')
        .then(response => response.json())
        .then(categories => {
            const select = document.getElementById('editMadanhmuc');
            select.innerHTML = '<option value="">Không có danh mục</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.madanhmuc;
                option.textContent = category.ten;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải danh mục:", error);
        });
}
  function deleteTask(macongviec) {
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
        const formData = new FormData();
        formData.append("action", "deleteTask");
        formData.append("macongviec", macongviec);

        fetch("tasks", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Lỗi: " + data.error);
            } else {
                alert(data.message);
                bootstrap.Modal.getInstance(document.getElementById('taskDetailsModal')).hide();
                loadTasks();
            }
        })
        .catch(error => {
            console.error("Lỗi:", error);
            alert("Lỗi khi xóa công việc.");
        });
    }
}
function markTaskAsCompleted(macongviec) {
    if (!macongviec) {
        alert('Mã công việc không hợp lệ.');
        return;
    }

    if (!confirm('Bạn có chắc chắn muốn đánh dấu công việc này là đã hoàn thành?')) {
        return;
    }

    fetch(`tasks?action=markAsCompleted&macongviec=${macongviec}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi khi đánh dấu công việc là đã hoàn thành');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(data.message || 'Công việc đã được đánh dấu là đã hoàn thành!');
            loadTaskDetails(macongviec);
        } else {
            alert('Lỗi: ' + (data.error || 'Không thể đánh dấu công việc là đã hoàn thành.'));
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Lỗi khi đánh dấu công việc: ' + error.message);
    });
}
// Hàm cập nhật navbar với thông tin người dùng
function updateNavbar() {
    fetch('userInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 401) {
            // Người dùng chưa đăng nhập
            throw new Error('Người dùng chưa đăng nhập');
        }
        if (!response.ok) {
            throw new Error('Lỗi khi lấy thông tin người dùng');
        }
        return response.json();
    })
    .then(data => {
        // Hiển thị dropdown người dùng
        document.getElementById('userDropdownContainer').style.display = 'block';
        document.getElementById('loginButton').style.display = 'none';

        // Cập nhật avatar và tên tài khoản
        document.getElementById('navbarAvatar').src = data.duongDanAnhDaiDien || (window.contextPath + '/img/user-avatar.png');
        document.getElementById('navbarUsername').textContent = data.tenNguoiDung || 'Người dùng';
    })
    .catch(error => {
        console.error('Lỗi khi cập nhật navbar:', error);
        // Hiển thị nút Đăng nhập
        document.getElementById('userDropdownContainer').style.display = 'none';
        document.getElementById('loginButton').style.display = 'block';
    });
}

// Hàm hiển thị thông tin người dùng trong modal
function showUserInfo() {
    fetch('userInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi khi lấy thông tin người dùng');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            alert(data.error);
            return;
        }
        document.getElementById('userAvatar').src = data.duongDanAnhDaiDien || (window.contextPath + '/img/user-avatar.png');
        document.getElementById('userName').textContent = data.tenNguoiDung || 'Người dùng';
        document.getElementById('userEmail').textContent = data.email || 'Không có email';
        document.getElementById('userCreatedAt').textContent = 'Ngày tạo: ' + (data.ngayTao ? new Date(data.ngayTao).toLocaleString() : 'Không có thông tin');
        const modal = new bootstrap.Modal(document.getElementById('userInfoModal'));
        modal.show();
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Lỗi khi lấy thông tin người dùng: ' + error.message);
    });
}