from flask import Flask, request, jsonify, redirect
from flask_cors import cross_origin

from operations import Operations


app = Flask('Doctors-Point')

op = Operations()


def response(json_obj):
	print(json_obj)
	res = jsonify(json_obj)
	res.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
	return res


@app.route('/top10/', methods=['GET'])
def top_ten():
	return response(op.top_ten())


@app.route('/login/', methods=['GET'])
def login():
	user_name = request.args.get('user_name')
	password = request.args.get('password')
	return response(op.sign_in(user_name, password))


@app.route('/users/', methods=['POST', 'DELETE'])
@cross_origin()
def users():
	if request.method == 'DELETE':
		user_name = request.args.get('user_name')
		password = request.args.get('password')
		return response(op.sign_down(user_name, password))

	if request.method == 'POST':
		data = request.json
		user_name = data.get('user_name')
		password = data.get('password')
		first_name = data.get('first_name')
		last_name = data.get('last_name')
		op.sign_up(first_name, last_name, user_name, password)
		res = op.sign_in(user_name, password)
		return jsonify(res)


@app.route('/get_comments/', methods=['GET'])
def get_comments():
	return response(op.get_comments(request.args.get('doctor_id')))


@app.route('/send_comment/', methods=['POST'])
@cross_origin()
def send_comment():
	return jsonify(op.add_comment(**request.json))


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
	return response(op.filter_doctors(**request.args))


if __name__ == '__main__':
	app.run()
