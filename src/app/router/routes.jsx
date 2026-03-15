import { Navigate } from 'react-router-dom';
import Home from "@pages/Home/HomePage.jsx";
import Migration from '@pages/Migration/MigrationPage.jsx';
import MintCosmetics from '@pages/MintCosmetics/MintCosmeticsPage.jsx';
// Hidden pages (uncomment when ready):
// import PreSale from "@pages/PreSale/PreSalePage.jsx";
import Link from "@pages/Link/LinkPage.jsx";
import PremiumShop from "@pages/PremiumShop/PremiumShopPage.jsx";
import PremiumShopHistory from "@pages/PremiumShop/PremiumShopHistoryPage.jsx";
import WalletChecker from "@pages/WalletChecker/WalletCheckerPage.jsx";
import Lotteries from "@pages/Lotteries/LotteriesPage.jsx";
import Privacy from "@pages/Privacy/PrivacyPage.jsx";
import FAQ from "@pages/FAQ/FAQPage.jsx";

const pages = [
    {
        path: '/',
        Component: Home,
    },
    {
        path: '/shop',
        Component: PremiumShop,
    },
    {
        path: '/migrate',
        Component: Migration,
    },
    {
        path:"/link",
        Component: Link
    },
    {
        path: '/cosmetics',
        Component: MintCosmetics,
    },
    {
        path: '/wallet-checker',
        Component: WalletChecker,
    },
    {
        path: '/lotteries',
        Component: Lotteries,
    },
    // Hidden temporarily
    // {
    //     path:"/factory",
    //     Component: PreSale
    // }
    {
        path: '/privacy',
        Component: Privacy,
    },
    {
        path: '/shop/history',
        Component: PremiumShopHistory,
    },
    {
        path: '/faq',
        Component: FAQ,
    },
    // Catch-all: redirect unknown routes to home
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
];

export default pages;
