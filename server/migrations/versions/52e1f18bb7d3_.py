"""empty message

Revision ID: 52e1f18bb7d3
Revises: 146689766138
Create Date: 2023-12-11 11:46:13.487051

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '52e1f18bb7d3'
down_revision = '146689766138'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('_password_hash',
               existing_type=sa.VARCHAR(),
               nullable=False)
        batch_op.alter_column('income_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('expense_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('expense_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('income_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('_password_hash',
               existing_type=sa.VARCHAR(),
               nullable=True)

    # ### end Alembic commands ###