FROM node:17.3.0
EXPOSE 8082
COPY ./frontend /gitpay/frontend
WORKDIR /gitpay/frontend
RUN npm install
CMD ["npm", "run", "dev"]
