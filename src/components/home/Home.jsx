import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import VideoDataRaw from '../data/VideoData';

// ====================== ОБРАБОТКА ИМПОРТА ======================
const VideoData = Array.isArray(VideoDataRaw) ? VideoDataRaw : (VideoDataRaw.default || []);

// ====================== ЦВЕТА ======================
const colors = {
  background: {
    primary: '#0A1A1A',
    secondary: '#0F2424',
    card: '#1A2A2A',
    tertiary: '#153030',
  },
  accent: {
    primary: '#2E7D64',
    highlight: '#00B886',
    gold: '#C9A03D',
  },
  text: {
    primary: '#E8EDE9',
    secondary: '#A8B8B0',
    tertiary: '#6B8A7A',
  },
  status: {
    free: '#00E676',
    busy: '#FF5252',
    partial: '#FFC107',
  },
  border: {
    subtle: 'rgba(46, 125, 100, 0.3)',
    primary: '#2E7D64',
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

// ====================== СТИЛИ ======================
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%);
  position: relative;
  &::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${colors.accent.primary} 0%, ${colors.accent.gold} 50%, ${colors.accent.primary} 100%);
    z-index: 100;
  }
`;

const Header = styled.div`
  padding: 20px 24px 12px;
  border-bottom: 1px solid ${colors.border.subtle};
  margin-bottom: 8px;
  @media (max-width: 768px) { padding: 16px 16px 8px; }
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
  .main-title {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 2px;
    color: ${colors.text.primary};
    font-family: 'Georgia', serif;
    span { color: ${colors.accent.gold}; font-weight: 700; }
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
  .stat-label { font-size: 11px; color: ${colors.text.tertiary}; text-transform: uppercase; letter-spacing: 1px; }
  .stat-value { font-size: 18px; font-weight: 600; font-family: monospace; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
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
    box-shadow: 0 20px 40px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(46,125,100,0.2);
    .port-dot { animation: ${pulseGreen} 1.5s infinite; }
  }
`;

const PortBadge = styled.div`
  position: absolute;
  top: 12px; right: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(10, 26, 26, 0.92);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  font-family: monospace;
`;

const PortDot = styled.span`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
  display: inline-block;
`;

const PortText = styled.span`
  color: ${({ color }) => color};
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: ${colors.background.tertiary};
`;

const StationImage = styled.img`
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  ${StationCard}:hover & { transform: scale(1.05); }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(10,26,26,0.9) 100%);
`;

const CoordLabel = styled.div`
  position: absolute;
  bottom: 10px; left: 12px;
  font-size: 11px;
  font-family: monospace;
  color: ${colors.accent.highlight};
  background: rgba(0,0,0,0.65);
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.5px;
`;

const InfoSection = styled.div`
  padding: 16px 20px 20px;
`;

const AddressTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.primary};
  line-height: 1.4;
  margin-bottom: 5px;
`;

const OperatorRow = styled.div`
  font-size: 11px;
  color: ${colors.text.tertiary};
  margin-bottom: 12px;
  span { color: ${colors.accent.highlight}; }
`;

const Divider = styled.div`
  height: 1px;
  background: ${colors.border.subtle};
  margin: 12px 0;
`;

const TechRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
`;

const TechItem = styled.div`
  flex: 1;
  text-align: center;
  background: rgba(46,125,100,0.06);
  border-radius: 10px;
  padding: 8px 4px;
  .tech-value {
    font-size: 13px;
    font-weight: 600;
    color: ${colors.accent.highlight};
    font-family: monospace;
    word-break: break-word;
  }
  .tech-label {
    font-size: 9px;
    color: ${colors.text.tertiary};
    text-transform: uppercase;
    margin-top: 3px;
  }
`;

const PortsVisual = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
`;

const PortsLabel = styled.div`
  font-size: 10px;
  color: ${colors.text.tertiary};
  text-transform: uppercase;
  min-width: 44px;
`;

const PortCircles = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
`;

const PortCircle = styled.div`
  width: 15px; height: 15px;
  border-radius: 50%;
  border: 2px solid ${({ $free }) => $free ? colors.status.free : colors.status.busy};
  background: ${({ $free }) => $free ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.12)'};
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 5px; height: 5px;
    border-radius: 50%;
    background: ${({ $free }) => $free ? colors.status.free : colors.status.busy};
  }
`;

const PortsCount = styled.div`
  font-size: 11px;
  font-family: monospace;
  .free { color: ${colors.status.free}; }
  .busy { color: ${colors.status.busy}; }
`;

const ActionButton = styled.div`
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

// ====================== СКЕЛЕТОН ======================
const SkeletonShimmer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: linear-gradient(90deg, #1A2A2A 25%, #243A3A 50%, #1A2A2A 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const SkeletonLine = styled.div`
  width: ${({ w }) => w || '100%'};
  height: ${({ h }) => h || '16px'};
  background: #1A2A2A;
  border-radius: 4px;
  margin-bottom: ${({ mb }) => mb || '10px'};
`;

const SkeletonCard = () => (
  <div style={{ background: colors.background.card, borderRadius: 16, overflow: 'hidden' }}>
    <SkeletonShimmer />
    <div style={{ padding: 20 }}>
      <SkeletonLine w="75%" h="18px" />
      <SkeletonLine w="45%" h="12px" />
      <SkeletonLine w="100%" h="36px" mb="0" />
    </div>
  </div>
);

// ====================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ======================
const getPortStatus = (station) => {
  const free = station.freePorts || 0;
  const total = station.totalPorts || 0;
  if (free === 0) return { color: colors.status.busy, label: 'ВСЕ ЗАНЯТЫ' };
  if (free === total) return { color: colors.status.free, label: 'ВСЕ СВОБОДНЫ' };
  return { color: colors.status.partial, label: `${free} своб. из ${total}` };
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

// ====================== ГЛАВНЫЙ КОМПОНЕНТ ======================
const Home = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [stations, setStations] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const [stats, setStats] = useState({ total: 0, freePorts: 0, busyPorts: 0 });

  const fetchStations = (pageNum) => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      const start = (pageNum - 1) * 12;
      const end = start + 12;
      const paginated = VideoData.slice(start, end);
      if (paginated.length > 0) {
        setStations(prev => [...prev, ...paginated]);
        const totalFree = paginated.reduce((s, v) => s + (v.freePorts || 0), 0);
        const totalBusy = paginated.reduce((s, v) => s + (v.busyPorts || 0), 0);
        setStats(prev => ({
          total: prev.total + paginated.length,
          freePorts: prev.freePorts + totalFree,
          busyPorts: prev.busyPorts + totalBusy,
        }));
      }
      if (paginated.length < 12 || end >= VideoData.length) setHasMore(false);
      setIsLoading(false);
    }, 400);
  };

  useEffect(() => { fetchStations(page); }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && !isLoading && hasMore) setPage(p => p + 1); },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => { if (loaderRef.current) observer.unobserve(loaderRef.current); };
  }, [isLoading, hasMore]);

  return (
    <PageContainer>
      <Header>
        <BrandSection>
          <Logo>
            <div className="main-title">ЭЛЕКТРО<span>СТАНЦИЯ</span></div>
            <div className="subtitle">Официальный реестр зарядных станций Узбекистана</div>
          </Logo>
          <LegalBadge>
            <div className="cert-number">СВИДЕТЕЛЬСТВО № {new Date().getFullYear()}-UZ</div>
            <div className="legal-text">Лицензия Минэнерго • Сертифицированное оборудование</div>
          </LegalBadge>
        </BrandSection>

        <StatsBar>
          <StatItem>
            <div className="stat-label">Станций</div>
            <div className="stat-value" style={{ color: colors.accent.highlight }}>{stats.total || VideoData.length}</div>
          </StatItem>
          <StatItem>
            <div className="stat-label">Свободных портов</div>
            <div className="stat-value" style={{ color: colors.status.free }}>{stats.freePorts}</div>
          </StatItem>
          <StatItem>
            <div className="stat-label">Занятых портов</div>
            <div className="stat-value" style={{ color: colors.status.busy }}>{stats.busyPorts}</div>
          </StatItem>
          <StatItem>
            <div className="stat-label">Год основания</div>
            <div className="stat-value" style={{ color: colors.accent.highlight }}>2024</div>
          </StatItem>
        </StatsBar>
      </Header>

      <Grid isMobile={isMobile}>
        {stations.map((station) => {
          const portStatus = getPortStatus(station);
          const imageUrl = station.snippet?.thumbnails?.medium?.url || '';
          const address = station.address || '—';
          const coords = station.coordinates || '';
          // Массив портов: true = свободен, false = занят
          const portCircles = [
            ...Array(station.busyPorts || 0).fill(false),
            ...Array(station.freePorts || 0).fill(true),
          ];

          return (
            <Link key={station.id} to={`/video/${station.id}`} style={{ textDecoration: 'none' }}>
              <StationCard>
                <PortBadge>
                  <PortDot className="port-dot" color={portStatus.color} />
                  <PortText color={portStatus.color}>{portStatus.label}</PortText>
                </PortBadge>

                <ImageContainer>
                  <StationImage
                    src={imageUrl}
                    alt={address}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/320x180/1A2A2A/00B886?text=Нет+фото'; }}
                  />
                  <ImageOverlay />
                  {coords && <CoordLabel>📍 {coords}</CoordLabel>}
                </ImageContainer>

                <InfoSection>
                  <AddressTitle>{address}</AddressTitle>
                  <OperatorRow>⚡ Оператор: <span>{station.operator || '—'}</span></OperatorRow>

                  <Divider />

                  <TechRow>
                    <TechItem>
                      <div className="tech-value">{station.power || '—'}</div>
                      <div className="tech-label">Мощность</div>
                    </TechItem>
                    <TechItem>
                      <div className="tech-value">{station.totalPorts || '—'}</div>
                      <div className="tech-label">Портов</div>
                    </TechItem>
                    <TechItem>
                      <div className="tech-value" style={{ fontSize: 10 }}>{station.connector || '—'}</div>
                      <div className="tech-label">Разъём</div>
                    </TechItem>
                  </TechRow>

                  <PortsVisual>
                    <PortsLabel>Порты:</PortsLabel>
                    <PortCircles>
                      {portCircles.map(($free, i) => (
                        <PortCircle key={i} $free={$free} />
                      ))}
                    </PortCircles>
                    <PortsCount>
                      <span className="free">{station.freePorts} св.</span>
                      {' / '}
                      <span className="busy">{station.busyPorts} зан.</span>
                    </PortsCount>
                  </PortsVisual>

                  <ActionButton>Подробнее →</ActionButton>
                </InfoSection>
              </StationCard>
            </Link>
          );
        })}

        {isLoading && hasMore && Array(3).fill(0).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
        <div ref={loaderRef} style={{ height: 20 }} />
      </Grid>
    </PageContainer>
  );
};
export default Home;