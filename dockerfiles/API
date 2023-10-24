FROM php:latest

RUN docker-php-ext-install pdo pdo_mysql mysqli

CMD ["php", "-S", "0.0.0.0:8080", "-t", "/var/www/html/public"]