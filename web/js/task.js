/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


// task.js
let currentFilter = {
    madanhmuc: null,
    mucdouutien: '',
    trangthai: '',
    thoigian: 'week'
};
function filterTasks(timeFilter) {
    currentFilter.thoigian = timeFilter;
    document.querySelectorAll('.btn-time-filter').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    loadTasks();
}

function filterTasksByPriority(priority) {
    currentFilter.mucdouutien = priority;
    document.querySelectorAll('.btn-priority-filter').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    loadTasks();
}

function filterTasksByStatus(status) {
    currentFilter.trangthai = status;
    document.querySelectorAll('.btn-status-filter').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    loadTasks();
}

function loadTasks() {
    const { madanhmuc, mucdouutien, trangthai, thoigian } = currentFilter;

    const taskGrid = document.getElementById('taskGrid');
    if (!taskGrid) {
        console.log('Phần tử taskGrid không tồn tại, bỏ qua loadTasks');
        return;
    }

    taskGrid.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
        </div>
    `;

    let url = `${window.contextPath}/tasks?action=getTasks`;
    if (madanhmuc) url += `&madanhmuc=${encodeURIComponent(madanhmuc)}`;
    if (mucdouutien && mucdouutien !== 'all') url += `&mucdouutien=${encodeURIComponent(mucdouutien)}`;
    if (trangthai && trangthai !== 'all') url += `&trangthai=${encodeURIComponent(trangthai)}`;
    if (thoigian && thoigian !== 'all') url += `&thoigian=${encodeURIComponent(thoigian)}`;

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
                taskGrid.innerHTML = `<p class="text-muted text-center">Bạn chưa có công việc nào. Nhấn "Thêm Công Việc" để bắt đầu!</p>`;
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
                    <div class="due-date">
                        <i class="fas fa-calendar-alt"></i> 
                        Hạn: ${task.ngayhethan ? formatDate(task.ngayhethan) : 'Không có'}
                    </div>
                    <div class="status">
                        <i class="fas ${task.dahoanthanh ? 'fa-check-circle text-success' : 'fa-hourglass-half text-warning'}"></i> 
                        ${task.dahoanthanh ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                    </div>
                `;

                taskGrid.appendChild(taskCard);
            });
        })
        .catch(error => {
            console.error('Lỗi:', error);
            taskGrid.innerHTML = `
                <p class="text-danger text-center">
                    Lỗi khi tải danh sách công việc: ${error.message}
                </p>`;
            showErrorAlert(error.message, "Lỗi khi tải công việc");
        });
}

function loadTaskDetails(macongviec) {
    const taskInfo = document.getElementById('taskInfo');
    if (!taskInfo) {
        console.log('Phần tử taskInfo không tồn tại, bỏ qua loadTaskDetails');
        return;
    }

    // Kiểm tra macongviec hợp lệ
    if (!macongviec || isNaN(macongviec)) {
        taskInfo.innerHTML = '<p class="text-danger">Mã công việc không hợp lệ.</p>';
        showWarningAlert("Mã công việc không hợp lệ!");
        return;
    }

    const taskDetailsModal = document.getElementById('taskDetailsModal');
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    const editBtn = taskDetailsModal.querySelector('.btn-edit');

    taskDetailsModal.dataset.macongviec = macongviec;

    // Hiển thị loading
    taskInfo.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
        </div>
    `;

    fetch(`${window.contextPath}/tasks?action=getTaskDetails&macongviec=${encodeURIComponent(macongviec)}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error || 'Lỗi không xác định khi lấy chi tiết công việc');
                });
            }
            return response.json();
        })
        .then(task => {
            if (!task || Object.keys(task).length === 0) {
                taskInfo.innerHTML = '<p class="text-danger">Không tìm thấy công việc.</p>';
                showErrorAlert("Không tìm thấy công việc!");
                return;
            }

            if (task.dahoanthanh) {
                markCompleteBtn.style.display = 'none';
                editBtn.style.display = 'none';
            } else {
                markCompleteBtn.style.display = 'inline-block';
                editBtn.style.display = 'inline-block';
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
                            <p class="card-text">${task.ngayhethan ? new Date(task.ngayhethan).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : 'Không có ngày hết hạn'}</p>
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
                                <p class="card-text">${new Date(task.ngayhoanthanh).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
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
                                                ${new Date(time).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
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
                                                ${log.hanhdong} - <span class="text-muted">${new Date(log.thoigian).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</span>
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
            taskInfo.innerHTML = `<p class="text-danger">Lỗi khi tải chi tiết công việc: ${error.message}</p>`;
            showErrorAlert(`Lỗi khi tải chi tiết công việc: ${error.message}`);
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

    // Lấy giá trị từ form
    const ngayhethanStr = formData.get("ngayhethan");
    const hasReminder = formData.get("hasReminder") === "on";
    const thoigiannhacnhoStr = formData.get("thoigiannhacnho");

    // Ngày giờ hiện tại
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset() + 7 * 60);

    // Kiểm tra ngày hết hạn
    if (ngayhethanStr) {
        const ngayhethan = new Date(ngayhethanStr);
        if (ngayhethan <= now) {
            showErrorAlert("Ngày hết hạn phải sau ngày giờ hiện tại!");
            return;
        }

        // Kiểm tra thời gian nhắc nhở
        if (hasReminder && thoigiannhacnhoStr) {
            const thoigiannhacnho = new Date(thoigiannhacnhoStr);
            if (thoigiannhacnho <= now) {
                showErrorAlert("Thời gian nhắc nhở phải lớn hơn ngày giờ hiện tại!");
                return;
            }
            if (thoigiannhacnho >= ngayhethan) {
                showErrorAlert("Thời gian nhắc nhở phải trước ngày hết hạn!");
                return;
            }
        } else if (hasReminder && !thoigiannhacnhoStr) {
            showErrorAlert("Vui lòng chọn thời gian nhắc nhở!");
            return;
        }
    }

    fetch("tasks", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || "Lỗi không xác định");
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showSuccessAlert("Thêm công việc thành công!");
            bootstrap.Modal.getInstance(document.getElementById("addTaskModal")).hide();
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            throw new Error(data.error || "Lỗi không xác định");
        }
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

            // Thêm sự kiện submit cho form editTaskForm
            const editForm = document.getElementById('editTaskForm');
            editForm.onsubmit = function(e) {
                e.preventDefault();
                const formData = new FormData(editForm);

                const ngayhethanStr = formData.get("ngayhethan");
                const hasReminder = formData.get("hasReminder") === "on";
                const thoigiannhacnhoStr = formData.get("thoigiannhacnho");

                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset() + 7 * 60); // Chuyển về múi giờ +07:00

                if (ngayhethanStr) {
                    const ngayhethan = new Date(ngayhethanStr);
                    if (ngayhethan <= now) {
                        showErrorAlert("Ngày hết hạn phải sau ngày giờ hiện tại!");
                        return false;
                    }

                    if (hasReminder && thoigiannhacnhoStr) {
                        const thoigiannhacnho = new Date(thoigiannhacnhoStr);
                        if (thoigiannhacnho <= now) {
                            showErrorAlert("Thời gian nhắc nhở phải lớn hơn ngày giờ hiện tại!");
                            return false;
                        }
                        if (thoigiannhacnho >= ngayhethan) {
                            showErrorAlert("Thời gian nhắc nhở phải trước ngày hết hạn!");
                            return false;
                        }
                    } else if (hasReminder && !thoigiannhacnhoStr) {
                        showErrorAlert("Vui lòng chọn thời gian nhắc nhở!");
                        return false;
                    }
                }

                fetch("tasks?action=updateTask", {
                    method: "POST",
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.error || "Lỗi không xác định");
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        showSuccessAlert("Cập nhật công việc thành công!");
                        editModal.hide();
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        throw new Error(data.error || "Lỗi không xác định");
                    }
                })
                .catch(error => {
                    console.error("Lỗi:", error);
                    showErrorAlert("Lỗi khi cập nhật công việc: " + error.message);
                });
            };
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
function loadStatsByPriority() {
    fetch(`${window.contextPath}/tasks?action=getStatsByPriority`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error("Lỗi:", data.error);
                return;
            }

            // Kiểm tra nếu data là mảng và không rỗng
            if (!Array.isArray(data) || data.length === 0) {
                console.warn("Không có dữ liệu thống kê theo mức độ ưu tiên.");
                const ctx = document.getElementById('taskPriorityChart');
                if (ctx) ctx.style.display = 'none'; // Ẩn canvas nếu không có dữ liệu
                return;
            }

            // Tách dữ liệu
            const labels = data.map(item => item.priority || 'Không xác định');
            const completed = data.map(item => item.completed || 0);
            const incomplete = data.map(item => item.incomplete || 0);

            // Cập nhật bảng
            const tbody = document.querySelector('#taskPriorityTable tbody');
            tbody.innerHTML = ''; // Xóa dữ liệu cũ

            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.priority || 'Không xác định'}</td>
                    <td>${item.completed || 0}</td>
                    <td>${item.incomplete || 0}</td>
                `;
                tbody.appendChild(row);
            });

            // Tạo biểu đồ
            const ctx = document.getElementById('taskPriorityChart').getContext('2d');

            if (window.taskPriorityChart) {
                window.taskPriorityChart.destroy();
            }

            window.taskPriorityChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Hoàn thành',
                            data: completed,
                            backgroundColor: '#4caf50'
                        },
                        {
                            label: 'Chưa hoàn thành',
                            data: incomplete,
                            backgroundColor: '#ff9800'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        title: {
                            display: true,
                            text: 'Số lượng công việc theo mức độ ưu tiên'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { precision: 0 }
                        }
                    }
                }
            });
        })
        .catch(err => {
            console.error('Lỗi khi tải thống kê theo mức độ:', err);
        });
}

function loadMonthlyStats() {
 fetch(`${window.contextPath}/tasks?action=getMonthlyStats`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error("Lỗi:", data.error);
                return;
            }

            const ctx = document.getElementById('taskStatsChart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Đã hoàn thành', 'Chưa hoàn thành'],
                    datasets: [{
                        data: [data.completed, data.incomplete],
                        backgroundColor: ['#4caf50', '#ff9800']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Thống kê công việc tháng này'
                        }
                    }
                }
            });
        })
        .catch(err => {
            console.error("Lỗi khi tải thống kê:", err);
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