// notification.js

/**
 * Lấy danh sách thông báo của người dùng
 */
function fetchNotifications() {
    fetch(window.contextPath + '/NotificationServlet', {
        method: 'GET',
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Người dùng chưa đăng nhập. Vui lòng đăng nhập lại.');
            }
            throw new Error('Lỗi khi lấy danh sách thông báo');
        }
        return response.json();
    })
    .then(notifications => {
        displayNotifications(notifications);
    })
    .catch(error => {
        console.error("Lỗi khi tải thông báo:", error);
        const notificationList = document.getElementById('notification-list');
        if (notificationList) {
            notificationList.innerHTML = `<li class="dropdown-item text-danger">Lỗi: ${error.message}</li>`;
        }
        if (error.message.includes('Người dùng chưa đăng nhập')) {
            window.location.href = window.contextPath + '/login.jsp';
        } else {
            showErrorAlert("Lỗi khi tải thông báo: " + error.message);
        }
    });
}

/**
 * Hiển thị danh sách thông báo trong dropdown
 */
function displayNotifications(notifications) {
    const notificationList = document.getElementById('notification-list');
    const notificationCount = document.getElementById('notificationCount');

    if (!notificationList || !notificationCount) {
        console.log('Phần tử notification-list hoặc notificationCount không tồn tại');
        return;
    }

    notificationList.innerHTML = '';

    if (notifications.length > 0) {
        notificationCount.textContent = notifications.length;
        notificationCount.style.display = 'block';
    } else {
        notificationCount.style.display = 'none';
    }

    if (notifications.length === 0) {
        notificationList.innerHTML = '<li class="dropdown-item text-muted">Không có thông báo nào</li>';
        return;
    }

    notifications.forEach(notification => {
        const li = document.createElement('li');
        li.className = 'dropdown-item';
        li.innerHTML = `
            <strong>${notification.tieuDe}</strong>
            <p class="mb-1">${notification.moTa || 'Không có mô tả'}</p>
            <small>Nhắc nhở: ${new Date(notification.thoiGianNhacNho).toLocaleString()}</small>
        `;
        notificationList.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    fetchNotifications();
    setInterval(fetchNotifications, 60000);
});