import { useEffect, useRef } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { serverUrl } from "../App"
import { clearCart, setCartFromServer } from "../redux/userSlice"

const CART_STORAGE_KEY = "foody-cart-state"

const clampQuantity = (quantity) => Math.min(99, Math.max(1, Number(quantity) || 1))

const sanitizeCartItem = (item, outletId) => ({
    id: item.itemId || item.id,
    name: item.name,
    price: Number(item.price) || 0,
    image: item.image,
    quantity: clampQuantity(item.quantity),
    shopId: outletId,
})

const useSyncCart = () => {
    const dispatch = useDispatch()
    const { userData, cartItems, cartOutletId, totalAmount } = useSelector((state) => state.user)
    const hasHydratedRef = useRef(false)
    const cartItemsRef = useRef(cartItems)

    useEffect(() => {
        cartItemsRef.current = cartItems
    }, [cartItems])

    useEffect(() => {
        if (!userData) {
            hasHydratedRef.current = false
            return
        }

        const sync = async () => {
            try {
                if (cartItems.length === 0) {
                    localStorage.removeItem(CART_STORAGE_KEY)
                }

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
        if (!userData || hasHydratedRef.current) return
        hasHydratedRef.current = true

        const hydrate = async () => {
            try {
                const cartLengthAtStart = cartItemsRef.current.length
                const result = await axios.get(`${serverUrl}/api/cart/my-cart`, { withCredentials: true })

                if (cartItemsRef.current.length !== cartLengthAtStart && cartItemsRef.current.length > 0) {
                    return
                }

                const cart = result.data || {}
                const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{"cartItems":[],"cartOutletId":null}')
                const localItems = Array.isArray(localCart.cartItems) ? localCart.cartItems : []
                const localOutletId = localCart.cartOutletId || null
                const serverItems = Array.isArray(cart.items) ? cart.items : []

                const cleanedLocalItems = localItems.map((item) => ({
                    ...item,
                    quantity: clampQuantity(item.quantity),
                }))

                const cleanedServerItems = serverItems.map((item) => sanitizeCartItem(item, cart.outletId))

                const hasComparableOutlets = Boolean(localOutletId && cart.outletId)

                if (cleanedServerItems.length > 0 && cleanedLocalItems.length > 0 && hasComparableOutlets && String(localOutletId) !== String(cart.outletId)) {
                    dispatch(clearCart())
                    return
                }

                if (cleanedServerItems.length > 0 && cleanedLocalItems.length > 0 && String(localOutletId) === String(cart.outletId)) {
                    const mergedItems = new Map()

                    cleanedServerItems.forEach((item) => {
                        mergedItems.set(String(item.id), item)
                    })

                    cleanedLocalItems.forEach((item) => {
                        mergedItems.set(String(item.id), {
                            ...item,
                            quantity: clampQuantity(item.quantity),
                        })
                    })

                    const mergedCartItems = Array.from(mergedItems.values()).map((item) => ({
                        ...item,
                        quantity: clampQuantity(item.quantity),
                    }))

                    dispatch(setCartFromServer({
                        cartItems: mergedCartItems,
                        totalAmount: mergedCartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
                        cartOutletId: cart.outletId,
                        cartOutletName: null,
                    }))
                    return
                }

                if (cleanedServerItems.length > 0 && cleanedLocalItems.length === 0) {
                    dispatch(setCartFromServer({
                        cartItems: cleanedServerItems.map((item) => ({
                            ...item,
                            quantity: clampQuantity(item.quantity),
                        })),
                        totalAmount: cleanedServerItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
                        cartOutletId: cart.outletId,
                        cartOutletName: null,
                    }))
                    return
                }

                if (cleanedServerItems.length === 0 && cleanedLocalItems.length > 0) {
                    dispatch(setCartFromServer({
                        cartItems: cleanedLocalItems.map((item) => ({
                            ...item,
                            quantity: clampQuantity(item.quantity),
                        })),
                        totalAmount: cleanedLocalItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
                        cartOutletId: localOutletId,
                        cartOutletName: localCart.cartOutletName || null,
                    }))
                }
            } catch (err) {
                console.error("cart hydrate error", err)
            }
        }

        hydrate()
    }, [dispatch, userData])
}

export default useSyncCart