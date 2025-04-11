package model;

import java.sql.Timestamp;

public class User {
    private int maNguoiDung;
    private String email;
    private String matKhau;
    private String tenNguoiDung;
    private Timestamp ngayTao;
    private String duongDanAnhDaiDien;

    // Constructor không tham số (thêm vào để sửa lỗi)
    public User() {
    }

    // Constructor với 6 tham số (đã có)
    public User(int maNguoiDung, String email, String matKhau, String tenNguoiDung, Timestamp ngayTao, String duongDanAnhDaiDien) {
        this.maNguoiDung = maNguoiDung;
        this.email = email;
        this.matKhau = matKhau;
        this.tenNguoiDung = tenNguoiDung;
        this.ngayTao = ngayTao;
        this.duongDanAnhDaiDien = duongDanAnhDaiDien;
    }

    // Constructor với 3 tham số (đã có, có thể từ phương thức registerUser)
    public User(String email, String matKhau, String tenNguoiDung) {
        this.email = email;
        this.matKhau = matKhau;
        this.tenNguoiDung = tenNguoiDung;
    }

    // Getter và Setter
    public int getMaNguoiDung() {
        return maNguoiDung;
    }

    public void setMaNguoiDung(int maNguoiDung) {
        this.maNguoiDung = maNguoiDung;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }

    public String getTenNguoiDung() {
        return tenNguoiDung;
    }

    public void setTenNguoiDung(String tenNguoiDung) {
        this.tenNguoiDung = tenNguoiDung;
    }

    public Timestamp getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(Timestamp ngayTao) {
        this.ngayTao = ngayTao;
    }

    public String getDuongDanAnhDaiDien() {
        return duongDanAnhDaiDien;
    }

    public void setDuongDanAnhDaiDien(String duongDanAnhDaiDien) {
        this.duongDanAnhDaiDien = duongDanAnhDaiDien;
    }
}