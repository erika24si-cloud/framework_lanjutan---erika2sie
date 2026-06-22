import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchProductById } from "@/services/supabaseAPI"

export default function ProductDetail() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProductById(id)
            .then((data) => setProduct(data))
            .catch((err) => setError(err.message))
    }, [id])

    if (error) return <div className="text-red-600 p-4">{error}</div>
    if (!product) return <div className="p-4">Loading...</div>

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-6">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-1">SKU: {product.sku || "-"}</p>
            <p className="text-gray-600 mb-1">Stock: {product.stock}</p>
            <p className="text-gray-800 font-semibold text-lg">
                Harga: Rp {Number(product.price).toLocaleString()}
            </p>
        </div>
    )
}
