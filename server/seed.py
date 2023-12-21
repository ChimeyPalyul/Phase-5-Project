#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime, timedelta


# Remote library imports
from faker import Faker

fake = Faker()

# Local imports
from app import app
from models import UserModel,ExpenseModel,CategoryModel,IncomeModel,ExpenseCategory, db

def create_users():
 users = []
 for _ in range(3):
    expense_id = randint(1,5)
   
    u = UserModel(
    name = fake.name(),
    username = fake.name(),
    password_hash = fake.password(),
    )
    users.append(u)
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
  # Define your list of desired categories
  categories = [
    CategoryModel(name="Eating Expense", description="Groceries, restaurants, dining expenses"),
    CategoryModel(name="Living Expense", description="Rent, mortgage, utility bills, etc"),
    CategoryModel(name="Transportation Expense", description="Buses, cars, car payments, travel costs, gasoline"),
    CategoryModel(name="Investment", description="Mortgage, stock purchases, schooling"),
    CategoryModel(name="Recreational Expense", description="Movies, concerts, hobbies"),
    CategoryModel(name='Health Expense', description='minor and major surgeries, gym fees, etc'),
    CategoryModel(name="Other", description="Other"),
    ]
  return categories

def create_expense_categories():
    expense_category = []
    for _ in range(3):
        expense_id = randint(178, 182)
        category_id = randint(54, 56)
        e = ExpenseCategory(
            expense_id=expense_id,
            category_id=category_id
        )
        expense_category.append(e)
    return expense_category



if __name__ == '__main__':
   fake = Faker()
   with app.app_context():
       print("Starting seed...")
       print("Deleting tables...")
       ExpenseModel.query.delete()
       IncomeModel.query.delete()
       UserModel.query.delete()
       CategoryModel.query.delete()
       ExpenseCategory.query.delete()
       print('Tables Deleted')
       db.create_all()
       db.session.commit()
       usr = create_users()
       inc = create_incomes()
       exp = create_expenses()
       cat = create_categories()
       expcat = create_expense_categories()
       print(usr,inc,exp,cat, expcat)
       db.session.add_all(inc)
       db.session.commit()
       db.session.add_all(exp)
       db.session.commit()
       db.session.add_all(cat)
       db.session.commit()
       db.session.add_all(usr)
       db.session.commit()
       db.session.add_all(expcat)
       db.session.commit()
       print('finished seeding')
