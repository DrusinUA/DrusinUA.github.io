import React, { useState, useMemo } from 'react';
import styles from './FAQPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';

// FAQ Categories
const FAQ_CATEGORIES = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'account', label: 'Account & Linking', icon: '🔗' },
    { id: 'payments', label: 'Payments & Gold', icon: '💰' },
    { id: 'wallet', label: 'Wallet & Web3', icon: '👛' },
    { id: 'gameplay', label: 'Gameplay', icon: '🎮' },
];

// FAQ Data
const FAQ_DATA = [
    {
        id: 1,
        category: 'account',
        question: 'How do I link my in-game account?',
        answer: `To link your in-game account, follow these steps:

1. Go to the **Link** page on our website
2. Click "Login" and enter your in-game credentials (email and password)
3. Connect your Web3 wallet (MetaMask, Ronin, etc.)
4. Sign the verification message to confirm ownership
5. Your account is now linked!

Once linked, you can purchase Gold and other items directly to your in-game inventory.`,
        tags: ['link', 'account', 'connect', 'login'],
    },
    {
        id: 2,
        category: 'account',
        question: 'Which email should I use for linking?',
        answer: `Use the **same email address** that you registered with in the game.

**Important:**
- This is your in-game account email, not your wallet email
- If you forgot which email you used, check your game settings
- The email is case-insensitive (test@email.com = TEST@EMAIL.COM)

If you're having trouble, try the "Forgot Password" option on the login screen.`,
        tags: ['email', 'account', 'login', 'register'],
    },
    {
        id: 3,
        category: 'account',
        question: 'Can I link multiple wallets to one account?',
        answer: `Yes! You can link up to **10 wallets** to a single in-game account.

This is useful if you:
- Use different wallets for different networks
- Want to keep your gaming wallet separate from your main wallet
- Need to switch between wallets

To add another wallet, simply connect it while logged into your account on the Link page.`,
        tags: ['wallet', 'multiple', 'link', 'connect'],
    },
    {
        id: 4,
        category: 'account',
        question: 'How do I unlink a wallet from my account?',
        answer: `To unlink a wallet:

1. Go to the **Link** page
2. Login to your account
3. Find the wallet you want to remove in the list
4. Click the "Unlink" button next to it
5. Confirm the action

**Note:** You cannot unlink your primary wallet. If you need to change it, first set another wallet as primary.`,
        tags: ['unlink', 'remove', 'wallet', 'disconnect'],
    },
    {
        id: 5,
        category: 'payments',
        question: 'How do I buy Gold?',
        answer: `Buying Gold is simple:

1. Go to the **Shop** page
2. Make sure your wallet is connected and account is linked
3. Enter the amount of USD you want to spend
4. Choose your payment method:
   - **Coinbase** - Pay with crypto on Ethereum, Base, or Polygon
   - **Ronin** - Pay with USDC on Ronin Network
5. Complete the payment
6. Gold will appear in your inventory within 5 minutes

**Rate:** $1 = 500 Gold`,
        tags: ['gold', 'buy', 'purchase', 'shop', 'payment'],
    },
    {
        id: 6,
        category: 'payments',
        question: 'My payment is stuck on "Pending". What do I do?',
        answer: `If your payment is pending:

**For Coinbase payments:**
- Check your **Payment History** page
- Click "Pay Now" to continue the payment
- The invoice expires after 1 hour

**For Ronin payments:**
- Check if the transaction was confirmed on-chain
- Wait a few minutes for processing

If it's been more than 30 minutes, contact our support team with your transaction ID.`,
        tags: ['pending', 'stuck', 'payment', 'transaction', 'help'],
    },
    {
        id: 7,
        category: 'payments',
        question: 'What payment methods are supported?',
        answer: `We support the following payment methods:

**Coinbase Commerce:**
- Bitcoin (BTC)
- Ethereum (ETH)
- USDC on Ethereum, Base, Polygon
- Other major cryptocurrencies

**Ronin Network:**
- USDC on Ronin

**Coming soon:**
- Credit/Debit cards via Stripe
- More networks

All crypto payments have minimal fees compared to traditional payment methods.`,
        tags: ['payment', 'methods', 'crypto', 'bitcoin', 'ethereum', 'usdc'],
    },
    {
        id: 8,
        category: 'payments',
        question: 'How long does it take to receive Gold?',
        answer: `Gold delivery times:

- **Coinbase payments:** 1-5 minutes after payment confirmation
- **Ronin payments:** 1-2 minutes after transaction confirmation

To claim your Gold in-game:
1. Press "Load Purchase" in the Premium Features tab
2. Or simply re-log into the game

If you don't see your Gold after 10 minutes, contact support.`,
        tags: ['gold', 'delivery', 'time', 'receive', 'claim'],
    },
    {
        id: 9,
        category: 'wallet',
        question: 'Which wallets are supported?',
        answer: `We support a wide range of wallets:

**Recommended:**
- MetaMask
- Ronin Wallet
- Coinbase Wallet
- WalletConnect (200+ wallets)

**Mobile:**
- Trust Wallet
- Rainbow
- And many more via WalletConnect

Make sure your wallet is on the correct network (Ethereum, Ronin, etc.) for your transaction.`,
        tags: ['wallet', 'metamask', 'ronin', 'coinbase', 'support'],
    },
    {
        id: 10,
        category: 'wallet',
        question: 'What is the "Sign Message" step?',
        answer: `The "Sign Message" step is a security verification that proves you own the wallet.

**Important:**
- This does NOT cost any gas fees
- It does NOT give us access to your funds
- It's similar to logging in with a password

The signature contains a unique code that verifies your wallet ownership. This is standard practice in Web3 applications.`,
        tags: ['sign', 'message', 'signature', 'verify', 'security'],
    },
    {
        id: 11,
        category: 'wallet',
        question: 'How do I get USDC on Ronin Network?',
        answer: `To get USDC on Ronin:

**Option 1: Swap on Katana DEX**
1. Visit [Katana DEX](https://app.roninchain.com/swap)
2. Connect your Ronin Wallet
3. Swap RON → USDC

**Option 2: Bridge from Ethereum**
1. Use the [Ronin Bridge](https://app.roninchain.com/bridge)
2. Bridge USDC from Ethereum to Ronin

**USDC Contract on Ronin:**
\`0x0B7007c13325C48911F73A2daD5FA5dCBf808aDc\``,
        tags: ['usdc', 'ronin', 'swap', 'bridge', 'katana'],
    },
    {
        id: 12,
        category: 'gameplay',
        question: 'What can I spend Gold on in-game?',
        answer: `Gold can be used for many in-game activities:

- **Auction House** - Buy items from other players
- **Gold Shop** - Purchase exclusive items
- **Fishing** - Buy bait and fishing gear
- **Duels** - Wager Gold in PvP battles
- **Crafting** - Pay for crafting materials
- **Trading** - Direct player-to-player trades

Gold is the main currency in the game economy!`,
        tags: ['gold', 'spend', 'auction', 'shop', 'game'],
    },
    {
        id: 13,
        category: 'gameplay',
        question: 'Is my purchase refundable?',
        answer: `**Gold purchases are non-refundable** once the Gold has been delivered to your account.

However, if you experience issues:
- Payment not received after 30 minutes
- Wrong amount of Gold received
- Technical errors during purchase

Please contact our support team immediately with your transaction details.`,
        tags: ['refund', 'cancel', 'return', 'purchase'],
    },
    {
        id: 14,
        category: 'account',
        question: 'I forgot my password. How do I reset it?',
        answer: `To reset your password:

1. Go to the **Link** page
2. Click "Login"
3. Click "Forgot Password"
4. Enter your registered email address
5. Check your email for the reset link
6. Create a new password

**Note:** If you don't receive the email, check your spam folder or try again after a few minutes.`,
        tags: ['password', 'forgot', 'reset', 'recover', 'login'],
    },
];

// Search icon
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

// Chevron icon
const ChevronIcon = ({ isOpen }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
    >
        <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// FAQ Item Component
const FAQItem = ({ item, isOpen, onToggle }) => {
    return (
        <div className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}>
            <button className={styles.faqQuestion} onClick={onToggle}>
                <span className={styles.questionText}>{item.question}</span>
                <ChevronIcon isOpen={isOpen} />
            </button>
            <div className={styles.faqAnswerWrapper}>
                <div className={styles.faqAnswer}>
                    {item.answer.split('\n').map((line, i) => (
                        <p key={i} dangerouslySetInnerHTML={{
                            __html: line
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/`(.*?)`/g, '<code>$1</code>')
                                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openItems, setOpenItems] = useState(new Set());

    // Filter FAQ items based on search and category
    const filteredFAQ = useMemo(() => {
        let items = FAQ_DATA;

        // Filter by category
        if (activeCategory !== 'all') {
            items = items.filter(item => item.category === activeCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.question.toLowerCase().includes(query) ||
                item.answer.toLowerCase().includes(query) ||
                item.tags.some(tag => tag.includes(query))
            );
        }

        return items;
    }, [searchQuery, activeCategory]);

    const toggleItem = (id) => {
        setOpenItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        // Open items that match search
        if (e.target.value.trim()) {
            const matchingIds = filteredFAQ.map(item => item.id);
            setOpenItems(new Set(matchingIds.slice(0, 3))); // Open first 3 matches
        }
    };

    return (
        <div className={styles.faqPage}>
            <div className={styles.castleBgWrapper}>
                <img src={castleBg} alt="" className={styles.castleBackground} />
            </div>

            <section className={styles.mainContent}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Help Center</h1>
                    <p className={styles.subtitle}>Find answers to frequently asked questions</p>
                </div>

                {/* Search Bar */}
                <div className={styles.searchContainer}>
                    <div className={styles.searchWrapper}>
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className={styles.searchInput}
                        />
                        {searchQuery && (
                            <button
                                className={styles.clearButton}
                                onClick={() => setSearchQuery('')}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className={styles.searchResults}>
                            Found {filteredFAQ.length} result{filteredFAQ.length !== 1 ? 's' : ''} for "{searchQuery}"
                        </p>
                    )}
                </div>

                {/* Categories */}
                <div className={styles.categories}>
                    {FAQ_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`${styles.categoryButton} ${activeCategory === cat.id ? styles.active : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <span className={styles.categoryIcon}>{cat.icon}</span>
                            <span className={styles.categoryLabel}>{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* FAQ List */}
                <div className={styles.faqList}>
                    {filteredFAQ.length === 0 ? (
                        <div className={styles.noResults}>
                            <span className={styles.noResultsIcon}>🔍</span>
                            <p>No results found</p>
                            <span className={styles.noResultsHint}>Try different keywords or browse categories</span>
                        </div>
                    ) : (
                        filteredFAQ.map(item => (
                            <FAQItem
                                key={item.id}
                                item={item}
                                isOpen={openItems.has(item.id)}
                                onToggle={() => toggleItem(item.id)}
                            />
                        ))
                    )}
                </div>

                {/* Contact Support */}
                <div className={styles.contactSection}>
                    <p className={styles.contactText}>Still have questions?</p>
                    <a href="#" className={styles.contactButton}>
                        Contact Support
                    </a>
                </div>
            </section>

            <img src={wavesBottom} alt="" className={styles.wavesBottom} />
        </div>
    );
}

export default FAQPage;
