'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';

interface Restaurant {
  id: number;
  name: string;
  category: string;
  location: string;
  price: string;
  rating: number;
  waitTime: string;
  tags: string[];
  image: string;
  description: string;
}

interface FilterConfig {
  key: string;
  label: string;
  icon: string;
  count: number;
}

// Default icons for common categories
const categoryIcons: Record<string, string> = {
  '快餐': '🍔',
  '面食': '🍜',
  '米饭': '🍚',
  '火锅': '🍲',
  '轻食': '🥗',
  '日料': '🍣',
  '烧腊': '🦆',
  '炒菜': '🥘',
  '家常菜': '🍛',
  '小吃': '🥟',
  '冒菜': '🌶️',
  '私房菜': '👨‍🍳',
};

// Generate filter icon based on category name
function getFilterIcon(category: string): string {
  return categoryIcons[category] || '🍽️';
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        const restaurantsData = data.restaurants || [];
        setRestaurants(restaurantsData);
        
        // Auto-generate filters from categories
        const categoryCount: Record<string, number> = {};
        restaurantsData.forEach((r: Restaurant) => {
          categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
        });
        
        // Sort by count (descending) and create filters
        const sortedCategories = Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])
          .map(([category, count]) => ({
            key: category,
            label: category,
            icon: getFilterIcon(category),
            count,
          }));
        
        // Add "all" filter at the beginning
        const generatedFilters: FilterConfig[] = [
          { key: 'all', label: '全部', icon: '🍽️', count: restaurantsData.length },
          ...sortedCategories,
        ];
        
        setFilters(generatedFilters);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load data:', err);
        setLoading(false);
      });
  }, []);

  const filteredRestaurants = useMemo(() => {
    if (activeFilter === 'all') return restaurants;
    return restaurants.filter(r => r.category === activeFilter);
  }, [restaurants, activeFilter]);

  const startSpin = useCallback(() => {
    const pool = filteredRestaurants;
    if (isSpinning || pool.length === 0) return;
    
    setIsSpinning(true);
    setSelectedId(null);
    setShowResult(false);
    
    let duration = 4000;
    let interval = 80;
    let elapsed = 0;
    
    const blink = () => {
      const randomId = pool[Math.floor(Math.random() * pool.length)].id;
      setActiveId(randomId);
    };
    
    const fastInterval = setInterval(() => {
      blink();
      elapsed += interval;
      
      if (elapsed >= duration - 800) {
        clearInterval(fastInterval);
        const slowInterval = setInterval(() => {
          blink();
        }, 250);
        
        setTimeout(() => {
          clearInterval(slowInterval);
          const finalId = pool[Math.floor(Math.random() * pool.length)].id;
          setActiveId(finalId);
          setSelectedId(finalId);
          setIsSpinning(false);
          setShowResult(true);
        }, 800);
      }
    }, interval);
  }, [isSpinning, filteredRestaurants]);

  const selectedRestaurant = selectedId !== null 
    ? restaurants.find(r => r.id === selectedId) 
    : null;

  const renderStars = (rating: number) => {
    const safeRating = Math.max(0, rating);
    const fullStars = Math.floor(safeRating);
    const hasHalf = safeRating % 1 >= 0.5;
    return (
      <span style={{ color: '#ffb800' }}>
        {'★'.repeat(fullStars)}
        {hasHalf ? '½' : ''}
      </span>
    );
  };

  if (loading) {
    return (
      <main style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>🍽️</div>
        <p style={styles.loadingText}>正在加载美食...</p>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      {/* Decorative elements */}
      <div style={styles.decoration1}>🥘</div>
      <div style={styles.decoration2}>🍜</div>
      <div style={styles.decoration3}>🥟</div>
      
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>
          <span style={styles.titleIcon}>🍽️</span>
          今天吃什么？
        </h1>
        <p style={styles.subtitle}>让命运决定你的午餐</p>
      </header>

      {/* Links */}
      <div style={styles.linksContainer}>
        <a href="https://github.com/Spico197/eating-outside-lab" target="_blank" rel="noopener" style={styles.linkBtn}>
          <span>📝</span> 添加餐厅
        </a>
        <a href="https://aicarrier.feishu.cn/wiki/ItwHwWAJuiWZPSkAELIcauqGnrg" target="_blank" rel="noopener" style={styles.linkBtn}>
          <span>⭐</span> 评价
        </a>
        <a href="https://aicarrier.feishu.cn/wiki/ItwHwWAJuiWZPSkAELIcauqGnrg" target="_blank" rel="noopener" style={styles.linkBtn}>
          <span>👀</span> 看评价
        </a>
      </div>

      {/* Auto-generated Filters */}
      <div style={styles.filterContainer}>
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            style={{
              ...styles.filterBtn,
              backgroundColor: activeFilter === f.key ? '#ff6b35' : 'white',
              color: activeFilter === f.key ? 'white' : '#666',
              boxShadow: activeFilter === f.key ? '0 4px 15px rgba(255, 107, 53, 0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
            }}
            title={`${f.label} (${f.count}家)`}
          >
            <span>{f.icon}</span> 
            <span>{f.label}</span>
            <span style={{
              fontSize: '11px',
              opacity: 0.8,
              marginLeft: '2px',
            }}>({f.count})</span>
          </button>
        ))}
      </div>

      {/* Restaurant Cards Grid */}
      <div style={styles.cardsGrid}>
        {filteredRestaurants.map((r) => {
          const isActive = activeId === r.id;
          const isSelected = selectedId === r.id;
          
          return (
            <div
              key={r.id}
              style={{
                ...styles.card,
                transform: isSelected ? 'scale(1.05)' : isActive ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isSelected 
                  ? '0 20px 40px rgba(255, 107, 53, 0.4)' 
                  : isActive 
                    ? '0 0 30px rgba(255, 193, 7, 0.6)' 
                    : '0 4px 12px rgba(0,0,0,0.08)',
                borderColor: isSelected ? '#ff6b35' : isActive ? '#ffc107' : 'transparent',
                backgroundColor: isSelected ? '#fff8f5' : 'white',
              }}
            >
              <div style={styles.cardHeader}>
                <span style={styles.cardEmoji}>{r.image}</span>
                <span style={styles.cardCategory}>{r.category}</span>
              </div>
              <h3 style={styles.cardName}>{r.name}</h3>
              <div style={styles.cardRating}>
                {renderStars(r.rating)}
                <span style={styles.ratingNum}>{r.rating}</span>
              </div>
              <p style={styles.cardDesc}>{r.description}</p>
              <div style={styles.cardFooter}>
                <span style={styles.cardPrice}>{r.price}</span>
                <span style={styles.cardWait}>⏱️ {r.waitTime}</span>
              </div>
              <div style={styles.tagsContainer}>
                {r.tags.slice(0, 2).map(tag => (
                  <span key={tag} style={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Action Button */}
      <button
        onClick={startSpin}
        disabled={isSpinning || filteredRestaurants.length === 0}
        style={{
          ...styles.mainBtn,
          opacity: filteredRestaurants.length === 0 ? 0.5 : 1,
          cursor: isSpinning ? 'wait' : filteredRestaurants.length === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {isSpinning ? (
          <span style={styles.spinningText}>🎲 选择中...</span>
        ) : (
          <>
            <span style={styles.btnIcon}>🎲</span>
            <span>帮我选一个</span>
          </>
        )}
      </button>

      {/* Bottom Game Link */}
      <a
        href="https://platform.feedscription.com/"
        target="_blank"
        rel="noopener"
        style={styles.gameLink}
      >
        🎮 一个人吃饭有些无聊？不如来一局休闲小游戏
      </a>

      {/* Result Modal */}
      {showResult && selectedRestaurant && (
        <>
          <div style={styles.overlay} onClick={() => setShowResult(false)} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <span style={styles.modalIcon}>🎉</span>
              <h2 style={styles.modalTitle}>就是它了！</h2>
            </div>
            
            <div style={styles.modalContent}>
              <div style={styles.modalEmoji}>{selectedRestaurant.image}</div>
              <h3 style={styles.modalRestaurantName}>{selectedRestaurant.name}</h3>
              <p style={styles.modalCategory}>{selectedRestaurant.category}</p>
              
              <div style={styles.modalDetails}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>📍 位置</span>
                  <span>{selectedRestaurant.location}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>💰 价格</span>
                  <span>{selectedRestaurant.price}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>⭐ 评分</span>
                  <span>{renderStars(selectedRestaurant.rating)} {selectedRestaurant.rating}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>⏱️ 等待</span>
                  <span>{selectedRestaurant.waitTime}</span>
                </div>
              </div>

              <p style={styles.modalDesc}>{selectedRestaurant.description}</p>

              <div style={styles.modalTags}>
                {selectedRestaurant.tags.map(tag => (
                  <span key={tag} style={styles.modalTag}>{tag}</span>
                ))}
              </div>
            </div>

            <button onClick={() => setShowResult(false)} style={styles.modalCloseBtn}>
              太棒了，去吃！
            </button>
          </div>
        </>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 50%, #ff4e50 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  decoration1: {
    position: 'absolute',
    fontSize: '8rem',
    opacity: 0.08,
    top: '5%',
    right: '5%',
    transform: 'rotate(15deg)',
    pointerEvents: 'none',
  },
  decoration2: {
    position: 'absolute',
    fontSize: '6rem',
    opacity: 0.06,
    bottom: '15%',
    left: '3%',
    transform: 'rotate(-10deg)',
    pointerEvents: 'none',
  },
  decoration3: {
    position: 'absolute',
    fontSize: '5rem',
    opacity: 0.08,
    top: '40%',
    right: '8%',
    transform: 'rotate(25deg)',
    pointerEvents: 'none',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 50%, #ff4e50 100%)',
    color: 'white',
    fontSize: '1.2rem',
  },
  loadingSpinner: {
    fontSize: '3rem',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.9)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: '2.4rem',
    color: 'white',
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  titleIcon: {
    fontSize: '2.6rem',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    margin: 0,
    fontSize: '1rem',
    fontWeight: 400,
  },
  linksContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 1,
  },
  linkBtn: {
    color: 'rgba(255,255,255,0.95)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    padding: '8px 14px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
    transition: 'all 0.2s',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    padding: '0 10px',
    position: 'relative',
    zIndex: 1,
  },
  filterBtn: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: 'none',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '12px',
    maxWidth: '900px',
    margin: '0 auto 24px',
    position: 'relative',
    zIndex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '16px',
    transition: 'all 0.2s ease',
    border: '2px solid transparent',
    cursor: 'default',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  cardEmoji: {
    fontSize: '2rem',
  },
  cardCategory: {
    fontSize: '11px',
    color: '#888',
    backgroundColor: '#f5f5f5',
    padding: '4px 8px',
    borderRadius: '10px',
  },
  cardName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 6px 0',
  },
  cardRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px',
  },
  ratingNum: {
    fontSize: '13px',
    color: '#888',
  },
  cardDesc: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 10px 0',
    lineHeight: 1.4,
    height: '34px',
    overflow: 'hidden',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  cardPrice: {
    fontSize: '13px',
    color: '#ff6b35',
    fontWeight: 'bold',
  },
  cardWait: {
    fontSize: '11px',
    color: '#999',
  },
  tagsContainer: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: '10px',
    color: '#666',
    backgroundColor: '#f0f0f0',
    padding: '3px 8px',
    borderRadius: '8px',
  },
  mainBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    margin: '0 auto 20px',
    padding: '18px 48px',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#ff6b35',
    background: 'white',
    border: 'none',
    borderRadius: '50px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 1,
  },
  btnIcon: {
    fontSize: '1.5rem',
  },
  spinningText: {
    animation: 'pulse 0.5s ease-in-out infinite',
  },
  gameLink: {
    display: 'block',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '12px 24px',
    margin: '0 auto',
    maxWidth: '400px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: '25px',
    border: '1px solid rgba(255,255,255,0.25)',
    transition: 'all 0.2s',
    position: 'relative',
    zIndex: 1,
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 998,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '32px',
    width: '90%',
    maxWidth: '400px',
    zIndex: 999,
    boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
    animation: 'modalPop 0.4s ease-out',
  },
  modalHeader: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  modalIcon: {
    fontSize: '3.5rem',
    display: 'block',
    marginBottom: '8px',
  },
  modalTitle: {
    fontSize: '1.5rem',
    color: '#333',
    margin: 0,
  },
  modalContent: {
    textAlign: 'center',
  },
  modalEmoji: {
    fontSize: '4rem',
    marginBottom: '8px',
  },
  modalRestaurantName: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#ff6b35',
    margin: '0 0 4px 0',
  },
  modalCategory: {
    color: '#888',
    marginBottom: '16px',
  },
  modalDetails: {
    backgroundColor: '#fff8f5',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #ffe8e0',
  },
  detailLabel: {
    color: '#666',
  },
  modalDesc: {
    color: '#666',
    fontSize: '14px',
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  modalTags: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  modalTag: {
    backgroundColor: '#ffe8e0',
    color: '#ff6b35',
    padding: '6px 14px',
    borderRadius: '15px',
    fontSize: '13px',
    fontWeight: 500,
  },
  modalCloseBtn: {
    width: '100%',
    padding: '16px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #ff6b35 0%, #ff4e50 100%)',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
