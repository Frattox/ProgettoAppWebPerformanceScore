from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import joblib
import os
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, KBinsDiscretizer, MinMaxScaler, OrdinalEncoder, StandardScaler, PowerTransformer, FunctionTransformer



app = Flask(__name__)
CORS(app)

PROJECT_PATH = os.path.join('..','Progetto_Performance_Lavoratori')
MODELS_PATH = os.path.join(PROJECT_PATH,'models')
MODEL_FILE_NAME = 'RandomForestClassifier.sav'

onehot_features = ['department','gender','remote_work_frequency','promotions','job_title']
onehot_enc = OneHotEncoder(sparse_output=False,handle_unknown='infrequent_if_exist')
pipe_onehot = Pipeline([
    ('pipe_onehot',onehot_enc)
])

bins_features = ['age','team_size','employee_satisfaction_score']
bins_enc = KBinsDiscretizer(n_bins=5, encode='onehot-dense',strategy = 'uniform')
pipe_bins = Pipeline([
    ('bins_enc',bins_enc)
])

numerics = ['years_at_company','work_hours_per_week','projects_handled','sick_days','team_size','training_hours']
numerics_enc = MinMaxScaler() #range (0,1)
pipe_numerics= Pipeline([
    ('numerics_enc',numerics_enc)
])

overtime_transf = PowerTransformer(method='yeo-johnson') #for zeros values
pipe_overtime = Pipeline([
    ('overtime_transf',overtime_transf)
])

salary_scaler = StandardScaler()
pipe_salary = Pipeline([
    ('salary_scaler',salary_scaler)
])

educ_enc = OrdinalEncoder(categories=[['High School', 'Bachelor', 'Master', 'PhD']])
pipe_educ= Pipeline([
    ('educ_enc',educ_enc)
])

overtime_transf = PowerTransformer(method='yeo-johnson') #for zeros values
pipe_overtime = Pipeline([
    ('overtime_transf',overtime_transf)
])

onehotencoder = OneHotEncoder(sparse_output=False,handle_unknown='infrequent_if_exist')

def fit_category_combine(df_original):
    x = df_original.copy()
    x['monthly_salary_category'] = pd.cut(
        x['monthly_salary'],
        bins=[3849.0, 6600.0, 7200.0, 7800.0, 8400.0, 9001.0],
        labels=[1, 2, 3, 4, 5]
    )
    x['job_salary'] = x['job_title'].astype(str) + '-' + x['monthly_salary_category'].astype(str)
    onehotencoder.fit(x[['job_salary', 'monthly_salary_category']])

def category_combine(X):
    x = X.copy()
    x['monthly_salary_category'] = pd.cut(
        x['monthly_salary'],
        bins=[3849.0, 6600.0, 7200.0, 7800.0, 8400.0, 9001.0],
        labels=[1, 2, 3, 4, 5]
    )
    x['job_salary'] = x['job_title'].astype(str) + '-' + x['monthly_salary_category'].astype(str)
    onehotencoded = onehotencoder.transform(x[['job_salary','monthly_salary_category']])
    x = x.drop(columns=['job_title','monthly_salary','job_salary','monthly_salary_category'])
    x = pd.concat([x,pd.DataFrame(onehotencoded, index=x.index)],axis=1)
    return x

pipe_combo = Pipeline([
    ('category_combine', FunctionTransformer(category_combine, validate=False))
])

pipe_resigned = Pipeline([
    ('resigned_enc',FunctionTransformer(lambda x: x.replace({'Si': 1, 'No': 0}))) #binary encoding
])

pipeline = ColumnTransformer([
    ('pipe_onehot', pipe_onehot, onehot_features),
    ('pipe_bins',pipe_bins,bins_features),
    ('pipe_numerics', pipe_numerics, numerics),
    ('pipe_educ', pipe_educ, ['education_level']),
    ('pipe_salary', pipe_salary, ['monthly_salary']),
    ('pipe_overtime', pipe_overtime, ['overtime_hours']),
    ('pipe_resigned', pipe_resigned, ['resigned']),
    ('pipe_combo', pipe_combo, ['job_title','monthly_salary'])
])

def check_values_in_column(df_record, df_complete):
    result = {}
    for column in df_record.columns:
        result[column] = df_record[column].iloc[0] in df_complete[column].values
        print(df_record[column].iloc[0])
    return result

@app.route('/',methods=['POST'])
def predict():
    
    df_original = pd.read_csv(os.path.join(".","employees.csv"))
    df_original.columns = map(str.lower,df_original.columns)
    df_original.drop(columns=['employee_id','hire_date','performance_score'],inplace=True)
    fit_category_combine(df_original)
    pipeline.fit(df_original)
    
    #loading data from the POST HTTP
    data = request.get_json()
    
    #loading the model
    model_file = os.path.join(MODELS_PATH,MODEL_FILE_NAME)
    model = pickle.load(open(model_file,'rb'))
    
    #transforming the data with the pipeline
    df = pd.DataFrame([data])
    transformed_data = pipeline.transform(df)

    #predict performance score
    performance_score = model.predict(transformed_data)
    print(performance_score)
    return jsonify({'performance_score': performance_score.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
