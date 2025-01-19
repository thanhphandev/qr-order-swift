import { getCategories } from '@/actions/category.action'
import { CategoryBar } from '@/components/menu/category-bar';
import Header from '@/components/menu/header'
import Footer from '@/components/menu/footer';
import CartView from '@/components/cart/cart-view';

interface MenuLayoutProps {
    children: React.ReactNode
}

const MenuLayout = async ({ children }: MenuLayoutProps) => {
    const categories = await getCategories();

    return (
        <>
            <Header />
            <CategoryBar categories={categories} />
            {children}
            <Footer />
        </>
    )
}

export default MenuLayout