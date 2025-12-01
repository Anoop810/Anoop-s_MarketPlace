function ProductCard({ product, onClick }) {
  if (!product) return null

  return (
    <article
      onClick={() => onClick?.(product)}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-slate-300 transition-all duration-200"
    >
      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
        {product.imageUrl || product.image ? (
          <img
            src={product.imageUrl || product.image}
            alt={product.name || 'Product'}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        )}
        {product.category && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-slate-700">
            {product.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-slate-900 truncate">{product.name}</h3>
        <p className="text-lg font-semibold text-slate-900 mt-1">
          ₹{typeof product.price === 'number' ? product.price.toFixed(2) : product.price || '0.00'}
        </p>
        {product.description && (
          <p className="text-sm text-slate-500 mt-2 line-clamp-2">{product.description}</p>
        )}
      </div>
    </article>
  )
}

export default ProductCard
