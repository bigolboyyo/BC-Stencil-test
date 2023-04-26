import { config } from 'dotenv';
config()

import express from 'express';
import cors from 'cors';
import axios from 'axios';
// import { ExpressHandlebars } from 'express-handlebars';

const app = express();
// const port = process.env.PORT || 3000;
app.use(cors());

// app.engine('handlebars', ExpressHandlebars);
// app.set('view engine', 'handlebars');

const API_PATH = process.env.API_PATH;
const STENCIL_ACCESS_TOKEN = process.env.STENCIL_ACCESS_TOKEN;
const STENCIL_CLIENT_ID = process.env.STENCIL_CLIENT_ID;
const STENCIL_CLIENT_SECRET = process.env.STENCIL_CLIENT_SECRET;
const PRODUCT_ACCESS_TOKEN = process.env.PRODUCT_ACCESS_TOKEN;
const PRODUCT_CLIENT_ID = process.env.PRODUCT_CLIENT_ID;
const PRODUCT_CLIENT_SECRET = process.env.PRODUCT_CLIENT_SECRET;


app.get('/get-products/:category', async (req, res) => {
  const catName = req.params.category;
  const endpoint = `${API_PATH}catalog/categories`;
  const headers = {
    'X-Auth-Token': PRODUCT_ACCESS_TOKEN,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const products = [];

// const channelTest = async () => {
//   const endpoint = `${API_PATH}channels`;
//   const response = await axios(endpoint, { headers });
//   const channels = response.data.data;
//   console.log(channels)
// }

  const createCart = async () => {
    // const channel = await channelTest();
    const endpoint = `${API_PATH}carts`;

    const lineItems = products.map((product) => {
      return {
        quantity: 1,
        product_id: product.id,
      };
    });    

    const requestBody = {
      line_items: lineItems,
      channel_id: 1
    };

    try {
      const response = await axios.post(endpoint, requestBody, {headers});
      const cart = response.data.data;
      return cart;
    } catch (error) {
      console.error('Error creating cart:', error);
      return null;
    }
  };

  try {
    const response = await axios(endpoint, { headers })
    const categories = response.data.data;
    const category = categories.find(p => p.name === catName);

    if(category){
      const productEndpoint = `${API_PATH}catalog/products?categories=${category.id}`

      try {
        const productResponse = await axios(productEndpoint, {headers})
        const catProds = productResponse.data.data;
        products.push(...catProds)
      } catch (error) {
        return res.status(500).json({ error: 'Error getting category' });
      }

    } else {
      console.log({error: "Category doesn't exist"})
    }
    
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Error getting products' });
  }

  const cart = await createCart();
  res.json(cart)
});

app.listen(9090, () => {
  console.log(`Server listening at http://localhost:9090`);
});
