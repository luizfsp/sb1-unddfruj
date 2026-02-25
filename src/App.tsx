import { useState, useEffect, useRef } from 'react';
import { 
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
  const [whatsappSummary, setWhatsappSummary] = useState("");
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

  // Efeito para carregar o Feed de Notícias do ConJur
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
          let filtered: NewsItem[] = data.items.map((item: any) => ({
            title: item.title,
            pubDate: item.pubDate,
            link: item.link,
            description: stripHtml(item.description).substring(0, 150) + "..."
          }));

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
    setWhatsappSummary("");

    let apiKey = "";
    try {
      // @ts-ignore
      if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
        // @ts-ignore
        apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      }
    } catch (e) {}
    
    // Prompt atualizado para forçar a separação do resumo com a tag "RESUMO_WHATSAPP:"
    const systemPrompt = `Você é um assistente jurídico virtual (IA) do escritório 'Saraiva & Advogados', especializado em Direito da Saúde no Brasil. 
    Analise o relato do usuário e forneça:
    1. Uma breve avaliação (1 parágrafo) indicando se parece haver uma violação de direitos (ex: abusividade do plano, dever do SUS, indícios de erro médico).
    2. A recomendação clara de que um advogado especialista deve avaliar os documentos (laudos, negativas) para confirmar a viabilidade de uma liminar (Tutela de Urgência).
    3. OBRIGATORIAMENTE, separe a última parte do seu texto com a palavra-chave exata "RESUMO_WHATSAPP:" (em maiúsculas e com dois pontos). Logo após essa palavra-chave, escreva apenas o 'Resumo Estruturado' final em tópicos (Problema, Documentos, Ação Necessária) que o cliente enviará ao advogado.
    Seja empático, acolhedor, profissional e transmita urgência. NÃO dê garantias de causa ganha. Formate o texto usando quebras de linha e **negrito** (apenas isso, sem listas complexas).`;

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
        // Lógica para cortar o texto apenas na parte do resumo para enviar ao WhatsApp
        if (text.includes("RESUMO_WHATSAPP:")) {
          const parts = text.split("RESUMO_WHATSAPP:");
          // A interface mostra tudo estruturado
          setAiAnalysis(parts[0].trim() + "\n\n**Resumo Estruturado para o WhatsApp:**\n" + parts[1].trim());
          // O link do WhatsApp envia apenas o resumo
          setWhatsappSummary(parts[1].trim());
        } else {
          setAiAnalysis(text);
          setWhatsappSummary(text); // Fallback caso a IA não use a tag
        }
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
          
          <a href="#" className="flex items-center">
            {/* O logotipo usa o caminho da pasta public para funcionar no Vercel sem falhas */}
            <img 
              src="/Logo 2_Fundo Transparente.png" 
              alt="Saraiva & Advogados Associados" 
              className="h-16 w-auto object-contain transition-all duration-300"
            />
          </a>

          <nav className="hidden md:flex gap-8 items-center">
            <a href="#solucoes" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Áreas de Atuação</a>
            <a href="#sobre" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Nossos Especialistas</a>
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
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed text-justify">
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
                  src="/7854563567.jpg" 
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
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600"><HeartPulse /></div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Planos de Saúde</h4>
              <p className="text-slate-600 text-sm leading-relaxed">Revisão de reajustes abusivos, reversão de negativas para internação, tratamento médico, internação, cirurgias, fornecimento de medicamentos, exames, negativa de reembolso, entre outros.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600"><ShieldAlert /></div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Descredenciamento Indevido</h4>
              <p className="text-slate-600 text-sm leading-relaxed">Pedido de liminar para manutenção de Hospital, Clínicas, Laboratórios e prestadores de serviço em caso de descredenciamento irregular pela operadora de saúde.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600"><CheckCircle2 /></div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Tratamentos</h4>
              <p className="text-slate-600 text-sm leading-relaxed">Cobertura para terapias voltadas ao TEA, Home Care e demais doenças raras de forma assertiva.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600"><FileWarning /></div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Erro Médico</h4>
              <p className="text-slate-600 text-sm leading-relaxed">Ação indenizatória decorrente de responsabilidade civil médica decorrente de negligência, imprudência ou imperícia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
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
              <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">Nossos Especialistas</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Para nós, todo caso é um caso especial.
              </h3>
              <div className="space-y-4 text-slate-600 text-lg leading-relaxed text-justify">
                <p>Somos uma advocacia especializada no Direito da Saúde.</p>
                <p>Atuamos com ética e sensibilidade no atendimento, buscando garantir os seus direitos sempre com amparo na lei.</p>
                <p>
                  Com mais de 25 anos de sólida experiência, o <strong>Dr. Fabio Saraiva</strong> é membro efetivo da Comissão Especial de Direito do Seguro e Resseguro e da Comissão de Defesa do Consumidor da Ordem dos Advogados do Brasil - São Paulo. Fundou o escritório com um propósito claro: entregar um atendimento humanizado, ético e assertivo na defesa dos interesses dos seus clientes, especialmente em uma área que requer a atuação de profissionais altamente especializados e qualificados para enfrentar as gigantes da área da saúde suplementar no Brasil.
                </p>
                <p>No Direito da Saúde, sabemos que a experiência e o rigor técnico precisam andar juntos. Um processo promovido contra grandes operadoras exige uma advocacia artesanal, onde cada laudo médico e cada vírgula importam.</p>
                <p>Assim, nossa missão é ser o seu escudo jurídico. Protegemos famílias contra as práticas abusivas das operadoras de planos de saúde, de modo a assegurar o respeito e a dignidade dos pacientes no momento em que mais precisam.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA (PASSO A PASSO) */}
      <section className="py-24 bg-blue-950 text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-3">Processo Simplificado</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold mb-6">
              Como garantimos o seu tratamento rapidamente
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Linha conectora (visível apenas em telas grandes) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-blue-800/50"></div>

            {/* Passos */}
            {[
              {
                step: "01",
                title: "Contato Imediato",
                desc: "Relate o seu caso pelo WhatsApp de forma 100% segura e sigilosa."
              },
              {
                step: "02",
                title: "Análise Gratuita",
                desc: "Avaliamos o seu caso de forma minuciosa quanto a viabilidade da ação."
              },
              {
                step: "03",
                title: "Pedido de Liminar",
                desc: "Ingressamos com a ação apropriada com pedido de liminar buscando a garantia dos seus direitos."
              },
              {
                step: "04",
                title: "Tranquilidade",
                desc: "Informações atualizadas do processo em linguagem clara (sem “juridiquês”)."
              }
            ].map((item, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-blue-900 border-4 border-slate-900 flex items-center justify-center mb-6 shadow-xl group-hover:bg-amber-500 group-hover:border-amber-600 transition-colors duration-300">
                  <span className="text-2xl font-black text-white">{item.step}</span>
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-blue-200 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
             <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex bg-white hover:bg-slate-100 text-blue-950 px-8 py-4 rounded-lg font-bold text-lg items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-1">
                Iniciar o Passo 1 Agora
             </a>
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
            <div className="bg-white rounded-2xl p-8 shadow-sm border relative mt-6 hover:shadow-lg transition-all">
              <div className="absolute -top-6 left-8 bg-blue-600 rounded-full p-3 shadow-lg text-white"><Quote size={20} /></div>
              <div className="flex gap-1 mb-4 mt-2">{[1,2,3,4,5].map(s => <Star key={s} className="text-amber-400 fill-amber-400" size={16} />)}</div>
              <p className="text-slate-600 text-sm italic mb-6">"O Dr. Fabio foi um anjo. Conseguiu a liminar para a cirurgia da minha mãe em menos de 48 horas. Atendimento humano e rápido."</p>
              <div className="border-t pt-4 font-bold text-slate-900 text-sm">Maria Fernandes</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border relative mt-6 hover:shadow-lg transition-all">
              <div className="absolute -top-6 left-8 bg-blue-600 rounded-full p-3 shadow-lg text-white"><Quote size={20} /></div>
              <div className="flex gap-1 mb-4 mt-2">{[1,2,3,4,5].map(s => <Star key={s} className="text-amber-400 fill-amber-400" size={16} />)}</div>
              <p className="text-slate-600 text-sm italic mb-6">"A equipe assumiu meu caso de medicamento de alto custo e conseguiu a liberação judicial em tempo recorde. Trabalho excepcional!"</p>
              <div className="border-t pt-4 font-bold text-slate-900 text-sm">Carlos Eduardo Silva</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border relative mt-6 hover:shadow-lg transition-all">
              <div className="absolute -top-6 left-8 bg-blue-600 rounded-full p-3 shadow-lg text-white"><Quote size={20} /></div>
              <div className="flex gap-1 mb-4 mt-2">{[1,2,3,4,5].map(s => <Star key={s} className="text-amber-400 fill-amber-400" size={16} />)}</div>
              <p className="text-slate-600 text-sm italic mb-6">"Aqui não fui tratada como número. O Dr. Fabio explicou tudo com clareza e lutou pela terapia intensiva do meu filho com TEA."</p>
              <div className="border-t pt-4 font-bold text-slate-900 text-sm">Ana Paula Rezende</div>
            </div>
          </div>
        </div>
      </section>

      {/* IA ANALISADOR RESTAURADO CONFORME IMAGEM */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4 text-amber-600">
              <Sparkles size={32} />
            </div>
            <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">
              Tecnologia a seu favor
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Pré-Avaliação Assistida por Inteligência Artificial
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
              Avaliação de forma rápida pelos nossos profissionais especializados. Descreva brevemente o seu problema (Exemplo: Reajuste abusivo; negativa de internação; negativa de tratamento, outros). A nossa IA analisará de forma rápida e direcionará o seu caso para atendimento de um especialista.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <label htmlFor="case-description" className="block text-sm font-bold text-slate-700 mb-2">
              Descreva o que aconteceu:
            </label>
            <textarea
              id="case-description"
              rows={5}
              className="w-full rounded-xl border-slate-300 border p-4 text-slate-700 focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none shadow-inner"
              placeholder="O meu plano de saúde negou a cobertura da minha cirurgia oncológica alegando que não consta no rol, mas o meu médico disse que o caso é urgente..."
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
            ></textarea>
            {aiError && <p className="text-red-500 text-sm mt-3">{aiError}</p>}
            <div className="mt-6 flex justify-end">
              <button 
                onClick={analyzeCaseWithAI} 
                disabled={isAnalyzing || !caseDescription.trim()} 
                className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-900/50 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Analisando o seu caso...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="text-amber-400" />
                    Analisar meu caso com IA
                    <Sparkles size={18} className="text-amber-400" />
                  </>
                )}
              </button>
            </div>
            {aiAnalysis && (
              <div className="mt-8 pt-8 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" size={24} />
                  Parecer Preliminar da IA:
                </h4>
                <div 
                  className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-slate-700 leading-relaxed text-sm md:text-base"
                  dangerouslySetInnerHTML={formatAIResponse(aiAnalysis)}
                />
                
                <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-800 font-medium">
                    Tudo pronto para dar o próximo passo?
                  </p>
                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Fiz a pré-análise do meu caso no site através da IA. Segue o resumo:\n\n")}${encodeURIComponent(whatsappSummary)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md whitespace-nowrap"
                  >
                    <Send size={18} />
                    Enviar Resumo para o Especialista
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* NOTÍCIAS */}
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
            <FaqItem 
              question="O plano de saúde negou meu tratamento. O que eu faço?" 
              answer="Não aceite o “não” como resposta final. Reúna a negativa por escrito (ou protocolo de atendimento) e o laudo do seu médico justificando a necessidade do tratamento. O plano não pode interferir na conduta do médico assistente. Com esses documentos, podemos ingressar com uma ação judicial em caráter de urgência pedindo uma liminar para assegurar a cobertura do tratamento." 
            />
            <FaqItem 
              question="Quanto tempo demora para a justiça analisar o meu caso e determinar que uma operadora autorize a cirurgia?" 
              answer="Em casos de urgência e emergência que possam causar riscos à saúde e à vida, nossos especialistas ingressarão com um pedido de Tutela Antecipada de Urgência em caráter liminar. A Justiça costuma analisar esses pedidos de forma muito rápida, normalmente entre 24 a 72 horas após a propositura da ação." 
            />
            <FaqItem 
              question="O escritório atende pessoas de fora de São Paulo?" 
              answer="Sim! Devido ao processo judicial eletrônico existente em praticamente todo o Brasil, nossos profissionais estão aptos a analisar o seu caso com a mesma agilidade e excelência, realizando reuniões por videochamada e contato via WhatsApp. Possuímos correspondentes em todas as capitais do país para garantir suporte total." 
            />
            <FaqItem 
              question="A operadora pode cancelar o meu contrato ou suspender o tratamento se eu ingressar com uma ação judicial?" 
              answer="Não! Nenhuma operadora pode promover retaliações contra um cliente que buscou os seus direitos. Essa prática é ilegal e se ocorrer, a justiça determina o restabelecimento imediato do contrato, inclusive com a condenação da operadora a pagar indenização por danos morais." 
            />
             <FaqItem 
              question="Meu plano de saúde descredenciou o Hospital Albert Einstein em São Paulo e não fui comunicado. Tenho direito a exigir a manutenção do hospital no meu plano?" 
              answer="Tratando-se de um hospital de referência no Brasil reconhecido internacionalmente, sem substituto de excelência assistencial, inovação tecnológica, de equipe médica, entre outros fatores, além de não ter havido uma comunicação prévia ou redução da mensalidade paga, esse descredenciamento pode ser considerado abusivo, garantindo o direito de o consumidor buscar a manutenção do credenciamento, entre outros direitos como redução do valor da mensalidade paga. Se o consumidor estiver em tratamento médico e este tratamento for suspenso devido ao descredenciamento, poderá pleitear uma liminar para manutenção do tratamento, assim como se for surpreendido quando de um atendimento de urgência/emergência em pronto socorro e não for atendido, com direito inclusive de pleitear indenização por danos morais sofridos em ambos os casos." 
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Você não está sozinho para enfrentar o sistema.
          </h2>
          <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto text-justify">
            Conte sempre com os nossos profissionais altamente especializados e capacitados para analisar o seu caso com total sigilo, segurança e assertividade na busca da defesa dos seus interesses e solução do problema.
          </p>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex bg-amber-500 hover:bg-amber-400 text-slate-900 px-10 py-5 rounded-xl font-black text-xl items-center justify-center gap-3 transition-transform hover:scale-105 shadow-2xl">
            <Phone size={28} />
            Falar com um Especialista
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 pt-20 pb-10 text-slate-400 border-t-4 border-amber-500">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-6">
                <img 
                  src="/Logo 2_Fundo Transparente.png" 
                  alt="Saraiva & Advogados Associados" 
                  className="h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
              <p className="mb-4 text-justify">Experiência adquirida durante mais de 25 anos de atuação. Atendimento personalizado e exclusivo com dedicação, ética e transparência na defesa da sua saúde.</p>
              <p className="text-white font-bold uppercase tracking-widest text-xs">Fabio Tadeu Saraiva (OAB/SP: 184.971)</p>
            </div>
            <div className="md:col-span-3">
              <h5 className="text-white font-bold mb-6 text-sm">Links Rápidos</h5>
              <ul className="space-y-3">
                <li><a href="#solucoes" className="hover:text-amber-500">Áreas de Atuação</a></li>
                <li><a href="#sobre" className="hover:text-amber-500">Sobre o Escritório</a></li>
                <li><a href="#depoimentos" className="hover:text-amber-500">Depoimentos</a></li>
                <li><a href="#faq" className="hover:text-amber-500">Dúvidas Frequentes</a></li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <h5 className="text-white font-bold mb-6 text-sm">Contato & Endereço</h5>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <MapPin className="text-blue-600 shrink-0 mt-1" size={20} />
                  <span>Rua Afonso Celso, 1221, Cj. 16<br />Vila Mariana, São Paulo/SP<br />CEP: 04119-061</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-blue-600 shrink-0" size={20} />
                  <span>(11) 96281-7392</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-blue-600 shrink-0" size={20} />
                  <span>saraiva@saraivaeadvogados.com.br</span>
                </li>
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

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all duration-300">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors outline-none">
        <span className="font-bold text-slate-900 pr-8">{question}</span>
        <ChevronDown className={`text-blue-600 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>
      <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-600 text-sm leading-relaxed border-t pt-4">{answer}</p>
      </div>
    </div>
  );
}


