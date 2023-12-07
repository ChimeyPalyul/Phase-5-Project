from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from datetime import datetime
from config import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt
from sqlalchemy import DateTime, select

class ExpenseModel(db.Model, SerializerMixin):
    __tablename__='expenses'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    date = db.Column(db.DateTime)
    description = db.Column(db.String)
    frequency = db.Column(db.String, nullable= False)
    

    category = db.relationship('CategoryModel', back_populates = 'expense')
    user = db.relationship('UserModel', back_populates = 'expenses' )

    serialize_rules=('-category.expense',)

    @validates('frequency')
    def validate_frequency(self, key,frequency):
        f = ['one time payment', 'daily', 'weekly', 'bi-weekly', 'monthly']
        if frequency not in f:
            raise ValueError('how often are you being paid?')
        return frequency
        


class IncomeModel(db.Model, SerializerMixin):
    __tablename__='incomes'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    date= db.Column(db.DateTime)
    description = db.Column(db.String)
    frequency = db.Column(db.String, nullable= False)

    category = db.relationship('CategoryModel', back_populates = 'income')
    user = db.relationship('UserModel', back_populates = 'incomes' )
    serialize_rules = ('-category.income',)

    @validates('frequency')
    def validate_frequency(self, key,frequency):
        f = ['one time payment', 'daily', 'weekly', 'bi-weekly', 'monthly']
        if frequency not in f:
            raise ValueError('how often are you being paid?')
        return frequency



class UserModel(db.Model, SerializerMixin):
  __tablename__ = 'users'

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String)
  username = db.Column(db.String, unique=True)
  _password_hash = db.Column(db.String)

  income_id = db.Column(db.Integer, db.ForeignKey('incomes.id'),nullable = False)
  expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable = False)

  expenses = db.relationship('ExpenseModel', back_populates='user')
  incomes = db.relationship('IncomeModel', back_populates='user')

  @validates('name')
  def validate_name(self, name, key):
      if not name:
        raise ValueError('must be a name')
      return name
  
  @validates('username')
  def validate_username(self, key, username):
      if not username:
          raise ValueError('must have a username')
      return username
          

  @hybrid_property
  def password_hash(self):
      return self._password_hash

  @password_hash.setter
  def password_hash(self, password):
      # utf-8 encoding and decoding is required in python 3
      password_hash = bcrypt.generate_password_hash(
          password.encode('utf-8'))
      self._password_hash = password_hash.decode('utf-8')

  @password_hash.expression
  def password_hash(cls):
      return cls._password_hash
  
  @validates('_password_hash')
  def validate_password_hash(self, key, password_hash):
     if not password_hash:
         raise ValueError('Password hash must not be empty')
     return password_hash





class CategoryModel(db.Model,SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    parent_id = db.Column(db.Integer)

    income_id = db.Column(db.Integer, db.ForeignKey('incomes.id'), nullable=False)
    expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable=False)

    expense = db.relationship('ExpenseModel', back_populates = 'category')
    income = db.relationship('IncomeModel', back_populates = 'category')

    serialize_rules=('-expense.category', '-income.category',)

    @validates('name')
    def validate_name(self, key,name):
        if not name:
            raise ValueError('must be a name')
        return name


