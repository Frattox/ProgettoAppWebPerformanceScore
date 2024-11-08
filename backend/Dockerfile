FROM python:3.12-slim

WORKDIR /backend

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

ENV FLASK_ENV=development
ENV FLASK_APP=prova.py

COPY . .

CMD [ "python", "prova.py" ]