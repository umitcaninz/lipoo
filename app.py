import streamlit as st
import numpy as np
import pandas as pd
from keras.models import load_model
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from keras.metrics import MeanSquaredError  # Explicitly import MeanSquaredError



# Başlık
st.title("📊 Lipozom Optimizasyon Tahminleme")
st.write("Girilen `X` değerlerine göre `P.BOYUTU (nm)`, `PDI`, `EE (%)` tahmini yapar.")

# Modeli yükleme
@st.cache_resource
def load_trained_model():
    return load_model('best_model2.h5', custom_objects={'mse': MeanSquaredError()})

# Modeli yükle
model = load_trained_model()

# Veri setini yükleme ve ölçekleyici ayarları
data = pd.read_excel('TOPLAMLIPITSIZ.xlsx')

# One-hot encoding işlemi
encoder = OneHotEncoder(sparse_output=False, drop='first')
solvent_encoded = encoder.fit_transform(data[['ÇÖZÜCÜ TİPİ']])
solvent_df = pd.DataFrame(solvent_encoded, columns=['Solvent_2', 'Solvent_3'])

# Modelin kullanacağı X ve y verilerini hazırla
X = pd.concat([data.drop(columns=['ÇÖZÜCÜ TİPİ', 'P.BOYUTU\n(nm)', 'PDI', 'EE\n(%)']), solvent_df], axis=1)
y = data[['P.BOYUTU\n(nm)', 'PDI', 'EE\n(%)']]

# Veriyi normalize et
scaler_X = MinMaxScaler()
scaler_y = MinMaxScaler()
X_scaled = scaler_X.fit_transform(X)
y_scaled = scaler_y.fit_transform(y)

# Kullanıcı girdilerini alma
st.sidebar.header("🔢 Girdi Değerleri")

lipid_s100 = st.sidebar.number_input("LİPOİD S100 (mg)", min_value=0, max_value=100000, value=50, step=1)
dspe = st.sidebar.number_input("DSPE (mg)", min_value=0, max_value=10000010, value=0, step=1)
dope = st.sidebar.number_input("DOPE (mg)", min_value=0, max_value=10100000, value=0, step=1)
cholesterol = st.sidebar.number_input("KOLESTEROL (mg)", min_value=0, max_value=100000, value=10, step=1)
em = st.sidebar.number_input("EM (mg)", min_value=0, max_value=100000, value=6, step=1)
hydration = st.sidebar.number_input("HİDRASYON (mL)", min_value=0.0, max_value=100000.0, value=25.0, step=0.1)

# ÇÖZÜCÜ TİPİ seçim kutusu
solvent_type = st.sidebar.selectbox("ÇÖZÜCÜ TİPİ", options=[1, 2, 3])

# Kullanıcı girdilerini bir DataFrame'e dönüştürme
custom_input = pd.DataFrame({
    'LİPOİD S100 \n(mg)': [lipid_s100],
    'DSPE \n(mg)': [dspe],
    'DOPE \n(mg)': [dope],
    'KOLESTEROL \n(mg)': [cholesterol],
    'EM \n(mg)': [em],
    'HİDRASYON\n(mL)': [hydration],
    'ÇÖZÜCÜ TİPİ': [solvent_type]
})

if st.button("📊 Tahmin Et"):
    with st.spinner("Model Çalışıyor... Lütfen Bekleyin ⏳"):
        # One-hot encoding uygulama
        solvent_encoded = encoder.transform(custom_input[['ÇÖZÜCÜ TİPİ']])
        solvent_df = pd.DataFrame(solvent_encoded, columns=['Solvent_2', 'Solvent_3'])

        # Modelin giriş formatına uygun hale getirme
        X_custom = pd.concat([custom_input.drop(columns=['ÇÖZÜCÜ TİPİ']), solvent_df], axis=1)

        # Veriyi ölçekleme
        X_custom_scaled = scaler_X.transform(X_custom)

        # Model tahmin yapıyor
        prediction_scaled = model.predict(X_custom_scaled)

        # Ölçekleri geri çevirme (Gerçek değerlere dönüş)
        prediction = scaler_y.inverse_transform(prediction_scaled)

        # Sonuçları gösterme
        st.subheader("📌 Tahmin Sonuçları:")
        st.write(f"**P.BOYUTU (nm):** {prediction[0,0]:.2f}")
        st.write(f"**PDI:** {prediction[0,1]:.4f}")
        st.write(f"**EE (%):** {prediction[0,2]:.2f}")

        # Tüm tahmin sonuçlarını tablo olarak gösterme
        result_df = pd.DataFrame(prediction, columns=["P.BOYUTU (nm)", "PDI", "EE (%)"])
        st.table(result_df)

        # Modelin nasıl çalıştığını anlatan açıklama
        st.success("Tahmin tamamlandı! 📊")
