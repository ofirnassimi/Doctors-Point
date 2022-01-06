import random

from connection import Connection
from settings import BATCH_SIZE
from sql import SqlFactory


con = Connection()
sql = SqlFactory()


def main():
    doctors = (doctor[0] for doctor in con.query_multi(sql.select_doctor_id(50000)))
    queries = []
    for i, doctor_id in enumerate(doctors):
        for j in range(5):
            queries.append(sql.insert_comment_by_id(doctor_id, random.randint(1, 5)))
        if i % BATCH_SIZE == 0:
            try:
                print('begin transaction', i)
                con.transaction(queries)
            except Exception as e:
                print(e)
            finally:
                queries = []


if __name__ == '__main__':
    main()
