import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { content } from '../data/content';
import styles from './SeeMessages.module.css';

import { pageVariants } from '../utils/animation';

const SeeMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [positions, setPositions] = useState({});
    const [connections, setConnections] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);

    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);

            // Generate positions and connections
            const newPositions = {};
            const newConnections = [];

            // Helper to check collision
            const checkCollision = (x, y, existing) => {
                for (const id in existing) {
                    const ex = existing[id];
                    const dx = x - ex.x;
                    const dy = y - ex.y;
                    if (Math.sqrt(dx * dx + dy * dy) < 10) return true; // Min distance 10%
                }
                return false;
            };

            msgs.forEach(msg => {
                if (!newPositions[msg.id]) {
                    let x, y, attempts = 0;
                    do {
                        x = 5 + Math.random() * 90;
                        y = 10 + Math.random() * 80;
                        attempts++;
                    } while (checkCollision(x, y, newPositions) && attempts < 50);

                    newPositions[msg.id] = {
                        x, y,
                        delay: Math.random() * 2,
                        scale: 0.8 + Math.random() * 0.4
                    };
                }
            });

            // Calculate connections (O(N^2) but N is small)
            const ids = Object.keys(newPositions);
            const connectionMap = new Set(); // Track connected nodes

            for (let i = 0; i < ids.length; i++) {
                for (let j = i + 1; j < ids.length; j++) {
                    const p1 = newPositions[ids[i]];
                    const p2 = newPositions[ids[j]];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 25) { // Connection threshold
                        newConnections.push({
                            from: ids[i],
                            to: ids[j],
                            id: `${ids[i]}-${ids[j]}`
                        });
                        connectionMap.add(ids[i]);
                        connectionMap.add(ids[j]);
                    }
                }
            }

            // Ensure every star has at least one connection
            ids.forEach(id => {
                if (!connectionMap.has(id)) {
                    // Find nearest neighbor
                    let minDist = Infinity;
                    let nearestId = null;
                    const p1 = newPositions[id];

                    ids.forEach(otherId => {
                        if (id === otherId) return;
                        const p2 = newPositions[otherId];
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < minDist) {
                            minDist = dist;
                            nearestId = otherId;
                        }
                    });

                    if (nearestId) {
                        newConnections.push({
                            from: id,
                            to: nearestId,
                            id: `${id}-${nearestId}`
                        });
                        connectionMap.add(id);
                        connectionMap.add(nearestId);
                    }
                }
            });

            setPositions(newPositions);
            setConnections(newConnections);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const [autoHighlightedId, setAutoHighlightedId] = useState(null);

    // Ambient Animation Loop
    useEffect(() => {
        if (loading || messages.length === 0) return;

        const interval = setInterval(() => {
            // Only auto-highlight if user isn't hovering
            if (!hoveredId) {
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                setAutoHighlightedId(randomMsg.id);

                // Clear highlight after a short duration
                setTimeout(() => {
                    setAutoHighlightedId(null);
                }, 3000);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [loading, messages, hoveredId]);

    const activeId = hoveredId || autoHighlightedId;

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    const truncateText = (text, maxLength = 10) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const selectedMessage = messages.find(m => m.id === selectedId);

    return (
        <motion.section
            className={styles.section}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            <Link to="/" className={styles.backButton}>
                <ArrowLeft size={20} /> {content.seeMessages.back}
            </Link>

            {loading ? (
                <div className={styles.loading}>{content.seeMessages.loading}</div>
            ) : messages.length === 0 ? (
                <div className={styles.empty}>{content.seeMessages.empty}</div>
            ) : (
                <div className={styles.starMap}>
                    {/* Constellation Lines Layer */}
                    <svg className={styles.constellationSvg}>
                        {connections.map(conn => {
                            const p1 = positions[conn.from];
                            const p2 = positions[conn.to];
                            const isConnected = activeId === conn.from || activeId === conn.to;

                            return (
                                <line
                                    key={conn.id}
                                    x1={`${p1.x}%`}
                                    y1={`${p1.y}%`}
                                    x2={`${p2.x}%`}
                                    y2={`${p2.y}%`}
                                    className={`${styles.constellationLine} ${isConnected ? styles.activeLine : ''}`}
                                />
                            );
                        })}
                    </svg>

                    {/* Stars Layer */}
                    {messages.map((msg) => {
                        const pos = positions[msg.id] || { x: 50, y: 50, delay: 0, scale: 1 };
                        const isActive = activeId === msg.id;

                        return (
                            <motion.div
                                key={msg.id}
                                className={styles.starWrapper}
                                style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
                                onClick={() => setSelectedId(msg.id)}
                                onMouseEnter={() => setHoveredId(msg.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    x: "-50%",
                                    y: "-50%"
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    className={styles.star}
                                    style={{ '--star-color': msg.color || '#fff' }}
                                    animate={{
                                        opacity: [0.6, 1, 0.6],
                                        scale: isActive ? 1.5 : [pos.scale, pos.scale * 1.2, pos.scale]
                                    }}
                                    transition={{
                                        opacity: { duration: 3 + Math.random() * 2, repeat: Infinity },
                                        scale: { duration: isActive ? 0.3 : 3 + Math.random() * 2, repeat: isActive ? 0 : Infinity },
                                        delay: pos.delay
                                    }}
                                />
                                <div
                                    className={styles.starLabel}
                                    style={{
                                        opacity: isActive ? 1 : undefined,
                                        transform: isActive ? 'translateY(0)' : undefined,
                                        color: isActive ? '#fff' : undefined,
                                        textShadow: isActive ? '0 0 10px rgba(255, 255, 255, 0.5)' : undefined,
                                        zIndex: isActive ? 40 : undefined
                                    }}
                                >
                                    {truncateText(msg.name)}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <AnimatePresence>
                {selectedId && selectedMessage && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedId(null)}
                    >
                        <motion.div
                            className={styles.modalCard}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            style={{ '--glow-color': selectedMessage.color || '#3b82f6' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className={styles.closeButton} onClick={() => setSelectedId(null)}>
                                <ArrowLeft size={24} />
                            </button>

                            <div className={styles.modalContent}>
                                {selectedMessage.message && (
                                    <p
                                        className={styles.messageText}
                                        data-lenis-prevent
                                    >
                                        {selectedMessage.message}
                                    </p>
                                )}
                                <div className={styles.modalFooter}>
                                    <span className={styles.modalName}>{selectedMessage.name}</span>
                                    <span className={styles.modalDate}>{formatDate(selectedMessage.timestamp)}</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
};

export default SeeMessages;
