package model;

import java.util.Date;

public class User {
    private int maNguoiDung; // MANGUOIDUNG
    private String email; // EMAIL
    private String matKhau; // MATKHAU
    private String tenNguoiDung; // TENNGUOIDUNG
    private Date ngayTao; // NGAYTAO
    private String duongDanAnhDaiDien; // DUONGDANANHDAIDIEN

    // Constructor đầy đủ
    public User(int maNguoiDung, String email, String matKhau, String tenNguoiDung, 
                Date ngayTao, String duongDanAnhDaiDien) {
        this.maNguoiDung = maNguoiDung;
        this.email = email;
        this.matKhau = matKhau;
        this.tenNguoiDung = tenNguoiDung;
        this.ngayTao = ngayTao;
        this.duongDanAnhDaiDien = duongDanAnhDaiDien;
    }

    // Constructor dùng cho đăng ký (không cần maNguoiDung và ngayTao vì tự động sinh)
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

    public Date getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(Date ngayTao) {
        this.ngayTao = ngayTao;
    }

    public String getDuongDanAnhDaiDien() {
        return duongDanAnhDaiDien;
    }

    public void setDuongDanAnhDaiDien(String duongDanAnhDaiDien) {
        this.duongDanAnhDaiDien = duongDanAnhDaiDien;
    }
}