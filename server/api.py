from flask import Flask, request, jsonify, redirect

from operations import Operations


app = Flask('Doctors-Point')

op = Operations()


def response(json_obj):
	res = jsonify(json_obj)
	res.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
	return res


@app.route('/login/', methods=['GET', 'POST', 'DELETE'])
def login():
	if request.method == 'DELETE':
		user_id = request.args.get('user_id')
		return response(op.sign_down(user_id))

	user_name = request.args.get('user_name')
	password = request.args.get('password')

	if request.method == 'GET':
		return response(op.sign_in(user_name, password))

	if request.method == 'POST':
		first_name = request.args.get('first_name')
		last_name = request.args.get('last_name')
		op.sign_up(first_name, last_name, user_name, password)
		return redirect('/login/')


@app.route('/specialty/', methods=['GET'])
def specialty():
	return response(op.get_specialties())


@app.route('/city/', methods=['GET'])
def city():
	return response(op.get_cities())


@app.route('/states/', methods=['GET'])
def states():
	return response(op.get_states())


@app.route('/search/', methods=['GET'])
def doctors():
	return response(op.filter_doctors())


if __name__ == '__main__':
	# TODO remove debug lines on submit, leave only "app.run()"
	app.debug = True
	app.run()
	# app.run(debug=True)
