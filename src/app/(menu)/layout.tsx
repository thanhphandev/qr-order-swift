import CartView from '@/components/cart/cart-view'
import React from 'react'

const LayoutMenu = ({ children }: { children: React.ReactNode }) => {

    return (
        <div>
            {children}
            <CartView />
        </div>
    )
}

export default LayoutMenu