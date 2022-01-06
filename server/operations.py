from connection import Connection
from sql import SqlFactory


class Operations:
    __con = Connection()
    __sql = SqlFactory()

    def top_ten(self):
        return self.__con.query_multi(self.__sql.top_doctors(), True)

    def filter_doctors(self, **kwargs):
        return self.__con.query_multi(self.__sql.doctors(**kwargs), True)

    def sign_up(self, first_name, last_name, email, password):
        return self.__con.exec(self.__sql.insert_user(first_name, last_name, email, password))

    def sign_in(self, email, password):
        user = self.__con.query_single(self.__sql.select_user(email, password))
        if user:
            self.__con.exec(self.__sql.update_user(user[0]))
        return user

    def sign_down(self, user_name, password):
        return self.__con.exec(self.__sql.delete_user(user_name, password))

    def get_specialties(self):
        return [spec[0] for spec in self.__con.query_multi(self.__sql.specialties())]

    def get_states(self):
        return [state[0] for state in self.__con.query_multi(self.__sql.states())]

    def get_cities(self):
        return [state[0] for state in self.__con.query_multi(self.__sql.city())]
