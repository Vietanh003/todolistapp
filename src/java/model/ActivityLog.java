package model;

import java.sql.Timestamp;

public class ActivityLog {
    private int manhatky;       
    private int macongviec;     
    private int manguoidung;    
    private String hanhdong;    
    private Timestamp thoigian; 

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