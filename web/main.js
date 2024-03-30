$(".login,.psw").click((e) => {
	const main = e.target.offsetParent;
	const pen = $(main).find('.editable');
	
	if (e.target.attributes['readonly']) {
		pen.addClass('text-danger');
	}
	setTimeout(() => {
		pen.removeClass('text-danger');
	}, 1000);
});

$(".editable").click((e) => editable(e));

$("#add_new").click(async (e) => {
	const button = $(e.target);
	const name = $("#name");
	const login = $("#login");
	const password = $("#psw");

	button.attr('disabled', true);
	button[0].innerText = null;

	button.addClass("bi bi-hourglass");
	let isSaved = await eel.save(-1, name[0].value, login[0].value, password[0].value)();
	if (isSaved == true) {
		button.removeClass("bi bi-hourglass");
		button.addClass("bi-check-lg");
	} else {
		button.removeClass("bi bi-hourglass");
		button.addClass("bi-bug text-danger fw-bold");
		button[0].innerText = isSaved;
	}

	setTimeout(() => {
		button.attr('disabled', false);
		button[0].innerText = "Сохранить";
		button.removeClass("fw-bold text-danger")
	}, 2000)
	update()
});

const editable = (e) => {
	const main = $(e)[0].offsetParent.offsetParent;
	const pen = $(e);
	const login = $(main).find(".login");
	const password = $(main).find(".psw");

	if (login.length && password.length) {
		login.attr('readonly', false);
		password.attr('readonly', false);
		pen.attr('onclick', 'save(this)')
		pen.removeClass('bi-pen');
		pen.addClass('bi-check-lg fs-5 text-info');
	}
}

const save = async (e) => {
	const main = $(e)[0].offsetParent.offsetParent;
	const pen = $(e);
	const id = main.id;
	const name = $(main).find('.name');
	const login = $(main).find(".login");
	const password = $(main).find(".psw");
	// eel save
	let isSaved = await eel.save(id, name[0].innerText, login[0].value, password[0].value)();
	login.attr('readonly', true);
	password.attr('readonly', true);
	pen.attr('onclick', false)
	pen.addClass('bi-pen');
	pen.removeClass('bi-check-lg fs-5 text-info');
	update()
};

const del = async (e) => {
	const main = $(e)[0].offsetParent.offsetParent;
	const pen = e;
	const id = main.id;

	let isDeleted = await eel.delete(id)();
	update()
}

const clear = () => {
	const passwords = $("#passwords .password");
	
	for (let i=0; i < passwords.length; i++) {
		let password = passwords[i];
		if (password.id) {
			$(password).remove();
		}
	}
}

const update = () => {
	clear()
	get()
}

const get = async () => {
	const passwords = $("#passwords");
	const rows = await eel.get_all()();
	
	for (let i=0; i < rows.length; i++) {
		let row = rows[i];
		let content = `<div class="password" id="${row[0]}">
		<div class="info">
			<h6 class="name">${row[1]}</h6>
			<div class="components" style="font-size: 18px;cursor: default;">
				<i class="bi bi-pen editable" onclick="editable(this)"></i>
				<i class="bi bi-trash text-danger" onclick="del(this)"></i>
			</div>
			<h6 class="date">${row[4]}</h6>
		</div>
		<div class="content">
			<input type="text" class="form-control login" value="${row[2]}" readonly>
			<input type="text" class="form-control psw" value="${row[3]}" readonly>
		</div>
	</div>`
		passwords.append(content);
	}
}

get()

$(window).keydown((e) => {
	disabled = [ 'F10', 'F7']
	if (disabled.includes(e.key) || (e.ctrlKey && e.key == 'u')) {
		e.preventDefault();
		return;
	}
})