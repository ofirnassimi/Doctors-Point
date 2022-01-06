from mysql import connector

from settings import CONNECTION_DETAILS


class Connection:
    def __init__(self, auto: bool = True):
        self.__con = connector.connect(**CONNECTION_DETAILS)
        self.__con.autocommit = auto
        self.__cursor = self.__con.cursor(buffered=True)

    def __del__(self):
        self.__con.close()

    def exec(self, operation: str):
        self.__cursor.execute(operation)

    def query_multi(self, query: str):
        self.__cursor.execute(query)
        return self.__cursor.fetchall()

    def query_single(self, query: str):
        self.__cursor.execute(query)
        return self.__cursor.fetchone()

    def transaction(self, operations):
        try:
            self.__con.start_transaction()
            for operation in operations:
                try:
                    self.exec(operation)
                except Exception as e:
                    print('operation failed:', operation)
                    print(e)
            self.__con.commit()
        except connector.Error as err:
            self.__con.rollback()
            raise err
