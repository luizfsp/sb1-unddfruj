import { useState, useEffect, useRef } from 'react';
import { 
  Scale, 
  HeartPulse, 
  ShieldAlert, 
  FileWarning, 
  ChevronDown, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  Clock,
  Award,
  CheckCircle2,
  Sparkles,
  Loader2,
  Send,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ExternalLink,
  MessageSquareWarning,
  Star,
  Quote
} from 'lucide-react';

// Interface para definir a estrutura dos itens de notícias
interface NewsItem {
  title: string;
  pubDate: string;
  link: string;
  description: string;
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [caseDescription, setCaseDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiError, setAiError] = useState("");
  
  // Estado para o Feed de Notícias
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  function stripHtml(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efeito para carregar o Feed de Notícias do ConJur (mais estável)
  useEffect(() => {
    const fetchNews = async () => {
      const fallbackNews: NewsItem[] = [
        { 
          title: "STJ define que plano de saúde deve cobrir tratamento multidisciplinar", 
          pubDate: new Date().toISOString(), 
          link: "https://www.conjur.com.br/?s=stj+plano+de+sa%C3%BAde", 
          description: "A decisão reforça a obrigatoriedade da cobertura integral para beneficiários em tratamentos específicos." 
        },
        { 
          title: "Justiça condena plano de saúde por negativa abusiva de cirurgia de urgência", 
          pubDate: new Date(Date.now() - 86400000).toISOString(), 
          link: "https://www.conjur.com.br/?s=negativa+plano+de+saude", 
          description: "Magistrado considerou que a demora colocava em risco a vida do paciente, determinando multa diária." 
        },
        { 
          title: "Novas regras da ANS para autorização de exames e procedimentos", 
          pubDate: new Date(Date.now() - 172800000).toISOString(), 
          link: "https://www.gov.br/ans/pt-br", 
          description: "Agência Nacional de Saúde Suplementar atualiza os critérios de prazos máximos de atendimento." 
        },
      ];

      try {
        const rssUrl = encodeURIComponent('https://www.conjur.com.br/feed/');
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        const data = await res.json();
        
        if (data && data.status === 'ok' && data.items) {
          // Filtro leve para priorizar temas relevantes, mas sem ser restritivo demais para evitar quedas no fallback
          const keywords = ['saúde', 'consumidor', 'stj', 'stf', 'justiça', 'direito', 'plano', 'médic', 'indenização'];
          
          let filtered: NewsItem[] = data.items.map((item: any) => ({
            title: item.title,
            pubDate: item.pubDate,
            link: item.link,
            description: stripHtml(item.description).substring(0, 150) + "..."
          }));

          // Ordenação por data
          filtered.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
          
          setNews(filtered.slice(0, 6));
        } else {
          throw new Error("Falha no carregamento");
        }
      } catch (error) {
        setNews(fallbackNews);
      } finally {
        setIsLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -carouselRef.current.offsetWidth + 50 : carouselRef.current.offsetWidth - 50;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const whatsappNumber = "5511962817392";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Ol%C3%A1,%20gostaria%20de%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica%20na%20%C3%A1rea%20da%20sa%C3%BAde.`;
  const whatsappLinkUrgency = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("URGÊNCIA: Olá! Preciso de um atendimento de urgência referente a Direito da Saúde. Poderiam me ajudar imediatamente?")}`;

  const analyzeCaseWithAI = async () => {
    if (!caseDescription.trim()) {
      setAiError("Por favor, descreva o seu caso brevemente.");
      return;
    }

    setIsAnalyzing(true);
    setAiError("");
    setAiAnalysis(null);

    let apiKey = "";
    try {
      // @ts-ignore
      if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
        // @ts-ignore
        apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      }
    } catch (e) {}
    
    const systemPrompt = `Você é um assistente jurídico virtual (IA) do escritório 'Saraiva & Advogados', especializado em Direito da Saúde no Brasil. 
    Analise o relato do usuário e forneça:
    1. Uma breve avaliação (1 parágrafo) indicando se parece haver uma violação de direitos.
    2. A recomendação clara de avaliação por advogado especialista.
    3. Um 'Resumo Estruturado' para o WhatsApp.
    Formate o texto usando quebras de linha e **negrito**.`;

    const prompt = `Relato do paciente/cliente: ${caseDescription}`;

    const fetchWithRetry = async (url: string, options: RequestInit, retries = 5, delay = 1000): Promise<any> => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP ${response.status}: ${errorData?.error?.message || response.statusText}`);
          }
          return await response.json();
        } catch (e: any) {
          if (i === retries - 1) throw e;
          await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
        }
      }
    };

    try {
      const modelName = apiKey ? "gemini-2.5-flash" : "gemini-2.5-flash-preview-09-2025";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const result = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setAiAnalysis(text);
      } else {
        setAiError("Não foi possível gerar a análise. Tente novamente.");
      }
    } catch (error: any) {
      setAiError(`Erro de conexão: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatAIResponse = (text: string) => {
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
      .replace(/\n/g, '<br />');
    return { __html: formattedText };
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* HEADER */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-slate-900/95 backdrop-blur-sm py-5'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scale className={isScrolled ? 'text-blue-900' : 'text-amber-500'} size={32} />
            <div>
              <h1 className={`text-xl font-bold tracking-tight leading-none ${isScrolled ? 'text-blue-950' : 'text-white'}`}>
                SARAIVA & ADVOGADOS
              </h1>
              <p className={`text-xs font-medium tracking-widest uppercase ${isScrolled ? 'text-slate-500' : 'text-slate-400'}`}>
                Associados
              </p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#solucoes" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Áreas de Atuação</a>
            <a href="#sobre" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>O Especialista</a>
            <a href="#depoimentos" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Depoimentos</a>
            <a href="#faq" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Dúvidas</a>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105 shadow-lg">
              Fale Conosco
            </a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-48 -left-24 w-72 h-72 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-3/5 text-center md:text-left">
              <div className="inline-block bg-blue-950/50 border border-blue-800/50 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
                <span className="text-amber-400 font-semibold text-sm tracking-wide flex items-center gap-2 justify-center md:justify-start">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  Atendimento Prioritário
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                A sua saúde <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">não pode esperar.</span><br />
                A busca pelos seus direitos também não.
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                Advocacia especializada contra <strong>abusos praticados por Operadoras de Planos de Saúde</strong> e <strong>Erros Médicos</strong>. Atuamos com rapidez para garantir o seu direito à saúde e à vida com pedido de liminares de urgência.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:-translate-y-1">
                  <MessageCircle size={24} />
                  Falar com um Especialista
                </a>
                <a href={whatsappLinkUrgency} target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:-translate-y-1">
                  <MessageSquareWarning size={24} />
                  Atendimento de Urgência
                </a>
              </div>
            </div>
            
            <div className="md:w-2/5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700/50 group">
                <img 
                  src="https://i.ibb.co/j9KkYTpv/Whats-App-Image-2026-02-12-at-21-40-15.jpg" 
                  alt="Dr. Fabio Saraiva" 
                  className="w-full h-auto object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                    <div className="bg-blue-600 p-2 rounded-full">
                      <Award className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-white font-bold">Dr. Fabio Saraiva</p>
                      <p className="text-slate-300 text-sm">Especialista em Direito da Saúde</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUTORIDADE */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="flex flex-col items-center text-center px-4 pt-4 md:pt-0">
              <Clock className="text-blue-800 mb-3" size={40} />
              <h3 className="text-4xl font-extrabold text-slate-900 mb-1">25+</h3>
              <p className="text-slate-600 font-medium">Anos de Experiência Jurídica</p>
            </div>
            <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
              <ShieldAlert className="text-blue-800 mb-3" size={40} />
              <h3 className="text-xl font-bold text-slate-900 mb-2 mt-2">Liminares de Urgência</h3>
              <p className="text-slate-600 font-medium text-sm px-4">Atuação ágil para garantir tratamentos e medicamentos vitais.</p>
            </div>
            <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
              <MapPin className="text-blue-800 mb-3" size={40} />
              <h3 className="text-xl font-bold text-slate-900 mb-2 mt-2">Atendimento Personalizado</h3>
              <p className="text-slate-600 font-medium text-sm px-4">Soluções Jurídicas de acordo com as necessidades de cada cliente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section id="solucoes" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">Áreas de Especialidade</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
              Como podemos defender o seu direito à saúde?
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<HeartPulse />} title="Planos de Saúde" desc="Revisão de reajustes ilegais, reversão de negativas para internação, cirurgias, exames e próteses." />
            <FeatureCard icon={<ShieldAlert />} title="Medicamentos" desc="Pedido de liminar para fornecimento de medicamentos de alto custo negados pelo plano ou Estado." />
            <FeatureCard icon={<CheckCircle2 />} title="Tratamentos" desc="Cobertura para terapias voltadas ao TEA, Home Care e demais doenças raras de forma assertiva." />
            <FeatureCard icon={<FileWarning />} title="Erro Médico" desc="Responsabilidade civil e indenização por negligência, imprudência ou imperícia médica." />
          </div>
        </div>
      </section>

      {/* SOBRE (TEXTO ATUALIZADO) */}
      <section id="sobre" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="relative">
                <img src="https://i.ibb.co/s9PyNDNW/firefox-1f-HADh-BJWx.jpg" alt="Escritório" className="rounded-lg shadow-2xl w-4/5 ml-auto"/>
                <img src="https://i.ibb.co/KzDCcZBV/456324765.jpg" alt="Detalhe" className="rounded-lg shadow-xl absolute -bottom-12 -left-4 w-3/5 border-8 border-white"/>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-16 lg:mt-0">
              <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">O Especialista</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Para nós, todo caso é um caso especial.
              </h3>
              <div className="space-y-4 text-slate-600 text-lg leading-relaxed text-justify">
                <p>Somos uma advocacia especializada no Direito da Saúde.</p>
                <p>Atuamos com ética e sensibilidade no atendimento, buscando garantir os seus direitos sempre com amparo na lei.</p>
                <p>
                  Com mais de 25 anos de sólida experiência, o <strong>Dr. Fabio Saraiva</strong> é membro efetivo da Comissão Especial de Direito do Seguro e Resseguro da Ordem dos Advogados do Brasil - São Paulo. Fundou o escritório com um propósito claro: entregar um atendimento humanizado, ético e assertivo na defesa dos interesses dos seus clientes, especialmente em uma área que requer a atuação de profissionais altamente especializados e qualificados para enfrentar as gigantes da área da saúde suplementar no Brasil.
                </p>
                <p>Um processo contra grandes operadoras exige uma advocacia artesanal, onde cada laudo médico e cada vírgula importam.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">Histórias de Sucesso</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">O que dizem os nossos clientes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard name="Maria Fernandes" text="O Dr. Fabio foi um anjo. Conseguiu a liminar para a cirurgia da minha mãe em menos de 48 horas. Atendimento humano e rápido." />
            <TestimonialCard name="Carlos Eduardo Silva" text="A equipe assumiu meu caso de medicamento de alto custo e conseguiu a liberação judicial em tempo recorde. Trabalho excepcional!" />
            <TestimonialCard name="Ana Paula Rezende" text="Aqui não fui tratada como número. O Dr. Fabio explicou tudo com clareza e lutou pela terapia intensiva do meu filho com TEA." />
          </div>
        </div>
      </section>

      {/* IA ANALISADOR */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4 text-amber-600"><Sparkles size={32} /></div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Análise Assistida por IA</h3>
            <p className="text-slate-600 text-lg">Descreva seu problema abaixo para uma avaliação preliminar rápida.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <textarea
              rows={5}
              className="w-full rounded-xl border-slate-300 border p-4 text-slate-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none shadow-inner"
              placeholder="Ex: O plano negou minha cirurgia..."
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
            ></textarea>
            {aiError && <p className="text-red-500 text-sm mt-3">{aiError}</p>}
            <div className="mt-6 flex justify-end">
              <button onClick={analyzeCaseWithAI} disabled={isAnalyzing || !caseDescription.trim()} className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2">
                {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />} Analisar agora
              </button>
            </div>
            {aiAnalysis && (
              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-slate-700 text-sm" dangerouslySetInnerHTML={formatAIResponse(aiAnalysis)} />
                <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(aiAnalysis)}`} target="_blank" rel="noreferrer" className="mt-6 w-full bg-[#25D366] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"><Send size={18} /> Enviar para o Advogado</a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* NOTÍCIAS (RECONFIGURADA) */}
      <section id="noticias" className="py-24 bg-slate-100 border-t border-slate-200 overflow-hidden">
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4 text-blue-700"><Newspaper size={28} /></div>
              <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">Direito em Foco</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Notícias e Atualizações Jurídicas</h3>
            </div>
            <div className="flex gap-3 mt-6 md:mt-0">
              <button onClick={() => scrollCarousel('left')} className="w-12 h-12 rounded-full bg-white border flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all"><ChevronLeft size={24} /></button>
              <button onClick={() => scrollCarousel('right')} className="w-12 h-12 rounded-full bg-white border flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all"><ChevronRight size={24} /></button>
            </div>
          </div>
          {isLoadingNews ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div> : (
            <div ref={carouselRef} className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar">
              {news.map((item, i) => (
                <div key={i} className="min-w-[85vw] md:min-w-[400px] bg-white rounded-2xl p-6 border snap-center flex flex-col justify-between hover:shadow-xl transition-all">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4"><Calendar size={14} />{new Date(item.pubDate).toLocaleDateString('pt-BR')}</div>
                    <h4 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2">{item.title}</h4>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3">{item.description}</p>
                  </div>
                  <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-700 font-bold text-sm flex items-center gap-2 pt-4 border-t">Ler matéria completa <ExternalLink size={16} /></a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-16">Perguntas Frequentes</h3>
          <div className="space-y-4">
            <FaqItem question="O plano negou meu tratamento. O que eu faço?" answer="Reúna a negativa por escrito e o laudo médico. O plano não pode interferir na conduta do médico assistente. Podemos ingressar com pedido de liminar para garantir o atendimento." />
            <FaqItem question="Quanto tempo demora para a liminar ser analisada?" answer="Em casos urgentes, a Justiça costuma analisar pedidos de tutela de urgência em um prazo médio de 24 a 72 horas." />
            <FaqItem question="Atendem fora de São Paulo?" answer="Sim! O processo é 100% eletrônico no Brasil, permitindo atendimento em qualquer cidade com excelência via reuniões online." />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 pt-20 pb-10 text-slate-400 border-t-4 border-amber-500">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-6">
                <Scale className="text-amber-500" size={32} />
                <h4 className="text-xl font-bold text-white">SARAIVA & ADVOGADOS</h4>
              </div>
              <p className="mb-4">Experiência de 25 anos com atendimento humanizado na defesa da sua saúde.</p>
              <p className="text-white font-bold uppercase tracking-widest text-xs">Fabio Tadeu Saraiva (OAB/SP: 184.971)</p>
            </div>
            <div className="md:col-span-3">
              <h5 className="text-white font-bold mb-6 text-sm">Links Rápidos</h5>
              <ul className="space-y-3">
                <li><a href="#solucoes" className="hover:text-amber-500">Áreas de Atuação</a></li>
                <li><a href="#sobre" className="hover:text-amber-500">Sobre o Escritório</a></li>
                <li><a href="#faq" className="hover:text-amber-500">Dúvidas Frequentes</a></li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <h5 className="text-white font-bold mb-6 text-sm">Contato</h5>
              <ul className="space-y-4">
                <li className="flex gap-3"><MapPin className="text-blue-600 shrink-0" size={20} /><span>Rua Afonso Celso, 1221, Cj. 16<br />Vila Mariana, São Paulo/SP<br />CEP: 04119-061</span></li>
                <li className="flex items-center gap-3"><Phone className="text-blue-600" size={20} /><span>(11) 96281-7392</span></li>
                <li className="flex items-center gap-3"><Mail className="text-blue-600" size={20} /><span>saraiva@saraivaeadvogados.com.br</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between text-xs text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} Saraiva & Advogados Associados. Todos os direitos reservados.</p>
            <p>OAB/SP - Inscrição Jurídica</p>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a href={whatsappLink} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"><MessageCircle size={32} /></a>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all">
      <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600">{icon}</div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, text }: { name: string, text: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border relative mt-6 hover:shadow-lg transition-all">
      <div className="absolute -top-6 left-8 bg-blue-600 rounded-full p-3 shadow-lg text-white"><Quote size={20} /></div>
      <div className="flex gap-1 mb-4 mt-2">{[1,2,3,4,5].map(s => <Star key={s} className="text-amber-400 fill-amber-400" size={16} />)}</div>
      <p className="text-slate-600 text-sm italic mb-6">"{text}"</p>
      <div className="border-t pt-4 font-bold text-slate-900 text-sm">{name}</div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border rounded-xl bg-white overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-5 text-left flex justify-between items-center">
        <span className="font-bold text-slate-900">{question}</span>
        <ChevronDown className={`text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>
      {isOpen && <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t pt-4">{answer}</div>}
    </div>
  );
}
