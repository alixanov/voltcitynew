import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import VideoDataRaw from '../data/VideoData';

// ====================== ОБРАБОТКА ИМПОРТА ======================
const VideoData = Array.isArray(VideoDataRaw) ? VideoDataRaw : (VideoDataRaw.default || []);

// ====================== ЦВЕТА ======================
const colors = {
  background: '#0A0E1A',
  cockpit: '#0D1425',
  panel: '#111827',
  ledGreen: '#00FF88',
  ledRed: '#FF3333',
  ledAmber: '#FFB800',
  ledBlue: '#00B8FF',
  textDim: '#4B5563',
  textBright: '#E5E7EB',
  statusFree: '#00E676',
  statusBusy: '#FF5252',
  statusPartial: '#FFC107',
};

// ====================== АНИМАЦИИ ======================
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const fastBlink = keyframes`
  0%, 100% { opacity: 1; text-shadow: 0 0 5px currentColor; }
  25% { opacity: 0.4; text-shadow: none; }
  50% { opacity: 1; text-shadow: 0 0 8px currentColor; }
  75% { opacity: 0.4; text-shadow: none; }
`;

const ledPulse = keyframes`
  0% { opacity: 1; box-shadow: 0 0 2px currentColor; }
  50% { opacity: 0.6; box-shadow: 0 0 8px currentColor; }
  100% { opacity: 1; box-shadow: 0 0 2px currentColor; }
`;

// ====================== КОМПОНЕНТЫ ======================
const SegmentDisplay = styled.span`
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: ${({ size }) => size || 'inherit'};
  background: #000000;
  color: ${({ color }) => color || colors.ledGreen};
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 2px;
  text-shadow: 0 0 5px currentColor;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid rgba(0, 255, 136, 0.3);
  &::before {
    content: "▊";
    font-size: 10px;
    animation: ${ledPulse} 1s ease-in-out infinite;
  }
`;

const LEDIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: monospace;
  font-size: 12px;
  font-weight: bold;
  &::before {
    content: "●";
    font-size: 12px;
    color: ${({ color }) => color || colors.ledGreen};
    animation: ${({ $blink }) => $blink ? fastBlink : ledPulse} 1s ease-in-out infinite;
    text-shadow: 0 0 5px currentColor;
  }
`;

const StatusRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  background: ${colors.cockpit};
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid ${colors.ledGreen};
  margin: 8px 0;
`;

const PageContainer = styled.div`
  padding: ${({ isMobile }) => (isMobile ? '14px' : '20px')};
  min-height: 100vh;
  background: ${colors.background};
  background-image: radial-gradient(circle at 10% 20%, rgba(0,255,136,0.03) 0%, transparent 50%);
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  gap: ${({ isMobile }) => (isMobile ? '16px' : '24px')};
  flex-wrap: wrap;
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 300px;
`;

const ImageViewer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
  border: 1px solid ${colors.ledGreen};
  box-shadow: 0 0 20px rgba(0,255,136,0.15);
  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${colors.ledGreen}, transparent);
    z-index: 10;
  }
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, rgba(0,255,136,0.03) 0px, rgba(0,255,136,0.03) 2px, transparent 2px, transparent 4px);
    pointer-events: none;
    z-index: 5;
  }
`;

const BigImage = styled.img`
  width: 100%; height: 100%;
  object-fit: cover;
  filter: brightness(0.9) contrast(1.1);
`;

const InfoPanel = styled.div`
  background-color: ${colors.panel};
  border-radius: 8px;
  padding: ${({ isMobile }) => (isMobile ? '16px' : '20px')};
  border: 1px solid ${colors.ledGreen};
  position: relative;
  margin-bottom: 20px;
  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: ${colors.ledGreen};
    opacity: 0.5;
  }
`;

const VideoTitle = styled.h1`
  font-size: ${({ isMobile }) => (isMobile ? '18px' : '22px')};
  color: ${colors.textBright};
  margin-bottom: 16px;
  font-family: monospace;
  letter-spacing: 1px;
  border-left: 3px solid ${colors.ledGreen};
  padding-left: 12px;
`;

const CockpitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px dashed rgba(0,255,136,0.3);
`;

const ChannelBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: monospace;
  font-size: 13px;
  background: rgba(0,255,136,0.1);
  padding: 4px 12px;
  border-radius: 4px;
  color: ${colors.ledGreen};
`;

const InstrumentCluster = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const Instrument = styled.div`
  display: flex;
  flex-direction: column;
  background: #000000;
  padding: 6px 12px;
  border-radius: 4px;
  min-width: 90px;
  .instrument-label {
    font-size: 8px;
    color: ${colors.textDim};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }
  .instrument-value {
    font-family: 'Courier New', monospace;
    font-size: 16px;
    font-weight: bold;
    color: ${({ valueColor }) => valueColor || colors.ledGreen};
    text-shadow: 0 0 3px currentColor;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

// Блок адреса и координат
const StationInfoBlock = styled.div`
  background: rgba(0,0,0,0.4);
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 16px;
  border-left: 3px solid ${colors.ledGreen};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 12px;
  &:last-child { margin-bottom: 0; }
  .info-label {
    font-size: 9px;
    color: ${colors.textDim};
    text-transform: uppercase;
    letter-spacing: 1px;
    min-width: 90px;
    margin-top: 2px;
  }
  .info-value {
    font-family: monospace;
    font-size: 13px;
    color: ${colors.textBright};
    text-align: right;
    flex: 1;
  }
  .info-value.coords {
    color: ${colors.ledGreen};
    text-shadow: 0 0 4px rgba(0,255,136,0.4);
  }
`;

// Визуальные порты
const PortsBlock = styled.div`
  background: rgba(0,0,0,0.4);
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 16px;
  border-left: 3px solid ${colors.ledAmber};
`;

const PortsTitle = styled.div`
  font-size: 9px;
  color: ${colors.textDim};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
`;

const PortsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const PortCircles = styled.div`
  display: flex;
  gap: 6px;
`;

const PortCircle = styled.div`
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ $free }) => $free ? colors.statusFree : colors.statusBusy};
  background: ${({ $free }) => $free ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.12)'};
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${({ $free }) => $free ? colors.statusFree : colors.statusBusy};
  }
`;

const PortsLegend = styled.div`
  font-family: monospace;
  font-size: 12px;
  display: flex;
  gap: 12px;
  .free { color: ${colors.statusFree}; }
  .busy { color: ${colors.statusBusy}; }
`;

const FlightDateBoard = styled.div`
  background: #000000;
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid ${colors.ledGreen};
  box-shadow: 0 0 10px rgba(0,255,136,0.2);
  margin-bottom: 12px;
  .label { font-size: 8px; letter-spacing: 2px; color: ${colors.textDim}; text-transform: uppercase; }
  .value { font-family: 'Courier New', monospace; font-size: 20px; font-weight: bold; color: ${colors.ledGreen}; text-shadow: 0 0 5px ${colors.ledGreen}; letter-spacing: 3px; }
`;

const MultiSegmentDate = styled.div`
  display: flex;
  gap: 8px;
  background: #000;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  margin-bottom: 12px;
  .segment { text-align: center; }
  .digit { font-size: 20px; font-weight: bold; color: ${colors.ledGreen}; text-shadow: 0 0 5px ${colors.ledGreen}; background: #0a0a0a; padding: 4px 6px; border-radius: 4px; letter-spacing: 2px; }
  .digit-label { font-size: 7px; color: ${colors.textDim}; text-transform: uppercase; margin-top: 2px; }
`;

const TechnicalSpecs = styled.div`
  padding: 14px 16px;
  background: rgba(0,0,0,0.5);
  border-radius: 6px;
  color: ${colors.textDim};
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
  border-left: 2px solid ${colors.ledGreen};
`;

const Sidebar = styled.div`
  flex-basis: 340px;
  flex-shrink: 0;
`;

const RadarTitle = styled.h3`
  color: ${colors.ledGreen};
  margin-bottom: 16px;
  font-family: monospace;
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before { content: "⦿"; animation: ${blink} 1.5s ease-in-out infinite; }
  &::after { content: ""; flex: 1; height: 1px; background: linear-gradient(90deg, ${colors.ledGreen}, transparent); }
`;

const FlightCard = styled.div`
  display: flex;
  background: ${colors.cockpit};
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  border: 1px solid rgba(0,255,136,0.2);
  cursor: pointer;
  &:hover { border-color: ${colors.ledGreen}; transform: translateX(4px); background: rgba(0,255,136,0.05); }
`;

const FlightThumbnail = styled.div`
  width: 120px; height: 68px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-right: 12px;
  flex-shrink: 0;
`;

const FlightInfo = styled.div`
  flex: 1;
`;

const FlightTitle = styled.div`
  font-weight: 600;
  color: ${colors.textBright};
  margin-bottom: 4px;
  line-height: 1.3;
  font-size: 12px;
  font-family: monospace;
`;

const FlightAddress = styled.div`
  font-size: 10px;
  color: ${colors.textDim};
  font-family: monospace;
  margin-bottom: 4px;
`;

const FlightMeta = styled.div`
  display: flex;
  gap: 8px;
  font-size: 10px;
  font-family: monospace;
  flex-wrap: wrap;
`;

const MetaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: ${({ color }) => color || colors.ledGreen};
`;

const SkeletonLine = styled.div`
  background: linear-gradient(90deg, #1a1f2e 25%, #2a3040 50%, #1a1f2e 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

// ====================== УТИЛИТЫ ======================
const formatViews = (count) => {
  if (!count) return '—';
  if (typeof count === 'string' && (count.includes('K') || count.includes('М'))) return count;
  const num = parseInt(count);
  if (isNaN(num)) return String(count);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}М`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}К`;
  return num.toString();
};

const formatFlightDate = (dateString) => {
  if (!dateString) return { day: '--', month: '--', year: '----' };
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return { day: '--', month: '--', year: '----' };
  return {
    day: date.getDate().toString().padStart(2, '0'),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    year: date.getFullYear()
  };
};

const formatRussianDate = (dateString) => {
  if (!dateString) return 'ДАТА НЕИЗВЕСТНА';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'ДАТА НЕИЗВЕСТНА';
  const months = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'];
  return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const getPortStatusColor = (station) => {
  const free = station.freePorts || 0;
  const total = station.totalPorts || 0;
  if (free === 0) return colors.statusBusy;
  if (free === total) return colors.statusFree;
  return colors.statusPartial;
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
const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (!VideoData || !Array.isArray(VideoData)) {
        setIsLoading(false);
        return;
      }
      const currentVideo = VideoData.find(v => v && v.id === id);
      if (currentVideo) {
        setVideo(currentVideo);
        try {
          const history = JSON.parse(localStorage.getItem('videoHistory')) || [];
          if (!history.find(v => v && v.id === currentVideo.id)) {
            history.unshift(currentVideo);
            localStorage.setItem('videoHistory', JSON.stringify(history.slice(0, 20)));
          }
        } catch (e) {}
        setRelatedVideos(VideoData.filter(v => v && v.id !== id).slice(0, 5));
      }
      setIsLoading(false);
    }, 400);
  }, [id]);

  if (!VideoData || !Array.isArray(VideoData) || VideoData.length === 0) {
    return <div style={{ color: colors.ledGreen, textAlign: 'center', padding: '50px', fontFamily: 'monospace' }}>[ОШИБКА] ИСТОЧНИК ДАННЫХ НЕ НАЙДЕН</div>;
  }
  if (!video && !isLoading) {
    return <div style={{ color: colors.ledGreen, textAlign: 'center', padding: '50px', fontFamily: 'monospace' }}>[404] СТАНЦИЯ НЕ НАЙДЕНА</div>;
  }
  if (isLoading) {
    return (
      <PageContainer isMobile={isMobile}>
        <SkeletonLine style={{ height: 400, width: '100%', marginBottom: 20 }} />
        <SkeletonLine style={{ height: 200, width: '100%' }} />
      </PageContainer>
    );
  }

  const flightDate = formatFlightDate(video?.snippet?.publishedAt);
  const russianDate = formatRussianDate(video?.snippet?.publishedAt);
  const portColor = getPortStatusColor(video);
  const portCircles = [
    ...Array(video.busyPorts || 0).fill(false),
    ...Array(video.freePorts || 0).fill(true),
  ];

  return (
    <PageContainer isMobile={isMobile}>
      <ContentWrapper isMobile={isMobile}>
        <MainContent>
          {/* ИЗОБРАЖЕНИЕ */}
          <ImageViewer>
            <BigImage
              src={video?.snippet?.thumbnails?.medium?.url || ''}
              alt={video?.address || 'Станция'}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x675/0a0e1a/00ff88?text=СИГНАЛ+ПОТЕРЯН'; }}
            />
          </ImageViewer>

          <InfoPanel isMobile={isMobile}>
            {/* Заголовок — адрес станции */}
            <VideoTitle isMobile={isMobile}>
              {video?.address || 'АДРЕС НЕ УКАЗАН'}
            </VideoTitle>

            <CockpitHeader>
              <ChannelBadge>
                <LEDIndicator color={colors.ledGreen} $blink>ОПЕ</LEDIndicator>
                {video?.operator || 'НЕИЗВЕСТЕН'}
              </ChannelBadge>

              <InstrumentCluster>
                <Instrument valueColor={colors.ledGreen}>
                  <div className="instrument-label">Мощность</div>
                  <div className="instrument-value">{video?.power || '—'}</div>
                </Instrument>
                <Instrument valueColor={portColor}>
                  <div className="instrument-label">Статус</div>
                  <div className="instrument-value">
                    <LEDIndicator color={portColor} />
                    {video.freePorts > 0 ? 'СВОБОДНА' : 'ЗАНЯТА'}
                  </div>
                </Instrument>
              </InstrumentCluster>
            </CockpitHeader>

            {/* Адрес и координаты */}
            <StationInfoBlock>
              <InfoRow>
                <span className="info-label">Адрес</span>
                <span className="info-value">{video?.address || '—'}</span>
              </InfoRow>
              <InfoRow>
                <span className="info-label">Координаты</span>
                <span className="info-value coords">{video?.coordinates || '—'}</span>
              </InfoRow>
              <InfoRow>
                <span className="info-label">Разъём</span>
                <span className="info-value">{video?.connector || '—'}</span>
              </InfoRow>
            </StationInfoBlock>

            {/* Порты */}
            <PortsBlock>
              <PortsTitle>Состояние зарядных портов — всего {video.totalPorts || 0}</PortsTitle>
              <PortsRow>
                <PortCircles>
                  {portCircles.map(($free, i) => (
                    <PortCircle key={i} $free={$free} />
                  ))}
                </PortCircles>
                <PortsLegend>
                  <span className="free">● {video.freePorts} своб.</span>
                  <span className="busy">● {video.busyPorts} зан.</span>
                </PortsLegend>
              </PortsRow>
            </PortsBlock>

            {/* Индикатор просмотров */}
            <StatusRow>
              <SegmentDisplay size="16px" color={colors.ledGreen}>
                ПРОСМОТРЫ: {formatViews(video?.statistics?.viewCount)}
              </SegmentDisplay>
              <LEDIndicator color={colors.ledGreen} $blink>АКТИВНА</LEDIndicator>
            </StatusRow>

            {/* Дата */}
            <FlightDateBoard>
              <div className="label">Дата ввода в эксплуатацию</div>
              <div className="value">{russianDate}</div>
            </FlightDateBoard>

            <MultiSegmentDate>
              <div className="segment">
                <div className="digit">{flightDate.day}</div>
                <div className="digit-label">ДЕНЬ</div>
              </div>
              <div className="segment">
                <div className="digit">{flightDate.month}</div>
                <div className="digit-label">МЕСЯЦ</div>
              </div>
              <div className="segment">
                <div className="digit">{flightDate.year}</div>
                <div className="digit-label">ГОД</div>
              </div>
            </MultiSegmentDate>

            {/* Описание */}
            <StatusRow>
              <LEDIndicator color={colors.ledAmber}>МОЩНОСТЬ: НОРМА</LEDIndicator>
              <LEDIndicator color={colors.ledBlue}>ТЕМП: 22°C</LEDIndicator>
              <LEDIndicator color={colors.ledGreen}>НАГРУЗКА: {Math.round((video.busyPorts / video.totalPorts) * 100) || 0}%</LEDIndicator>
            </StatusRow>

            <TechnicalSpecs>
              {video?.snippet?.description || 'ТЕХНИЧЕСКИЕ ДАННЫЕ ОТСУТСТВУЮТ'}
            </TechnicalSpecs>
          </InfoPanel>
        </MainContent>

        {/* БОКОВАЯ ПАНЕЛЬ */}
        <Sidebar>
          <RadarTitle>БЛИЖАЙШИЕ СТАНЦИИ [РАДАР]</RadarTitle>
          {relatedVideos.map((rel) => {
            const relPortColor = getPortStatusColor(rel);
            return (
              <Link key={rel.id} to={`/video/${rel.id}`} style={{ textDecoration: 'none' }}>
                <FlightCard>
                  <FlightThumbnail style={{ backgroundImage: `url(${rel.snippet?.thumbnails?.medium?.url || ''})` }} />
                  <FlightInfo>
                    <FlightTitle>
                      {rel.address?.substring(0, 45) || 'НЕИЗВЕСТНАЯ СТАНЦИЯ'}
                      {(rel.address?.length > 45) && '...'}
                    </FlightTitle>
                    <FlightAddress>⚡ {rel.operator || '—'}</FlightAddress>
                    <FlightMeta>
                      <MetaBadge color={rel.power ? colors.ledGreen : colors.textDim}>
                        ⚡ {rel.power || '—'}
                      </MetaBadge>
                      <MetaBadge color={relPortColor}>
                        ● {rel.freePorts} св. / {rel.busyPorts} зан.
                      </MetaBadge>
                    </FlightMeta>
                  </FlightInfo>
                </FlightCard>
              </Link>
            );
          })}

          <StatusRow style={{ marginTop: 16, justifyContent: 'center' }}>
            <LEDIndicator color={colors.ledGreen}>РАДАР АКТИВЕН</LEDIndicator>
            <LEDIndicator color={colors.ledGreen} $blink>СКАНИРОВАНИЕ</LEDIndicator>
          </StatusRow>
        </Sidebar>
      </ContentWrapper>
    </PageContainer>
  );
};

export default VideoPage;