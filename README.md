# Lipozom Optimizasyon Tahminleme Web Uygulaması

Bu web uygulaması, lipozom optimizasyonu için tahminleme yapan bir araçtır. Girilen parametrelere göre P.BOYUTU (nm), PDI ve EE (%) değerlerini tahmin eder.

## Özellikler

- Kullanıcı dostu web arayüzü
- Gerçek zamanlı tahminleme
- Responsive tasarım (mobil uyumlu)
- TensorFlow/Keras tabanlı makine öğrenmesi modeli

## Gereksinimler

- Python 3.7 veya üstü
- Flask
- TensorFlow/Keras
- Pandas
- NumPy
- Scikit-learn
- OpenPyXL

## Kurulum

1. Gerekli paketleri yükleyin:

```bash
pip install -r requirements.txt
```

2. Uygulamayı başlatın:

```bash
python server.py
```

3. Web tarayıcınızda aşağıdaki adresi açın:

```
http://localhost:5000
```

## Kullanım

1. Sol taraftaki formu doldurun:
   - LİPOİD S100 (mg)
   - DSPE (mg)
   - DOPE (mg)
   - KOLESTEROL (mg)
   - EM (mg)
   - HİDRASYON (mL)
   - ÇÖZÜCÜ TİPİ (1, 2 veya 3)

2. "Tahmin Et" butonuna tıklayın.

3. Sağ tarafta tahmin sonuçlarını görüntüleyin:
   - P.BOYUTU (nm)
   - PDI
   - EE (%)

## Proje Yapısı

- `server.py`: Flask web sunucusu ve model tahminleme API'si
- `static/`: Web arayüzü dosyaları
  - `index.html`: Ana HTML sayfası
  - `styles.css`: CSS stil dosyası
  - `script.js`: JavaScript işlevselliği
- `best_model2.h5`: Eğitilmiş makine öğrenmesi modeli
- `TOPLAMLIPITSIZ.xlsx`: Veri seti

## Lisans

Bu proje açık kaynaklıdır. 