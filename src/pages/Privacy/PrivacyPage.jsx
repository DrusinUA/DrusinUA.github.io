import React from 'react';
import styles from './PrivacyPage.module.scss';
import castleBg from '@assets/images/castleBg.png';
import wavesBottom from '@assets/images/wavesBottom.png';

function PrivacyPage() {
    return (
        <div className={styles.privacyPage}>
            <div className={styles.castleBgWrapper}>
                <img src={castleBg} alt="" className={styles.castleBackground} />
            </div>

            <section className={styles.mainContent}>
                <header className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Privacy Policy for Calamity</h1>
                    <p className={styles.subtitle}>Last updated: <time dateTime="2025-10-01">October 2025</time></p>
                    <a href="mailto:support@calamity.online" className={styles.contactButton}>
                        Contact Support
                    </a>
                </header>

                <nav className={styles.tableOfContents}>
                    <h2 className={styles.tocTitle}>Contents</h2>
                    <ol className={styles.tocList}>
                        <li><a href="#what-we-collect">What Information We Collect</a></li>
                        <li><a href="#how-we-use">How We Use the Information</a></li>
                        <li><a href="#retention">Data Retention</a></li>
                        <li><a href="#deletion">Account Deletion</a></li>
                        <li><a href="#security">Security</a></li>
                        <li><a href="#rights">Your Rights</a></li>
                        <li><a href="#children">Children's Privacy</a></li>
                        <li><a href="#third-parties">Links and Third-Party Services</a></li>
                        <li><a href="#updates">Updates to This Policy</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                    </ol>
                </nav>

                <article className={styles.article}>
                    <p className={styles.intro}>
                        Calamity ("we", "us", or "our") is a multiplayer action RPG developed and operated by
                        <strong> Something Is Cooking Corp</strong>. We value your privacy and are committed to protecting your
                        personal information. This Privacy Policy explains what information we collect, how we use it, and your rights
                        related to that information.
                    </p>

                    <section id="what-we-collect" className={styles.section}>
                        <h2>1. What Information We Collect</h2>
                        <p>We collect only the minimum data necessary to operate and improve the game and our services.</p>

                        <h3>Account Information</h3>
                        <ul>
                            <li>Email address and encrypted password (used for login and authentication).</li>
                            <li>Optional blockchain wallet address (if linked manually by the user).</li>
                        </ul>

                        <h3>Gameplay Data</h3>
                        <ul>
                            <li>Character progress, items, achievements, and in-game actions (to store progress and balance gameplay).</li>
                        </ul>

                        <h3>Technical and Analytics Data</h3>
                        <ul>
                            <li>Device and platform type, app version, IP address, and crash diagnostics.</li>
                            <li>
                                Aggregated gameplay events (e.g., dungeon completions, deaths, etc.) collected via analytics tools such as
                                Unity Analytics or similar services.
                            </li>
                        </ul>

                        <div className={styles.calloutWarning}>
                            <p>
                                <strong>Important:</strong> We do not use analytics to collect personally identifying information, and we do not attempt to identify you from this data.
                                For details about Unity's data practices, see{" "}
                                <a href="https://unity.com/legal/privacy-policy" target="_blank" rel="noreferrer">
                                    Unity's Privacy Policy
                                </a>.
                            </p>
                        </div>
                    </section>

                    <section id="how-we-use" className={styles.section}>
                        <h2>2. How We Use the Information</h2>
                        <p>We use your data to:</p>
                        <ul>
                            <li>Create and maintain your Calamity account.</li>
                            <li>Save your progress and gameplay preferences.</li>
                            <li>Detect and fix bugs or crashes.</li>
                            <li>Balance the in-game economy and progression systems.</li>
                            <li>Improve game design, user experience, and technical performance.</li>
                            <li>Communicate important updates or service information.</li>
                        </ul>
                        <div className={styles.calloutSuccess}>
                            <p>
                                <strong>Your data is safe:</strong> We <strong>do not sell or rent</strong> your data to third parties. We only share data with service providers that
                                process it on our behalf (e.g., hosting, analytics) or when required by law.
                            </p>
                        </div>
                    </section>

                    <section id="retention" className={styles.section}>
                        <h2>3. Data Retention</h2>
                        <p>
                            We retain your account and gameplay data while your account is active. Analytics and technical data are kept only as long
                            as necessary for the purposes described above and according to our service providers' standard retention policies.
                            If you delete your account, we remove or anonymize all personal data within <strong>30 days</strong>.
                        </p>
                    </section>

                    <section id="deletion" className={styles.section}>
                        <h2>4. Account Deletion</h2>
                        <p>
                            You can request deletion of your account at any time by emailing{" "}
                            <a href="mailto:support@calamity.online">support@calamity.online</a>.
                            Once processed, your email, account information, and all associated gameplay data will be permanently deleted.
                        </p>
                    </section>

                    <section id="security" className={styles.section}>
                        <h2>5. Security</h2>
                        <p>
                            We use reasonable administrative, technical, and organizational measures to protect your information from unauthorized
                            access, loss, misuse, or alteration.
                        </p>
                    </section>

                    <section id="rights" className={styles.section}>
                        <h2>6. Your Rights</h2>
                        <p>
                            Depending on your location (for example, the EEA/UK under GDPR or California under CCPA/CPRA), you may have the right to:
                        </p>
                        <ul>
                            <li>Access, correct, or delete your data.</li>
                            <li>Restrict or object to certain processing.</li>
                            <li>Withdraw consent for optional data collection (like analytics).</li>
                        </ul>
                        <p>
                            To exercise these rights, contact us at{" "}
                            <a href="mailto:support@calamity.online">support@calamity.online</a>.
                        </p>
                    </section>

                    <section id="children" className={styles.section}>
                        <h2>7. Children's Privacy</h2>
                        <p>
                            Calamity is not directed toward children under the age of 13. We do not knowingly collect personal data from minors.
                            If we learn that a minor has provided us with personal information, we will promptly delete it.
                        </p>
                    </section>

                    <section id="third-parties" className={styles.section}>
                        <h2>8. Links and Third-Party Services</h2>
                        <p>
                            Our website and game may include links to third-party sites or integrations with services like wallet providers.
                            These services are governed by their own privacy policies, and we are not responsible for their content or practices.
                        </p>
                    </section>

                    <section id="updates" className={styles.section}>
                        <h2>9. Updates to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. If we make material changes, we'll update the "Last Updated" date
                            above and post the new version on our website.
                        </p>
                    </section>

                    <section id="contact" className={styles.section}>
                        <h2>10. Contact Us</h2>
                        <p>
                            If you have any questions, concerns, or data requests, please reach out to us:{" "}
                            <a href="mailto:support@calamity.online">support@calamity.online</a>.
                        </p>
                    </section>
                </article>

                <footer className={styles.pageFooter}>
                    This policy is provided for transparency and does not constitute legal advice.
                </footer>
            </section>

            <img src={wavesBottom} alt="" className={styles.wavesBottom} />
        </div>
    );
}

export default PrivacyPage;
