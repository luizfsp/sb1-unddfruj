import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Instagram,
  Layers,
  Play,
  X,
} from 'lucide-react';

interface BeholdSize {
  width: number;
  height: number;
  mediaUrl: string;
}

interface BeholdChild {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  thumbnailUrl?: string;
  sizes?: {
    small?: BeholdSize;
    medium?: BeholdSize;
    large?: BeholdSize;
    full?: BeholdSize;
  };
}

interface BeholdPost {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  isReel?: boolean;
  caption?: string;
  prunedCaption?: string;
  permalink: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  timestamp: string;
  likeCount?: number;
  children?: BeholdChild[];
  sizes?: {
    small?: BeholdSize;
    medium?: BeholdSize;
    large?: BeholdSize;
    full?: BeholdSize;
  };
}

interface BeholdFeedResponse {
  username?: string;
  profilePictureUrl?: string;
  followersCount?: number;
  posts?: BeholdPost[];
}

interface InstagramFeedSectionProps {
  feedUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  whatsappLink: string;
}

function getPostCoverUrl(post: BeholdPost): string {
  return (
    post.sizes?.medium?.mediaUrl ||
    post.sizes?.large?.mediaUrl ||
    post.thumbnailUrl ||
    post.mediaUrl
  );
}

function isReelPost(post: BeholdPost): boolean {
  return post.isReel === true || post.mediaType === 'VIDEO';
}

export function InstagramFeedSection({
  feedUrl,
  instagramHandle,
  instagramUrl,
  whatsappLink,
}: InstagramFeedSectionProps) {
  const [feed, setFeed] = useState<BeholdFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'reels'>('all');
  const [selectedPost, setSelectedPost] = useState<BeholdPost | null>(null);
  const [carouselSlideIndex, setCarouselSlideIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadFeed = async () => {
      try {
        const res = await fetch(feedUrl, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: BeholdFeedResponse = await res.json();
        if (!cancelled) {
          setFeed(data);
        }
      } catch {
        if (!cancelled) {
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadFeed();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [feedUrl]);

  useEffect(() => {
    if (!selectedPost) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPost(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost]);

  const allPosts = (feed?.posts || []).filter((p) => p && p.permalink);
  const reelsPosts = allPosts.filter(isReelPost);
  const visiblePosts = activeFilter === 'reels' && reelsPosts.length > 0 ? reelsPosts : allPosts;

  const scrollTrack = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const delta = direction === 'left' ? -340 : 340;
    scrollContainerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const openPostModal = (post: BeholdPost) => {
    setCarouselSlideIndex(0);
    setSelectedPost(post);
  };

  const modalSlides: BeholdChild[] = selectedPost
    ? selectedPost.mediaType === 'CAROUSEL_ALBUM' && selectedPost.children && selectedPost.children.length > 0
      ? selectedPost.children
      : [
          {
            id: selectedPost.id,
            mediaType: selectedPost.mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE',
            mediaUrl: selectedPost.mediaUrl,
            thumbnailUrl: selectedPost.thumbnailUrl,
            sizes: selectedPost.sizes,
          },
        ]
    : [];

  const currentSlide = modalSlides[carouselSlideIndex] || modalSlides[0];

  return (
    <section id="instagram" className="py-24 bg-slate-100 border-t border-slate-200 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-blue-900 px-4 py-1.5 rounded-full mb-4 shadow-sm text-xs font-bold uppercase tracking-wider">
              <Instagram size={15} className="text-amber-500" />
              Instagram Oficial · {instagramHandle}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Conteúdos no Instagram
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed text-justify">
              Acompanhe os vídeos, alertas rápidos e conteúdos educativos do Dr. Fábio Saraiva sobre direitos dos
              pacientes diante dos planos de saúde — atualizados automaticamente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {/* Filtro Todos / Reels (exibido automaticamente assim que houver Reels publicados) */}
            {reelsPosts.length > 0 && (
              <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-blue-950 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos ({allPosts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('reels')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 ${
                    activeFilter === 'reels'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Play size={12} className="fill-current" />
                  Reels ({reelsPosts.length})
                </button>
              </div>
            )}

            {/* Botões de Navegação e Seguir */}
            <div className="flex items-center gap-2.5">
              {visiblePosts.length > 3 && (
                <div className="hidden md:flex items-center gap-2 mr-1">
                  <button
                    type="button"
                    onClick={() => scrollTrack('left')}
                    aria-label="Publicações anteriores"
                    className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-blue-950 hover:text-white hover:border-blue-950 transition-all shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTrack('right')}
                    aria-label="Próximas publicações"
                    className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-blue-950 hover:text-white hover:border-blue-950 transition-all shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-blue-950 hover:bg-amber-500 text-white hover:text-slate-950 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md"
              >
                <Instagram size={16} />
                Seguir {instagramHandle}
              </a>
            </div>
          </div>
        </div>

        {/* Estado de Carregamento */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm animate-pulse"
              >
                <div className="aspect-[4/5] bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : hasError || visiblePosts.length === 0 ? (
          /* Fallback elegante caso a API esteja temporariamente indisponível */
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-4">
              <Instagram size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Acompanhe {instagramHandle} no Instagram
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              Publicamos Reels e conteúdos diários sobre liminares de urgência, negativas de cobertura, medicamentos e
              reajustes abusivos.
            </p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-blue-950 hover:bg-amber-500 text-white hover:text-slate-950 px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
            >
              <Instagram size={18} />
              Acessar perfil oficial
              <ExternalLink size={15} />
            </a>
          </div>
        ) : (
          /* Carrossel / Grid de Reels e Publicações */
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {visiblePosts.map((post) => {
              const reel = isReelPost(post);
              const isCarousel = post.mediaType === 'CAROUSEL_ALBUM';
              const cover = getPostCoverUrl(post);
              const captionText = (post.prunedCaption || post.caption || '').trim();
              const dateLabel = new Date(post.timestamp).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={post.id}
                  onClick={() => openPostModal(post)}
                  className="min-w-[270px] sm:min-w-[290px] lg:min-w-[300px] max-w-[320px] flex-shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden">
                      <img
                        src={cover}
                        alt={captionText.slice(0, 80) || `Publicação ${instagramHandle}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 opacity-80 group-hover:opacity-90 transition-opacity" />

                      {/* Badge de Tipo (Reel / Carrossel / Post) */}
                      <div className="absolute top-3 right-3">
                        {reel ? (
                          <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                            <Play size={10} className="fill-slate-950" />
                            Reel
                          </span>
                        ) : isCarousel ? (
                          <span className="inline-flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/15">
                            <Layers size={10} />
                            Carrossel
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/15">
                            <Instagram size={10} />
                            Post
                          </span>
                        )}
                      </div>

                      {/* Ícone de Play central para Reels */}
                      {reel && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-amber-500/95 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play size={24} className="fill-slate-950 ml-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Perfil no rodapé da capa */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          {feed?.profilePictureUrl && (
                            <img
                              src={feed.profilePictureUrl}
                              alt={instagramHandle}
                              className="w-6 h-6 rounded-full border border-amber-400 object-cover shrink-0"
                            />
                          )}
                          <span className="font-bold truncate">{instagramHandle}</span>
                        </div>
                        <span className="text-[11px] text-slate-200 shrink-0">{dateLabel}</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-slate-600 text-xs leading-relaxed text-justify line-clamp-3">
                        {captionText || 'Confira esta orientação jurídica no Instagram oficial do escritório.'}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-blue-800 font-bold text-xs group-hover:text-amber-600 transition-colors">
                      {reel ? 'Assistir Reel →' : 'Ver conteúdo completo →'}
                    </span>
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Abrir publicação no Instagram"
                      className="text-slate-400 hover:text-blue-700 transition-colors p-1"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Player (Reel em Vídeo ou Visualizador de Carrossel/Post) */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              aria-label="Fechar visualização"
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            {/* Mídia (Esquerda) */}
            <div className="md:w-1/2 bg-slate-950 relative flex items-center justify-center min-h-[300px] max-h-[55vh] md:max-h-[90vh]">
              {currentSlide?.mediaType === 'VIDEO' ? (
                <video
                  key={currentSlide.id}
                  src={currentSlide.mediaUrl}
                  poster={
                    currentSlide.sizes?.large?.mediaUrl ||
                    currentSlide.thumbnailUrl ||
                    getPostCoverUrl(selectedPost)
                  }
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full max-h-[55vh] md:max-h-[85vh] object-contain bg-black"
                />
              ) : (
                <img
                  src={
                    currentSlide?.sizes?.large?.mediaUrl ||
                    currentSlide?.sizes?.medium?.mediaUrl ||
                    currentSlide?.mediaUrl ||
                    getPostCoverUrl(selectedPost)
                  }
                  alt={instagramHandle}
                  className="w-full h-full max-h-[55vh] md:max-h-[85vh] object-contain"
                />
              )}

              {/* Controles de Carrossel se houver múltiplos slides */}
              {modalSlides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setCarouselSlideIndex((prev) => (prev === 0 ? modalSlides.length - 1 : prev - 1))
                    }
                    aria-label="Slide anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCarouselSlideIndex((prev) => (prev === modalSlides.length - 1 ? 0 : prev + 1))
                    }
                    aria-label="Próximo slide"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-950/75 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    {carouselSlideIndex + 1} / {modalSlides.length}
                  </div>
                </>
              )}
            </div>

            {/* Legenda e CTAs (Direita) */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between max-h-[35vh] md:max-h-[90vh] overflow-y-auto">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4 pr-8">
                  {feed?.profilePictureUrl ? (
                    <img
                      src={feed.profilePictureUrl}
                      alt={instagramHandle}
                      className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-950 text-white flex items-center justify-center">
                      <Instagram size={18} />
                    </div>
                  )}
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm">{instagramHandle}</p>
                    <p className="text-xs text-slate-500">
                      Saraiva &amp; Advogados ·{' '}
                      {new Date(selectedPost.timestamp).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed text-justify whitespace-pre-line mb-6">
                  {selectedPost.prunedCaption || selectedPost.caption}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                  Falar com um Especialista no WhatsApp
                </a>
                <a
                  href={selectedPost.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Instagram size={15} />
                  Abrir publicação no Instagram
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
