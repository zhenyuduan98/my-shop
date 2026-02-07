import { useEffect, useState } from 'react'

const API_URL = 'https://fakestoreapi.com/products'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // 获取商品
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => {
        setError('商品加载失败')
        setLoading(false)
      })
  }, [])

  // 持久化购物车
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const categories = ['all', ...new Set(products.map(p => p.category))]

  const filteredProducts =
    category === 'all'
      ? products
      : products.filter(p => p.category === category)

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  if (loading) return <p style={{ padding: 24 }}>加载中...</p>
  if (error) return <p style={{ padding: 24, color: 'red' }}>{error}</p>

  return (
    <div style={{ padding: 24, display: 'flex', gap: 32 }}>
      {/* 商品区 */}
      <div style={{ flex: 3 }}>
        <h1>🛒 My Shop</h1>

        <div style={{ marginBottom: 16 }}>
          分类：
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                marginLeft: 8,
                fontWeight: category === c ? 'bold' : 'normal'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16
          }}
        >
          {filteredProducts.map(p => (
            <div
              key={p.id}
              style={{
                border: '1px solid #ddd',
                padding: 12,
                borderRadius: 6
              }}
            >
              <img
                src={p.image}
                alt={p.title}
                style={{ height: 120, objectFit: 'contain', width: '100%' }}
              />
              <h4>{p.title}</h4>
              <p>¥ {p.price}</p>
              <button onClick={() => addToCart(p)}>加入购物车</button>
            </div>
          ))}
        </div>
      </div>

      {/* 购物车 */}
      <div style={{ flex: 1 }}>
        <h2>🧾 购物车</h2>
        {cart.length === 0 && <p>购物车为空</p>}
        {cart.map(item => (
          <div key={item.id}>
            {item.title} × {item.qty}
          </div>
        ))}
        <hr />
        <strong>总价：¥ {totalPrice.toFixed(2)}</strong>
      </div>
    </div>
  )
}

export default App