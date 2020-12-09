
from sqlalchemy import create_engine
import pandas as pd
import numpy as np

class SQLHelper():

    def __init__(self):
        self.connection_string = "sqlite:////Users/samanthalane/Desktop/SMU /SMU_assignments/10-Advanced-Data-Storage-and-Retrieval/app/Resources /hawaii.sqlite"
        self.engine = create_engine(self.connection_string)

    def get_prcp(self):
        query = """
                SELECT 
                    prcp,
                    date, 
                    station 
                FROM
                    measurement
                 WHERE
                    date >= ( 
                        SELECT 
                            date(MAX(date), '-365 day')
                        FROM 
                            measurement
                        )
                ORDER BY
                    date

                """
        conn = self.engine.connect()
        df = pd.read_sql(query, con=conn)
        conn.close()

        return df

    def get_stations(self):
        query = """
                SELECT 
                    station
                FROM
                    station
                """
        conn = self.engine.connect()
        df = pd.read_sql(query, con=conn)
        conn.close()

        return df

    def get_tobs(self):
        query = """
               SELECT
                    m.tobs, 
                    m.date, 
                    m.station
        
                 FROM
                    measurement m 
                    join station s on m.station = s.station
                WHERE
                    m.station = 'USC00519281' and 
                    date >= ( 
                        SELECT 
                            date(MAX(date), '-365 day')
                        FROM 
                            measurement
                        )
                """
        conn = self.engine.connect()
        df = pd.read_sql(query, con=conn)
        conn.close()

        return df

    # date must be in format YYYY-MM-DD
    def get_info_for_date(self, start_date):
        query = f"""
            SELECT
                MIN(tobs) as "Minimum Temperature", 
                MAX(tobs) as "Maximum Temperature", 
                AVG(tobs) as "Average Temperature"
            
            FROM
                measurement
            WHERE
                date = '{start_date}'
        """
        conn = self.engine.connect()
        df = pd.read_sql(query, con=conn)
        conn.close()

        return df

    def get_info_for_date_range(self, start_date, end_date):
        query = f"""
            SELECT
                MIN(m.tobs) as "Minimum Temperature", 
                MAX(m.tobs) as "Maximum Temperature", 
                AVG(m.tobs) as "Average Temperature"
            
            FROM
                measurement m 
            join station s on m.station = s.station
            WHERE
                date >= '{start_date}' AND
                date <= '{end_date}'
        """
        conn = self.engine.connect()
        df = pd.read_sql(query, con=conn)
        conn.close()

        return df
        
        

