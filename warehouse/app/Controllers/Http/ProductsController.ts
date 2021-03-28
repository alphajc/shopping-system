import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Product from 'App/Models/Product'

export default class ProductsController {
    public async index({ logger, request, params, response }: HttpContextContract) {
        if (params.id) {
            const product = await Product.findOrFail(params.id)

            response.json(product.serialize())
        } else {
            const { q } = request.get()
            logger.info(`search: ${q}`)
            const product = await (!!q ? Product.query().where('name', 'like', `%${q}%`) : Product.query())
    
            response.json(product.map(p => p.serialize()))
        }
    }

    /**
     * 上架货品
     */
    public async online({ request, response }: HttpContextContract) {
        const productDetail = await request.validate({
            schema: schema.create({
                'name': schema.string(),
                'description': schema.string(),
                'price': schema.number(),
                'count': schema.number()
            })
        })

        const product = new Product()
        product.name = productDetail.name
        product.description = productDetail.description
        product.price = productDetail.price
        product.count = productDetail.count
        
        response.json(await product.save())
    }

    /**
     * 下架货品
     */
    public async offline({params, response}: HttpContextContract) {
        const product = await Product.findOrFail(params.id)
       response.json(await product.delete())
    }
}
