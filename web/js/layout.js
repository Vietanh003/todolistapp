/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


document.addEventListener("DOMContentLoaded", function () {
    loadCategories();
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
        .then(response => response.json())
        .then(data => {
            let categoryList = document.getElementById("category-list");
            categoryList.innerHTML = "";
            if (data.length === 0) {
                categoryList.innerHTML = "<li class='dropdown-item text-muted'>Không có danh mục nào</li>";
            } else {
                data.forEach(category => {
                    let li = document.createElement("li");
                    li.className = "dropdown-item d-flex align-items-center justify-content-between";
                    let colorDot = document.createElement("span");
                    colorDot.className = "category-color me-2";
                    colorDot.style.backgroundColor = category.mausac;
                    colorDot.style.width = "12px";
                    colorDot.style.height = "12px";
                    colorDot.style.borderRadius = "50%";
                    colorDot.style.display = "inline-block";
                    let categoryName = document.createElement("span");
                    categoryName.textContent = category.ten;
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
                    li.appendChild(colorDot);
                    li.appendChild(categoryName);
                    li.appendChild(buttonsDiv);
                    categoryList.appendChild(li);
                });
            }
        })
        .catch(error => console.error("Lỗi khi tải danh mục:", error));
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
function loadTasks() {
    fetch('tasks?action=getTasks')
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách công việc');
            }
            return response.json();
        })
        .then(tasks => {
            const taskGrid = document.getElementById('taskGrid');
            taskGrid.innerHTML = ''; // Xóa nội dung cũ

            if (tasks.length === 0) {
                taskGrid.innerHTML = '<p class="text-muted text-center">Bạn chưa có công việc nào. Nhấn "Thêm Công Việc" để bắt đầu!</p>';
                return;
            }

            tasks.forEach(task => {
                const taskCard = document.createElement('div');
                const priorityClass = getPriorityClass(task.mucdouutien);

                taskCard.className = `task-card ${priorityClass} ${task.dahoanthanh ? 'completed' : ''}`;
                // Sửa sự kiện onclick để mở modal và gọi loadTaskDetails
                taskCard.onclick = () => {
                    // Mở modal
                    const modal = new bootstrap.Modal(document.getElementById('taskDetailsModal'));
                    modal.show();
                    // Gọi loadTaskDetails với macongviec
                    loadTaskDetails(task.macongviec);
                };

                taskCard.innerHTML = `
                    <div class="priority ${priorityClass}">${task.mucdouutien}</div>
                    <div class="title">${task.tieude}</div>
                    <div class="due-date"><i class="fas fa-calendar-alt"></i> Hạn: ${formatDate(task.ngayhethan)}</div>
                    <div class="status"><i class="fas ${task.dahoanthanh ? 'fa-check-circle text-success' : 'fa-hourglass-half text-warning'}"></i> ${task.dahoanthanh ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</div>
                `;

                taskGrid.appendChild(taskCard);
            });
        })
        .catch(error => {
            console.error('Lỗi:', error);
            document.getElementById('taskGrid').innerHTML = '<p class="text-danger text-center">Lỗi khi tải danh sách công việc.</p>';
        });
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

// Hàm lấy chi tiết nhiệm vụ
function loadTaskDetails(macongviec) {
    // Kiểm tra macongviec
    if (!macongviec) {
        document.getElementById('taskInfo').innerHTML = '<p class="text-danger">Mã công việc không hợp lệ.</p>';
        return;
    }

    fetch(`tasks?action=getTaskDetails&macongviec=${macongviec}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi lấy chi tiết công việc');
            }
            return response.json();
        })
        .then(task => {
            const taskInfo = document.getElementById('taskInfo');
            taskInfo.innerHTML = ''; // Xóa spinner

            if (!task) {
                taskInfo.innerHTML = '<p class="text-danger">Không tìm thấy công việc.</p>';
                return;
            }

            // Hiển thị thông tin chi tiết
            taskInfo.innerHTML = `
                <div class="detail-item">
                    <label>Tiêu đề:</label>
                    <p>${task.tieude || 'Không có tiêu đề'}</p>
                </div>
                <div class="detail-item">
                    <label>Mô tả:</label>
                    <p>${task.mota || 'Không có mô tả'}</p>
                </div>
                <div class="detail-item">
                    <label>Danh mục:</label>
                    <p>${task.category && task.category.ten ? task.category.ten : 'Không có danh mục'}</p>
                </div>
                <div class="detail-item">
                    <label>Mức độ ưu tiên:</label>
                    <p>${task.mucdouutien || 'Không xác định'}</p>
                </div>
                <div class="detail-item">
                    <label>Ngày hết hạn:</label>
                    <p>${formatDate(task.ngayhethan)}</p>
                </div>
                <div class="detail-item">
                    <label>Thời gian nhắc nhở:</label>
                    <ul>
                        ${task.nhacNho && task.nhacNho.length > 0 
                            ? task.nhacNho.map(time => `<li>${formatDate(time)}</li>`).join('')
                            : '<li>Không có nhắc nhở</li>'}
                    </ul>
                </div>
                <div class="detail-item attachments">
                    <label>Tệp đính kèm:</label>
                    <ul>
                        ${task.attachments && task.attachments.length > 0 
                            ? task.attachments.map(attachment => `
                                <li>
                                    <a href="${attachment.duongdantep}" target="_blank">${attachment.tentep}</a>
                                    (${attachment.loaitep})
                                </li>`).join('')
                            : '<li>Không có tệp đính kèm</li>'}
                    </ul>
                </div>
                <div class="detail-item activity-logs">
                    <label>Nhật ký hoạt động:</label>
                    <ul>
                        ${task.activityLogs && task.activityLogs.length > 0 
                            ? task.activityLogs.map(log => `
                                <li>
                                    ${log.hanhdong} - ${formatDate(log.thoigian)}
                                </li>`).join('')
                            : '<li>Không có nhật ký hoạt động</li>'}
                    </ul>
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
    switch (priority.toLowerCase()) {
        case 'thấp': return 'priority-thap';
        case 'trung bình': return 'priority-trung-binh';
        case 'cao': return 'priority-cao';
        default: return '';
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
