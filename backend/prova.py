from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import dill
import os
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, KBinsDiscretizer, MinMaxScaler, OrdinalEncoder, StandardScaler, PowerTransformer, FunctionTransformer



app = Flask(__name__)
CORS(app)

ROOT_PATH = '.'
MODEL_FILE_NAME = 'RandomForestClassifier_grid_search.sav'
PIPELINE_FILE_NAME = 'pipeline.dill'



@app.route('/',methods=['POST'])
def predict():
    
    #loading data from the POST HTTP
    data = request.get_json()
    
    #loading the model
    model_file = os.path.join(ROOT_PATH,MODEL_FILE_NAME)
    model = pickle.load(open(model_file,'rb'))

    #loading pipeline
    pipeline_file = os.path.join(ROOT_PATH,PIPELINE_FILE_NAME)
    pipeline = dill.load(open(pipeline_file, 'rb'))
    
    #transforming the data with the pipeline
    df = pd.DataFrame([data])
    df['resigned'] = df['resigned'].replace({'Si': True, 'No': False})
    transformed_data = pipeline.transform(df)

    #predict performance score
    performance_score = model.predict(transformed_data)
    print(performance_score)
    return jsonify({'performance_score': performance_score.tolist()})

if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0",port=5000)
