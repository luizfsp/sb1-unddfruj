import { useState, useEffect } from 'react';
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
  Send
} from 'lucide-react';

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [caseDescription, setCaseDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiError, setAiError] = useState("");

  // Efeito para mudar a cor do cabeçalho ao fazer scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappNumber = "5511962817392";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Ol%C3%A1,%20gostaria%20de%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica%20na%20%C3%A1rea%20da%20sa%C3%BAde.`;

  const analyzeCaseWithAI = async () => {
    if (!caseDescription.trim()) {
      setAiError("Por favor, descreva o seu caso brevemente.");
      return;
    }

    setIsAnalyzing(true);
    setAiError("");
    setAiAnalysis(null);

    const apiKey = ""; // A chave da API é injetada no ambiente de execução
    const systemPrompt = `Você é um assistente jurídico virtual (IA) do escritório 'Saraiva & Advogados', especializado em Direito da Saúde no Brasil. 
    Analise o relato do usuário e forneça:
    1. Uma breve avaliação (1 parágrafo) indicando se parece haver uma violação de direitos (ex: abusividade do plano, dever do SUS, indícios de erro médico).
    2. A recomendação clara de que um advogado especialista deve avaliar os documentos (laudos, negativas) para confirmar a viabilidade de uma liminar (Tutela de Urgência).
    3. Um 'Resumo Estruturado': um texto curto e objetivo que o usuário possa enviar no WhatsApp do escritório para iniciar o atendimento.
    Seja empático, acolhedor, profissional e transmita urgência. NÃO dê garantias de causa ganha. Formate o texto usando quebras de linha e **negrito** (apenas isso, sem listas complexas).`;

    const prompt = `Relato do paciente/cliente: ${caseDescription}`;

    const fetchWithRetry = async (url: string, options: RequestInit, retries = 5, delay = 1000): Promise<any> => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url, options);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return await response.json();
        } catch (e) {
          if (i === retries - 1) throw e;
          await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
        }
      }
    };

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
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
    } catch (error) {
      setAiError("Ocorreu um erro ao conectar com a IA. Por favor, tente novamente mais tarde.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatAIResponse = (text: string) => {
    // Transforma negrito de markdown e quebras de linha em HTML
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
      .replace(/\n/g, '<br />');
    return { __html: formattedText };
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* HEADER / NAVEGAÇÃO */}
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
            <a href="#faq" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Dúvidas</a>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105 shadow-lg">
              Fale Conosco
            </a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION - A PRIMEIRA IMPRESSÃO */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-900 overflow-hidden">
        {/* Fundo abstrato elegante */}
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
                A Justiça também não.
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                Advocacia altamente especializada contra negativas de <strong>Planos de Saúde</strong>, <strong>SUS</strong> e <strong>Erros Médicos</strong>. Agimos com rapidez para garantir o seu direito à vida através de liminares de urgência.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:-translate-y-1">
                  <MessageCircle size={24} />
                  Falar com um Especialista Agora
                </a>
              </div>
            </div>
            
            <div className="md:w-2/5 relative">
              {/* Moldura da imagem do Hero */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700/50 group">
                {/* INSTRUÇÃO: Substituir o src abaixo pela foto principal do Dr. Fabio Saraiva (Drive) 
                  Idealmente uma foto com postura confiante, fundo escuro ou clean.
                */}
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
                      <p className="text-slate-300 text-sm">Fundador e Especialista</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUTORIDADE E PROVA SOCIAL */}
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
              <p className="text-slate-600 font-medium text-sm px-4">Soluções jurídicas sob medida para cada cliente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSAS SOLUÇÕES */}
      <section id="solucoes" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">Áreas de Especialidade</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
              Como podemos proteger o seu direito à saúde?
            </h3>
            <p className="text-slate-600 text-lg">
              Atuamos contra as práticas abusivas de operadoras de saúde e do Estado, garantindo que o seu tratamento médico não seja interrompido ou negado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group hover:-translate-y-2">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <HeartPulse className="text-blue-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Planos de Saúde</h4>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Reversão de negativas para cirurgias, exames, próteses e contestação de reajustes abusivos (falsos coletivos ou faixa etária).
              </p>
              <a href={whatsappLink} className="text-blue-700 font-bold text-sm flex items-center gap-1 group-hover:text-amber-600 transition-colors">
                Saber mais <ChevronDown size={16} className="-rotate-90" />
              </a>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group hover:-translate-y-2">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <ShieldAlert className="text-blue-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Medicamentos de Alto Custo</h4>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Ações rápidas com pedido de liminar para obtenção de remédios importados ou oncológicos não fornecidos pelo SUS ou Convênio.
              </p>
              <a href={whatsappLink} className="text-blue-700 font-bold text-sm flex items-center gap-1 group-hover:text-amber-600 transition-colors">
                Saber mais <ChevronDown size={16} className="-rotate-90" />
              </a>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group hover:-translate-y-2">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <CheckCircle2 className="text-blue-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Tratamentos Específicos</h4>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Garantia de cobertura para terapias voltadas ao Transtorno do Espectro Autista (TEA), Home Care e doenças raras.
              </p>
              <a href={whatsappLink} className="text-blue-700 font-bold text-sm flex items-center gap-1 group-hover:text-amber-600 transition-colors">
                Saber mais <ChevronDown size={16} className="-rotate-90" />
              </a>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group hover:-translate-y-2">
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <FileWarning className="text-blue-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Erro Médico</h4>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Busca por responsabilidade civil e indenização por negligência, imprudência ou falha em prestação de serviços de saúde.
              </p>
              <a href={whatsappLink} className="text-blue-700 font-bold text-sm flex items-center gap-1 group-hover:text-amber-600 transition-colors">
                Saber mais <ChevronDown size={16} className="-rotate-90" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE O DR. FABIO (O ROSTO DA CONFIANÇA) */}
      <section id="sobre" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              {/* Composição de Imagens */}
              <div className="relative">
                {/* INSTRUÇÃO: Substituir pela foto do Dr. Fabio em ação/reunião */}
                <img 
                  src="https://i.ibb.co/s9PyNDNW/firefox-1f-HADh-BJWx.jpg" 
                  alt="Escritório Saraiva & Advogados" 
                  className="rounded-lg shadow-2xl w-4/5 ml-auto"
                />
                {/* INSTRUÇÃO: Substituir pela foto da fachada ou ambiente do escritório */}
                <img 
                  src="https://i.ibb.co/KzDCcZBV/456324765.jpg" 
                  alt="Detalhe Escritório" 
                  className="rounded-lg shadow-xl absolute -bottom-12 -left-4 w-3/5 border-8 border-white"
                />
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-16 lg:mt-0">
              <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">O Especialista</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Sensibilidade no atendimento, rigor absoluto na lei.
              </h3>
              <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                <p>
                  Com mais de duas décadas de sólida experiência jurídica nos mais diversos ramos corporativos e civis, o <strong>Dr. Fabio Saraiva</strong> fundou o escritório com um propósito claro: entregar um atendimento humanizado e implacável na defesa dos pacientes.
                </p>
                <p>
                  No Direito da Saúde, sabemos que a vulnerabilidade e o rigor técnico precisam andar juntos. Um processo contra uma gigante operadora de saúde ou contra o Estado exige uma advocacia artesanal, onde cada laudo e cada vírgula importam.
                </p>
                <p>
                  Nossa missão é ser o seu escudo jurídico. Protegemos famílias contra os abusos do sistema, garantindo dignidade, tratamentos e resultados rápidos no momento em que você mais precisa.
                </p>
              </div>
              
              <div className="mt-10">
                <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                    <Scale size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Atendimento Pessoal</p>
                    <p className="text-sm text-slate-600">O seu caso será conduzido diretamente pelos nossos especialistas.</p>
                  </div>
                </div>
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
                desc: "Avaliamos a negativa, os laudos médicos e a viabilidade da ação."
              },
              {
                step: "03",
                title: "Ação Urgente",
                desc: "Entramos com o pedido de liminar na Justiça em tempo recorde."
              },
              {
                step: "04",
                title: "Tranquilidade",
                desc: "Acompanhamento integral do processo, informando-o sem 'juridiquês'."
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

      {/* ANALISADOR DE CASO COM IA */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50 via-white to-white opacity-50 pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4 text-amber-600">
              <Sparkles size={32} />
            </div>
            <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">Tecnologia a seu favor</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Pré-Avaliação Assistida por Inteligência Artificial
            </h3>
            <p className="text-slate-600 text-lg">
              Descreva brevemente o seu problema (ex: negativa de cirurgia, falta de remédio). A nossa IA analisará o seu caso em segundos para direcionar e agilizar o atendimento com o especialista.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <label htmlFor="case-description" className="block text-sm font-bold text-slate-700 mb-2">
              Descreva o que aconteceu:
            </label>
            <textarea
              id="case-description"
              rows={5}
              className="w-full rounded-xl border-slate-300 border p-4 text-slate-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none shadow-inner"
              placeholder="Ex: O meu plano de saúde negou a cobertura da minha cirurgia oncológica alegando que não consta no rol, mas o meu médico disse que o caso é urgente..."
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
            ></textarea>

            {aiError && (
              <p className="text-red-500 text-sm mt-3 flex items-center gap-1">
                <ShieldAlert size={16} /> {aiError}
              </p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={analyzeCaseWithAI}
                disabled={isAnalyzing || !caseDescription.trim()}
                className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-900/50 text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analisando o seu caso...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="text-amber-400" />
                    Analisar meu caso com IA ✨
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
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Fiz a pré-análise do meu caso no site através da IA. Segue o resumo:\n\n")}${encodeURIComponent(aiAnalysis)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-md whitespace-nowrap"
                  >
                    <Send size={18} />
                    Enviar Resumo para o Advogado
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">Tire as Suas Dúvidas</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Perguntas Frequentes
            </h3>
          </div>

          <div className="space-y-4">
            <FaqItem 
              question="O plano de saúde negou meu tratamento. O que eu faço?" 
              answer="Não aceite o 'não' como resposta final. Reúna a negativa por escrito (ou protocolo de atendimento) e o laudo do seu médico justificando a necessidade do tratamento. O plano não pode interferir na conduta médica. Com esses documentos, podemos ingressar com uma ação judicial pedindo uma liminar urgente para obrigar a cobertura."
            />
            <FaqItem 
              question="Quanto tempo demora para a Justiça liberar uma medicação ou cirurgia urgente?" 
              answer="Em casos de urgência e emergência à saúde, ingressamos com um pedido de 'Liminar' (Tutela de Urgência). A Justiça costuma analisar esses pedidos de forma muito rápida, frequentemente no prazo de 24 a 48 horas após a distribuição do processo."
            />
            <FaqItem 
              question="O escritório atende pessoas de fora de São Paulo?" 
              answer="Sim. O processo judicial no Brasil hoje é 100% eletrónico. Isso nos permite atender clientes em qualquer cidade ou estado do país com a mesma agilidade e excelência, realizando reuniões por videochamada e contacto via WhatsApp."
            />
            <FaqItem 
              question="O plano pode cancelar o meu contrato se eu entrar com uma ação judicial?" 
              answer="Não. É ilegal que o plano de saúde promova retaliações ou cancele o contrato do beneficiário simplesmente por ele ter buscado os seus direitos na Justiça. A lei protege o consumidor nestas situações."
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Não enfrente o sistema sozinho.
          </h2>
          <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto">
            A nossa equipe está pronta para analisar o seu caso agora mesmo, com total sigilo e foco na resolução rápida do seu problema.
          </p>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex bg-amber-500 hover:bg-amber-400 text-slate-900 px-10 py-5 rounded-xl font-black text-xl items-center justify-center gap-3 transition-transform hover:scale-105 shadow-2xl">
            <Phone size={28} />
            Falar com um Advogado Especialista
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 pt-20 pb-10 text-slate-400 border-t-4 border-amber-500">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-6">
                <Scale className="text-amber-500" size={32} />
                <div>
                  <h4 className="text-xl font-bold tracking-tight text-white leading-none">
                    SARAIVA & ADVOGADOS
                  </h4>
                  <p className="text-xs font-medium tracking-widest uppercase text-slate-500">
                    Associados
                  </p>
                </div>
              </div>
              <p className="mb-6 max-w-md leading-relaxed">
                Experiência adquirida durante mais de 25 anos de atuação. Atendimento personalizado e exclusivo com dedicação, ética e transparência na defesa da sua saúde.
              </p>
            </div>
            
            <div className="md:col-span-3">
              <h5 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Links Rápidos</h5>
              <ul className="space-y-3">
                <li><a href="#solucoes" className="hover:text-amber-500 transition-colors">Áreas de Atuação</a></li>
                <li><a href="#sobre" className="hover:text-amber-500 transition-colors">Sobre o Escritório</a></li>
                <li><a href="#faq" className="hover:text-amber-500 transition-colors">Dúvidas Frequentes</a></li>
                <li><a href="#" className="hover:text-amber-500 transition-colors">Política de Privacidade (LGPD)</a></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h5 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contato & Endereço</h5>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <MapPin className="text-blue-600 shrink-0 mt-1" size={20} />
                  <span>Av. Nove de Julho, n° 3229, 11° andar, CJ 1103<br />Jardim Paulista, São Paulo/SP<br />CEP: 01407-000</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-blue-600 shrink-0" size={20} />
                  <span>(11) 96281-7392</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-blue-600 shrink-0" size={20} />
                  <span>saraiva@saraivaeadvogados.com.br</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="text-blue-600 shrink-0" size={20} />
                  <span>Segunda a Sexta, das 09h às 18h</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Saraiva & Advogados Associados. Todos os direitos reservados.</p>
            <p>OAB/SP - Inscrição Jurídica</p>
          </div>
        </div>
      </footer>

      {/* BOTÃO FLUTUANTE WHATSAPP */}
      <a 
        href={whatsappLink} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 z-50 flex items-center justify-center"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle size={32} />
        <span className="absolute -top-12 right-0 bg-white text-slate-800 text-xs font-bold px-3 py-1 rounded shadow-lg whitespace-nowrap opacity-0 md:opacity-100 hidden md:block">
          Entre em contato pelo whatsapp
        </span>
      </a>

    </div>
  );
}

// Componente Auxiliar para o Acordeão do FAQ
function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
      >
        <span className="font-bold text-slate-900 pr-8">{question}</span>
        <ChevronDown 
          className={`text-blue-600 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </button>
      <div 
        className={`px-6 text-slate-600 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}
      >
        <p className="leading-relaxed border-t border-slate-100 pt-4">{answer}</p>
      </div>
    </div>
  );
}
