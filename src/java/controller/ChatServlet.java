package controller;

import dao.UserDAO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.google.gson.Gson;

@WebServlet("/chat")
public class ChatServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Map<Integer, Session> sessions = new ConcurrentHashMap<>();
    private UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getRequestDispatcher("/chat.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String action = request.getParameter("action");
        Integer userId = (Integer) request.getSession().getAttribute("userId");

        if (userId == null) {
            response.getWriter().write("{\"success\": false, \"error\": \"Người dùng chưa đăng nhập\"}");
            return;
        }

        if ("getUsers".equals(action)) {
            Map<Integer, String> users = userDAO.getUsersExceptCurrent(userId);
            response.getWriter().write(new Gson().toJson(users));
        }
    }

    @ServerEndpoint("/chatEndpoint")
    public static class ChatEndpoint {
        @OnOpen
        public void onOpen(Session session) {
            Integer userId = (Integer) session.getUserProperties().get("userId");
            if (userId != null) {
                sessions.put(userId, session);
                System.out.println("User " + userId + " connected");
            }
        }

        @OnClose
        public void onClose(Session session, CloseReason reason) {
            Integer userId = (Integer) session.getUserProperties().get("userId");
            if (userId != null) {
                sessions.remove(userId);
                System.out.println("User " + userId + " disconnected");
            }
        }

        @OnMessage
        public void onMessage(String message, Session session) {
            Gson gson = new Gson();
            ChatMessage chatMessage = gson.fromJson(message, ChatMessage.class);
            Integer senderId = (Integer) session.getUserProperties().get("userId");
            Integer recipientId = chatMessage.getRecipientId();

            if (senderId != null && recipientId != null) {
                Session recipientSession = sessions.get(recipientId);
                if (recipientSession != null && recipientSession.isOpen()) {
                    try {
                        chatMessage.setSenderId(senderId);
                        recipientSession.getBasicRemote().sendText(gson.toJson(chatMessage));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    public static class ChatMessage {
        private Integer recipientId;
        private String content;
        private Integer senderId;

        public Integer getRecipientId() { return recipientId; }
        public void setRecipientId(Integer recipientId) { this.recipientId = recipientId; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public Integer getSenderId() { return senderId; }
        public void setSenderId(Integer senderId) { this.senderId = senderId; }
    }
}