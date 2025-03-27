<%@page contentType="text/html" pageEncoding="UTF-8"%>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">ToPlan</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="home.jsp">Trang chủ</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="tasks.jsp">Công việc</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="categories.jsp">Danh mục</a>
                </li>
            </ul>
        </div>
        <div>
            <a href="logout" class="btn btn-danger"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a>
        </div>
    </div>
</nav>
