<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Chat</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        body {
            background: #f4f7fa;
            overflow: hidden;
        }
        .chat-container {
            display: flex;
            height: 100vh;
            margin: 0;
        }
        .chat-users {
            width: 300px;
            background: #fff;
            border-right: 1px solid #ddd;
            padding: 15px;
            overflow-y: auto;
        }
        .chat-users h5 {
            color: #007bff;
            margin-bottom: 15px;
        }
        .chat-users input {
            border-radius: 20px;
            padding: 8px 15px;
            border: 1px solid #ccc;
            width: 100%;
            margin-bottom: 15px;
        }
        .user-item {
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .user-item:hover {
            background: #f1f1f1;
        }
        .chat-messages {
            flex-grow: 1;
            padding: 20px;
            display: flex;
            flex-direction: column;
        }
        .chat-header {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .chat-header h6 {
            margin: 0;
        }
        .chat-body {
            flex-grow: 1;
            padding: 15px;
            overflow-y: auto;
            background: #f8f9fa;
        }
        .chat-message {
            margin-bottom: 10px;
            padding: 8px 12px;
            border-radius: 5px;
            max-width: 70%;
        }
        .sent { background: #007bff; color: white; margin-left: auto; }
        .received { background: #e9ecef; color: black; }
        .chat-input {
            padding: 10px;
            background: #fff;
            border-top: 1px solid #ddd;
            display: flex;
            gap: 5px;
        }
        .chat-input input {
            flex-grow: 1;
            border-radius: 20px;
            border: 1px solid #ccc;
        }
        .btn-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            line-height: 1;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <%
    model.User user = (model.User) session.getAttribute("user");
    if (user == null) {
        response.sendRedirect("login.jsp");
        return;
    }
    %>
    <div class="chat-container">
        <div class="chat-users">
            <h5><i class="fas fa-users"></i> Danh sách người dùng</h5>
            <input type="text" id="searchUser" class="form-control" placeholder="Tìm tên hoặc email..." onkeyup="searchUsers()">
            <div id="userList"></div>
        </div>
        <div class="chat-messages" id="chatMessages" style="display: none;">
            <div class="chat-header">
                <h6 id="chatWith"></h6>
                <button class="btn-close" onclick="closeChat()"></button>
            </div>
            <div class="chat-body" id="chatBody"></div>
            <div class="chat-input">
                <input type="text" id="chatInput" class="form-control" placeholder="Nhập tin nhắn...">
                <button class="btn btn-primary" onclick="sendMessage()">Gửi</button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/chat.js"></script>
    <script src="${pageContext.request.contextPath}/js/utils.js"></script>
    <script src="${pageContext.request.contextPath}/js/task.js"></script>
    <script src="${pageContext.request.contextPath}/js/user.js"></script>
    <script src="${pageContext.request.contextPath}/js/category.js"></script>
    <script src="${pageContext.request.contextPath}/js/sidebar.js"></script>
    <script src="${pageContext.request.contextPath}/js/notification.js"></script>
    <script src="${pageContext.request.contextPath}/js/alert.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
              updateNavbar();
        loadCategories();
        loadUserProfile();
        setupSidebar();
        setupViewTasksButton();
        setupViewHomeButton();
        fetchNotifications();
        loadMonthlyStats();
        loadStatsByPriority(); // Gọi hàm để hiển thị bảng
        showRandomQuote();
            fetch('/chat?action=getUsers')
                .then(response => response.json())
                .then(users => {
                    displayUsers(users);
                })
                .catch(error => console.error('Lỗi khi lấy danh sách người dùng:', error));
        });

        function displayUsers(users) {
            const userList = document.getElementById('userList');
            userList.innerHTML = '';
            for (let [id, name] of Object.entries(users)) {
                const div = document.createElement('div');
                div.className = 'user-item';
                div.innerHTML = `<i class="fas fa-user"></i> ${name} (ID: ${id})`;
                div.onclick = () => openChat(id, name);
                userList.appendChild(div);
            }
        }

        function searchUsers() {
            const searchTerm = document.getElementById('searchUser').value.toLowerCase();
            fetch('/chat?action=getUsers')
                .then(response => response.json())
                .then(users => {
                    const filteredUsers = Object.fromEntries(
                        Object.entries(users).filter(([id, name]) =>
                            name.toLowerCase().includes(searchTerm) || id.toString().includes(searchTerm)
                        )
                    );
                    displayUsers(filteredUsers);
                })
                .catch(error => console.error('Lỗi khi tìm kiếm người dùng:', error));
        }

        function openChat(userId, userName) {
            const chatMessages = document.getElementById('chatMessages');
            const chatWith = document.getElementById('chatWith');
            chatWith.textContent = `Chat với ${userName}`;
            chatMessages.style.display = 'flex';
            recipientId = userId;

            if (!ws || ws.readyState === WebSocket.CLOSED) {
                ws = new WebSocket(`ws://${window.location.host}/chatEndpoint`);
                ws.onopen = () => {
                    console.log("Kết nối WebSocket thành công");
                    ws.send(JSON.stringify({ userId: <%= user.getMaNguoiDung() %> }));
                };
                ws.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    displayMessage(message);
                };
                ws.onerror = (error) => console.error("Lỗi WebSocket:", error);
                ws.onclose = () => console.log("Kết nối WebSocket đóng");
            }
        }

        function closeChat() {
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.style.display = 'none';
            if (ws) ws.close();
            recipientId = null;
        }

        function displayMessage(message) {
            const chatBody = document.getElementById('chatBody');
            const isSender = message.senderId === <%= user.getMaNguoiDung() %>;
            chatBody.innerHTML += `
                <div class="chat-message ${isSender ? 'sent' : 'received'}">
                    <p><strong>${isSender ? 'Bạn' : 'Người khác'}</strong>: ${message.content}</p>
                </div>
            `;
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        function sendMessage() {
            if (ws && ws.readyState === WebSocket.OPEN && recipientId) {
                const content = document.getElementById('chatInput').value;
                if (content.trim()) {
                    const chatMessage = { recipientId: recipientId, content: content };
                    ws.send(JSON.stringify(chatMessage));
                    displayMessage({ senderId: <%= user.getMaNguoiDung() %>, content: content });
                    document.getElementById('chatInput').value = '';
                }
            } else {
                alert('Vui lòng chọn người dùng để chat!');
            }
        }

        window.addEventListener('beforeunload', () => {
            if (ws) ws.close();
        });
    </script>
</body>
</html