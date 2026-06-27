import { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  ChevronDown, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Award, 
  ArrowLeft,  CheckCircle2,
  Loader2,
  Send,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ExternalLink,
  Star,
  User,
  FileCheck,
  Scale,
  Pill,
  Stethoscope,
  ShieldCheck
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
  const googleMapsLink = "https://www.google.com/maps/place/Saraiva+%26+Advogados+Associados/@-14.4095261,-51.31668,4z/data=!3m1!4b1!4m6!3m5!1s0x94ce5bbc948bf5c1:0xe06e22bfbf9da60e!8m2!3d-14.4095262!4d-51.31668!16s%2Fg%2F11nq0_hg79?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D";

  const [activeArticle, setActiveArticle] = useState<number | null>(null);

  // Efeito para tratar os links de Google Ads com parâmetros ?artigo=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const artigoParam = params.get('artigo');
    if (artigoParam === 'liminar') {
      setActiveArticle(1);
      window.scrollTo(0, 0);
    } else if (artigoParam === 'negativa') {
      setActiveArticle(2);
      window.scrollTo(0, 0);
    } else if (artigoParam === 'especialista') {
      setActiveArticle(3);
      window.scrollTo(0, 0);
    }
  }, []);

  const articles = [
    {
      id: 1,
      slug: "liminar",
      title: "Como Conseguir uma Liminar Contra o Plano de Saúde em Casos de Urgência",
      image: "/liminar.jpeg",
      excerpt: "Descobrir que o plano de saúde negou sua cobertura no momento em que você mais precisa gera angústia. Saiba como a Justiça pode reverter isso rapidamente.",
      intro: "Descobrir que o plano de saúde negou sua cobertura no momento em que você ou sua família mais precisam gera revolta e muita angústia. Em momentos de emergência médica, sabemos que cada minuto conta e a burocracia não pode custar a sua saúde. A boa notícia é que a Justiça entende essa urgência.",
      subtitle: "Como a Liminar pode salvar o seu tratamento",
      bullets: [
        { title: "Rapidez", text: "Em casos de risco de vida ou agravamento da saúde, a decisão costuma sair em questão de horas." },
        { title: "Abrangência", text: "Cobre internações de emergência, cirurgias inadiáveis, UTIs e liberação de medicamentos de alto custo (como oncológicos) pela operadora do plano de saúde." },
        { title: "Base Legal", text: "A prescrição do seu médico é soberana. O plano não pode interferir no tratamento que o especialista definiu como ideal." }
      ],
      conclusion: "Uma liminar concedida em tutela de urgência é uma decisão rápida do juiz que obriga o plano de saúde a autorizar o procedimento imediatamente, antes mesmo do fim do processo.\n\nNão perca tempo discutindo com o teleatendimento da operadora. A lei está do seu lado.",
      ctaText: "Seu caso é urgente? Clique aqui e fale agora com um especialista via WhatsApp.",
      ctaLink: whatsappLinkUrgency
    },
    {
      id: 2,
      slug: "negativa",
      title: "O que fazer quando o Plano de Saúde nega internações, cirurgias ou exames?",
      image: "/cirurgia.jpeg",
      excerpt: "Rol da ANS e carência são as justificativas mais comuns para negativas. Descubra a verdade sobre os seus direitos e como agir.",
      intro: "Receber um diagnóstico preocupante já é difícil. Mas o pior de tudo isso é ter o tratamento, a cirurgia ou o exame negado pelo plano de saúde sob a justificativa de que “não consta no Rol da ANS” ou mesmo sob a alegação de estar no período de carência.\n\nA verdade que as operadoras não te contam é que o Rol da ANS é apenas uma lista de referência básica, e não um limite para a sua saúde. Além disso, se houver requerimento médico demonstrando se tratar de urgência ou emergência, não se aplica período de carência, que neste caso é de apenas 24 horas.",
      subtitle: "Saiba que a Prescrição do Seu Médico é Soberana",
      bullets: [
        { text: "Cirurgias complexas e robóticas." },
        { text: "Exames genéticos (como o Pet Scan) e de alta tecnologia." },
        { text: "Terapias especiais para autismo (TEA) e doenças raras." },
        { text: "Tratamentos oncológicos e medicamentos importados." }
      ],
      conclusion: "O Superior Tribunal de Justiça (STJ) e nossos tribunais estaduais já consolidaram o entendimento de que, se há indicação médica fundamentada, o plano deve cobrir o tratamento. O plano de saúde não tem autoridade para decidir qual é o melhor tratamento para você. Essa decisão cabe exclusivamente ao seu médico.",
      ctaText: "Entende que sofreu algum abuso por parte do seu plano de saúde? Agende hoje mesmo uma consulta gratuita com um dos nossos especialistas e faça valer os seus direitos.",
      ctaLink: whatsappLink
    },
    {
      id: 3,
      slug: "especialista",
      title: "Por que você precisa de um Advogado Especialista em Direito da Saúde Suplementar?",
      image: "/suplementar.jpeg",
      excerpt: "Enfrentar operadoras de saúde exige alta capacitação técnica. Saiba por que contar com um especialista faz toda a diferença.",
      intro: "Enfrentar grandes operadoras de saúde e seguradoras não é uma tarefa para amadores. O Direito da Saúde Suplementar é uma área altamente técnica, cheia de resoluções complexas da ANS, normas do Conselho Federal de Medicina e constantes mudanças na jurisprudência, especialmente dos tribunais superiores.\n\nContratar um advogado generalista pode colocar o seu direito à saúde em risco.",
      subtitle: "Nossa missão é focada em Você!",
      bullets: [
        { title: "Estratégia Precisa", text: "Conhecemos as brechas dos contratos e as defesas padrão das seguradoras." },
        { title: "Agilidade Máxima", text: "Temos processos internos otimizados para despachar liminares com a urgência que a sua vida exige." },
        { title: "Histórico de Sucesso", text: "Lidamos diariamente com negativas de cobertura, reajustes abusivos e cancelamentos unilaterais de contratos." }
      ],
      conclusion: "No Saraiva e Advogados, nós vivenciamos o Direito da Saúde por meio de profissionais qualificados e especializados no assunto. Nosso foco é combater os abusos das operadoras e seguradoras e garantir os seus direitos. Sua saúde e seu patrimônio importam. Confie sua defesa a quem realmente entende do assunto.",
      ctaText: "Entende que sofreu algum abuso do seu plano de saúde? Agende uma consulta com nossos especialistas e faça valer os seus direitos.",
      ctaLink: whatsappLink
    }
  ];

  const [showAllCases, setShowAllCases] = useState(false);

  const courtCases = [
    {
      id: 1,
      parties: "A.T.S. e outro x Bradesco Saúde e Rede D'Or São Luiz",
      court: "1ª Vara do Juizado Especial Cível - JEC Central",
      issue: "Negativa de OPME com cobrança hospitalar indevida.",
      outcome: "Liminar Concedida",
      summary: "Tutela Antecipada Concedida para garantir o fornecimento de todos os materiais necessários à cirurgia, suspendendo a cobrança.",
      excerpt: `Ante o exposto, DEFIRO PARCIALMENTE a tutela de urgência para que a corré REDE D'OR SÃO LUIZ S.A. se abstenha imediatamente de cobrar, por quaisquer meios, notadamente a inscrição em cadastros de proteção ao crédito, quaisquer débitos supostamente existentes em nome da autora referente à dívida relacionada ao insumo utilizado no procedimento (Ácido Hialurônico Sinovial), sob pena de multa de R$ 1.000,00 (um mil reais) por cada ato de cobrança indevido, ou, em se tratando de inscrição em cadastros de inadimplentes, sob pena de multa de R$ 500,00 (quinhentos reais) por dia de atraso, limitada a R$ 10.000,00 (dez mil reais).`
    },
    {
      id: 2,
      parties: "A.A.O.S x Sulamérica Saúde",
      court: "5ª Vara Cível do Foro Regional de Santana/SP",
      issue: "Negativa de exame de Alta Complexidade com cobrança hospitalar.",
      outcome: "Liminar Concedida",
      summary: "Tutela Antecipada Concedida para garantir a cobertura de todos os exames necessários, suspendendo a cobrança.",
      excerpt: `...defiro a tutela de urgência e, em consequência, determino à parte requerida Sul América, que proceda com a cobertura atinente a atual cobrança do credenciado Hospital Albert Einstein em decorrência do exame "RM Parede de Vaso" (angio-rm/angioressonância), realizado quando da internação da parte autora no período de 14/08/2025 a 16/08/2025. Os valores deverão ser adimplidos pela parte ré diretamente junto àquele credenciado.`
    },
    {
      id: 3,
      parties: "A.A.N e outra x Sulamérica Saúde",
      court: "5ª Vara Cível do Foro Regional de Santo Amaro/SP",
      issue: "Negativa de exame de Alta Complexidade e Tratamento Oncológico.",
      outcome: "Liminar Concedida",
      summary: "Tutela Antecipada Concedida para garantir a realização dos exames necessários e todo tratamento oncológico.",
      excerpt: `Assim, ante o exposto, presentes os requisitos legais, DEFIRO PARCIALMENTE a Tutela antecipada, já que presentes os requisitos do artigo 273 do Código de Processo Civil, para determinar à ré autorize de imediato todos os exames necessários e já requeridos pela autora e os demais que poderá o médico requerer, os custeando, bem como custeie o tratamento quimioterápico e internações, cirurgias e demais intervenções necessárias ou seja, custeie todas as despesas médico-hospitalares da autora para tratamento do tumor da mama direita, no Hospital SANTA CRUZ (fls. 35)...`
    },
    {
      id: 4,
      parties: "J.R.J x Itaúseg Saúde S/A",
      court: "35ª Vara Cível do Foro Central",
      issue: "Reajuste abusivo por faixa etária a partir dos 60 anos de idade.",
      outcome: "Liminar Concedida",
      summary: "Tutela Antecipada Concedida para determinar a aplicação de reajustes autorizados pela ANS desde quando os autores completaram 60 anos, reduzindo a parcela em 3 mil reais mensais.",
      excerpt: `Presentes, os demais requisitos consistentes em perigo de dano e risco ao resultado útil do processo, na medida em que a manutenção da cobrança dos valores das mensalidades pode estar onerando em demasia o consumidor o que pode lhe gerar dissabores que podem resvalar em prejuízo patrimonial. Ante o exposto, DEFIRO o pedido de tutela de urgência para que a Requerida providencie a revisão imediata das parcelas do contrato dos autores a partir de quando completaram 60 anos, aplicando exclusivamente os reajustes máximos autorizados pela ANS para planos individuais e familiares, para que seja mantido o equilíbrio contratual até contraordem deste Juízo, o que deverá ser feito já para a próxima mensalidade a vencer, sob pena de incidência de multa, por cobrança a maior realizada (multa mensal), de R$ 2.000,00.`
    },
    {
      id: 5,
      parties: "J.G.L.B x Amil Assistência Médica",
      court: "5ª Vara Cível do Foro Regional de Itaquera",
      issue: "Negativa de Internação e Cirurgia de Urgência sob alegação de carência.",
      outcome: "Liminar Concedida",
      summary: "Tutela Antecipada Concedida para determinar a internação e cirurgia da autora nos termos requeridos pelo médico assistente.",
      excerpt: `O perigo de dano também está presente, diante da possibilidade de agravamento do quadro clínico e de comprometimento neurológico irreversível decorrente da demora na realização do tratamento indicado. Ademais, a medida é reversível. Presentes, portanto, os requisitos do art. 300 do Código de Processo Civil, DEFIRO a tutela de urgência para determinar que a ré, no prazo de 03 (três) dias, autorize e custeie a internação e cirurgia de urgência indicadas pelo médico assistente da autora, nos termos constantes do relatório médico que instruiu a inicial, a serem realizadas pelo Dr. João Paulo Souza de Castro, CRM/SP nº 178.247, integrante da rede credenciada da operadora. No mesmo prazo, a ré deverá comprovar o cumprimento da determinação judicial, sob pena de aplicação das sanções legais cabíveis. Esta decisão vale como ofício, a ser encaminhado pela parte autora à requerida.`
    },
    {
      id: 6,
      parties: "C.C.R.S x Sulamérica Saúde e Hospital São Camilo",
      court: "1ª Vara Cível do Foro Regional de Santana",
      issue: "Negativa de OPME com cobrança hospitalar indevida.",
      outcome: "Liminar Concedida",
      summary: "Tutela Antecipada Concedida para garantir o fornecimento de todos os materiais necessários à cirurgia, suspendendo a cobrança.",
      excerpt: `Vislumbro, no caso em tela, o preenchimento dos requisitos legais previstos no artigo 300 do Código de Processo Civil. Há probabilidade do direito alegado. Com efeito, enquanto perdurar a discussão quanto à existência ou não do débito, temerário o apontamento nos services de proteção ao crédito. Outrossim, há urgência no pedido ante o risco de dano de difícil reparação, posto que o apontamento asseguradamente causará restrição de crédito, representando evidente prejuízo. Assim, uma vez preenchidos os requisitos legais, DEFIRO o pedido de tutela antecipada, determinando que o primeiro réu, Hospital São Camilo, suspenda a exigibilidade e os atos de cobrança do débito sub judice, no valor de R$ 84.000,00 (oitenta e quatro mil reais), bem como se abstenha de negativar o nome da autora junto aos órgãos de proteção ao crédito em razão do valor acima mencionado, enquanto perdurar a demanda judicial, sob pena de multa diária de R$ 200,00 (duzentos reais), limitada a R$ 10.000,00 (dez mil reais).`
    },
    {
      id: 7,
      parties: "M.C.M.D e outra x Porto Seguro – Seguro Saúde",
      court: "9ª Vara Cível do Foro de São José dos Campos",
      issue: "Negativa de internação de urgência e tratamento sob alegação estar o plano em período de carência.",
      outcome: "Ação Procedente",
      summary: "Sentença: Após liminar concedida, a ação foi julgada procedente confirmando a tutela e condenando a Porto Seguro em danos morais e ressarcimento das despesas antecipadas.",
      excerpt: `Diante do exposto, a) JULGO PARCIALMENTE PROCEDENTE o pedido em face da 1ª ré, PORTO SEGURO – SEGURO SAÚDE S/A, para: (i) CONFIRMAR a tutela de urgência concedida no Evento 7, declarando nula a cláusula contratual que impõe carência superior a 24 horas em situações de urgência/emergência; (ii) CONDENAR a 1ª ré ao ressarcimento de R$ 529,75 em favor das autoras, correspondente a R$ 500,00 de ambulância e R$ 29,75 de refeição, com correção monetária desde cada desembolso e juros de mora ao mês (no termos do CC, art. 406); (iii) CONDENAR a 1ª ré ao pagamento de danos morais de R$ 4.000,00 em favor da 1ª autora (M C M D) e de R$ 6.000,00 em favor da 2ª autora (N L M D), ambos com correção monetária e juros de mora ao mês desde esta data (Súmula 362/STJ – quando a obrigação se tornou certa, líquida e, com isso, exigível).`
    },
    {
      id: 8,
      parties: "A.T.S e outro x Bradesco Saúde e Rede D'Or São Luiz",
      court: "1ª Vara do Juizado Especial Cível - JEC Central",
      issue: "Negativa de OPME com cobrança hospitalar indevida.",
      outcome: "Ação Procedente",
      summary: "Sentença julgou a ação procedente, anulou a cobrança em face da paciente e condenou as Rés ao pagamento de danos morais.",
      excerpt: `Ante o exposto, JULGO PARCIALMENTE PROCEDENTE a demanda, nos seguintes termos: a) declaro a inexigibilidade do débito de R$ 19.080,00 (dezenove mil e oitenta reais) em favor dos autores. b) condeno o réu BRADESCO SAÚDE S/A em obrigação de fazer, consistente em custear a despesa hospitalar de R$ 19.080,00 (dezenove mil e oitenta reais) diretamente ao réu SÃO LUIZ. c) condeno os réus, solidariamente, ao pagamento de R$ 8.000,00 (oito mil reais) (R$ 4.000,00 para cada coautor), a título de dano moral, com correção monetária pelo IPCA, a contar do arbitramento (Súmula 362, STJ), acrescido de juros de mora pela taxa Selic, deduzido dela o IPCA, ao mês, desde a citação (artigos 389 e 406, § 1º, do CC, na redação da Lei n. 14.905/2024). d) rejeito o pedido de declaração de nulidade das cláusulas 1.5, 2.1, 2.2 e 2.3 do contrato firmado com o réu SÃO LUIZ.`
    },
    {
      id: 9,
      parties: "A.A.N e outra x Sulamérica Saúde",
      court: "5ª Vara Cível do Foro Regional de Santo Amaro/SP",
      issue: "Negativa de exame de Alta Complexidade e Tratamento Oncológico.",
      outcome: "Ação Procedente",
      summary: "Sentença. Ação julgada procedente para confirmar a tutela antecipada concedida e garantir a realização de todos os exames necessários e tratamento oncológico.",
      excerpt: `Posto isso, JULGO PARCIALMENTE PROCEDENTES os pedidos iniciais para DECLARAR NULA DE PLENO DIREITO POR SER ABUSIVA as cláusulas restritiva chamada “cobertura parcial temporária” excluidora de determinados procedimentos e exames constante do contrato celebrado entre as partes, com base na legislação supra mencionada, CONDENANDO a requerida a custear todos os exames realizados pela autora e arcar com todos os gastos para o tratamento da nova doença diagnosticada aos 16/07/2011... Em conseqüência, JULGO PROCEDENTE o pedido de danos morais para CONDENAR a ré ao pagamento aos autores à guisa de DANOS MORAIS o valor de R$ 12.000,00, devidamente corrigido desde a data da sentença e acrescido de juros de 1% ao mês, desde a citação até o efetivo pagamento.`
    }
  ];

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
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-blue-950/90 backdrop-blur-sm py-5'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          
          <a href="#" onClick={() => { setActiveArticle(null); window.history.pushState({}, document.title, window.location.pathname); window.scrollTo(0,0); }} className="flex items-center">
            {/* Logótipo com escala dinâmica optimizada (maior no computador, equilibrado no telemóvel) */}
            <img 
              src="/Logo 2_Fundo Transparente.png" 
              alt="Saraiva & Advogados Associados" 
              className="h-20 md:h-24 w-auto object-contain transition-all duration-300"
            />
          </a>

          <nav className="hidden md:flex gap-8 items-center">
            {activeArticle !== null ? (
              <button 
                onClick={() => { setActiveArticle(null); window.history.pushState({}, document.title, window.location.pathname); window.scrollTo(0,0); }} 
                className={`text-sm font-semibold hover:text-amber-500 transition-colors flex items-center gap-1.5 ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}
              >
                <ArrowLeft size={16} /> Voltar para o Início
              </button>
            ) : (
              <>
                <a href="#solucoes" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Áreas de Atuação</a>
                <a href="#sobre" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Nossos Especialistas</a>
                <a href="#depoimentos" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Depoimentos</a>
                <a href="#vitorias" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Vitórias Judiciais</a>
                <a href="#artigos" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Artigos</a>
                <a href="#faq" className={`text-sm font-semibold hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`}>Dúvidas</a>
                <a href="#contato-formulario" rel="noreferrer" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105 shadow-lg">
                  Fale Conosco
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      {activeArticle !== null ? (
        <ArticlePageView 
          article={articles.find(a => a.id === activeArticle)!} 
          articles={articles}
          onBack={() => { setActiveArticle(null); window.history.pushState({}, document.title, window.location.pathname); window.scrollTo(0,0); }}
          onNavigate={(id) => { setActiveArticle(id); window.scrollTo(0,0); }}
        />
      ) : (
        <>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-blue-950 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-600/30 rounded-full filter blur-3xl"></div>
          <div className="absolute top-48 -left-24 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl"></div>
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
                A sua saúde <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-sky-400">não pode esperar.</span><br />
                
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed text-justify">
                Advocacia especializada na atuação contra Operadoras de Planos de Saúde. Atuamos com rapidez para garantir o seu direito à saúde e à vida com pedido de liminares de urgência em casos de negativas abusivas e ilegais.
              </p>
              
              {/* ÁREA DE BOTÕES DO INÍCIO */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center md:justify-start items-stretch sm:items-center">
                {/* Falar com Especialista (WhatsApp) */}
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-sky-500 hover:bg-sky-400 text-blue-950 px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:-translate-y-1">
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
              Algumas das nossas especialidades na área da saúde.
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Liminares de Urgência */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col justify-between">
              <div>
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                  <ShieldAlert size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Liminares de Urgência</h4>
                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                  Atuamos de forma rápida e efetiva contra negativas abusivas de internação, cirurgias, tratamentos e exames de urgência e emergência para resguardo da sua saúde.
                </p>
              </div>
            </div>

            {/* Card 2: Reversão de Negativas */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col justify-between">
              <div>
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                  <FileCheck size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Reversão de Negativas</h4>
                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                  Adoção de medidas judiciais contra cobranças irregulares realizadas contra o beneficiário por Hospitais devido a negativa de cobertura do tratamento realizado pela operadora de plano de saúde.
                </p>
              </div>
            </div>

            {/* Card 3: Reajuste Abusivo */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col justify-between">
              <div>
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                  <Scale size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Reajuste Abusivo</h4>
                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                  Ação revisional de reajustes abusivos praticados pelas operadoras de planos de saúde, possibilitando a redução da mensalidade e restituição dos valores pagos dos últimos 3 anos.
                </p>
              </div>
            </div>

            {/* Card 4: Medicamentos */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col justify-between">
              <div>
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                  <Pill size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Medicamentos</h4>
                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                  Pedido de liminar contra operadoras de plano de saúde devido a negativa de fornecimento de medicamentos de alto custo necessário ao tratamento.
                </p>
              </div>
            </div>

            {/* Card 5: Erro Médico */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col justify-between">
              <div>
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                  <Stethoscope size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Erro Médico</h4>
                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                  Atuação na defesa dos interesses dos nossos clientes e médicos em casos que envolvem alegação de erro médico decorrentes de negligência, imprudência ou imperícia.
                </p>
              </div>
            </div>

            {/* Card 6: Seguros em Geral */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col justify-between">
              <div>
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                  <ShieldCheck size={28} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Seguros em Geral</h4>
                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                  Ações contra seguradoras por negativas indevidas de pagamento de indenização e cobertura em seguro de vida, seguro automóvel, entre outros.
                </p>
              </div>
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
                Preencha o formulário para enviar os detalhes da sua situação diretamente ao e-mail da equipe do Dr. Fabio Saraiva. Avaliaremos o seu relato de forma cuidadosa e ágil para retornar o contato.
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
                      Agradecemos o seu contato. Suas informações e a descrição do caso foram enviadas com segurança diretamente ao e-mail da equipe do Dr. Fabio Saraiva.
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
                  <form onSubmit={handleFormSubmit} className="space-y-6">
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
                        rows={5}
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
                            Enviar Formulário
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
                  Com mais de 25 anos de sólida experiência, nosso escritório é liderado pelo <strong>Dr. Fabio Saraiva</strong>, membro efetivo das <u>Comissões Especiais de Direito Médico e de Saúde</u>, <u>Defesa do Consumidor</u> e <u>Direito do Seguro e Resseguro da Ordem dos Advogados do Brasil - São Paulo</u>. Fundou o escritório com um propósito claro: entregar um atendimento humanizado, ético e assertivo na defesa dos interesses dos seus clientes, especialmente em uma área que requer a atuação de profissionais altamente especializados e qualificados para enfrentar as gigantes da área da saúde suplementar no Brasil.
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
                desc: "Analisamos o seu caso de forma rápida e minuciosa quanto aos seus direitos."
              },
              {
                step: "03",
                title: "Pedido de Liminar",
                desc: "Após análise e aprovação, adotamos as medidas necessárias, inclusive com pedido de liminar de urgência."
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

      {/* VITÓRIAS JUDICIAIS RECENTES */}
      <section id="vitorias" className="py-24 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">Decisões Judiciais Reais</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Nossas Vitórias Judiciais Recentes
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
              Veja abaixo alguns casos reais patrocinados por nosso escritório, demonstrando a atuação prática no restabelecimento do direito à saúde dos nossos clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {courtCases
              .slice(0, showAllCases ? courtCases.length : 3)
              .map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Badge e Autoridade */}
                    <div className="flex justify-between items-start gap-2 mb-6">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full">
                        {item.outcome}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        Processo Real
                      </span>
                    </div>

                    {/* Partes e Juizado */}
                    <h4 className="text-slate-900 font-black text-lg mb-2 leading-snug">
                      {item.parties}
                    </h4>
                    <p className="text-xs text-blue-700 font-extrabold mb-4 flex items-center gap-1">
                      {item.court}
                    </p>

                    <div className="border-t border-slate-100 pt-4 mb-4">
                      <h5 className="text-xs font-black uppercase text-slate-400 mb-1">Discussão:</h5>
                      <p className="text-slate-700 font-semibold text-xs leading-relaxed mb-3">
                        {item.issue}
                      </p>
                      <h5 className="text-xs font-black uppercase text-slate-400 mb-1">Medida Concedida:</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    {/* Recorte Decisão */}
                    <div className="mt-4 bg-slate-50 border-l-4 border-amber-500 rounded-r-xl p-4 font-mono text-[11px] text-slate-600 select-none relative max-h-[160px] overflow-y-auto hide-scrollbar">
                      <span className="absolute top-1 right-2 text-2xl font-black text-slate-200 pointer-events-none">”</span>
                      <p className="leading-relaxed italic text-justify">
                        "{item.excerpt}"
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-6">
                    <a 
                      href={whatsappLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full inline-flex bg-blue-950 hover:bg-amber-500 text-white hover:text-slate-950 py-3 rounded-xl font-bold text-xs items-center justify-center gap-2 transition-all"
                    >
                      <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-4 h-4 object-contain brightness-0 invert hover:brightness-100 hover:invert-0" />
                      Consultar caso semelhante
                    </a>
                  </div>
                </div>
              ))}
          </div>

          {courtCases.length > 3 && (
            <div className="text-center mt-12">
              <button 
                onClick={() => setShowAllCases(!showAllCases)} 
                className="inline-flex bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-sm items-center justify-center gap-2 transition-all hover:scale-105 shadow-sm"
              >
                {showAllCases ? "Ver menos decisões" : `Ver mais decisões (${courtCases.length - 3})`}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* DEPOIMENTOS (GOOGLE REVIEWS) */}
      <section id="depoimentos" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-6 shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span className="text-xs font-bold text-slate-700">
                Avaliações de Clientes no Google Maps
              </span>
            </div>
            <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">Casos de Sucesso</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">O que dizem os nossos clientes</h3>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-lg font-black text-slate-950">5.0</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="text-amber-400 fill-amber-400 w-5 h-5" />
                ))}
              </div>
              <span className="text-slate-500 text-sm">(Nota máxima baseada em avaliações reais)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Nilcemara Moliterno */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-lg">
                      N
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Nilcemara Moliterno</h4>
                      <p className="text-xs text-slate-500">6 avaliações</p>
                    </div>
                  </div>
                  <div className="text-slate-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="text-amber-400 fill-amber-400 w-4 h-4" />
                    ))}
                  </div>
                  <span className="text-slate-400 text-xs">• Há 3 dias</span>
                  <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider scale-90">Novo</span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed text-justify mb-6 whitespace-pre-line">
                  "Excelente trabalho!
                  Gostaria de agradecer imensamente a toda a equipe do escritório pelo profissionalismo e dedicação. Eles cuidaram de um processo meu delicado e o resultado foi um verdadeiro sucesso.
                  São profissionais extremamente experientes, ágeis e empáticos em cada etapa do processo. Passaram muita segurança em um momento difícil. Recomendo de olhos fechados!"
                </p>
              </div>
              
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Avaliação Verificada</span>
                <a href={googleMapsLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1">
                  Ver no Google <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Card 2: Marcela Torres */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-500 border border-slate-600 flex items-center justify-center font-bold text-white text-lg relative">
                      M
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border border-white">
                        <Star size={10} className="fill-white text-white" />
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Marcela Torres</h4>
                      <p className="text-xs text-slate-500">Local Guide • 44 avaliações</p>
                    </div>
                  </div>
                  <div className="text-slate-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="text-amber-400 fill-amber-400 w-4 h-4" />
                    ))}
                  </div>
                  <span className="text-slate-400 text-xs">• Há 1 semana</span>
                  <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider scale-90">Novo</span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed text-justify mb-6 whitespace-pre-line">
                  "Todo o trabalho do Dr. Fabio e sua equipe do escritório Saraiva & Advogados, é embasado no que há de mais atual, sempre muito solícitos, resolutivos e empenhados em auxiliar e orientar técnica e verdadeiramente em seus casos.
                  Obrigada pelo trabalho!"
                </p>
              </div>
              
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Avaliação Verificada</span>
                <a href={googleMapsLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1">
                  Ver no Google <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Card 3: Wagner Pereira */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#1a73e8] border border-blue-600 flex items-center justify-center font-bold text-white text-lg relative">
                      W
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border border-white">
                        <Star size={10} className="fill-white text-white" />
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Wagner Pereira</h4>
                      <p className="text-xs text-slate-500">Local Guide • 24 avaliações</p>
                    </div>
                  </div>
                  <div className="text-slate-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="text-amber-400 fill-amber-400 w-4 h-4" />
                    ))}
                  </div>
                  <span className="text-slate-400 text-xs">• Há 1 semana</span>
                  <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider scale-90">Novo</span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed text-justify mb-6 whitespace-pre-line">
                  "O Dr. Fábio Saraiva é um excelente profissional! Sempre muito atencioso, prestativo e disponível para ajudar. Explica os assuntos de forma clara e objetiva, transmite segurança nas orientações e responde com rapidez. Além do conhecimento técnico, destaco a prontidão e o comprometimento em buscar as melhores soluções. Recomendo com confiança."
                </p>
              </div>
              
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Avaliação Verificada</span>
                <a href={googleMapsLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1">
                  Ver no Google <ExternalLink size={14} />
                </a>
              </div>
            </div>

          </div>

          <div className="text-center mt-16">
            <a 
              href={googleMapsLink} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-sm items-center justify-center gap-3 transition-transform hover:scale-105 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              Ver todas as avaliações no Google
            </a>
          </div>

        </div>
      </section>

      {/* ARTIGOS E ORIENTAÇÕES */}
      <section id="artigos" className="py-24 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">Artigos e Orientações</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Informativos e Direitos dos Pacientes
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
              Acompanhe as publicações do Dr. Fabio Saraiva com orientações práticas de como agir contra negativas e reajustes abusivos de planos de saúde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((item) => (
              <div 
                key={item.id} 
                onClick={() => { setActiveArticle(item.id); window.scrollTo(0, 0); }}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="rounded-xl overflow-hidden mb-5 aspect-video border border-slate-200">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-3">
                    Direito da Saúde
                  </span>
                  <h4 className="font-extrabold text-slate-950 text-lg leading-snug mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>
                <span className="text-blue-700 font-bold text-sm flex items-center gap-1 group-hover:underline mt-4">
                  Ler artigo completo →
                </span>
              </div>
            ))}
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
      <section className="py-20 bg-blue-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Você não está sozinho! Conte sempre conosco na defesa dos seus direitos.
          </h2>
          <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto text-justify">
            Conte sempre com os nossos profissionais altamente especializados e capacitados para analisar o seu caso com total sigilo, segurança e assertividade na busca da defesa dos seus interesses e solução do problema.
          </p>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex bg-sky-500 hover:bg-sky-400 text-blue-950 px-10 py-5 rounded-xl font-black text-xl items-center justify-center gap-3 transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:-translate-y-1">
            <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-7 h-7 object-contain" />
            Falar com um Especialista
          </a>
        </div>
      </section>
        </>
      )}

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

function ArticlePageView({ 
  article, 
  articles, 
  onBack, 
  onNavigate 
}: { 
  article: any, 
  articles: any[], 
  onBack: () => void, 
  onNavigate: (id: number) => void 
}) {
  return (
    <div className="bg-slate-50 pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Breadcrumb e Botão Voltar */}
        <div className="mb-8">
          <button 
            onClick={onBack} 
            className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold transition-colors cursor-pointer group text-sm"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Voltar para a página inicial
          </button>
        </div>

        {/* Artigo Principal */}
        <article className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-slate-100 mb-12">
          <div className="mb-6">
            <span className="inline-block bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
              Direito da Saúde • Informativo
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-3 text-slate-500 text-sm border-t border-slate-100 pt-4">
              <div className="w-8 h-8 rounded-full bg-blue-950 flex items-center justify-center text-white font-bold text-xs">
                FS
              </div>
              <div>
                <p className="font-bold text-slate-700">Por Dr. Fabio Saraiva</p>
                <p className="text-xs">Especialista em Direito da Saúde • 4 min de leitura</p>
              </div>
            </div>
          </div>

          {/* Imagem de Capa */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 mb-8 max-h-[400px] aspect-video">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          {/* Conteúdo do Artigo */}
          <div className="text-slate-700 text-base md:text-lg leading-relaxed space-y-6 text-justify">
            <p className="font-medium text-slate-800 text-lg md:text-xl border-l-4 border-amber-500 pl-4 italic">
              {article.intro}
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 pt-4 border-t border-slate-100">
              {article.subtitle}
            </h3>

            {/* Listagem de Tópicos */}
            <div className="space-y-4 my-6">
              {article.bullets.map((bullet: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-full shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    {bullet.title && <h4 className="font-extrabold text-slate-900 text-sm mb-1">{bullet.title}</h4>}
                    <p className="text-slate-600 text-sm leading-relaxed">{bullet.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="whitespace-pre-line text-slate-600">
              {article.conclusion}
            </p>
          </div>

          {/* Chamada para Ação (CTA) */}
          <div className="mt-12 bg-blue-950 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-blue-900">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h4 className="text-lg md:text-xl font-bold mb-6 text-slate-200 text-center">
                {article.ctaText}
              </h4>
              <a 
                href={article.ctaLink} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex bg-sky-500 hover:bg-sky-400 text-blue-950 px-8 py-4 rounded-xl font-black text-base items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:-translate-y-1"
              >
                <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                Falar com Especialista Agora
              </a>
            </div>
          </div>
        </article>

        {/* Leia Também Section */}
        <div className="border-t border-slate-200 pt-12">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-8 text-center md:text-left">
            Leia também outros artigos do Dr. Fabio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles
              .filter(a => a.id !== article.id)
              .map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => onNavigate(item.id)}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="rounded-xl overflow-hidden mb-4 aspect-video">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded mb-3">
                      Direito da Saúde
                    </span>
                    <h4 className="font-extrabold text-slate-950 text-base leading-snug line-clamp-2 mb-3 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 text-xs line-clamp-3 mb-4 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                  <span className="text-blue-700 font-bold text-xs flex items-center gap-1 group-hover:underline mt-auto">
                    Ler artigo completo →
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
