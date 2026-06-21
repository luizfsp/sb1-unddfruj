import { useState, useEffect, useRef } from 'react';
import { 
  HeartPulse, 
  ShieldAlert, 
  FileWarning, 
  ChevronDown, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Award, 
  CheckCircle2,
  Loader2,
  Send,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ExternalLink,
  Star,
  Quote,
  User
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
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Estado para o Feed de Notícias
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Sugestões rápidas para preenchimento do formulário de IA
  const presetCases = [
    { label: "Negativa de Cirurgia", text: "O meu plano de saúde recusou cobrir a minha cirurgia, alegando que o procedimento não está no rol da ANS ou que estou em período de carência." },
    { label: "Medicamento de Alto Custo", text: "Preciso de um medicamento de alto custo prescrito pelo meu médico, mas a operadora de saúde negou o fornecimento." },
    { label: "Aumento Abusivo", text: "A mensalidade do meu plano de saúde sofreu um reajuste extremamente alto e abusivo por mudança de faixa etária ou sinistralidade." },
    { label: "Tratamento TEA", text: "O plano de saúde está a limitar o número de sessões ou a recusar a cobertura para o tratamento multidisciplinar de autismo (TEA) do meu filho." }
  ];

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
          description: "A decisão reforça a obrigatoriedade da cobertura integral para beneficiários in tratamentos específicos." 
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

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!clientName.trim()) {
      setFormError("Por favor, preencha o seu nome completo.");
      return;
    }
    if (!clientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())) {
      setFormError("Por favor, preencha um e-mail de contato válido.");
      return;
    }
    if (!caseDescription.trim()) {
      setFormError("Por favor, descreva o seu caso brevemente.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "aff42f13-87de-4a1d-8979-4a2a108b4433",
          name: clientName,
          email: clientEmail,
          phone: clientPhone || "Não informado",
          message: caseDescription,
          subject: `Novo Contato Jurídico - ${clientName}`,
          from_name: "Site Saraiva & Advogados",
        })
      });

      const result = await response.json();
      if (result.success) {
        setFormSubmitted(true);
      } else {
        setFormError(result.message || "Ocorreu um erro ao enviar a sua mensagem. Tente novamente.");
      }
    } catch (error: any) {
      setFormError(`Erro de conexão ao enviar: ${error.message || "Verifique sua conexão e tente novamente."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 scroll-smooth">
      
      {/* HEADER */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-slate-900/95 backdrop-blur-sm py-5'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          
          <a href="#" className="flex items-center">
            {/* Logótipo com escala dinâmica optimizada (maior no computador, equilibrado no telemóvel) */}
            <img 
              src="/Logo 2_Fundo Transparente.png" 
              alt="Saraiva & Advogados Associados" 
              className="h-20 md:h-24 w-auto object-contain transition-all duration-300"
            />
          </a>

          <nav className="hidden md:flex gap-8 items-center">
            <a href="#solucoes" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Áreas de Atuação</a>
            <a href="#contato-formulario" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Fale Conosco</a>
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
                
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed text-justify">
                Advocacia especializada na atuação contra Operadoras de Planos de Saúde. Atuamos com rapidez para garantir o seu direito à saúde e à vida com pedido de liminares de urgência em casos de negativas abusivas e ilegais.
              </p>
              
              {/* ÁREA DE BOTÕES DO INÍCIO */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center md:justify-start items-stretch sm:items-center">
                {/* Botão de Destaque: Enviar Caso por E-mail */}
                <a href="#contato-formulario" className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 px-8 py-4 rounded-lg font-black text-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-1">
                  <Mail size={20} />
                  Enviar Caso por E-mail
                </a>
                
                {/* Falar com Especialista (WhatsApp) */}
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(202,138,4,0.3)] hover:-translate-y-1">
                  <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-6 h-6 object-contain" />
                  Falar com um Especialista
                </a>
                
                {/* Atendimento de Urgência (WhatsApp Urgente) */}
                <a href={whatsappLinkUrgency} target="_blank" rel="noreferrer" className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:-translate-y-1">
                  <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-6 h-6 object-contain" />
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
              <p className="text-slate-600 font-medium text-sm px-4">Atuação ágil para garantir tratamentos e medicamentos vitais negados indevidamente pelas Operadoras de Plano de Saúde.</p>
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
              <p className="text-slate-600 text-sm leading-relaxed text-justify">Nossos advogados atuam contra práticas abusivas de operadoras de planos de saúde em assuntos como: 1) liminares contra negativa para internação, exames e tratamento médico; 2) cirurgias em geral (incluindo bariátrica e cirurgia plástica reparadora); 3) exames de alta complexidade decorrente de alegação de carência, doença preexistente ou que está fora do rol de procedimentos da ANS; 4) reversão de negativas de reembolso; 5) fornecimento de medicamentos, 6) Descredenciamento de Hospitais, Laboratórios, Clínicas, entre outros.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600"><ShieldAlert /></div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Reajuste Abusivo</h4>
              <p className="text-slate-600 text-sm leading-relaxed text-justify">Atuamos na revisão de reajustes abusivos praticados pelas operadoras de plano de saúde, amparado em cálculos contábeis/atuariais, inclusive com pedido de liminar, possibilitando a redução do valor da mensalidade e restituição dos valores pagos a maior dos últimos 3 anos devidamente corrigido.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600"><CheckCircle2 /></div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Seguros em Geral</h4>
              <p className="text-slate-600 text-sm leading-relaxed text-justify">Ações contra seguradoras por negativas indevidas de pagamento de seguro de vida de agravamento de risco, negativa de pagamento de seguro automóvel, entre outros.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600"><FileWarning /></div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Erro Médico</h4>
              <p className="text-slate-600 text-sm leading-relaxed text-justify">Atuação na defesa dos interesses dos nossos clientes em casos que envolvem discussão de erro médico por negligência, imprudência ou imperícia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECÇÃO DO FORMULÁRIO DE CONTATO DIRETO POR E-MAIL */}
      <section id="contato-formulario" className="py-24 bg-white text-slate-800 relative overflow-hidden">
        {/* Elementos decorativos de luz e fundo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            
            {/* Coluna Esquerda: Texto de Enquadramento e Proposta de Valor */}
            <div className="lg:w-5/12 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 px-4 py-2 rounded-full mb-6 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
                <Mail size={16} />
                Atendimento Rápido e Seguro
              </div>
              <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                Fale com um <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-sky-800">especialista.</span>
              </h3>
              <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed text-justify">
                Preencha o formulário para enviar os detalhes da sua situação diretamente ao e-mail do Dr. Fabio Saraiva. Avaliaremos o seu relato de forma cuidadosa e ágil para retornar o contato.
              </p>
              
              <div className="space-y-4 hidden lg:block">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg text-blue-800">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Privacidade Total</h5>
                    <p className="text-slate-600 text-xs">Os seus dados são protegidos e tratados sob rigoroso sigilo profissional.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg text-blue-800">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Retorno Garantido</h5>
                    <p className="text-slate-600 text-xs">Análise técnica com retorno ágil via e-mail ou WhatsApp informado.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita: O Painel do Formulário Interativo */}
            <div className="lg:w-7/12 w-full">
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl relative min-h-[400px] flex flex-col justify-center">
                {/* Linha brilhante no topo do card */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500 to-transparent"></div>

                {formSubmitted ? (
                  <div className="text-center py-10 px-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-emerald-50 border border-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                      <CheckCircle2 size={40} className="animate-pulse" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-4">Mensagem Enviada com Sucesso!</h4>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto mb-8 text-justify">
                      Agradecemos o seu contato. Suas informações e a descrição do caso foram enviadas com segurança diretamente ao e-mail do Dr. Fabio Saraiva.
                      <br /><br />
                      Analisaremos todos os detalhes da sua situação com o máximo de critério e entraremos em contato em breve através dos canais informados.
                    </p>
                    <div className="border-t border-slate-200 pt-6">
                      <p className="text-xs text-slate-500 mb-4">
                        Deseja falar com um especialista por mensagem agora mesmo?
                      </p>
                      <a 
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Sou ${clientName}. Enviei os detalhes do meu caso pelo formulário do site e gostaria de um retorno.`)}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-xl font-bold text-sm items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md"
                      >
                        <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                        Falar no WhatsApp Agora
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="mb-2">
                      <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Selecione um exemplo rápido de problema para preencher a descrição:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {presetCases.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setCaseDescription(preset.text);
                              setFormError("");
                            }}
                            className={`text-xs px-3 py-2 rounded-lg border transition-all font-semibold ${
                              caseDescription === preset.text 
                                ? 'bg-sky-700 border-sky-700 text-white font-bold shadow-md shadow-sky-500/20' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Campo de Nome Completo */}
                    <div className="relative">
                      <label htmlFor="client-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Seu Nome Completo:
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <User size={18} />
                        </span>
                        <input
                          id="client-name"
                          type="text"
                          className="w-full rounded-2xl bg-white border-slate-200 border pl-11 pr-4 py-3.5 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all shadow-sm text-sm"
                          placeholder="Ex: Maria da Silva"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Grid de E-mail e Telefone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label htmlFor="client-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Seu E-mail de Contato:
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <Mail size={18} />
                          </span>
                          <input
                            id="client-email"
                            type="email"
                            className="w-full rounded-2xl bg-white border-slate-200 border pl-11 pr-4 py-3.5 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all shadow-sm text-sm"
                            placeholder="Ex: maria@exemplo.com"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="client-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Seu WhatsApp / Telefone (com DDD):
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <Phone size={18} />
                          </span>
                          <input
                            id="client-phone"
                            type="tel"
                            className="w-full rounded-2xl bg-white border-slate-200 border pl-11 pr-4 py-3.5 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all shadow-sm text-sm"
                            placeholder="Ex: (11) 99999-9999"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Descrição do Caso */}
                    <div className="relative">
                      <label htmlFor="case-description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Conte-me sobre o seu caso:
                      </label>
                      <textarea
                        id="case-description"
                        rows={4}
                        className="w-full rounded-2xl bg-white border-slate-200 border p-4 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none shadow-sm text-sm leading-relaxed"
                        placeholder="Descreva aqui o ocorrido com o máximo de detalhes possível (ex: recusa de cobertura de cirurgia, reajuste abusivo, medicamento de alto custo...)"
                        value={caseDescription}
                        onChange={(e) => setCaseDescription(e.target.value)}
                      ></textarea>
                    </div>

                    {formError && <p className="text-red-500 text-xs mt-2 flex items-center gap-1 font-semibold">⚠️ {formError}</p>}
                    
                    <div className="mt-5 flex justify-end">
                      <button 
                        type="submit"
                        disabled={isSubmitting || !caseDescription.trim() || !clientName.trim() || !clientEmail.trim()} 
                        className="w-full sm:w-auto bg-sky-700 hover:bg-amber-600 disabled:bg-slate-100 disabled:text-slate-400 text-slate-900 px-8 py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-sky-500/10 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Enviando sua mensagem...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Enviar Formulário por E-mail
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
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
                <img src="https://i.ibb.co/HfW3qVCZ/Whats-App-Image-2026-06-01-at-20-46-27.jpg" alt="Detalhe" className="rounded-lg shadow-xl absolute -bottom-12 -left-4 w-3/5 border-8 border-white"/>
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
                  Com mais de 25 anos de sólida experiência, o <strong>Dr. Fabio Saraiva</strong> é membro efetivo das Comissões Especiais de Direito Médico e de Saúde, Direito do Seguro e Resseguro e de Defesa do Consumidor da Ordem dos Advogados do Brasil - São Paulo. Fundou o escritório com um propósito claro: entregar um atendimento humanizado, ético e assertivo na defesa dos interesses dos seus clientes, especialmente em uma área que requer a atuação de profissionais altamente especializados e qualificados para enfrentar as gigantes da área da saúde suplementar no Brasil.
                </p>
                <p>No Direito da Saúde, sabemos que a experiência e o rigor técnico precisam andar juntos. Um processo promovido contra grandes operadoras exige uma advocacia artesanal, onde cada laudo médico e cada vírgula importam.</p>
                <p>Nossa missão é ser o seu escudo jurídico. Protegemos famílias contra as práticas abusivas das operadoras de planos de saúde, de modo a assegurar o respeito e a dignidade dos pacientes no momento em que mais precisam, assim como defendemos os interesses dos profissionais da área médica perante ao órgão de classe e ações indenizatória de responsabilidade civil decorrente de alegação de erro médico.</p>
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
              Como atuamos na busca da garantia dos seus direitos
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
                desc: "Informações atualizadas do processo in linguagem clara (sem “juridiquês”)."
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
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Você não está sozinho para enfrentar o sistema.
          </h2>
          <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto text-justify">
            Conte sempre com os nossos profissionais altamente especializados e capacitados para analisar o seu caso com total sigilo, segurança e assertividade na busca da defesa dos seus interesses e solução do problema.
          </p>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex bg-amber-500 hover:bg-amber-400 text-slate-900 px-10 py-5 rounded-xl font-black text-xl items-center justify-center gap-3 transition-transform hover:scale-105 shadow-2xl">
            <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-7 h-7 object-contain" />
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
                  <span>contato@saraivaeadvogados.com.br</span>
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
      <a href={whatsappLink} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50">
        <img 
          src="/WhatsApp_Logo.png" 
          alt="WhatsApp" 
          className="w-14 h-14 object-contain" 
        />
      </a>
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
