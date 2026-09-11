import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import CategoryCard from '../components/CategoryCard'
import { getFoods } from '../services/api'

import nigerianMealsImage from '../assets/foods/nigerian-meals.jpg'
import proteinsSidesImage from '../assets/foods/proteins-sides.jpg'
import fastFoodImage from '../assets/foods/fast-food.jpg'
import drinksImage from '../assets/foods/drinks.jpg'

function Home() {
  const [foods, setFoods] = useState([])

  useEffect(() => {
    async function loadFoods() {
      try {
        const data = await getFoods()
        setFoods(data)
      } catch (error) {
        console.error('Unable to load foods:', error)
      }
    }

    loadFoods()
  }, [])

  const popularFoods = foods
    .filter((food) => food.category === 'Nigerian Meals')
    .slice(0, 6)

  const proteinsAndSides = foods
    .filter((food) => food.category === 'Proteins & Sides')
    .slice(0, 6)

  const fastFoods = foods
    .filter((food) => food.category === 'Fast Food')
    .slice(0, 6)

  const drinks = foods
    .filter((food) => food.category === 'Drinks')
    .slice(0, 6)

  const categories = [
    {
      name: 'Nigerian Meals',
      image: nigerianMealsImage,
    },
    {
      name: 'Proteins & Sides',
      image: proteinsSidesImage,
    },
    {
      name: 'Fast Food',
      image: fastFoodImage,
    },
    {
      name: 'Drinks',
      image: drinksImage,
    },
  ]

  return (
    <main className="home-page">

      {/* Hero Section */}

      <section className="hero">
        <div className="hero-content">
          <p className="hero-tagline">
            DELICIOUS FOOD, DELIVERED
          </p>

          <h1>
            Your Favourite Meals,
            <br />
            Delivered to You.
          </h1>

          <p>
            Order delicious Nigerian meals, fast food, proteins,
            sides and refreshing drinks from BiteHub.
          </p>

          <div className="hero-buttons">
            <Link to="/menu">
              Order Now
            </Link>

            <Link to="/menu">
              Explore Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}

      <section className="categories-section">
        <div className="section-heading">
          <p>EXPLORE</p>
          <h2>Browse Categories</h2>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              image={category.image}
            />
          ))}
        </div>
      </section>

      {/* Nigerian Meals */}

      <section className="food-section">
        <div className="section-heading">
          <p>OUR FAVOURITES</p>
          <h2>Nigerian Meals</h2>
        </div>

        <div className="food-grid">
          {popularFoods.map((food) => (
            <FoodCard
              key={food._id}
              _id={food._id}
              name={food.name}
              category={food.category}
              price={food.price}
              image={food.image}
            />
          ))}
        </div>

        <div className="view-menu-container">
          <Link
            to="/menu?category=Nigerian%20Meals"
            className="view-menu-button"
          >
            Explore Nigerian Meals
          </Link>
        </div>
      </section>

      {/* Proteins & Sides */}

      <section className="food-section">
        <div className="section-heading">
          <p>ADD TO YOUR MEAL</p>
          <h2>Proteins & Sides</h2>
        </div>

        <div className="food-grid">
          {proteinsAndSides.map((food) => (
            <FoodCard
              key={food._id}
              _id={food._id}
              name={food.name}
              category={food.category}
              price={food.price}
              image={food.image}
            />
          ))}
        </div>

        <div className="view-menu-container">
          <Link
            to="/menu?category=Proteins%20%26%20Sides"
            className="view-menu-button"
          >
            Explore Proteins & Sides
          </Link>
        </div>
      </section>

      {/* Fast Food */}

      <section className="food-section">
        <div className="section-heading">
          <p>QUICK BITES</p>
          <h2>Fast Food</h2>
        </div>

        <div className="food-grid">
          {fastFoods.map((food) => (
            <FoodCard
              key={food._id}
              _id={food._id}
              name={food.name}
              category={food.category}
              price={food.price}
              image={food.image}
            />
          ))}
        </div>

        <div className="view-menu-container">
          <Link
            to="/menu?category=Fast%20Food"
            className="view-menu-button"
          >
            Explore Fast Food
          </Link>
        </div>
      </section>

      {/* Drinks */}

      <section className="food-section">
        <div className="section-heading">
          <p>STAY REFRESHED</p>
          <h2>Drinks</h2>
        </div>

        <div className="food-grid">
          {drinks.map((food) => (
            <FoodCard
              key={food._id}
              _id={food._id}
              name={food.name}
              category={food.category}
              price={food.price}
              image={food.image}
            />
          ))}
        </div>

        <div className="view-menu-container">
          <Link
            to="/menu?category=Drinks"
            className="view-menu-button"
          >
            Explore Drinks
          </Link>
        </div>
      </section>

    </main>
  )
}

export default Home