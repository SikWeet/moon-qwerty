import eel
from os.path import basename
from browser import default_browser
from base import Table
from stamp import Time

browser = default_browser()
browser_name = basename(browser)[:-4]
db = Table()


@eel.expose
def get_time() -> str:
	return Time.get()

@eel.expose
def get_all() -> list[list]:
	decoded = []
	for rows in db.get():
		name = db.decode(rows[1])
		login = db.decode(rows[2])
		password = db.decode(rows[3])
		rows = (rows[0], name, login, password, rows[4])
		decoded.append(rows)

	return decoded

@eel.expose
def save(_id: int, name: str, login: str, password: str) -> bool:
	if len(name) < 2 or len(name) < 2 or len(password) < 2:
		return "Заполните все поля!"
	if not _id or not db.by_id(_id):
		return db.insert(name, login, password)
	return db.update(_id, name, login, password)

@eel.expose
def delete(_id: int) -> bool:
	return db.delete(_id)

if __name__ == "__main__":
	eel.init('web')
	eel.browsers.set_path(browser_name, browser)
	eel.start('main.html', mode=browser_name, size=(760, 830))