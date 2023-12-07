#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime, timedelta


# Remote library imports
from faker import Faker

fake = Faker()

# Local imports
from app import app
from models import UserModel,ExpenseModel,CategoryModel,IncomeModel, db

def create_users():
    users = []
    for _ in range(5):
        a = UserModel(
            username= fake.first_name(),
            password_hash='testpassword',
            name= fake.name(),
            income_id = randint(1,5),
            expense_id = randint(1,5),
        )
        users.append(a)
    return users

def create_expenses():
   expenses = []
   frequencies = ['one time payment', 'daily', 'weekly', 'bi-weekly', 'monthly']
   for _ in range(5):
       a = ExpenseModel(
           amount = fake.random_number(1,10000),
           date = datetime.now(),
           description = fake.sentence(15),
           frequency = fake.random_element(elements=frequencies)
       )
       expenses.append(a)
   return expenses

def create_incomes():
    incomes = []
    frequencies = ['one time payment', 'daily', 'weekly', 'bi-weekly', 'monthly']
    for _ in range(5):
       a = IncomeModel(
           amount = fake.random_number(1,10000),
           date = datetime.now(),
           description = fake.sentence(15),
           frequency = fake.random_element(elements=frequencies)
       )
       incomes.append(a)
    return incomes

def create_categories():
    categories = []
    for _ in range(3):
        a = CategoryModel(
            name = fake.word(),
            description = fake.sentence(5),
            parent_id= randint(1,5),
            income_id = randint(1,5),
            expense_id = randint(1,5),
        )
        categories.append(a)
    return categories

if __name__ == '__main__':
   fake = Faker()
   with app.app_context():
       print("Starting seed...")
       print("Deleting tables...")
       ExpenseModel.query.delete()
       IncomeModel.query.delete()
       UserModel.query.delete()
       CategoryModel.query.delete()
       print('Tables Deleted')
       db.create_all()
       usr = create_users()
       inc = create_incomes()
       exp = create_expenses()
       cat = create_categories()
       all_data = usr + inc + exp + cat
       db.session.add_all(all_data)
       db.session.commit()
       print('finished seeding')
