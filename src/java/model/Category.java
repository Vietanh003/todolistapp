package model;

public class Category {
    private int madanhmuc;
    private int manguoidung; 
    private String ten;
    private String mausac;

    // Getters và Setters
    public int getMadanhmuc() {
        return madanhmuc;
    }

    public void setMadanhmuc(int madanhmuc) {
        this.madanhmuc = madanhmuc;
    }

    public int getManguoidung() {
        return manguoidung;
    }

    public void setManguoidung(int manguoidung) {
        this.manguoidung = manguoidung;
    }

    public String getTen() {
        return ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public String getMausac() {
        return mausac;
    }

    public void setMausac(String mausac) {
        this.mausac = mausac;
    }
}
