const API_URL = 'http://localhost:5000'

const imageModules = import.meta.glob(
  '../assets/foods/*.{jpg,jpeg,png,webp}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
)

function getFoodImage(filename) {
  const imagePath = `../assets/foods/${filename}`

  return imageModules[imagePath] || ''
}

export async function getFoods() {
  const response = await fetch(`${API_URL}/api/foods`)

  if (!response.ok) {
    throw new Error('Failed to fetch foods')
  }

  const foods = await response.json()

  return foods.map((food) => ({
    ...food,
    image: getFoodImage(food.image),
  }))
}