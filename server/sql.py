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

    def insert_comment(self, doctor_first_name, doctor_last_name, specialty, user_email, rating, text):
        doctor_id_query = self.select_doctor(doctor_first_name, doctor_last_name, specialty)
        date_query = self.get_date()
        columns = 'doctor_id, rating, publish_date'
        values = f"({doctor_id_query}), {rating}, ({date_query})"
        if user_email:
            user_id_query = self.select_user(user_email)
            columns += ', writer_id'
            values += f", '{user_id_query}'"
        if text:
            columns += ', text'
            values += f", '{text}'"
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
    def get_date():
        return "SELECT CURDATE()"

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
    def delete_user(user_id):
        return f"DELETE FROM users " \
               f"WHERE id={user_id}"

    @staticmethod
    def doctors(first_name, last_name, specialty, address, city, state, order_by, limit = 20):
        return f"SELECT clinics.address,clinics.phone_number, city.name, states.name," \
               f"       doctors.first_name, doctors.middle_name, doctors.last_name, doctors.gender," \
               f"       doctors.graduation_year, specialty.name " \
               f"FROM doctors_clinics " \
               f"    LEFT OUTER JOIN clinics on doctors_clinics.clinic_id = clinics.id " \
               f"    LEFT OUTER JOIN city on clinics.city_id = city.id " \
               f"    LEFT OUTER JOIN states on city.state_symbol = states.symbol " \
               f"    LEFT OUTER JOIN doctors on doctors_clinics.doctor_id = doctors.id " \
               f"    LEFT OUTER JOIN specialty on specialty.id = doctors.specialty_id " \
               f"ORDER BY first_name " \
               f"LIMIT 20"

    @staticmethod
    def specialties():
        return f"SELECT name FROM specialty"

    @staticmethod
    def states():
        return f"SELECT name FROM states"

    @staticmethod
    def city():
        return f"SELECT DISTINCT name FROM city"
