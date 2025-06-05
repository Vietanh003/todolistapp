package model;

import java.sql.Timestamp;

public class Attachment {
    private int matepdinhkem;      
    private int macongviec;        
    private String tentep;        
    private String duongdantep;   
    private String loaitep;        
    private Timestamp ngaytaiLen; 

    public int getMatepdinhkem() { return matepdinhkem; }
    public void setMatepdinhkem(int matepdinhkem) { this.matepdinhkem = matepdinhkem; }
    public int getMacongviec() { return macongviec; }
    public void setMacongviec(int macongviec) { this.macongviec = macongviec; }
    public String getTentep() { return tentep; }
    public void setTentep(String tentep) { this.tentep = tentep; }
    public String getDuongdantep() { return duongdantep; }
    public void setDuongdantep(String duongdantep) { this.duongdantep = duongdantep; }
    public String getLoaitep() { return loaitep; }
    public void setLoaitep(String loaitep) { this.loaitep = loaitep; }
    public Timestamp getNgaytaiLen() { return ngaytaiLen; }
    public void setNgaytaiLen(Timestamp ngaytaiLen) { this.ngaytaiLen = ngaytaiLen; }
}