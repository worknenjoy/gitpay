FROM node:17
EXPOSE 3000
COPY . /gitpay
WORKDIR /gitpay
RUN npm install
CMD ["npm", "run", "start"]