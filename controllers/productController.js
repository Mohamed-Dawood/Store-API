import Product from '../models/productModel.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

export const getAllProducts = asyncWrapper(async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };

    const reqEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      reqEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
      console.log(filters);
    });
    console.log(numericFilters);
  }

  // Sort
  // const products = await Product.find(queryObject);
  let result = Product.find(queryObject);

  if (sort) {
    // products = products.sort();
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({
    success: true,
    data: {
      nbHits: products.length,
      products,
    },
  });
});

export const createProduct = asyncWrapper(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: {
      product,
    },
  });
});

export const getProduct = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      msg: `No product with id : ${id}`,
    });
  }

  res.status(200).json({
    success: true,
    data: { product },
  });
});

export const updateProduct = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      msg: `No product with id : ${id}`,
    });
  }

  res.status(200).json({ success: true, data: { product } });
});

export const deleteProduct = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      msg: `No product with id : ${id}`,
    });
  }

  res.status(200).json({
    success: true,
    msg: 'Product Deleted Successfully',
  });
});
