import { Link } from 'react-router-dom'

function CategoryCard({ name, image }) {
  return (
    <Link
      to={`/menu?category=${encodeURIComponent(name)}`}
      className="category-card"
    >
      <div className="category-image">
        <img src={image} alt={name} />
      </div>

      <div className="category-info">
        <h3>{name}</h3>
      </div>
    </Link>
  )
}

export default CategoryCard