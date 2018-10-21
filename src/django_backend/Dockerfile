FROM python:3.6.1

MAINTAINER Jama Noor (jamawadi@gmail.com)

# Copy files from actual computer to a folder named django
RUN mkdir /django
WORKDIR /django
COPY requirements.txt /django
RUN pip install -r requirements.txt

COPY . /django
# La til disse for å fikse issue #65 relation ("fg_auth_user" does not exist)
RUN python manage makemigrations fg_auth
RUN python manage makemigrations api
RUN python manage migrate

