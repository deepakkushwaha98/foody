import { useEffect } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { serverUrl } from "../App"
import { clearCart, setCartFromServer } from "../redux/userSlice"

const CART_STORAGE_KEY = "foody-cart-state"

const useSyncCart = () => {
    const dispatch = useDispatch()
    const { userData, cartItems, cartOutletId, totalAmount } = useSelector((state) => state.user)

    useEffect(() => {
        if (!userData) return

        const sync = async () => {
            try {
                await axios.post(
                    `${serverUrl}/api/cart/sync`,
                    {
                        cartItems,
                        outletId: cartOutletId,
                        totalAmount,
                    },
                    { withCredentials: true }
                )
            } catch (err) {
                console.error("cart sync error", err)
            }
        }

        sync()
    }, [cartItems, cartOutletId, totalAmount, userData])

    useEffect(() => {
        if (!userData) return

        const hydrate = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/cart/my-cart`, { withCredentials: true })
                const cart = result.data || {}
                const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{"cartItems":[],"cartOutletId":null}')
                const localItems = Array.isArray(localCart.cartItems) ? localCart.cartItems : []
                const localOutletId = localCart.cartOutletId || null
                const serverItems = Array.isArray(cart.items) ? cart.items : []

                if (serverItems.length > 0 && localItems.length > 0 && String(localOutletId) !== String(cart.outletId)) {
                    dispatch(clearCart())
                    return
                }

                if (serverItems.length > 0 && localItems.length > 0 && String(localOutletId) === String(cart.outletId)) {
                    const mergedItems = new Map()

                    ;[...serverItems, ...localItems].forEach((item) => {
                        const itemKey = String(item.itemId || item.id)
                        const existing = mergedItems.get(itemKey)
                        if (existing) {
                            existing.quantity += Number(item.quantity || 0)
                        } else {
                            mergedItems.set(itemKey, {
                                id: item.itemId || item.id,
                                name: item.name,
                                price: item.price,
                                image: item.image,
                                quantity: Number(item.quantity || 0),
                                shopId: cart.outletId,
                            })
                        }
                    })

                    dispatch(setCartFromServer({
                        cartItems: Array.from(mergedItems.values()),
                        totalAmount: Array.from(mergedItems.values()).reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
                        cartOutletId: cart.outletId,
                        cartOutletName: null,
                    }))
                    return
                }

                if (serverItems.length > 0 && cartItems.length === 0) {
                    dispatch(setCartFromServer({
                        cartItems: serverItems.map((item) => ({
                            id: item.itemId,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            quantity: item.quantity,
                            shopId: cart.outletId,
                        })),
                        totalAmount: cart.subtotal || 0,
                        cartOutletId: cart.outletId,
                        cartOutletName: null,
                    }))
                }
            } catch (err) {
                console.error("cart hydrate error", err)
            }
        }

        hydrate()
    }, [dispatch, userData, cartItems.length])
}

export default useSyncCart