document.addEventListener('DOMContentLoaded', () => {
    const chatBtn = document.getElementById('chatBtn');
    const chatWindow = document.getElementById('chatWindow');
    let recipientId = null;
    let ws = null;

    window.openChatPopup = function(users) {
        if (!document.getElementById('chatWindow')) {
            const popup = document.createElement('div');
            popup.id = 'chatWindow';
            popup.className = 'chat-window';
            popup.innerHTML = `
                <div class="chat-header">
                    <select id="userSelect" class="form-select form-select-sm" onchange="selectUser()">
                        <option value="">Chọn người chat</option>
                        ${Object.entries(users).map(([id, name]) => `<option value="${id}">${name}</option>`).join('')}
                    </select>
                    <button class="btn-close" onclick="closeChat()"></button>
                </div>
                <div class="chat-body" id="chatBody"></div>
                <div class="chat-input">
                    <input type="text" id="chatInput" class="form-control" placeholder="Nhập tin nhắn...">
                    <button class="btn btn-sm btn-primary mt-2" onclick="sendMessage()">Gửi</button>
                </div>
            `;
            document.body.appendChild(popup);

            ws = new WebSocket(`ws://${window.location.host}/chatEndpoint`);
            ws.onopen = () => {
                console.log("Kết nối WebSocket thành công");
                ws.send(JSON.stringify({ userId: <%= ((model.User)session.getAttribute("user")).getMaNguoiDung() %> }));
            };
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                displayMessage(message);
            };
            ws.onerror = (error) => console.error("Lỗi WebSocket:", error);
            ws.onclose = () => console.log("Kết nối WebSocket đóng");
        } else {
            chatWindow.style.display = 'block';
        }
    };

    window.selectUser = function() {
        recipientId = document.getElementById('userSelect').value;
        document.getElementById('chatBody').innerHTML = '';
    };

    window.closeChat = function() {
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow) chatWindow.style.display = 'none';
        if (ws) ws.close();
    };

    function displayMessage(message) {
        const chatBody = document.getElementById('chatBody');
        const isSender = message.senderId === <%= ((model.User)session.getAttribute("user")).getMaNguoiDung() %>;
        chatBody.innerHTML += `
            <div class="chat-message ${isSender ? 'sent' : 'received'}">
                <p><strong>${isSender ? 'Bạn' : 'Người khác'}</strong>: ${message.content}</p>
            </div>
        `;
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    window.sendMessage = function() {
        if (ws && ws.readyState === WebSocket.OPEN && recipientId) {
            const content = document.getElementById('chatInput').value;
            if (content.trim()) {
                const chatMessage = { recipientId: recipientId, content: content };
                ws.send(JSON.stringify(chatMessage));
                displayMessage({ senderId: <%= ((model.User)session.getAttribute("user")).getMaNguoiDung() %>, content: content });
                document.getElementById('chatInput').value = '';
            }
        } else {
            alert('Vui lòng chọn người dùng để chat!');
        }
    };

    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            fetch('/chat?action=getUsers')
                .then(response => response.json())
                .then(users => {
                    openChatPopup(users);
                })
                .catch(error => console.error('Lỗi khi lấy danh sách người dùng:', error));
        });
    } else {
        console.error('Chat button not found!');
    }

    window.addEventListener('beforeunload', () => {
        if (ws) ws.close();
    });
});