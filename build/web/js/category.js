// category.js

/**
 * Lấy danh sách mã và tên danh mục
 */
function fetchCategories() {
    return fetch('CategoryServlet')
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách danh mục');
            }
            return response.json();
        });
}

/**
 * Tải danh sách danh mục vào dropdown
 */
function loadCategories() {
    fetch("CategoryServlet")
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách danh mục');
            }
            return response.json();
        })
        .then(data => {
            let categoryList = document.getElementById("category-list");
            categoryList.innerHTML = "";

            // Thêm mục "Tất cả danh mục"
            let allCategoriesItem = document.createElement("li");
            allCategoriesItem.className = "dropdown-item d-flex align-items-center";
            allCategoriesItem.style.cursor = "pointer";
            allCategoriesItem.innerHTML = `
                <span class="category-color me-2" style="background-color: #000; width: 12px; height: 12px; border-radius: 50%; display: inline-block;"></span>
                <span>Tất cả danh mục</span>
            `;
            allCategoriesItem.addEventListener('click', () => loadTasks());
            categoryList.appendChild(allCategoriesItem);

            if (data.length === 0) {
                let noCategoryItem = document.createElement("li");
                noCategoryItem.className = "dropdown-item text-muted";
                noCategoryItem.textContent = "Không có danh mục nào";
                categoryList.appendChild(noCategoryItem);
                return;
            }

            data.forEach(category => {
                let li = document.createElement("li");
                li.className = "dropdown-item d-flex align-items-center justify-content-between";
                li.style.cursor = "pointer";

                let categoryInfo = document.createElement("div");
                categoryInfo.className = "d-flex align-items-center flex-grow-1";
                let colorDot = document.createElement("span");
                colorDot.className = "category-color me-2";
                colorDot.style.backgroundColor = category.mausac || '#000';
                colorDot.style.width = "12px";
                colorDot.style.height = "12px";
                colorDot.style.borderRadius = "50%";
                colorDot.style.display = "inline-block";
                let categoryName = document.createElement("span");
                categoryName.textContent = category.ten;

                categoryInfo.addEventListener('click', (e) => {
                    e.stopPropagation();
                    loadTasks(category.madanhmuc);
                });

                categoryInfo.appendChild(colorDot);
                categoryInfo.appendChild(categoryName);

                let buttonsDiv = document.createElement("div");
                buttonsDiv.className = "category-buttons";
                buttonsDiv.innerHTML = `
                    <button class="edit-btn btn btn-sm text-warning me-1">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn btn btn-sm text-danger">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;

                // Gắn sự kiện cho các nút
                buttonsDiv.querySelector('.edit-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    editCategory(category.madanhmuc, category.ten, category.mausac);
                });

                buttonsDiv.querySelector('.delete-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteCategory(category.madanhmuc);
                });

                li.appendChild(categoryInfo);
                li.appendChild(buttonsDiv);
                categoryList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải danh mục:", error);
            let categoryList = document.getElementById("category-list");
            categoryList.innerHTML = `<li class="dropdown-item text-danger">Lỗi khi tải danh mục: ${error.message}</li>`;
            showErrorAlert("Lỗi khi tải danh mục: " + error.message);
        });
}

/**
 * Thêm danh mục mới
 */
function addCategory() {
    let ten = document.getElementById("categoryName").value.trim();
    let mausac = document.getElementById("categoryColor").value;

    if (!ten) {
        showErrorAlert("Tên danh mục không được để trống!");
        return;
    }

    fetch("CategoryServlet", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "ten=" + encodeURIComponent(ten) + "&mausac=" + encodeURIComponent(mausac)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showSuccessAlert("Thêm danh mục thành công!");
            loadCategories();
            bootstrap.Modal.getInstance(document.getElementById("addCategoryModal")).hide();
        } else {
            showErrorAlert(result.error || "Lỗi khi thêm danh mục!");
        }
    })
    .catch(error => {
        console.error("Lỗi:", error);
        showErrorAlert("Lỗi khi thêm danh mục: " + error.message);
    });
}

/**
 * Hiển thị modal chỉnh sửa danh mục
 */
function editCategory(madanhmuc, ten, mausac) {
    const modalElement = document.getElementById("editCategoryModal");
    if (!modalElement) {
        console.error("Không tìm thấy phần tử modal");
        showErrorAlert("Lỗi: Không tìm thấy modal chỉnh sửa danh mục!");
        return;
    }

    // Kiểm tra madanhmuc
    if (!madanhmuc || isNaN(madanhmuc)) {
        console.error("Mã danh mục không hợp lệ:", madanhmuc);
        showErrorAlert("Lỗi: Mã danh mục không hợp lệ!");
        return;
    }

    // Gán giá trị vào các trường
    const editCategoryId = document.getElementById("editCategoryId");
    const editCategoryIdDisplay = document.getElementById("editCategoryIdDisplay");
    const editCategoryName = document.getElementById("editCategoryName");
    const editCategoryColor = document.getElementById("editCategoryColor");

    if (!editCategoryId || !editCategoryIdDisplay || !editCategoryName || !editCategoryColor) {
        console.error("Không tìm thấy các trường trong modal");
        showErrorAlert("Lỗi: Không tìm thấy các trường trong modal!");
        return;
    }

    editCategoryId.value = madanhmuc;
    editCategoryIdDisplay.value = madanhmuc; // Gán madanhmuc vào trường hiển thị
    editCategoryName.value = ten || "";
    editCategoryColor.value = mausac || "#000000";

    // Mở modal
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

/**
 * Lưu thông tin chỉnh sửa danh mục
 */
function saveCategory() {
    // Lấy modal để truy xuất các input bên trong
    const modal = document.getElementById("editCategoryModal");

    // Lấy dữ liệu từ các trường input trong modal
    const madanhmuc = modal.querySelector("#editCategoryId").value;
    const ten = modal.querySelector("#editCategoryName").value.trim();
    const mausac = modal.querySelector("#editCategoryColor").value;

    // Kiểm tra dữ liệu trước khi gửi
    if (!madanhmuc || isNaN(madanhmuc)) {
        showErrorAlert("Mã danh mục không hợp lệ!");
        return;
    }

    if (!ten) {
        showErrorAlert("Tên danh mục không được để trống!");
        return;
    }

    // Gửi request PUT để cập nhật danh mục
    fetch("CategoryServlet", {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "madanhmuc=" + encodeURIComponent(madanhmuc) +
              "&ten=" + encodeURIComponent(ten) +
              "&mausac=" + encodeURIComponent(mausac)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Lỗi HTTP: ${response.status} - ${text.substring(0, 100)}...`);
            });
        }
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
            return response.text().then(text => {
                if (text.includes("login.jsp") || text.includes("<form") && text.includes("password")) {
                    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                }
                throw new Error(`Phản hồi không phải JSON: ${text.substring(0, 100)}...`);
            });
        }
        return response.json();
    })
    .then(result => {
        if (result.success) {
            showSuccessAlert("Cập nhật danh mục thành công!");
            loadCategories();
            bootstrap.Modal.getInstance(modal).hide();
        } else {
            showErrorAlert(result.error || "Lỗi khi cập nhật danh mục!");
        }
    })
    .catch(error => {
        console.error("Lỗi khi cập nhật danh mục:", error);
        if (error.message.includes("Phiên đăng nhập đã hết hạn")) {
            showErrorAlert(error.message, "Phiên hết hạn");
            window.location.href = "login.jsp";
        } else {
            showErrorAlert(`Lỗi khi cập nhật danh mục: ${error.message}`);
        }
    });
}

/**
 * Xóa danh mục
 */
function deleteCategory(madanhmuc) {
    showConfirmAlert("Bạn có chắc chắn muốn xóa danh mục này không?", () => {
        fetch("CategoryServlet?madanhmuc=" + madanhmuc, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                showSuccessAlert("Xóa danh mục thành công!");
                loadCategories();
            } else {
                showErrorAlert(result.error || "Lỗi khi xóa danh mục!");
            }
        })
        .catch(error => {
            console.error("Lỗi:", error);
            showErrorAlert("Lỗi khi xóa danh mục: " + error.message);
        });
    });
}

/**
 * Tải danh sách danh mục cho dropdown chỉnh sửa (trong tasks.jsp)
 */
function loadCategoriesForEdit() {
    const select = document.getElementById('editMadanhmuc');
    if (!select) {
        console.log('Phần tử editMadanhmuc không tồn tại, bỏ qua loadCategoriesForEdit');
        return;
    }

    fetch('CategoryServlet')
        .then(response => response.json())
        .then(categories => {
            select.innerHTML = '<option value="">Không có danh mục</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.madanhmuc;
                option.textContent = category.ten;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải danh mục:", error);
            showErrorAlert("Lỗi khi tải danh mục: " + error.message);
        });
}

/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */