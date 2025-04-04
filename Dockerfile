FROM node:14-alpine

RUN mkdir /code
WORKDIR /code
ADD . .

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
