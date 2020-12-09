import datetime as dt
import numpy as np
import pandas as pd
from flask import Flask, jsonify
import json
from sqlHelper import SQLHelper

#######################################################

app = Flask(__name__)

sqlHelper = SQLHelper()

@app.route("/")
def home():
    print("Client requested the home page from the server")
    return"""<html>
        <h1> Welcome to the Hawaii Climate Flask APP API</h1>
        <h2>Available Routes:</h2>
        <h3>Precipitation:</h3>
        <ul>
            <li><h3><a target="_blank" href="/api/v1.0/precipitation">/api/v1.0/precipitation</h3></a></li>
        </ul>
        <h2>Stations: </h2>
        <ul>
            <li><h3><a target="_blank" href="/api/v1.0/stations">/api/v1.0/stations</h3></a></li>
        </ul>
        <h2> TOBS Analysis: </h2>
        <ul>
            <li><h3><a target="_blank" href="/api/v1.0/tobs">/api/v1.0/tobs </h3></li></a>
        </ul>

        <h2> Start Date: (insert date in format YYYY-MM-DD)</h2>
        <ul>
            <li><h3><a target="_blank" href="/api/v1.0/insert_date">/api/v1.0/insert_date_YYYY-MM-DD</h3></a></li>
        </ul>
        <h2>Start and End Date: (insert date in format YYYY-MM-DD)</h2>
        <ul>
            <li><h3><a target="_blank" href="/api/v1.0/insert_date/insert_date">/api/v1.0/insert_date_YYYY-MM-DD/insert_date_YYYY-MM-DD</h3></a></li>
        </ul> 
        
        """

@app.route("/api/v1.0/precipitation")
def get_prcp():
    data = sqlHelper.get_prcp()
    return jsonify(json.loads(data.to_json(orient="records")))

@app.route("/api/v1.0/stations")
def get_stations():
    data = sqlHelper.get_stations()
    return jsonify(json.loads(data.to_json(orient="records")))

@app.route("/api/v1.0/tobs")
def get_tobs():
    data = sqlHelper.get_tobs()
    return jsonify(json.loads(data.to_json(orient="records")))

@app.route("/api/v1.0/<start_date>")
def get_info_for_date(start_date):
    data = sqlHelper.get_info_for_date(start_date)
    return jsonify(json.loads(data.to_json(orient="records")))

@app.route("/api/v1.0/<start_date>/<end_date>")
def get_info_for_date_range(start_date, end_date):
    data = sqlHelper.get_info_for_date_range(start_date, end_date)
    return jsonify(json.loads(data.to_json(orient="records")))

if __name__ == "__main__":
    app.run(debug=True)
