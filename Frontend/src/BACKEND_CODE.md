# Furnito Backend - Express.js + MongoDB

This file contains the complete backend code for the Furnito furniture website. You need to set this up separately from the frontend.

## Setup Instructions

### 1. Create a new directory for your backend
```bash
mkdir furnito-backend
cd furnito-backend
npm init -y
```

### 2. Install required dependencies
```bash
npm install express mongoose cors dotenv
npm install --save-dev nodemon
```

### 3. Create the following file structure:
```
furnito-backend/
├── server.js
├── models/
│   └── Order.js
├── routes/
│   └── orders.js
├── .env
└── package.json
```

## File Contents

### server.js
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/furnito', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/orders', require('./routes/orders'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Furnito API Server is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### models/Order.js
```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    }
  },
  items: [{
    productId: {
      type: String,
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String
    }
  }],
  total: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
```

### routes/orders.js
```javascript
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { customerInfo, items, total, orderDate } = req.body;

    // Validate request data
    if (!customerInfo || !items || !total) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }

    // Create new order
    const newOrder = new Order({
      customerInfo,
      items,
      total,
      orderDate: orderDate || new Date()
    });

    // Save to database
    const savedOrder = await newOrder.save();

    console.log('✅ New order created:', savedOrder._id);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: savedOrder._id,
      order: savedOrder
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error('❌ Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
});

module.exports = router;
```

### .env
```
# MongoDB Connection String
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/furnito

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/furnito?retryWrites=true&w=majority

# Server Port
PORT=5000
```

### package.json (update scripts)
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## Running the Backend

### Option 1: Using Local MongoDB
1. Install MongoDB on your computer
2. Start MongoDB service
3. Run the backend:
```bash
npm run dev
```

### Option 2: Using MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update the MONGODB_URI in .env file
5. Run the backend:
```bash
npm run dev
```

## API Endpoints

- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete an order

## Testing the API

You can test using curl:

```bash
# Create an order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St"
    },
    "items": [
      {
        "productId": "1",
        "productName": "Modern Sofa",
        "price": 1299,
        "quantity": 1
      }
    ],
    "total": 1349
  }'

# Get all orders
curl http://localhost:5000/api/orders
```

## Connecting Frontend to Backend

In your React frontend (already updated in OrderConfirmation.jsx):

1. Make sure the backend URL in OrderConfirmation.jsx matches your backend server
2. If backend is on localhost:5000, it's already configured
3. If deployed, update the URL to your backend deployment URL

## Deployment Options

### Backend Deployment:
- **Heroku**: Free tier available
- **Railway**: Easy deployment
- **Render**: Free tier available
- **DigitalOcean**: App Platform
- **AWS/Azure/GCP**: Various services

### MongoDB Hosting:
- **MongoDB Atlas**: Free tier (512MB storage)
- Recommended for production use

## Important Notes

1. **CORS**: The backend is configured to accept requests from any origin. In production, restrict this to your frontend domain.

2. **Environment Variables**: Never commit .env file to git. Add it to .gitignore.

3. **Security**: Add authentication/authorization for production use.

4. **Validation**: Consider adding more robust validation using libraries like Joi or express-validator.

5. **Error Handling**: Add more comprehensive error handling for production.

## Next Steps

1. Set up the backend following the instructions above
2. Test the API endpoints
3. Update the frontend URL if deploying to a different domain
4. Add email notifications using nodemailer or SendGrid
5. Add payment processing with Stripe or PayPal
