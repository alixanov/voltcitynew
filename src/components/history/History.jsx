import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import VideoData from '../data/VideoData';

// ====================== ПРЕМИАЛЬНАЯ ЦВЕТОВАЯ ГАММА ======================
const colors = {
  background: {
    primary: '#0A1A1A',
    secondary: '#0F2424',
    tertiary: '#153030',
    card: '#1A2A2A',
    elevated: '#1E3030',
  },
  accent: {
    primary: '#2E7D64',
    secondary: '#1B5E4A',
    highlight: '#00B886',
    gold: '#C9A03D',
    copper: '#B87333',
  },
  text: {
    primary: '#E8EDE9',
    secondary: '#A8B8B0',
    tertiary: '#6B8A7A',
    highlight: '#FFFFFF',
    gold: '#D4AF37',
  },
  status: {
    available: '#00E676',
    charging: '#FFC107',
    occupied: '#FF5252',
    maintenance: '#78909C',
  },
  border: {
    subtle: 'rgba(46, 125, 100, 0.3)',
    primary: '#2E7D64',
    highlight: '#00B886',
    gold: 'rgba(201, 160, 61, 0.5)',
  }
};

// ====================== АНИМАЦИИ ======================
const pulseGreen = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(46, 125, 100, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(46, 125, 100, 0); }
  100% { box-shadow: 0 0 0 0 rgba(46, 125, 100, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ====================== СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ======================

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%);
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      ${colors.accent.primary} 0%, 
      ${colors.accent.gold} 50%, 
      ${colors.accent.primary} 100%);
    z-index: 100;
  }
`;

const Header = styled.div`
  padding: 20px 24px 12px 24px;
  border-bottom: 1px solid ${colors.border.subtle};
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    padding: 16px 16px 8px 16px;
  }
`;

const BrandSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  
  .main-title {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 2px;
    color: ${colors.text.primary};
    font-family: 'Playfair Display', 'Georgia', serif;
    
    span {
      color: ${colors.accent.gold};
      font-weight: 700;
    }
  }
  
  .subtitle {
    font-size: 11px;
    color: ${colors.text.tertiary};
    letter-spacing: 1px;
    margin-top: 4px;
    text-transform: uppercase;
  }
`;

const LegalBadge = styled.div`
  text-align: right;
  
  .cert-number {
    font-family: monospace;
    font-size: 12px;
    color: ${colors.accent.gold};
    background: rgba(201, 160, 61, 0.1);
    padding: 4px 12px;
    border-radius: 20px;
    display: inline-block;
  }
  
  .legal-text {
    font-size: 9px;
    color: ${colors.text.tertiary};
    margin-top: 6px;
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid ${colors.border.subtle};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .stat-label {
    font-size: 11px;
    color: ${colors.text.tertiary};
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .stat-value {
    font-size: 18px;
    font-weight: 600;
    color: ${colors.accent.highlight};
    font-family: monospace;
  }
  
  .stat-unit {
    font-size: 10px;
    color: ${colors.text.tertiary};
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ isMobile }) => (isMobile ? '16px' : '24px')};
  padding: ${({ isMobile }) => (isMobile ? '16px' : '24px')};
  max-width: 1600px;
  margin: 0 auto;
`;

const StationCard = styled.div`
  position: relative;
  background: ${colors.background.card};
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${colors.border.subtle};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    border-color: ${colors.accent.primary};
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(46, 125, 100, 0.2);
    
    .status-indicator {
      background: ${colors.status.available};
      animation: ${pulseGreen} 1.5s infinite;
    }
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(10, 26, 26, 0.9);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  
  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ status }) => colors.status[status] || colors.status.available};
  }
  
  .status-text {
    color: ${colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: ${colors.background.tertiary};
`;

const StationImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${StationCard}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 60%,
    rgba(10, 26, 26, 0.8) 100%
  );
`;

const InfoSection = styled.div`
  padding: 20px;
`;

const StationName = styled.h3`
  font-size: ${({ isMobile }) => (isMobile ? '16px' : '18px')};
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 8px;
  line-height: 1.4;
  font-family: 'Playfair Display', 'Georgia', serif;
  
  &::before {
    content: '⚡';
    font-size: 14px;
    color: ${colors.accent.gold};
    margin-right: 6px;
  }
`;

const Address = styled.div`
  font-size: 12px;
  color: ${colors.text.tertiary};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: '📍';
    font-size: 10px;
  }
`;

const LegalDetails = styled.div`
  background: rgba(46, 125, 100, 0.08);
  border-radius: 12px;
  padding: 12px;
  margin: 12px 0;
  border-left: 3px solid ${colors.accent.primary};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  margin-bottom: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .label {
    color: ${colors.text.tertiary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .value {
    color: ${colors.text.secondary};
    font-family: monospace;
    font-weight: 500;
  }
`;

const TechSpecs = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${colors.border.subtle};
`;

const TechItem = styled.div`
  flex: 1;
  text-align: center;
  
  .tech-value {
    font-size: 14px;
    font-weight: 600;
    color: ${colors.accent.highlight};
    font-family: monospace;
  }
  
  .tech-label {
    font-size: 9px;
    color: ${colors.text.tertiary};
    text-transform: uppercase;
    margin-top: 4px;
  }
`;

const ActionButton = styled.div`
  margin-top: 16px;
  padding: 10px 16px;
  background: transparent;
  border: 1px solid ${colors.accent.primary};
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: ${colors.accent.primary};
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  
  ${StationCard}:hover & {
    background: ${colors.accent.primary};
    color: ${colors.text.primary};
  }
`;

// ====================== СКЕЛЕТОН КОМПОНЕНТЫ ======================
const SkeletonImage = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: linear-gradient(90deg, #1A2A2A 25%, #243A3A 50%, #1A2A2A 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const SkeletonLine = styled.div`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '20px'};
  background: #1A2A2A;
  border-radius: ${({ radius }) => radius || '4px'};
  margin-bottom: ${({ margin }) => margin || '12px'};
`;

const SkeletonFlex = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const SkeletonBox = styled.div`
  flex: 1;
  height: 40px;
  background: #1A2A2A;
  border-radius: 8px;
`;

const SkeletonCardWrapper = styled.div`
  background: ${colors.background.card};
  border-radius: 16px;
  overflow: hidden;
`;

const SkeletonCard = () => (
  <SkeletonCardWrapper>
    <SkeletonImage />
    <div style={{ padding: '20px' }}>
      <SkeletonLine width="70%" height="20px" />
      <SkeletonLine width="50%" height="14px" />
      <SkeletonLine width="90%" height="60px" radius="8px" />
      <SkeletonFlex>
        <SkeletonBox />
        <SkeletonBox />
      </SkeletonFlex>
    </div>
  </SkeletonCardWrapper>
);

// ====================== ФУНКЦИИ ФОРМАТИРОВАНИЯ ======================
const formatLegalDate = (dateString) => {
  const date = new Date(dateString);
  const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} г.`;
};

const formatPower = (views) => {
  const num = parseInt(views) || 0;
  if (num >= 1000) return `${(num / 1000).toFixed(0)} кВт`;
  return `${num} кВт`;
};

// Функция для извлечения города из названия станции
const extractCityFromTitle = (title) => {
  const cities = ['Ташкент', 'Самарканд', 'Бухара', 'Фергана', 'Наманган', 'Андижан', 'Карши', 'Нукус', 'Ургенч', 'Термез'];
  for (const city of cities) {
    if (title.includes(city)) {
      return city;
    }
  }
  return 'Ташкент';
};

// Функция для генерации адреса на основе города
const generateAddress = (city) => {
  const streets = {
    'Ташкент': ['ул. Амира Темура', 'просп. Навои', 'ул. Шота Руставели', 'ул. Мустакиллик', 'ул. Фараби'],
    'Самарканд': ['ул. Регистан', 'ул. Ташкентская', 'ул. Афрасиаб', 'ул. Мирзо Улугбека', 'ул. Рудаки'],
    'Бухара': ['ул. Навои', 'ул. Бахауддина Накшбанда', 'ул. Ходжа Нуробод', 'ул. Саманидов', 'ул. Ибн Сино'],
    'Фергана': ['ул. Ферганская', 'просп. Ахмада Фергани', 'ул. Навои', 'ул. Маргиланская', 'ул. Кокандская'],
    'Наманган': ['ул. Амира Темура', 'ул. Наманганская', 'ул. Уйчи', 'ул. Чустская', 'ул. Туракурганская'],
    'Андижан': ['ул. Бабура', 'ул. Андижанская', 'ул. Навои', 'ул. Асака', 'ул. Шахрихан'],
    'Карши': ['ул. Навои', 'ул. Самаркандская', 'ул. Термезская', 'ул. Пахтакор', 'ул. Ширабад'],
    'Нукус': ['ул. Бердаха', 'ул. Нукусская', 'ул. Муса Ташмухамедова', 'ул. Ажинияза', 'ул. Туркменская'],
    'Ургенч': ['ул. Аль-Хорезми', 'ул. Ургенчская', 'ул. Хивинская', 'ул. Беруни', 'ул. Дружбы'],
    'Термез': ['ул. Термезская', 'ул. Навои', 'ул. Авиценны', 'ул. Шерабадская', 'ул. Сариасийская']
  };
  
  const cityStreets = streets[city] || streets['Ташкент'];
  const randomStreet = cityStreets[Math.floor(Math.random() * cityStreets.length)];
  const buildingNum = Math.floor(Math.random() * 100) + 1;
  
  return `г. ${city}, ${randomStreet}, д. ${buildingNum}`;
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
};

// ====================== ОСНОВНОЙ КОМПОНЕНТ ======================
const Home = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [stations, setStations] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const [stats, setStats] = useState({
    total: 0,
    totalPower: 0,
    active: 0
  });

  const fetchStations = (pageNum) => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);

    setTimeout(() => {
      const start = (pageNum - 1) * 12;
      const end = start + 12;
      const paginated = VideoData.slice(start, end);

      if (paginated.length > 0) {
        setStations(prev => [...prev, ...paginated]);
        
        const totalPower = paginated.reduce((sum, v) => sum + (parseInt(v.statistics.viewCount) || 0), 0);
        setStats(prev => ({
          total: prev.total + paginated.length,
          totalPower: prev.totalPower + totalPower,
          active: prev.active + paginated.length
        }));
      }
      
      if (paginated.length < 12 || end >= VideoData.length) {
        setHasMore(false);
      }
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchStations(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, hasMore]);

  // Статусы для карточек
  const statuses = ['available', 'charging', 'available', 'available', 'maintenance'];

  return (
    <PageContainer>
      <Header>
        <BrandSection>
          <Logo>
            <div className="main-title">
              ELECTRO<span>STATION</span>
            </div>
            <div className="subtitle">
              ОФИЦИАЛЬНЫЙ РЕЕСТР ЗАРЯДНЫХ СТАНЦИЙ
            </div>
          </Logo>
          <LegalBadge>
            <div className="cert-number">
              СВИДЕТЕЛЬСТВО № {new Date().getFullYear()}-{Math.floor(Math.random() * 1000)}
            </div>
            <div className="legal-text">
              Лицензия Минэнерго • Сертифицированное оборудование
            </div>
          </LegalBadge>
        </BrandSection>
        
        <StatsBar>
          <StatItem>
            <div className="stat-label">СТАНЦИЙ В РЕЕСТРЕ</div>
            <div className="stat-value">{stats.total || VideoData.length}</div>
          </StatItem>
          <StatItem>
            <div className="stat-label">ОБЩАЯ МОЩНОСТЬ</div>
            <div className="stat-value">{Math.floor(stats.totalPower / 1000) || 0}</div>
            <div className="stat-unit">МВт</div>
          </StatItem>
          <StatItem>
            <div className="stat-label">АКТИВНЫЕ</div>
            <div className="stat-value">{stats.active || VideoData.length}</div>
          </StatItem>
          <StatItem>
            <div className="stat-label">ГОД ОСНОВАНИЯ</div>
            <div className="stat-value">2024</div>
          </StatItem>
        </StatsBar>
      </Header>

      <VideoGrid isMobile={isMobile}>
        {stations.map((station, index) => {
          const city = extractCityFromTitle(station.snippet.title);
          const address = generateAddress(city);
          const randomStatus = statuses[index % statuses.length];
          
          return (
            <Link
              key={station.id}
              to={`/video/${station.id}`}
              style={{ textDecoration: 'none' }}
            >
              <StationCard>
                <StatusBadge status={randomStatus}>
                  <div className="status-indicator" />
                  <div className="status-text">
                    {randomStatus === 'available' && 'ГОТОВА К РАБОТЕ'}
                    {randomStatus === 'charging' && 'ИДЁТ ЗАРЯДКА'}
                    {randomStatus === 'maintenance' && 'ТЕХОБСЛУЖИВАНИЕ'}
                    {randomStatus !== 'available' && randomStatus !== 'charging' && randomStatus !== 'maintenance' && 'ГОТОВА К РАБОТЕ'}
                  </div>
                </StatusBadge>
                
                <ImageContainer>
                  <StationImage
                    src={station.snippet.thumbnails.medium.url}
                    alt={station.snippet.title}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1593948363156-e6e3b6b8b8b8?w=400&h=225&fit=crop';
                    }}
                  />
                  <ImageOverlay />
                </ImageContainer>
                
                <InfoSection>
                  <StationName isMobile={isMobile}>
                    {station.snippet.title}
                  </StationName>
                  
                  <Address>
                    {address}
                  </Address>
                  
                  <LegalDetails>
                    <DetailRow>
                      <span className="label">Регистрационный номер</span>
                      <span className="value">ES-{station.id.slice(0, 8)}</span>
                    </DetailRow>
                    <DetailRow>
                      <span className="label">Дата ввода в эксплуатацию</span>
                      <span className="value">{formatLegalDate(station.snippet.publishedAt)}</span>
                    </DetailRow>
                    <DetailRow>
                      <span className="label">Оператор</span>
                      <span className="value">{station.snippet.channelTitle}</span>
                    </DetailRow>
                  </LegalDetails>
                  
                  <TechSpecs>
                    <TechItem>
                      <div className="tech-value">{formatPower(station.statistics.viewCount)}</div>
                      <div className="tech-label">Макс. мощность</div>
                    </TechItem>
                    <TechItem>
                      <div className="tech-value">{Math.floor(Math.random() * 3 + 2)}</div>
                      <div className="tech-label">Кол-во портов</div>
                    </TechItem>
                    <TechItem>
                      <div className="tech-value">CCS/CHAdeMO</div>
                      <div className="tech-label">Тип разъёма</div>
                    </TechItem>
                  </TechSpecs>
                  
                  <ActionButton>
                    Подробная спецификация →
                  </ActionButton>
                </InfoSection>
              </StationCard>
            </Link>
          );
        })}

        {isLoading && hasMore && (
          Array(4).fill().map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
        )}
        
        <div ref={loaderRef} style={{ height: '20px' }} />
      </VideoGrid>
    </PageContainer>
  );
};

export default Home;