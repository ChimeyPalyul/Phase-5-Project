#!/usr/bin/env python3
# Standard library imports
# Remote library imports
from flask import request, session
from flask_restful import Resource
# Local imports
from config import app, db, api
# Add your model imports
from models import ExpenseModel,IncomeModel,UserModel,CategoryModel

class Expenses(Resource):
    def get(self):
        expenses = [expense.to_dict()for expense in ExpenseModel.query.all()]
        return expenses,200
    
    def post(self):
        data = request.get_json()
        try:
            new_expense = ExpenseModel(
                amount = data['amount'],
                date = data['date'],
                description = data['description'],
                frequency = data['frequency']
            )
            db.session.add(new_expense)
            db.session.commit()
            return new_expense.to_dict(only=('amount', 'date', 'description','frequency')),200
        except ValueError:
            return{
                'errors': ['validation errors']
            }, 400

api.add_resource(Expenses, '/expense')

class ExpensesById(Resource):
    def get(self, id):
        expenses = ExpenseModel.query.filter_by(id=id).first()
        return expenses.to_dict(only = ('amount', 'date', 'description', 'frequency'))
    
    def patch(self,id):
        expense = ExpenseModel.query.filter_by(id=id).first()
        if not expense:
            return{
                "error": "Expense not found"
            }, 404
        data = request.get_json()

        try:
            for key in data:
                setattr(expense,key,data[key])
            db.session.add(expense)
            db.session.commit()
        except ValueError as e:
            print(e.__str__())
            return{
                "error": "validation errors"
            }, 400
        
        return expense.to_dict(only=('amount', 'date','description')), 200
    
    def delete(self,id):
        expense = ExpenseModel.query.filter_by(id=id).first()
        if not expense:
            return{'error': "Expense not found"},400
        
        db.session.delete(expense)
        db.session.commit()
        return "", 204

api.add_resource(ExpensesById, '/expense/<int:id>')

class Incomes(Resource):
    def get(self):
        incomes = [income.to_dict()for income in IncomeModel.query.all()]
        return incomes, 200
    
    def post(self):
        data = request.get_json()
        try:
            new_income = IncomeModel(
                amount = data['amount'],
                date = data['date'],
                description = data['description'],
                frequency = data['frequency']
            )
            db.session.add(new_income)
            db.session.commit()
            return new_income.to_dict(only=('amount', 'date', 'description', 'frequency')),200
        except ValueError:
            return{
                'errors': ['validation errors']
            }, 400

api.add_resource(Incomes, '/income')

class IncomesById(Resource):
    def get(self, id):
        incomes = IncomeModel.query.filter_by(id=id).first()
        return incomes.to_dict(only = ('amount', 'date', 'description'))
    
    def patch(self,id):
        income = IncomeModel.query.filter_by(id=id).first()
        if not income:
            return{
                "error": "Income not found"
            }, 404
        data = request.get_json()

        try:
            for key in data:
                setattr(income,key,data[key])
            db.session.add(income)
            db.session.commit()
        except ValueError as e:
            print(e.__str__())
            return{
                "error": "validation errors"
            }, 400
        
        return income.to_dict(only=('amount', 'date','description')), 200
    
    def delete(self,id):
        income = IncomeModel.query.filter_by(id=id).first()
        if not income:
            return{'error': "Income not found"},400
        
        db.session.delete(income)
        db.session.commit()
        return "", 204

api.add_resource(IncomesById, '/income/<int:id>')


class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in UserModel.query.all()]
        return users, 200
    
    def post(self):
        data = request.get_json()
        try:
            new_user = UserModel(
                 name = data['name'],
                username = data['username'],
                _password_hash = data['_password_hash'],
                income_id = data['income_id'],
                expense_id = data['expense_id']
            )
            db.session.add(new_user)
            db.session.commit()
            return new_user.to_dict(only=('name','username','_password_hash', 'income_id', 'expense_id')), 201
        except ValueError as e:
            print(e.__str__())
            return{
                'errors': {'validation errors'}
            }, 400
        
api.add_resource(Users, '/users')

class UsersById(Resource):
    def get(self,id):
        users = UserModel.query.filter_by(id=id).first()
        return users.to_dict(), 200
    
    def delete(self,id):
        user= UserModel.query.filter_by(id=id).first()
        if not user:
            return{"Error": "User not found"}
        db.session.query.delete(user)
        db.session.commit()
        return "", 204
    
api.add_resource(UsersById, '/users/<int:id>')

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        _password_hash = data['_password_hash']
        user = UserModel.query.filter(username == username).first()
        if user:
            if user.authenticate(_password_hash):
                session['user_id'] = user.id
                return user.to_dict(),200
            else:
                return{'error': "Incorrect Password"}, 401
        else:
            return {
                'error': 'Unauthorized'
            }, 401
    
api.add_resource(Login, "/login")

class CheckSession(Resource):
    def get(self):
        user = UserModel.query.filter_(UserModel.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return{
                'message': '401: Not Authorized'
            }, 401
api.add_resource(CheckSession, '/check_session')

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return{'message': '204: No Content'}
    
api.add_resource(Logout, '/logout')
# Views go here!
if __name__ == '__main__':
    app.run(port=5555, debug=True)




@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")

if __name__ == '__main__':
    app.run(port=5555, debug=True)

