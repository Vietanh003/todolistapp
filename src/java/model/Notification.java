package model;

import java.sql.Timestamp;

public class Notification {
    private int maThongBao;
    private int maCongViec;
    private int maNguoiDung;
    private Timestamp thoiGianNhacNho;
    private String tieuDe;
    private String moTa;

    // Constructor
    public Notification(int maThongBao, int maCongViec, int maNguoiDung, Timestamp thoiGianNhacNho, String tieuDe, String moTa) {
        this.maThongBao = maThongBao;
        this.maCongViec = maCongViec;
        this.maNguoiDung = maNguoiDung;
        this.thoiGianNhacNho = thoiGianNhacNho;
        this.tieuDe = tieuDe;
        this.moTa = moTa;
    }

    // Getter and Setter
    public int getMaThongBao() {
        return maThongBao;
    }

    public void setMaThongBao(int maThongBao) {
        this.maThongBao = maThongBao;
    }

    public int getMaCongViec() {
        return maCongViec;
    }

    public void setMaCongViec(int maCongViec) {
        this.maCongViec = maCongViec;
    }

    public int getMaNguoiDung() {
        return maNguoiDung;
    }

    public void setMaNguoiDung(int maNguoiDung) {
        this.maNguoiDung = maNguoiDung;
    }

    public Timestamp getThoiGianNhacNho() {
        return thoiGianNhacNho;
    }

    public void setThoiGianNhacNho(Timestamp thoiGianNhacNho) {
        this.thoiGianNhacNho = thoiGianNhacNho;
    }

    public String getTieuDe() {
        return tieuDe;
    }

    public void setTieuDe(String tieuDe) {
        this.tieuDe = tieuDe;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }
}