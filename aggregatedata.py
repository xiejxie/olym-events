from argparse import ArgumentParser
from pyspark.sql import SparkSession
from pyspark.sql.types import *
import sys
import json

"""
    Data sourced from: https://www.kaggle.com/heesoo37/120-years-of-olympic-history-athletes-and-results
"""

def get_args():
    parser = ArgumentParser()
    parser.add_argument("-s", "--season", choices=["Summer", "Winter"],
        default="Winter", dest="season", help="Specify olympic season")
    parser.add_argument("-ef", "--extractedfields", required=True, nargs='+',
        dest="extracted_fields", help="Specify fields to extract")
    parser.add_argument("-f", "--file", required=True, dest="file",
        help="Path to data file")
    return parser.parse_args()

def setup(spark):
    sc = spark.sparkContext
    args = get_args()
    season = args.season
    extracted_fields = sc.broadcast(args.extracted_fields)
    dataFile = args.file
    athleteDF = spark.read.csv(dataFile, header=True, inferSchema=True)
    return athleteDF.filter(athleteDF["Season"] == season).cache(), extracted_fields

def jsonify(kvPair):
    year = kvPair[0]
    athleteData = kvPair[1]
    return {"year": year, "athleteData": athleteData}

def init_dict():
    return {key: {} for key in extracted_fields.value}

def combiner_op(acc, row):
    for fieldName in extracted_fields.value:
        field = row[fieldName]
        innerDict = acc[fieldName]
        innerDict[field] = 1\
            if field not in innerDict\
            else innerDict[field] + 1
    return acc

def merger_op(dict1, dict2):
    return {**dict1, **dict2}

spark = SparkSession.builder.appName("aggregate_data").getOrCreate()
df, extracted_fields = setup(spark)
rdd = df\
    .rdd\
    .keyBy(lambda row: row.Year)\
    .aggregateByKey(init_dict(), combiner_op, merger_op)
json_formatted = rdd.map(jsonify).collect()
with open("allSports.json", 'w') as outfile:
    json.dump(json_formatted, outfile, ensure_ascii=False)
spark.stop()
