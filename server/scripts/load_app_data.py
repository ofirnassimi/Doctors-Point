import json
from csv import DictReader
import time

from connection import Connection
from settings import RESOURCES_DIR, BATCH_SIZE
from sql import SqlFactory


con = Connection()
sql = SqlFactory()
with open(f'{RESOURCES_DIR}/states.json') as j:
    states = json.load(j)


def insert_row_queries(frst_nm, mid_nm, lst_nm, gndr, Grd_yr, pri_spec, adr_ln_1, cty, st, phn_numbr, **kwargs):
    return [
        sql.insert_state(st, states.get(st)),
        sql.insert_city(cty, st),
        sql.insert_clinic(adr_ln_1, cty, st, phn_numbr),
        sql.insert_specialty(pri_spec),
        sql.insert_doctor(frst_nm, mid_nm, lst_nm, gndr, Grd_yr, pri_spec),
        sql.insert_doctor_clinic(frst_nm, lst_nm, pri_spec, adr_ln_1, cty, st),
    ]


def load(csv_path):
    t = time.time()
    with open(csv_path) as csv_f:
        reader = DictReader(csv_f, skipinitialspace=True)
        queries = []
        for i, row in enumerate(reader):
            queries.extend(insert_row_queries(**row))
            if i % BATCH_SIZE == 0:
                try:
                    print('begin transaction', i)
                    start = time.time()
                    con.transaction(queries)
                    print('finished transaction', i, ', time:', time.time()-start)
                except Exception as e:
                    print(e)
                finally:
                    queries = []
    print(time.time()-t)


def main():
    t = time.time()
    load(f'{RESOURCES_DIR}/doctors.csv')
    print(time.time() - t)


if __name__ == '__main__':
    main()
