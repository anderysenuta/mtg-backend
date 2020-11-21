CREATE TABLE products
(
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       text NOT NULL,
    description text,
    price       int8
);

CREATE TABLE stocks
(
    product_id uuid,
    count      int8,
    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
            REFERENCES products (id)
);

INSERT INTO products (title, description, price)
VALUES ('Abundance', 'Enchantment', 100),
       ('Academy Researchers', 'Creature — Human Wizard', 200),
       ('Adarkar Wastes', 'Land', 300),
       ('Afflict', 'Instant', 400);

INSERT INTO stocks(product_id, count)
VALUES ('565865d1-8b2f-446a-bbf9-738c1eadca21', 10),
       ('7ec025f9-5622-4c29-9d9b-73c73e7bed02', 20),
       ('4cd62acd-7016-4727-b19b-b55fbedbdf44', 30),
       ('4ce72f59-cfc9-44a4-8d0a-6ddf77d50797', 40);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
