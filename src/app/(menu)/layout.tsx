import CartView from '@/components/cart/cart-view'
import React from 'react'

const LayoutMenu = ({ children }: { children: React.ReactNode }) => {
    const availableTables = Array.from({ length: 10 }, (_, i) => `${i + 1}`);

    return (
        <div>
            {children}
            <CartView tables={availableTables} />
        </div>
    )
}

export default LayoutMenu