// user.js

/**
 * Cập nhật thanh điều hướng với thông tin người dùng
 */
function updateNavbar() {
    const userDropdownContainer = document.getElementById('userDropdownContainer');
    const loginButton = document.getElementById('loginButton');
    const navbarAvatar = document.getElementById('navbarAvatar');
    const navbarUsername = document.getElementById('navbarUsername');

    // Kiểm tra sự tồn tại của các phần tử DOM
    if (!userDropdownContainer || !loginButton || !navbarAvatar || !navbarUsername) {
        console.error('Không tìm thấy các phần tử cần thiết trong DOM để cập nhật navbar');
        return;
    }

    if (!window.contextPath) {
        console.error('window.contextPath không được định nghĩa');
        return;
    }

    fetch(window.contextPath + '/userInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.status === 401) {
            throw new Error('Người dùng chưa đăng nhập');
        }
        if (!response.ok) {
            throw new Error('Lỗi khi lấy thông tin người dùng');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        userDropdownContainer.style.display = 'block';
        loginButton.style.display = 'none';
        // Xử lý đường dẫn ảnh đại diện
        navbarAvatar.src = data.duongDanAnhDaiDien 
            ? (window.contextPath + data.duongDanAnhDaiDien) 
            : (window.contextPath + '/img/user-avatar.png');
        navbarUsername.textContent = data.tenNguoiDung || 'Người dùng';
    })
    .catch(error => {
        console.error('Lỗi khi cập nhật navbar:', error);
        userDropdownContainer.style.display = 'none';
        loginButton.style.display = 'block';
    });
}

/**
 * Hiển thị thông tin người dùng trong modal
 */
function showUserInfo() {
    if (!window.contextPath) {
        console.error('window.contextPath không được định nghĩa');
        return;
    }

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
        if (data.error) {
            alert(data.error);
            return;
        }

        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userCreatedAt = document.getElementById('userCreatedAt');

        if (userAvatar && userName && userEmail && userCreatedAt) {
            // Xử lý đường dẫn ảnh đại diện
            userAvatar.src = data.duongDanAnhDaiDien 
                ? (window.contextPath + data.duongDanAnhDaiDien) 
                : (window.contextPath + '/img/user-avatar.png');
            userName.textContent = data.tenNguoiDung || 'Người dùng';
            userEmail.textContent = data.email || 'Không có email';
            userCreatedAt.textContent = 'Ngày tạo: ' + (data.ngayTao ? new Date(data.ngayTao).toLocaleString() : 'Không có thông tin');
            const modal = new bootstrap.Modal(document.getElementById('userInfoModal'));
            modal.show();
        } else {
            console.error('Không tìm thấy các phần tử DOM để hiển thị thông tin người dùng');
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Lỗi khi lấy thông tin người dùng: ' + error.message);
    });
}

/**
 * Tải thông tin hồ sơ người dùng để hiển thị trên trang cá nhân
 */
function loadUserProfile() {
    const profileError = document.getElementById('profileError');
    if (!profileError) {
        console.log('Phần tử profileError không tồn tại, bỏ qua loadUserProfile');
        return;
    }

    if (!window.contextPath) {
        console.error('window.contextPath không được định nghĩa');
        return;
    }

    fetch(window.contextPath + '/userInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        if (!response.ok) {
            throw new Error('Lỗi khi lấy thông tin người dùng');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            profileError.textContent = data.error;
            return;
        }
        // Cập nhật ảnh đại diện
        const profileAvatar = document.getElementById('profileAvatar');
        profileAvatar.src = data.duongDanAnhDaiDien 
            ? (window.contextPath + data.duongDanAnhDaiDien) 
            : (window.contextPath + '/img/user-avatar.png');

        // Cập nhật các thông tin khác
        document.getElementById('profileUsername').textContent = data.tenNguoiDung || 'Người dùng';
        document.getElementById('profileEmail').textContent = data.email || 'Không có email';
        document.getElementById('profileCreatedAt').textContent = 'Ngày tạo: ' + 
            (data.ngayTao ? new Date(data.ngayTao).toLocaleString() : 'Không có thông tin');
        
        profileError.textContent = ''; // Xóa thông báo lỗi nếu thành công
    })
    .catch(error => {
        console.error('Lỗi:', error);
        profileError.textContent = 'Lỗi khi lấy thông tin người dùng: ' + error.message;
        if (error.message.includes('Phiên đăng nhập')) {
            window.location.href = window.contextPath + '/login.jsp';
        }
    });
}

/**
 * Hàm xem trước ảnh đại diện
 */
function previewAvatar(event) {
    const preview = document.getElementById('previewAvatar');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result; // Hiển thị ảnh xem trước
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Cập nhật thông tin người dùng
 */
function updateProfile() {
    const form = document.getElementById('editProfileForm');
    const editProfileError = document.getElementById('editProfileError');
    const tenNguoiDung = document.getElementById('editUsername').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const avatarInput = document.getElementById('editAvatar');
    const avatarFile = avatarInput ? avatarInput.files[0] : null;

    // Kiểm tra dữ liệu đầu vào
    if (!tenNguoiDung || !email) {
        editProfileError.textContent = 'Vui lòng điền đầy đủ thông tin.';
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        editProfileError.textContent = 'Email không đúng định dạng.';
        return;
    }

    if (avatarFile) {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (!validTypes.includes(avatarFile.type)) {
            editProfileError.textContent = 'Vui lòng chọn tệp PNG hoặc JPEG.';
            return;
        }
        if (avatarFile.size > maxSize) {
            editProfileError.textContent = 'Kích thước tệp không được vượt quá 5MB.';
            return;
        }
    }

    if (!window.contextPath) {
        console.error('window.contextPath không được định nghĩa');
        editProfileError.textContent = 'Lỗi cấu hình hệ thống.';
        return;
    }

    const formData = new FormData();
    formData.append('action', 'updateProfile');
    formData.append('tenNguoiDung', tenNguoiDung);
    formData.append('email', email);
    if (avatarFile) {
        formData.append('avatar', avatarFile);
    } else {
        formData.append('duongDanAnhDaiDien', ''); // Gửi chuỗi rỗng nếu không có ảnh
    }

    fetch(window.contextPath + '/userInfo', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        if (!response.ok) {
            throw new Error('Lỗi khi cập nhật thông tin');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Cập nhật thông tin thành công!');
            bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
            // Cập nhật giao diện với dữ liệu mới
            loadUserProfile(); // Tải lại thông tin hồ sơ
            updateNavbar(); // Cập nhật lại navbar
        } else {
            editProfileError.textContent = data.error || 'Lỗi không xác định.';
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        editProfileError.textContent = error.message;
        if (error.message.includes('Phiên đăng nhập')) {
            window.location.href = window.contextPath + '/login.jsp';
        }
    });
}

/**
 * Đổi mật khẩu người dùng
 */
function changePassword() {
    const form = document.getElementById('changePasswordForm');
    const changePasswordError = document.getElementById('changePasswordError');
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmNewPassword = document.getElementById('confirmNewPassword').value.trim();

    // Kiểm tra dữ liệu đầu vào
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        changePasswordError.textContent = 'Vui lòng điền đầy đủ thông tin.';
        return;
    }

    if (newPassword !== confirmNewPassword) {
        changePasswordError.textContent = 'Mật khẩu mới và xác nhận mật khẩu không khớp.';
        return;
    }

    if (newPassword.length < 6) {
        changePasswordError.textContent = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
        return;
    }

    if (!window.contextPath) {
        console.error('window.contextPath không được định nghĩa');
        changePasswordError.textContent = 'Lỗi cấu hình hệ thống.';
        return;
    }

    const formData = new FormData();
    formData.append('action', 'changePassword');
    formData.append('currentPassword', currentPassword);
    formData.append('newPassword', newPassword);

    fetch(window.contextPath + '/userInfo', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        if (!response.ok) {
            throw new Error('Lỗi khi đổi mật khẩu');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            bootstrap.Modal.getInstance(document.getElementById('changePasswordModal')).hide();
            window.location.href = window.contextPath + '/login.jsp'; // Chuyển hướng về trang đăng nhập
        } else {
            changePasswordError.textContent = data.error || 'Lỗi không xác định.';
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        changePasswordError.textContent = 'Lỗi khi đổi mật khẩu: ' + error.message;
        if (error.message.includes('Phiên đăng nhập')) {
            window.location.href = window.contextPath + '/login.jsp';
        }
    });
}