function ProductModal({ product, onClose }) {
  if (!product) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl"
      >
        <div className="aspect-video bg-slate-100 relative">
          {product.imageUrl || product.image ? (
            <img
              src={product.imageUrl || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
              {product.category && (
                <span className="inline-block mt-2 px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                  {product.category}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900">${product.price}</p>
          </div>
          
          <p className="text-slate-600 mt-4">{product.description}</p>
          
          <div className="border-t border-slate-200 mt-6 pt-6">
            <h3 className="text-sm font-medium text-slate-500 mb-3">Seller Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-medium text-slate-700">
                {(product.sellerName || 'S').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-slate-900">{product.sellerName || 'Seller'}</p>
                {product.sellerPhone && (
                  <p className="text-sm text-slate-500">{product.sellerPhone}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button className="flex-1 px-4 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
