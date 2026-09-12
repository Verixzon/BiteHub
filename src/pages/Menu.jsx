import { useEffect, useState } from 'react'
import FoodCard from '../components/FoodCard.jsx'
import { getFoods } from '../services/api.js'

function Menu() {
  const [foods, setFoods] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadFoods() {
      try {
        const data = await getFoods()
        setFoods(data)
      } catch (error) {
        console.error(error)
        setError('Unable to connect to the server.')
      } finally {
        setLoading(false)
      }
    }

    loadFoods()
  }, [])

  const categories = [
    'All',
    ...new Set(foods.map((food) => food.category)),
  ]

  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      food.category === selectedCategory

    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <main className="menu-page">
      <section className="menu-header">
        <p>OUR MENU</p>

        <h1>Choose Your Favourite</h1>

        <span>
          Fresh meals, tasty sides and delicious proteins
          prepared just for you.
        </span>
      </section>

      <section className="menu-controls">
        <div className="menu-search">
          <input
            type="search"
            placeholder="Search for a meal..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="category-buttons">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={
                selectedCategory === category
                  ? 'category-button active'
                  : 'category-button'
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
  <div className="loading-state">
    <div className="loading-spinner"></div>
    <p>Loading menu...</p>
  </div>
      ) : error ? (
        <p className="menu-message menu-error">
          {error}
        </p>
      ) : filteredFoods.length === 0 ? (
        <section className="no-results">
          <h2>No meals found</h2>

          <p>
            Try a different search or category.
          </p>
        </section>
      ) : (
        <section className="menu-food-grid">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
            />
          ))}
        </section>
      )}
    </main>
  )
}

export default Menu