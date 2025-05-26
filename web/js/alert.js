/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


// alert.js

/**
 * Hiển thị thông báo thành công
 * @param {string} message - Nội dung thông báo
 * @param {string} [title] - Tiêu đề (mặc định: "Thành công!")
 */
function showSuccessAlert(message, title = 'Thành công!') {
    Swal.fire({
        icon: 'success',
        title: title,
        text: message,
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745', // Màu xanh lá cho nút OK
        position: 'center',
        timer: 3000, // Tự động đóng sau 3 giây
        timerProgressBar: true
    });
}

/**
 * Hiển thị thông báo lỗi
 * @param {string} message - Nội dung thông báo
 * @param {string} [title] - Tiêu đề (mặc định: "Lỗi!")
 */
function showErrorAlert(message, title = 'Lỗi!') {
    Swal.fire({
        icon: 'error',
        title: title,
        text: message,
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545', // Màu đỏ cho nút OK
        position: 'center'
    });
}

/**
 * Hiển thị thông báo cảnh báo
 * @param {string} message - Nội dung thông báo
 * @param {string} [title] - Tiêu đề (mặc định: "Cảnh báo!")
 */
function showWarningAlert(message, title = 'Cảnh báo!') {
    Swal.fire({
        icon: 'warning',
        title: title,
        text: message,
        confirmButtonText: 'OK',
        confirmButtonColor: '#ffc107', // Màu vàng cho nút OK
        position: 'center'
    });
}

/**
 * Hiển thị thông báo thông tin
 * @param {string} message - Nội dung thông báo
 * @param {string} [title] - Tiêu đề (mặc định: "Thông tin!")
 */
function showInfoAlert(message, title = 'Thông tin!') {
    Swal.fire({
        icon: 'info',
        title: title,
        text: message,
        confirmButtonText: 'OK',
        confirmButtonColor: '#17a2b8', // Màu xanh dương cho nút OK
        position: 'center'
    });
}

/**
 * Hiển thị thông báo xác nhận (ví dụ: xác nhận xóa)
 * @param {string} message - Nội dung thông báo
 * @param {string} [title] - Tiêu đề (mặc định: "Xác nhận")
 * @param {Function} onConfirm - Hàm được gọi nếu người dùng xác nhận
 */
function showConfirmAlert(message, onConfirm, title = 'Xác nhận') {
    Swal.fire({
        icon: 'question',
        title: title,
        text: message,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#28a745', // Màu xanh lá cho nút xác nhận
        cancelButtonColor: '#dc3545', // Màu đỏ cho nút hủy
        position: 'center'
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
}