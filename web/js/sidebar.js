/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt 
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js 
 */


// sidebar.js
function setupSidebar() {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
    const toggleSidebar = document.getElementById("toggleSidebar");
    const pinSidebar = document.getElementById("pinSidebar");
    let isPinned = false;

    toggleSidebar.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");
        mainContent.classList.toggle("expanded");
    });

    pinSidebar.addEventListener("click", function () {
        isPinned = !isPinned;
        sidebar.classList.toggle("pinned", isPinned);
        pinSidebar.innerHTML = isPinned ? `<i class="fas fa-lock"></i> Đã ghim` : `<i class="fas fa-thumbtack"></i> Ghim`;
    });
}

function setupViewTasksButton() {
    const viewTasksBtn = document.getElementById("viewTasksBtn");
    if (viewTasksBtn) {
        viewTasksBtn.addEventListener("click", function () {
            window.location.href = "tasks.jsp";
        });
    }
}

function setupViewHomeButton() {
    const viewHomeBtn = document.getElementById("viewHomeBtn");
    if (viewHomeBtn) {
        viewHomeBtn.addEventListener("click", function () {
            window.location.href = "home.jsp";
        });
    }
}