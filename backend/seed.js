const dns = require('dns')

dns.setServers(['8.8.8.8', '8.8.4.4'])

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Food = require('./models/Food')

dotenv.config()

const foods = [
  { name: 'Jollof Rice', category: 'Nigerian Meals', price: 2500, image: 'jollof-rice.jpg' },
  { name: 'Fried Rice', category: 'Nigerian Meals', price: 2500, image: 'fried-rice.jpg' },
  { name: 'Ofada Rice & Sauce', category: 'Nigerian Meals', price: 3000, image: 'ofada-rice.jpg' },
  { name: 'Amala & Ewedu', category: 'Nigerian Meals', price: 2500, image: 'amala-ewedu.jpg' },
  { name: 'Pounded Yam & Egusi', category: 'Nigerian Meals', price: 3000, image: 'pounded-yam-egusi.jpg' },
  { name: 'Semo & Efo', category: 'Nigerian Meals', price: 3000, image: 'semo-efo.jpg' },
  { name: 'Eba & Efo Riro', category: 'Nigerian Meals', price: 2500, image: 'eba-efo-riro.jpg' },
  { name: 'Beans & Plantain', category: 'Nigerian Meals', price: 2500, image: 'beans-plantain.jpg' },
  { name: 'Yam & Egg Sauce', category: 'Nigerian Meals', price: 2500, image: 'yam-egg-sauce.jpg' },
  { name: 'White Rice & Stew', category: 'Nigerian Meals', price: 2500, image: 'white-rice.jpg' },
  { name: 'Tuwo Shinkafa & Soup', category: 'Nigerian Meals', price: 3000, image: 'tuwo.jpg' },
  { name: 'Rice & Beans', category: 'Nigerian Meals', price: 2500, image: 'rice-beans.jpg' },

  { name: 'Fried Chicken', category: 'Proteins & Sides', price: 2500, image: 'fried-chicken.jpg' },
  { name: 'Grilled Chicken', category: 'Proteins & Sides', price: 3000, image: 'grilled-chicken.jpg' },
  { name: 'Beef', category: 'Proteins & Sides', price: 2000, image: 'beef.jpg' },
  { name: 'Fried Fish', category: 'Proteins & Sides', price: 2500, image: 'fried-fish.jpg' },
  { name: 'Plantain', category: 'Proteins & Sides', price: 1500, image: 'plantain.jpg' },
  { name: 'Moi Moi', category: 'Proteins & Sides', price: 1500, image: 'moi-moi.jpg' },
  { name: 'Peppered Chicken', category: 'Proteins & Sides', price: 3000, image: 'peppered-chicken.jpg' },
  { name: 'Suya', category: 'Proteins & Sides', price: 3000, image: 'suya.jpg' },
  { name: 'Coleslaw', category: 'Proteins & Sides', price: 1000, image: 'coleslaw.jpg' },

  { name: 'Burger', category: 'Fast Food', price: 3000, image: 'burger.jpg' },
  { name: 'Shawarma', category: 'Fast Food', price: 3000, image: 'shawarma.jpg' },
  { name: 'Pizza', category: 'Fast Food', price: 6000, image: 'pizza.jpg' },
  { name: 'Chicken & Chips', category: 'Fast Food', price: 4500, image: 'chicken-chips.jpg' },
  { name: 'Hot Dog', category: 'Fast Food', price: 2500, image: 'hot-dog.jpg' },
  { name: 'Meat Pie', category: 'Fast Food', price: 1500, image: 'meat-pie.jpg' },
  { name: 'Chicken Pie', category: 'Fast Food', price: 1800, image: 'chicken-pie.jpg' },

  { name: 'Zobo', category: 'Drinks', price: 1000, image: 'zobo.jpg' },
  { name: 'Chapman', category: 'Drinks', price: 1500, image: 'chapman.jpg' },
  { name: 'Bottled Water', category: 'Drinks', price: 500, image: 'bottled-water.jpg' },
  { name: 'Soft Drinks', category: 'Drinks', price: 800, image: 'soft-drinks.jpg' },
  { name: 'Fruit Juice', category: 'Drinks', price: 1500, image: 'fruit-juice.jpg' },
  { name: 'Yoghurt', category: 'Drinks', price: 1500, image: 'yoghurt.jpg' },
  { name: 'Kunu', category: 'Drinks', price: 1000, image: 'kunu.jpg' },
  { name: 'Tigernut', category: 'Drinks', price: 1500, image: 'tigernut.jpg' },
]

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB connected!')

    await Food.deleteMany()
    await Food.insertMany(foods)

    console.log(`${foods.length} foods inserted successfully!`)

    await mongoose.connection.close()

    console.log('MongoDB connection closed.')
  } catch (error) {
    console.error('Seeding failed:', error.message)
  }
}

seedDatabase()