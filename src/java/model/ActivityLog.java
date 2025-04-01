package model;

import java.sql.Timestamp;

public class ActivityLog {
    private int manhatky;       // Mã nhật ký (MANHATKY)
    private int macongviec;     // Mã công việc (MACONGVIEC)
    private int manguoidung;    // Mã người dùng (MANGUOIDUNG)
    private String hanhdong;    // Hành động (HANHDONG)
    private Timestamp thoigian; // Thời gian (THOIGIAN)

    // Getters and Setters
    public int getManhatky() { return manhatky; }
    public void setManhatky(int manhatky) { this.manhatky = manhatky; }
    public int getMacongviec() { return macongviec; }
    public void setMacongviec(int macongviec) { this.macongviec = macongviec; }
    public int getManguoidung() { return manguoidung; }
    public void setManguoidung(int manguoidung) { this.manguoidung = manguoidung; }
    public String getHanhdong() { return hanhdong; }
    public void setHanhdong(String hanhdong) { this.hanhdong = hanhdong; }
    public Timestamp getThoigian() { return thoigian; }
    public void setThoigian(Timestamp thoigian) { this.thoigian = thoigian; }
}