import sqlite3
from SimpleEncoder import SimpleEncode as SE


class Table:
	def __init__(self) -> None:
		self.conn = sqlite3.connect("base.db")
		self.cursor = self.conn.cursor()
		self.config = SE.Config(use_rich_print=False)
		self.create()

	def create(self) -> None:
		with self.conn:
			self.cursor.execute("CREATE TABLE IF NOT EXISTS accounts(id INTEGER, name VARCHAR(255)," \
										"login VARCHAR(255), password VARCHAR(255), created_at TEXT, PRIMARY KEY(\"id\" AUTOINCREMENT))")

	def encode(self, value: str):
		return SE.Encode(value, self.config).b64_str()
	
	def decode(self, value: str):
		return SE.Decode(value, self.config).b64_str()

	def by_id(self, _id: int) -> list:
		with self.conn:
			return self.cursor.execute("SELECT * FROM accounts WHERE id = ?", (_id,)).fetchone()

	def get(self) -> list[list]:
		with self.conn:
			return self.cursor.execute("SELECT * FROM accounts").fetchall()

	def insert(self, name: str, login: str, password: str) -> bool:
		name = self.encode(name)
		login = self.encode(login)
		password = self.encode(password)
		with self.conn:
			self.cursor.execute("INSERT INTO accounts(name, login, password, created_at) VALUES (?,?,?,date('now'))", (name, login, password,))
			return True

	def update(self, _id:int, name: str, login: str, password: str) -> bool:
		name = self.encode(name)
		login = self.encode(login)
		password = self.encode(password)
		with self.conn:
			self.cursor.execute("UPDATE accounts SET name=?, login=?, password=? WHERE id=?", (name, login, password, _id,))
			return True
	
	def delete(self, _id: int) -> bool:
		with self.conn:
			self.cursor.execute("DELETE FROM accounts WHERE id=?", ( _id,))
			return True
