import math
import mysql.connector as msql
import pandas as pd

empdata = pd.read_csv('DAC_NationalDownloadableFile.csv', index_col=False, delimiter=',')
empdata.head()

my_db = msql.connect(host="localhost", user="root", passwd="", database="doctors_point")
cursor = my_db.cursor()
cursor.execute("SELECT database();")
record = cursor.fetchone()
print("You're connected to database: ", record)

for i, row in empdata.iterrows():
    arr = tuple(row)
    firstName = arr[4]
    middleName = arr[5]
    lastName = arr[3]
    gender = arr[7]
    speciality = arr[11]

    if math.isnan(arr[10]):
        graduationYear = None
        sql = "INSERT INTO doctors_point.doctors(first_name, middle_name, last_name, gender, speciality, graduation_year) " \
              "VALUES ('%s', '%s', '%s', '%s', '%s', NULL)" % (
              firstName, middleName, lastName, gender, speciality)
    else:
        graduationYear = arr[10]
        sql = "INSERT INTO doctors_point.doctors(first_name, middle_name, last_name, gender, speciality, graduation_year) " \
              "VALUES ('%s', '%s', '%s', '%s', '%s', '%s')" % (
              firstName, middleName, lastName, gender, speciality, graduationYear)

    #print(firstName, middleName, lastName, gender, speciality, graduationYear)

    #sql = "INSERT INTO doctors_point.doctors(first_name, middle_name, last_name, gender, speciality, graduation_year) " \
          #"VALUES ('%s', '%s', '%s', '%s', '%s', '%s')" %(firstName, middleName, lastName, gender, speciality, graduationYear)

    print(sql)

    cursor.execute(sql)
    my_db.commit()


    """print(arr[0])
    firstName = row["frst_nm"]
    middleName = row["mid_nm"]
    lastName = row["lst_nm"]
    gender = row["gndr"]
    speciality = row["pri_spec"]
    graduationYear = row["Grd_yr"]"""

    """sql = "INSERT INTO test_scheme.students VALUES (%s, %s, %s, %s)"
    cursor.execute(sql, tuple(row))
    print("Record inserted")
    my_db.commit()"""

    # Last row uploaded: PLOCHARCZYK (last name) row 500