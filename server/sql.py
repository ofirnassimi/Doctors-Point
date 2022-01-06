class SqlFactory:
    @staticmethod
    def insert_state(symbol, name):
        return f"INSERT IGNORE INTO states (symbol, name) " \
               f"VALUES ('{symbol}', '{name}')"

    @staticmethod
    def insert_city(city_name, state_symbol):
        return f"INSERT IGNORE INTO city (name, state_symbol) " \
               f"VALUES ('{city_name}', '{state_symbol}')"

    def insert_clinic(self, address, city_name, state_symbol, phone):
        city_id_query = self.select_city(city_name, state_symbol)
        columns = 'address, city_id'
        values = f"'{address}', ({city_id_query})"
        if phone:
            columns += ', phone_number'
            values += f', {phone}'
        return f"INSERT IGNORE INTO clinics ({columns}) " \
               f"VALUES ({values})"

    @staticmethod
    def insert_specialty(specialty):
        return f"INSERT IGNORE INTO specialty (name) " \
               f"VALUES ('{specialty}')"

    def insert_doctor(self, first_name, mid_name, last_name, gender, grd_year, specialty):
        specialty_id_query = self.select_specialty(specialty)
        columns = 'first_name, last_name, gender, specialty_id'
        values = f"'{first_name}', '{last_name}', '{gender}', ({specialty_id_query})"
        if mid_name:
            columns += ', middle_name'
            values += f", '{mid_name}'"
        if grd_year:
            columns += ', graduation_year'
            values += f", {grd_year}"
        return f"INSERT IGNORE INTO doctors ({columns}) " \
               f"VALUES ({values})"

    def insert_doctor_clinic(self, first_name, last_name, specialty, address, city, state):
        doctor_id_query = self.select_doctor(first_name, last_name, specialty)
        clinic_id_query = self.select_clinic(address, city, state)
        return f"INSERT IGNORE INTO doctors_clinics (doctor_id, clinic_id) " \
               f"VALUES (({doctor_id_query}), ({clinic_id_query}))"

    def insert_comment(self, doctor_id, rating, text='', user_id=None):
        columns = 'doctor_id, rating, text, publish_date'
        values = f"{doctor_id}, '{rating}', '{text}', NOW()"
        if user_id:
            columns += ", writer_id"
            values += f", {user_id}"
        return f"INSERT INTO comments ({columns}) " \
               f"VALUES ({values})"

    @staticmethod
    def insert_comment_by_id(doctor_id, rating, text='', user_id=None):
        columns = 'doctor_id, rating, text, publish_date'
        values = f"{doctor_id}, {rating}, '{text}', NOW()"
        if user_id:
            columns += ', writer_id'
            values += f"{user_id}"
        return f"INSERT INTO comments ({columns}) " \
               f"VALUES ({values})"

    @staticmethod
    def select_city(city, state_symbol):
        return f"SELECT id " \
               f"FROM city " \
               f"WHERE name='{city}' AND state_symbol='{state_symbol}'"

    @staticmethod
    def select_clinic(address, city, state):
        return f"SELECT clinics.id " \
               f"FROM clinics LEFT JOIN city on city.id = clinics.city_id " \
               f"WHERE clinics.address='{address}' AND city.name='{city}' AND city.state_symbol='{state}'"

    @staticmethod
    def select_specialty(specialty):
        return f"SELECT id " \
               f"FROM specialty " \
               f"WHERE name='{specialty}'"

    @staticmethod
    def select_doctor(first_name, last_name, specialty):
        return f"SELECT doctors.id " \
               f"FROM doctors LEFT JOIN specialty on specialty.id = doctors.specialty_id " \
               f"WHERE first_name='{first_name}' AND last_name='{last_name}' AND specialty.name='{specialty}'"

    @staticmethod
    def select_doctor_id(limit=20):
        return f"SELECT id FROM doctors LIMIT {limit}"

    @staticmethod
    def get_date():
        return "SELECT CURDATE()"

    @staticmethod
    def select_comments(doctor_id):
        return f"SELECT rating, text, publish_date " \
               f"FROM comments " \
               f"WHERE doctor_id={doctor_id}"

    @staticmethod
    def rating():
        return "SELECT doctor_id, AVG(rating) as rating " \
               "FROM comments " \
               "GROUP BY doctor_id " \
               "ORDER BY rating DESC"

    @staticmethod
    def insert_user(first_name, last_name, email, password):
        return f"INSERT INTO users (first_name, last_name, email, password, last_login)" \
               f"VALUES ('{first_name}', '{last_name}', '{email}', '{password}', NOW())"

    @staticmethod
    def select_user(email, password):
        return f"SELECT id, first_name, last_name " \
               f"FROM users " \
               f"WHERE email='{email}' AND password='{password}'"

    @staticmethod
    def update_user(user_id):
        return f"UPDATE users " \
               f"SET last_login=NOW() " \
               f"WHERE id={user_id}"

    @staticmethod
    def delete_user(user_name, password):
        return f"DELETE FROM users " \
               f"WHERE email='{user_name}' AND password='{password}'"

    @staticmethod
    def top_doctors(limit=10):
        return f"SELECT rating, first_name, middle_name, last_name, gender, specialty.name as specialty, " \
               f"       YEAR(NOW())-doctors.graduation_year as seniority " \
               f"FROM (SELECT AVG(rating) as rating, doctor_id FROM comments " \
               f"      GROUP BY doctor_id " \
               f"      ORDER BY rating DESC" \
               f"      LIMIT {limit}) as top_rated " \
               f"LEFT JOIN doctors on top_rated.doctor_id = doctors.id " \
               f"LEFT JOIN specialty on specialty.id = doctors.specialty_id"

    def doctors1(self, first_name, last_name, specialty, address, city, state_symbol, order_by, limit = 20):
        columns = 'doctors.first_name, doctors.middle_name, doctors.last_name, doctors.gender, ' \
                  'doctors.graduation_year, specialty.name, clinics.address, city.name, states.name, ' \
                  'clinics.phone_number'
        tables = 'doctors, specialty, clinics, city, states, doctors_clinics'
        conditions = f"doctors.specialty_id = specialty.id AND doctors.id = doctors_clinics.doctor_id " \
                     f"AND doctors_clinics.clinic_id = clinics.id AND clinics.city_id = city.id " \
                     f"AND city.state_symbol = states.symbol"
        if first_name:
            conditions += f" AND doctors.first_name = '{first_name}'"
        if last_name:
            conditions += f" AND doctors.last_name = '{last_name}'"
        if specialty:
            specialty_id_query = self.select_specialty(specialty)
            conditions += f" AND specialty.id = ({specialty_id_query})"
        if address:
            conditions += f" AND clinics.address = '{address}'"
        if city:
            city_id_query = self.select_city(city, state_symbol)
            conditions += f" AND city.id = ({city_id_query})"
        if state_symbol:
            conditions += f" AND state.symbol = '{state_symbol}'"
        query = f"SELECT {columns} " \
                f"FROM {tables} " \
                f"WHERE ({conditions}) "
        if order_by:
            query += f" ORDER BY {order_by}"
        if limit:
            query += f"LIMIT {limit}"
        return query

    @staticmethod
    def doctors(first_name='', last_name='', specialty='', address='', city='', state='',
                order_by='seniority', desc=False, limit=20):
        conditions = []
        if first_name:
            conditions.append(f"doctors.first_name = '{first_name}'")
        if last_name:
            conditions.append(f"doctors.last_name = '{last_name}'")
        if specialty:
            conditions.append(f"specialty.name = '{specialty}'")
        # if address:
        #     conditions.append(f"clinics.address = '{address}'")
        if city:
            conditions.append(f"city.name = '{city}'")
        if state:
            conditions.append(f"states.name = '{state}'")
        if order_by == 'seniority':
            conditions.append("doctors.graduation_year IS NOT NULL")

        sql = f"SELECT doctors.first_name as first_name, doctors.middle_name as middle_name, " \
              f"       doctors.last_name as last_name, doctors.gender as gender, specialty.name as specialty, " \
              f"       YEAR(NOW())-doctors.graduation_year as seniority, clinics.address as address, " \
              f"       clinics.phone_number as phone, city.name as city, states.name as state " \
              f"FROM doctors_clinics " \
              f"    LEFT OUTER JOIN clinics on doctors_clinics.clinic_id = clinics.id " \
              f"    LEFT OUTER JOIN city on clinics.city_id = city.id " \
              f"    LEFT OUTER JOIN states on city.state_symbol = states.symbol " \
              f"    LEFT OUTER JOIN doctors on doctors_clinics.doctor_id = doctors.id " \
              f"    LEFT OUTER JOIN specialty on specialty.id = doctors.specialty_id " \
              f"WHERE {' AND '.join(conditions)} "
        sql += f"ORDER BY {order_by} "
        if desc:
            sql += "DESC "
        sql += f"LIMIT {limit}"
        return sql

    @staticmethod
    def specialties():
        return f"SELECT name FROM specialty"

    @staticmethod
    def states():
        return f"SELECT name FROM states"

    @staticmethod
    def city():
        return f"SELECT DISTINCT name FROM city"
