rm -rf databse.sqlite
npx sequelize db:migrate
npx sequelize db:seed:all
