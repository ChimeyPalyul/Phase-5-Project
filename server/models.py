from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from datetime import datetime
from config import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt
from sqlalchemy import DateTime, select
from werkzeug.security import check_password_hash

class ExpenseModel(db.Model, SerializerMixin):
    __tablename__='expenses'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    date = db.Column(db.DateTime, default=db.func.now())
    description = db.Column(db.String)
    frequency = db.Column(db.String, nullable= False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),nullable = True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    
   
    
    user = db.relationship('UserModel', back_populates = 'expenses' )
    expense_category= db.relationship('ExpenseCategory', back_populates='expense')

    serialize_rules=('-category.expense','-user.expenses',)

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
    date= db.Column(db.DateTime, default=db.func.now())
    description = db.Column(db.String)
    frequency = db.Column(db.String, nullable= False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),nullable = True)
    
    user = db.relationship('UserModel', back_populates = 'incomes' )
    serialize_rules = ('-category.income', '-user.incomes',)

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
  _password_hash = db.Column(db.String, nullable=False)

  def authenticate(self, password):
       return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))

  expenses  = db.relationship('ExpenseModel', back_populates='user')
  incomes = db.relationship('IncomeModel', back_populates='user')

  serialize_rules =('-expenses.user', '-incomes.user','-expenses.category', '-incomes.category')

  @validates('name')
  def validate_name(self, key, name):
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

#   @password_hash.expression
#   def password_hash(cls):
#       return cls._password_hash
  
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

    

    expense_category = db.relationship('ExpenseCategory', back_populates = 'category')
    

    serialize_rules=('-expense.category', '-income.category',)

    @validates('name')
    def validate_name(self, key,name):
        if not name:
            raise ValueError('must be a name')
        return name
    

class ExpenseCategory(db.Model, SerializerMixin):
    __tablename__='expense-category'
    id = db.Column(db.Integer, primary_key=True)
    expense_id=db.Column(db.Integer, db.ForeignKey('expenses.id'))
    category_id=db.Column(db.Integer, db.ForeignKey('categories.id'))

    expense =db.relationship('ExpenseModel', back_populates='expense_category')
    category=db.relationship('CategoryModel', back_populates='expense_category')
    


