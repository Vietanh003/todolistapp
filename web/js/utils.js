/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


// utils.js
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

function formatDate(dateString) {
    if (!dateString) return "Không có ngày";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    return date.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}