import Factory from '@ioc:Adonis/Lucid/Factory'
import Product from 'App/Models/Product'

export const ProductFactory = Factory
  .define(Product, ({ faker }) => {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price()),
      count: Math.floor(Math.random() * 1000),
      lock_cnt: Math.floor(Math.random() * 300 + 239)
    }
  })
  .build()