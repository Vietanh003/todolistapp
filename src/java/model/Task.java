package model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class Task {
    private int macongviec;
    private int manguoidung;
    private Integer madanhmuc;
    private String tieude;
    private String mota;
    private String mucdouutien;
    private Timestamp ngayhethan;
    private boolean dahoanthanh;
    private Timestamp ngaytao;
    private Timestamp ngayhoanthanh;
    private Category category;
    private List<Timestamp> nhacNho;
    private List<Attachment> attachments;
    private List<ActivityLog> activityLogs;

    // Constructor
    public Task() {
        this.nhacNho = new ArrayList<>();
        this.attachments = new ArrayList<>();
        this.activityLogs = new ArrayList<>();
    }

    // Getters and Setters
    public int getMacongviec() { return macongviec; }
    public void setMacongviec(int macongviec) { this.macongviec = macongviec; }

    public int getManguoidung() { return manguoidung; }
    public void setManguoidung(int manguoidung) { this.manguoidung = manguoidung; }

    public Integer getMadanhmuc() { return madanhmuc; }
    public void setMadanhmuc(Integer madanhmuc) { this.madanhmuc = madanhmuc; }

    public String getTieude() { return tieude; }
    public void setTieude(String tieude) { this.tieude = tieude; }

    public String getMota() { return mota; }
    public void setMota(String mota) { this.mota = mota; }

    public String getMucdouutien() { return mucdouutien; }
    public void setMucdouutien(String mucdouutien) { this.mucdouutien = mucdouutien; }

    public Timestamp getNgayhethan() { return ngayhethan; }
    public void setNgayhethan(Timestamp ngayhethan) { this.ngayhethan = ngayhethan; }

    public boolean isDahoanthanh() { return dahoanthanh; }
    public void setDahoanthanh(boolean dahoanthanh) { this.dahoanthanh = dahoanthanh; }

    public Timestamp getNgaytao() { return ngaytao; }
    public void setNgaytao(Timestamp ngaytao) { this.ngaytao = ngaytao; }

    public Timestamp getNgayhoanthanh() { return ngayhoanthanh; }
    public void setNgayhoanthanh(Timestamp ngayhoanthanh) { this.ngayhoanthanh = ngayhoanthanh; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public List<Timestamp> getNhacNho() { return nhacNho; }
    public void setNhacNho(List<Timestamp> nhacNho) { this.nhacNho = nhacNho; }
    public void addNhacNho(Timestamp nhacNho) { this.nhacNho.add(nhacNho); }

    public List<Attachment> getAttachments() { return attachments; }
    public void setAttachments(List<Attachment> attachments) { this.attachments = attachments; }
    public void addAttachment(Attachment attachment) { this.attachments.add(attachment); }

    public List<ActivityLog> getActivityLogs() { return activityLogs; }
    public void setActivityLogs(List<ActivityLog> activityLogs) { this.activityLogs = activityLogs; }
}
