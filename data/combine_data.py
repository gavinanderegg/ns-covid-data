import pandas as pd

cases = pd.read_csv('./csv/cases.csv', usecols=[0, 1, 4], parse_dates=[0])
hosp = pd.read_csv('./csv/hospitalizations.csv', parse_dates=[0])

data = pd.merge(cases, hosp)

data.to_excel('data.xlsx', 'Combined COVID Data', index=False)
data.to_csv('data.csv', index=False)


