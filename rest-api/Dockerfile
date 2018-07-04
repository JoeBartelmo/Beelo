# Use an official Python runtime as an image
FROM python:2.7
ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz
WORKDIR /app

# Install any needed packages specified in requirements.txt
COPY ./requirements.txt /app
RUN pip install -r requirements.txt
COPY ./ /app

CMD dockerize -wait tcp://sql:3306 && python api.py
