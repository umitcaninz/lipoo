from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from keras.models import load_model
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from keras.metrics import MeanSquaredError
import os
import tensorflow as tf

# TensorFlow optimizasyonları
tf.config.threading.set_inter_op_parallelism_threads(1)
tf.config.threading.set_intra_op_parallelism_threads(1)

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# Load the model
model = load_model('api/best_model2.h5', custom_objects={'mse': MeanSquaredError()})

# Load and prepare the data for scaling
data = pd.read_excel('api/TOPLAMLIPITSIZ.xlsx')

# One-hot encoding
encoder = OneHotEncoder(sparse_output=False, drop='first')
solvent_encoded = encoder.fit_transform(data[['ÇÖZÜCÜ TİPİ']])
solvent_df = pd.DataFrame(solvent_encoded, columns=['Solvent_2', 'Solvent_3'])

# Prepare X and y data
X = pd.concat([data.drop(columns=['ÇÖZÜCÜ TİPİ', 'P.BOYUTU\n(nm)', 'PDI', 'EE\n(%)']), solvent_df], axis=1)
y = data[['P.BOYUTU\n(nm)', 'PDI', 'EE\n(%)']]

# Normalize data
scaler_X = MinMaxScaler()
scaler_y = MinMaxScaler()
X_scaled = scaler_X.fit_transform(X)
y_scaled = scaler_y.fit_transform(y)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        input_data = request.json
        
        # Create DataFrame from input
        custom_input = pd.DataFrame({
            'LİPOİD S100 \n(mg)': [float(input_data['lipid_s100'])],
            'DSPE \n(mg)': [float(input_data['dspe'])],
            'DOPE \n(mg)': [float(input_data['dope'])],
            'KOLESTEROL \n(mg)': [float(input_data['cholesterol'])],
            'EM \n(mg)': [float(input_data['em'])],
            'HİDRASYON\n(mL)': [float(input_data['hydration'])],
            'ÇÖZÜCÜ TİPİ': [int(input_data['solvent_type'])]
        })
        
        # One-hot encoding
        solvent_encoded = encoder.transform(custom_input[['ÇÖZÜCÜ TİPİ']])
        solvent_df = pd.DataFrame(solvent_encoded, columns=['Solvent_2', 'Solvent_3'])
        
        # Format for model input
        X_custom = pd.concat([custom_input.drop(columns=['ÇÖZÜCÜ TİPİ']), solvent_df], axis=1)
        
        # Scale the data
        X_custom_scaled = scaler_X.transform(X_custom)
        
        # Make prediction
        prediction_scaled = model.predict(X_custom_scaled, verbose=0)
        
        # Inverse transform to get actual values
        prediction = scaler_y.inverse_transform(prediction_scaled)
        
        # Return results
        return jsonify({
            'particle_size': float(prediction[0, 0]),
            'pdi': float(prediction[0, 1]),
            'ee': float(prediction[0, 2])
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 