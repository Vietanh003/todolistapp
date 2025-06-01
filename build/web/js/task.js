/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


// task.js
function loadTasks(madanhmuc = null) {
    const taskGrid = document.getElementById('taskGrid');
    if (!taskGrid) {
        console.log('Phần tử taskGrid không tồn tại, bỏ qua loadTasks');
        return;
    }

    taskGrid.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Đang tải...</span></div></div>';

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
            showErrorAlert(error.message, "Lỗi khi tải công việc");
        });
}

function loadTaskDetails(macongviec) {
    const taskInfo = document.getElementById('taskInfo');
    if (!taskInfo) {
        console.log('Phần tử taskInfo không tồn tại, bỏ qua loadTaskDetails');
        return;
    }

    if (!macongviec) {
        taskInfo.innerHTML = '<p class="text-danger">Mã công việc không hợp lệ.</p>';
        showWarningAlert("Mã công việc không hợp lệ!");
        return;
    }

    const taskDetailsModal = document.getElementById('taskDetailsModal');
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    const editBtn = taskDetailsModal.querySelector('.btn-edit'); // Lấy nút "Sửa"

    taskDetailsModal.dataset.macongviec = macongviec;

    fetch(`tasks?action=getTaskDetails&macongviec=${macongviec}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi lấy chi tiết công việc');
            }
            return response.json();
        })
        .then(task => {
            taskInfo.innerHTML = '';

            if (!task) {
                taskInfo.innerHTML = '<p class="text-danger">Không tìm thấy công việc.</p>';
                showErrorAlert("Không tìm thấy công việc!");
                return;
            }

            if (task.dahoanthanh) {
                markCompleteBtn.style.display = 'none';
                editBtn.style.display = 'none'; // Ẩn nút "Sửa" khi công việc đã hoàn thành
            } else {
                markCompleteBtn.style.display = 'inline-block';
                editBtn.style.display = 'inline-block'; // Hiển thị nút "Sửa" khi công việc chưa hoàn thành
            }

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
                            <p class="card-text">${task.ngayhethan ? new Date(task.ngayhethan).toLocaleString() : 'Không có ngày hết hạn'}</p>
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
                                <p class="card-text">${new Date(task.ngayhoanthanh).toLocaleString()}</p>
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
                                                ${new Date(time).toLocaleString()}
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
                                                ${log.hanhdong} - <span class="text-muted">${new Date(log.thoigian).toLocaleString()}</span>
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
            taskInfo.innerHTML = '<p class="text-danger">Lỗi khi tải chi tiết công việc.</p>';
            showErrorAlert("Lỗi khi tải chi tiết công việc: " + error.message);
        });
}
function setupTaskForm() {
    const taskReminder = document.getElementById("taskReminder");
    const reminderDateDiv = document.getElementById("reminderDateDiv");

    if (!taskReminder || !reminderDateDiv) {
        console.log('Phần tử taskReminder hoặc reminderDateDiv không tồn tại, bỏ qua setupTaskForm');
        return;
    }

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
    .then(response => response.json()) // Server giờ đây luôn trả về JSON
    .then(data => {
        showSuccessAlert("Thêm công việc thành công!");
        bootstrap.Modal.getInstance(document.getElementById("addTaskModal")).hide();
        // Trì hoãn tải lại trang để người dùng thấy thông báo
        setTimeout(() => {
            window.location.reload();
        }, 1500); // Chờ 1.5 giây trước khi tải lại trang
    })
    .catch(error => {
        console.error("Lỗi:", error);
        showErrorAlert("Lỗi khi thêm công việc: " + error.message);
    });
}
function editTask(macongviec) {
    if (!macongviec || macongviec === "undefined") {
         showWarningAlert("Mã công việc không hợp lệ!");
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
            const editModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
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
           showErrorAlert("Lỗi khi lấy chi tiết công việc: " + error.message);
        });
}
function deleteTask(macongviec) {
    showConfirmAlert('Bạn có chắc chắn muốn xóa công việc này?', () => {
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
                showErrorAlert("Lỗi: " + data.error);
            } else {
                showSuccessAlert(data.message || "Xóa công việc thành công!");
                bootstrap.Modal.getInstance(document.getElementById('taskDetailsModal')).hide();
                loadTasks();
            }
        })
        .catch(error => {
            console.error("Lỗi:", error);
            showErrorAlert("Lỗi khi xóa công việc: " + error.message);
        });
    });
}

function markTaskAsCompleted(macongviec) {
    if (!macongviec) {
        showWarningAlert('Mã công việc không hợp lệ!');
        return;
    }

    showConfirmAlert('Bạn có chắc chắn muốn đánh dấu công việc này là đã hoàn thành?', () => {
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
                showSuccessAlert(data.message || 'Công việc đã được đánh dấu là đã hoàn thành!');
                loadTaskDetails(macongviec);
                 loadTasks();
            } else {
                showErrorAlert(data.error || 'Không thể đánh dấu công việc là đã hoàn thành.');
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            showErrorAlert('Lỗi khi đánh dấu công việc: ' + error.message);
        });
    });
}

document.addEventListener('submit', function(event) {
    if (event.target.id === 'editTaskForm') {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append("action", "updateTask");

        fetch("tasks", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showErrorAlert("Lỗi: " + data.error);
            } else {
                showSuccessAlert(data.message || "Cập nhật công việc thành công!");
                bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
                bootstrap.Modal.getInstance(document.getElementById('taskDetailsModal')).hide();
                loadTasks();
            }
        })
        .catch(error => {
            console.error("Lỗi:", error);
            showErrorAlert("Lỗi khi cập nhật công việc: " + error.message);
        });
    }
});