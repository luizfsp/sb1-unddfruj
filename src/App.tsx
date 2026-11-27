import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  Loader2,
  Send,
  ExternalLink,
  Star,
  User,
  FileCheck,
  Scale,
  Pill,
  Home,
  FileWarning,
  Globe,
  Instagram,
  Menu,
  X,
} from 'lucide-react';
import { InstagramBioPage, SpecialtyInternalPage } from './components/SecondaryPages';
import { InstagramFeedSection } from './components/InstagramFeedSection';

type ActiveView =
  | { type: 'home' }
  | { type: 'article'; id: number }
  | { type: 'specialty'; page: 'defesa-medica' | 'seguros' }
  | { type: 'instagram' };

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [areasDropdownOpen, setAreasDropdownOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const whatsappNumber = '5511962817392';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Ol%C3%A1,%20gostaria%20de%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica%20na%20%C3%A1rea%20da%20sa%C3%BAde.`;
  const whatsappLinkUrgency = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'URGÊNCIA: Olá! Preciso de um atendimento de urgência referente a Direito da Saúde. Poderiam me ajudar imediatamente?'
  )}`;
  const googleMapsLink =
    'https://www.google.com/maps/place/Saraiva+%26+Advogados+Associados/@-14.4095261,-51.31668,4z/data=!3m1!4b1!4m6!3m5!1s0x94ce5bbc948bf5c1:0xe06e22bfbf9da60e!8m2!3d-14.4095262!4d-51.31668!16s%2Fg%2F11nq0_hg79?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D';
  const instagramHandle = '@saraivaeadvogados';
  const instagramUrl = 'https://www.instagram.com/saraivaeadvogados/';
  const beholdFeedUrl = 'https://feeds.behold.so/egJDQgN9GcedqPoPnrlh';

  const resolveViewFromLocation = (): ActiveView => {
    const pathname = window.location.pathname.replace(/\/+$/, '').toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const paginaParam = params.get('pagina')?.toLowerCase();
    const areaParam = params.get('area')?.toLowerCase();
    const artigoParam = params.get('artigo')?.toLowerCase();

    if (pathname === '/instagram' || paginaParam === 'instagram') {
      return { type: 'instagram' };
    }
    if (
      pathname === '/defesa-medica' ||
      pathname === '/medicos-e-clinicas' ||
      areaParam === 'defesa-medica' ||
      areaParam === 'medicos-e-clinicas'
    ) {
      return { type: 'specialty', page: 'defesa-medica' };
    }
    if (pathname === '/seguros' || areaParam === 'seguros') {
      return { type: 'specialty', page: 'seguros' };
    }
    if (artigoParam === 'liminar') {
      return { type: 'article', id: 1 };
    }
    if (artigoParam === 'negativa') {
      return { type: 'article', id: 2 };
    }
    if (artigoParam === 'especialista') {
      return { type: 'article', id: 3 };
    }
    if (artigoParam === 'reajuste') {
      return { type: 'article', id: 4 };
    }
    return { type: 'home' };
  };

  const [activeView, setActiveView] = useState<ActiveView>(() => resolveViewFromLocation());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setActiveView(resolveViewFromLocation());
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const articles = [
    {
      id: 1,
      slug: 'liminar',
      title: 'Como Conseguir uma Liminar Contra o Plano de Saúde em Casos de Urgência',
      image: '/liminar.jpeg',
      excerpt:
        'Descobrir que o plano de saúde negou sua cobertura no momento em que você mais precisa gera angústia. Saiba como a Justiça pode reverter isso rapidamente.',
      intro:
        'Descobrir que o plano de saúde negou sua cobertura no momento em que você ou sua família mais precisam gera revolta e muita angústia. Em momentos de emergência médica, sabemos que cada minuto conta e a burocracia não pode custar a sua saúde. A boa notícia é que a Justiça entende essa urgência.',
      subtitle: 'Como a Liminar pode salvar o seu tratamento',
      bullets: [
        {
          title: 'Rapidez',
          text: 'Em casos de risco de vida ou agravamento da saúde, a decisão costuma sair em questão de horas.',
        },
        {
          title: 'Abrangência',
          text: 'Cobre internações de emergência, cirurgias inadiáveis, UTIs e liberação de medicamentos de alto custo (como oncológicos) pela operadora do plano de saúde.',
        },
        {
          title: 'Base Legal',
          text: 'A prescrição do seu médico é soberana. O plano não pode interferir no tratamento que o especialista definiu como ideal.',
        },
      ],
      conclusion:
        'Uma liminar concedida em tutela de urgência é uma decisão rápida do juiz que obriga o plano de saúde a autorizar o procedimento imediatamente, antes mesmo do fim do processo.\n\nNão perca tempo discutindo com o teleatendimento da operadora. A lei está do seu lado.',
      ctaText: 'Seu caso é urgente? Clique aqui e fale agora com um especialista via WhatsApp.',
      ctaLink: whatsappLinkUrgency,
    },
    {
      id: 2,
      slug: 'negativa',
      title: 'O que fazer quando o Plano de Saúde nega internações, cirurgias ou exames?',
      image: '/cirurgia.jpeg',
      excerpt:
        'Rol da ANS e carência são as justificativas mais comuns para negativas. Descubra a verdade sobre os seus direitos e como agir.',
      intro:
        'Receber um diagnóstico preocupante já é difícil. Mas o pior de tudo isso é ter o tratamento, a cirurgia ou o exame negado pelo plano de saúde sob a justificativa de que “não consta no Rol da ANS” ou mesmo sob a alegação de estar no período de carência.\n\nA verdade que as operadoras não te contam é que o Rol da ANS é apenas uma lista de referência básica, e não um limite para a sua saúde. Além disso, se houver requerimento médico demonstrando se tratar de urgência ou emergência, não se aplica período de carência, que neste caso é de apenas 24 horas.',
      subtitle: 'Saiba que a Prescrição do Seu Médico é Soberana',
      bullets: [
        { text: 'Cirurgias complexas e robóticas.' },
        { text: 'Exames genéticos (como o Pet Scan) e de alta tecnologia.' },
        { text: 'Terapias especiais para autismo (TEA) e doenças raras.' },
        { text: 'Tratamentos oncológicos e medicamentos importados.' },
      ],
      conclusion:
        'O Superior Tribunal de Justiça (STJ) e nossos tribunais estaduais já consolidaram o entendimento de que, se há indicação médica fundamentada, o plano deve cobrir o tratamento. O plano de saúde não tem autoridade para decidir qual é o melhor tratamento para você. Essa decisão cabe exclusivamente ao seu médico.',
      ctaText:
        'Entende que sofreu algum abuso por parte do seu plano de saúde? Solicite uma triagem técnica com um dos nossos especialistas e faça valer os seus direitos.',
      ctaLink: whatsappLink,
    },
    {
      id: 3,
      slug: 'especialista',
      title: 'Por que você precisa de um Advogado Especialista em Direito da Saúde Suplementar?',
      image: '/advogado.jpg',
      excerpt:
        'Enfrentar operadoras de saúde exige alta capacitação técnica. Saiba por que contar com um especialista faz toda a diferença.',
      intro:
        'Enfrentar grandes operadoras de saúde e seguradoras não é uma tarefa para amadores. O Direito da Saúde Suplementar é uma área altamente técnica, cheia de resoluções complexas da ANS, normas do Conselho Federal de Medicina e constantes mudanças na jurisprudência, especialmente dos tribunais superiores.\n\nContratar um advogado generalista pode colocar o seu direito à saúde em risco.',
      subtitle: 'Nossa missão é focada em Você!',
      bullets: [
        {
          title: 'Estratégia Precisa',
          text: 'Conhecemos as brechas dos contratos e as defesas padrão das seguradoras.',
        },
        {
          title: 'Agilidade Máxima',
          text: 'Temos processos internos otimizados para despachar liminares com a urgência que a sua vida exige.',
        },
        {
          title: 'Atuação Consolidada',
          text: 'Lidamos diariamente com negativas de cobertura, reajustes abusivos e cancelamentos unilaterais de contratos.',
        },
      ],
      conclusion:
        'No Saraiva & Advogados, nós vivenciamos o Direito da Saúde por meio de profissionais qualificados e especializados no assunto. Nosso foco é combater os abusos das operadoras e seguradoras e garantir os seus direitos. Sua saúde e seu patrimônio importam. Confie sua defesa a quem realmente entende do assunto.',
      ctaText:
        'Entende que sofreu algum abuso do seu plano de saúde? Fale com nossos especialistas para uma triagem técnica e faça valer os seus direitos.',
      ctaLink: whatsappLink,
    },
    {
      id: 4,
      slug: 'reajuste',
      title: 'Reajuste abusivo no plano de saúde por idade e falso coletivo-empresarial: como a Justiça protege você',
      image: '/suplementar.jpeg',
      excerpt:
        'Saiba quando o aumento aos 59 anos ou em planos empresariais com poucas vidas pode ser considerado abusivo e como funciona a revisão contratual.',
      intro:
        'Chegar à terceira idade deveria ser sinônimo de tranquilidade. No entanto, muitas operadoras de saúde aplicam reajustes desproporcionais e abusivos aos 59 anos (ou em outras faixas etárias) com um único objetivo: forçar o consumidor a cancelar o contrato.\n\nEsta prática de reajustes abusivos ocorre também em planos de saúde de pequenos empresários, como MEI e micro-empresa, onde muitas vezes há apenas membros da mesma família, o que foi reconhecido pelo STJ como “falso coletivo” ou “falso empresarial”, em que os reajustes não possuem teto definido pela ANS.',
      subtitle: 'Não Aceite Pagar Mais do Que o Justo',
      bullets: [
        {
          title: 'Anulação do Reajuste',
          text: 'A Justiça pode considerar o percentual abusivo e determinar a redução imediata da sua mensalidade.',
        },
        {
          title: 'Devolução de Valores',
          text: 'Você pode ter o direito de receber de volta, com juros e correção, tudo o que pagou a mais nos últimos anos.',
        },
        {
          title: 'Manutenção do Plano',
          text: 'O processo garante que você continue com o seu plano de saúde ativo, pagando um valor justo e proporcional.',
        },
      ],
      conclusion:
        'Essa prática é conhecida como "expulsão velada" e os tribunais brasileiros têm sido rigorosos contra ela. Se a sua mensalidade dobrou ou sofreu um aumento que comprometeu sua renda, saiba que na maioria dos casos é possível reverter essa situação judicialmente.',
      ctaText:
        'Acha que seu boleto está caro demais? Envie uma cópia para nossa equipe realizar uma triagem técnica do seu reajuste.',
      ctaLink: whatsappLink,
    },
  ];

  const [showAllCases, setShowAllCases] = useState(false);

  const courtCases = [
    {
      id: 1,
      parties: "A.T.S. e outro x Bradesco Saúde e Rede D'Or São Luiz",
      court: '1ª Vara do Juizado Especial Cível - JEC Central',
      issue: 'Negativa de OPME com cobrança hospitalar indevida.',
      outcome: 'Liminar Concedida',
      summary:
        'Tutela Antecipada Concedida para garantir o fornecimento de todos os materiais necessários à cirurgia, suspendendo a cobrança.',
      excerpt: `Ante o exposto, DEFIRO PARCIALMENTE a tutela de urgência para que a corré REDE D'OR SÃO LUIZ S.A. se abstenha imediatamente de cobrar, por quaisquer meios, notadamente a inscrição em cadastros de proteção ao crédito, quaisquer débitos supostamente existentes em nome da autora referente à dívida relacionada ao insumo utilizado no procedimento (Ácido Hialurônico Sinovial), sob pena de multa de R$ 1.000,00 (um mil reais) por cada ato de cobrança indevido, ou, em se tratando de inscrição em cadastros de inadimplentes, sob pena de multa de R$ 500,00 (quinhentos reais) por dia de atraso, limitada a R$ 10.000,00 (dez mil reais).`,
    },
    {
      id: 2,
      parties: 'A.A.O.S x Sulamérica Saúde',
      court: '5ª Vara Cível do Foro Regional de Santana/SP',
      issue: 'Negativa de exame de Alta Complexidade com cobrança hospitalar.',
      outcome: 'Liminar Concedida',
      summary:
        'Tutela Antecipada Concedida para garantir a cobertura de todos os exames necessários, suspendendo a cobrança.',
      excerpt: `...defiro a tutela de urgência e, em consequência, determino à parte requerida Sul América, que proceda com a cobertura atinente a atual cobrança do credenciado Hospital Albert Einstein em decorrência do exame "RM Parede de Vaso" (angio-rm/angioressonância), realizado quando da internação da parte autora no período de 14/08/2025 a 16/08/2025. Os valores deverão ser adimplidos pela parte ré diretamente junto àquele credenciado.`,
    },
    {
      id: 3,
      parties: 'J.G.L.B x Amil Assistência Médica',
      court: '5ª Vara Cível do Foro Regional de Itaquera',
      issue: 'Negativa de Internação e Cirurgia de Urgência sob alegação de carência.',
      outcome: 'Liminar Concedida',
      summary:
        'Tutela de urgência concedida com base no art. 300 do CPC/2015 para determinar a internação e cirurgia da autora nos termos requeridos pelo médico assistente.',
      excerpt: `O perigo de dano também está presente, diante da possibilidade de agravamento do quadro clínico e de comprometimento neurológico irreversível decorrente da demora na realização do tratamento indicado. Ademais, a medida é reversível. Presentes, portanto, os requisitos do art. 300 do Código de Processo Civil, DEFIRO a tutela de urgência para determinar que a ré, no prazo de 03 (três) dias, autorize e custeie a internação e cirurgia de urgência indicadas pelo médico assistente da autora, nos termos constantes do relatório médico que instruiu a inicial, a serem realizadas pelo médico assistente [nome e CRM omitidos], integrante da rede credenciada da operadora. No mesmo prazo, a ré deverá comprovar o cumprimento da determinação judicial, sob pena de aplicação das sanções legais cabíveis. Esta decisão vale como ofício, a ser encaminhado pela parte autora à requerida.`,
    },
    {
      id: 4,
      parties: 'J.R.J x Itaúseg Saúde S/A',
      court: '35ª Vara Cível do Foro Central',
      issue: 'Reajuste abusivo por faixa etária a partir dos 60 anos de idade.',
      outcome: 'Liminar Concedida',
      summary:
        'Tutela Antecipada Concedida para determinar a aplicação de reajustes autorizados pela ANS desde quando os autores completaram 60 anos, reduzindo a parcela em 3 mil reais mensais.',
      excerpt: `Presentes, os demais requisitos consistentes em perigo de dano e risco ao resultado útil do processo, na medida em que a manutenção da cobrança dos valores das mensalidades pode estar onerando em demasia o consumidor o que pode lhe gerar dissabores que podem resvalar em prejuízo patrimonial. Ante o exposto, DEFIRO o pedido de tutela de urgência para que a Requerida providencie a revisão imediata das parcelas do contrato dos autores a partir de quando completaram 60 anos, aplicando exclusivamente os reajustes máximos autorizados pela ANS para planos individuais e familiares, para que seja mantido o equilíbrio contratual até contraordem deste Juízo, o que deverá ser feito já para a próxima mensalidade a vencer, sob pena de incidência de multa, por cobrança a maior realizada (multa mensal), de R$ 2.000,00.`,
    },
    {
      id: 5,
      parties: 'C.C.R.S x Sulamérica Saúde e Hospital São Camilo',
      court: '1ª Vara Cível do Foro Regional de Santana',
      issue: 'Negativa de OPME com cobrança hospitalar indevida.',
      outcome: 'Liminar Concedida',
      summary:
        'Tutela de urgência concedida com base no art. 300 do CPC/2015 para suspender a cobrança hospitalar de R$ 84 mil e impedir a negativação do nome da paciente.',
      excerpt: `Vislumbro, no caso em tela, o preenchimento dos requisitos legais previstos no artigo 300 do Código de Processo Civil. Há probabilidade do direito alegado. Com efeito, enquanto perdurar a discussão quanto à existência ou não do débito, temerário o apontamento nos serviços de proteção ao crédito. Outrossim, há urgência no pedido ante o risco de dano de difícil reparação, posto que o apontamento asseguradamente causará restrição de crédito, representando evidente prejuízo. Assim, uma vez preenchidos os requisitos legais, DEFIRO o pedido de tutela antecipada, determinando que o primeiro réu, Hospital São Camilo, suspenda a exigibilidade e os atos de cobrança do débito sub judice, no valor de R$ 84.000,00 (oitenta e quatro mil reais), bem como se abstenha de negativar o nome da autora junto aos órgãos de proteção ao crédito em razão do valor acima mencionado, enquanto perdurar a demanda judicial, sob pena de multa diária de R$ 200,00 (duzentos reais), limitada a R$ 10.000,00 (dez mil reais).`,
    },
    {
      id: 6,
      parties: 'M.C.M.D e outra x Porto Seguro – Seguro Saúde',
      court: '9ª Vara Cível do Foro de São José dos Campos',
      issue: 'Negativa de internação de urgência e tratamento sob alegação de período de carência.',
      outcome: 'Ação Procedente',
      summary:
        'Sentença: Após liminar concedida, a ação foi julgada procedente confirmando a tutela e condenando a Porto Seguro em danos morais e ressarcimento das despesas antecipadas.',
      excerpt: `Diante do exposto, a) JULGO PARCIALMENTE PROCEDENTE o pedido em face da 1ª ré, PORTO SEGURO – SEGURO SAÚDE S/A, para: (i) CONFIRMAR a tutela de urgência concedida no Evento 7, declarando nula a cláusula contratual que impõe carência superior a 24 horas em situações de urgência/emergência; (ii) CONDENAR a 1ª ré ao ressarcimento de R$ 529,75 em favor das autoras, correspondente a R$ 500,00 de ambulância e R$ 29,75 de refeição, com correção monetária desde cada desembolso e juros de mora ao mês (no termos do CC, art. 406); (iii) CONDENAR a 1ª ré ao pagamento de danos morais de R$ 4.000,00 em favor da 1ª autora (M C M D) e de R$ 6.000,00 em favor da 2ª autora (N L M D), ambos com correção monetária e juros de mora ao mês desde esta data (Súmula 362/STJ – quando a obrigação se tornou certa, líquida e, com isso, exigível).`,
    },
    {
      id: 7,
      parties: "A.T.S e outro x Bradesco Saúde e Rede D'Or São Luiz",
      court: '1ª Vara do Juizado Especial Cível - JEC Central',
      issue: 'Negativa de OPME com cobrança hospitalar indevida.',
      outcome: 'Ação Procedente',
      summary:
        'Sentença julgou a ação procedente, anulou a cobrança em face da paciente e condenou as Rés ao pagamento de danos morais.',
      excerpt: `Ante o exposto, JULGO PARCIALMENTE PROCEDENTE a demanda, nos seguintes termos: a) declaro a inexigibilidade do débito de R$ 19.080,00 (dezenove mil e oitenta reais) em favor dos autores. b) condeno o réu BRADESCO SAÚDE S/A em obrigação de fazer, consistente em custear a despesa hospitalar de R$ 19.080,00 (dezenove mil e oitenta reais) diretamente ao réu SÃO LUIZ. c) condeno os réus, solidariamente, ao pagamento de R$ 8.000,00 (oito mil reais) (R$ 4.000,00 para cada coautor), a título de dano moral, com correção monetária pelo IPCA, a contar do arbitramento (Súmula 362, STJ), acrescido de juros de mora pela taxa Selic, deduzido dela o IPCA, ao mês, desde a citação (artigos 389 e 406, § 1º, do CC, na redação da Lei n. 14.905/2024). d) rejeito o pedido de declaração de nulidade das cláusulas 1.5, 2.1, 2.2 e 2.3 do contrato firmado com o réu SÃO LUIZ.`,
    },
    {
      id: 8,
      parties: 'A.A.N e outra x Sulamérica Saúde',
      court: '5ª Vara Cível do Foro Regional de Santo Amaro/SP',
      issue: 'Negativa de exame de Alta Complexidade e Tratamento Oncológico.',
      outcome: 'Ação Procedente',
      summary:
        'Sentença: ação julgada procedente para declarar nula cláusula restritiva abusiva, garantir os exames necessários e condenar a operadora em danos morais.',
      excerpt: `Posto isso, JULGO PARCIALMENTE PROCEDENTES os pedidos iniciais para DECLARAR NULA DE PLENO DIREITO POR SER ABUSIVA as cláusulas restritiva chamada “cobertura parcial temporária” excluidora de determinados procedimentos e exames constante do contrato celebrado entre as partes, com base na legislação supra mencionada, CONDENANDO a requerida a custear todos os exames realizados pela autora e arcar com todos os gastos para o tratamento da nova doença diagnosticada... Em conseqüência, JULGO PROCEDENTE o pedido de danos morais para CONDENAR a ré ao pagamento aos autores à guisa de DANOS MORAIS o valor de R$ 12.000,00, devidamente corrigido desde a data da sentença e acrescido de juros de 1% ao mês, desde a citação até o efetivo pagamento.`,
    },
  ];

  const faqItems = [
    {
      question: '1. O plano de saúde negou meu tratamento, cirurgia ou medicamento. O que devo fazer?',
      answer:
        'Não aceite a recusa como palavra final. Solicite à operadora a negativa por escrito (ou guarde o número de protocolo e prints do atendimento) e peça ao seu médico um relatório detalhado indicando o diagnóstico, a necessidade do tratamento e eventual risco de urgência. Com esses documentos, um especialista pode avaliar as medidas cabíveis, inclusive o pedido de liminar judicial.',
    },
    {
      question: '2. Quanto tempo leva para a Justiça analisar um pedido de liminar de urgência?',
      answer:
        'Em situações que envolvem risco à saúde ou à vida, é possível requerer tutela antecipada de urgência (liminar). Após a distribuição da ação com a documentação médica completa, o Judiciário costuma analisar pedidos urgentes em prazo reduzido — frequentemente entre 24 e 72 horas, variando conforme a vara e o plantão judiciário.',
    },
    {
      question: '3. O plano recusou alegando carência ou doença preexistente. Essa negativa é sempre válida?',
      answer:
        'Nem sempre. A Lei 9.656/98 fixa limites máximos de carência (24 horas para urgência e emergência, 300 dias para parto a termo e 180 dias para os demais casos), e a Súmula 597 do STJ considera abusiva a exigência de carência superior a 24 horas em urgência/emergência. Já em doença preexistente, a Súmula 609 do STJ estabelece que a recusa é ilícita se a operadora não exigiu exame médico prévio nem comprovou má-fé do beneficiário.',
    },
    {
      question: '4. Tenho plano empresarial (CNPJ/MEI) com poucas vidas da mesma família e o reajuste foi muito alto. Posso questionar?',
      answer:
        'Sim. Planos contratados via CNPJ ou MEI que, na prática, atendem apenas poucos membros de uma mesma família são frequentemente reconhecidos pelos tribunais como "falsos coletivos". Além da regra de agrupamento de risco prevista na RN ANS 565/2022 para contratos com menos de 30 vidas, diversas decisões aplicam os limites de reajuste da ANS para planos individuais e analisam a devolução de valores pagos a maior.',
    },
    {
      question: '5. O plano descredenciou um hospital de referência em São Paulo (como o Hospital Albert Einstein) sem aviso prévio. Tenho algum direito?',
      answer:
        'A Lei 9.656/98 exige que o descredenciamento hospitalar seja precedido de comunicação com 30 dias de antecedência e substituição por unidade equivalente. Quando há retirada de hospital de excelência sem substituto equivalente ou sem aviso prévio — especialmente com tratamento em curso —, a medida pode ser contestada judicialmente para manutenção do atendimento, revisão da mensalidade ou reparação de danos, conforme o caso concreto.',
    },
    {
      question: '6. A operadora pode cancelar o meu contrato ou suspender o tratamento se eu ingressar com ação judicial?',
      answer:
        'Não. Retaliações contra beneficiários que recorrem ao Judiciário são ilegais. Caso ocorra cancelamento indevido ou suspensão de cobertura em retaliação, é possível pedir o restabelecimento imediato do contrato e a apuração de danos morais.',
    },
    {
      question: '7. O escritório atende clientes de fora de São Paulo?',
      answer:
        'Sim. Como o processo judicial é eletrônico em praticamente todo o país, realizamos todo o atendimento por WhatsApp e videochamada, com a mesma agilidade e acompanhamento direto para clientes em qualquer estado do Brasil.',
    },
  ];

  const navigateHome = (sectionId?: string) => {
    setMobileMenuOpen(false);
    setAreasDropdownOpen(false);
    const targetUrl = sectionId ? `/#${sectionId}` : '/';
    if (activeView.type !== 'home') {
      setActiveView({ type: 'home' });
      window.history.pushState({}, document.title, targetUrl);
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (sectionId) {
      window.history.pushState({}, document.title, targetUrl);
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.history.pushState({}, document.title, '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateSpecialty = (page: 'defesa-medica' | 'seguros') => {
    setMobileMenuOpen(false);
    setAreasDropdownOpen(false);
    setActiveView({ type: 'specialty', page });
    window.history.pushState({}, document.title, `/${page}`);
    window.scrollTo(0, 0);
  };

  const navigateArticle = (id: number) => {
    setMobileMenuOpen(false);
    setAreasDropdownOpen(false);
    const target = articles.find((a) => a.id === id);
    setActiveView({ type: 'article', id });
    if (target) {
      window.history.pushState({}, document.title, `/?artigo=${target.slug}`);
    }
    window.scrollTo(0, 0);
  };

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!clientName.trim()) {
      setFormError('Por favor, preencha o seu nome completo.');
      return;
    }
    if (!clientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())) {
      setFormError('Por favor, preencha um e-mail de contato válido.');
      return;
    }
    if (!caseDescription.trim()) {
      setFormError('Por favor, descreva o seu caso brevemente.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: 'aff42f13-87de-4a1d-8979-4a2a108b4433',
          name: clientName,
          email: clientEmail,
          phone: clientPhone || 'Não informado',
          message: caseDescription,
          subject: `Nova Triagem Jurídica - ${clientName}`,
          from_name: 'Site Saraiva & Advogados',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setFormSubmitted(true);
      } else {
        setFormError(result.message || 'Ocorreu um erro ao enviar a sua mensagem. Tente novamente.');
      }
    } catch (error: any) {
      setFormError(`Erro de conexão ao enviar: ${error.message || 'Verifique sua conexão e tente novamente.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activeView.type === 'instagram') {
    return (
      <InstagramBioPage
        whatsappNumber={whatsappNumber}
        instagramHandle={instagramHandle}
        instagramUrl={instagramUrl}
        onGoHome={() => navigateHome()}
      />
    );
  }

  const navLinkClass =
    'text-sm font-semibold text-slate-200 hover:text-amber-400 transition-colors cursor-pointer whitespace-nowrap';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 scroll-smooth">
      {/* HEADER */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 bg-blue-950/95 backdrop-blur-md ${
          isScrolled ? 'shadow-xl border-b border-blue-900/60 py-2.5' : 'py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center gap-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateHome();
            }}
            className="flex items-center shrink-0"
          >
            <img
              src="/Logo 2_Fundo Transparente.png"
              alt="Saraiva & Advogados"
              className="h-16 md:h-20 w-auto object-contain transition-all duration-300"
            />
          </a>

          {/* Menu Desktop */}
          <nav className="hidden lg:flex gap-5 xl:gap-6 items-center">
            <a
              href="/#sobre"
              onClick={(e) => {
                e.preventDefault();
                navigateHome('sobre');
              }}
              className={navLinkClass}
            >
              O Escritório
            </a>

            {/* Submenu Áreas de Atuação */}
            <div
              className="relative"
              onMouseEnter={() => setAreasDropdownOpen(true)}
              onMouseLeave={() => setAreasDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setAreasDropdownOpen((prev) => !prev)}
                className={`${navLinkClass} flex items-center gap-1 py-2`}
              >
                Áreas de Atuação
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${areasDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {areasDropdownOpen && (
                <div className="absolute left-0 top-full pt-1 w-64 z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => navigateHome('solucoes')}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors block"
                    >
                      <span className="block text-sm font-bold text-slate-900">Direito Médico e da Saúde</span>
                      <span className="block text-xs text-slate-500">Planos de saúde, liminares e reajustes</span>
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      type="button"
                      onClick={() => navigateSpecialty('defesa-medica')}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors block"
                    >
                      <span className="block text-sm font-bold text-slate-900">Para Médicos e Clínicas</span>
                      <span className="block text-xs text-slate-500">CRM e responsabilidade civil médica</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateSpecialty('seguros')}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors block"
                    >
                      <span className="block text-sm font-bold text-slate-900">Seguros em Geral</span>
                      <span className="block text-xs text-slate-500">Seguro de vida, automóvel e sinistros</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <a
              href="/#atuacao"
              onClick={(e) => {
                e.preventDefault();
                navigateHome('atuacao');
              }}
              className={navLinkClass}
            >
              Atuação Prática
            </a>
            <a
              href="/#depoimentos"
              onClick={(e) => {
                e.preventDefault();
                navigateHome('depoimentos');
              }}
              className={navLinkClass}
            >
              Depoimentos
            </a>
            <a
              href="/#artigos"
              onClick={(e) => {
                e.preventDefault();
                navigateHome('artigos');
              }}
              className={navLinkClass}
            >
              Artigos
            </a>
            <a
              href="/#faq"
              onClick={(e) => {
                e.preventDefault();
                navigateHome('faq');
              }}
              className={navLinkClass}
            >
              Dúvidas
            </a>
            <a
              href="/#contato-formulario"
              onClick={(e) => {
                e.preventDefault();
                navigateHome('contato-formulario');
              }}
              className={navLinkClass}
            >
              Fale Conosco
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram oficial Saraiva & Advogados"
              title={`Instagram ${instagramHandle}`}
              className="p-2 rounded-full transition-colors text-slate-200 hover:text-amber-400 hover:bg-white/10"
            >
              <Instagram size={20} />
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-full font-extrabold text-sm transition-transform hover:scale-105 shadow-lg inline-flex items-center gap-2 whitespace-nowrap"
            >
              <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
              WhatsApp
            </a>
          </nav>

          {/* Ações Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram oficial Saraiva & Advogados"
              className="p-2 rounded-full text-white hover:text-amber-400 transition-colors"
            >
              <Instagram size={20} />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Abrir menu de navegação"
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl px-6 py-5 space-y-3">
            <button
              type="button"
              onClick={() => navigateHome('sobre')}
              className="block w-full text-left py-2 text-sm font-bold text-slate-800 hover:text-blue-700"
            >
              O Escritório
            </button>
            <div className="border-t border-slate-100 pt-2 space-y-1">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">Áreas de Atuação</p>
              <button
                type="button"
                onClick={() => navigateHome('solucoes')}
                className="block w-full text-left py-2 text-sm font-bold text-slate-800 hover:text-blue-700"
              >
                Direito Médico e da Saúde
              </button>
              <button
                type="button"
                onClick={() => navigateSpecialty('defesa-medica')}
                className="block w-full text-left py-2 pl-3 text-sm font-semibold text-slate-600 hover:text-blue-700 border-l-2 border-slate-200"
              >
                Para Médicos e Clínicas
              </button>
              <button
                type="button"
                onClick={() => navigateSpecialty('seguros')}
                className="block w-full text-left py-2 pl-3 text-sm font-semibold text-slate-600 hover:text-blue-700 border-l-2 border-slate-200"
              >
                Seguros em Geral
              </button>
            </div>
            <div className="border-t border-slate-100 pt-2 space-y-1">
              <button type="button" onClick={() => navigateHome('atuacao')} className="block w-full text-left py-2 text-sm font-semibold text-slate-700">
                Atuação Prática
              </button>
              <button type="button" onClick={() => navigateHome('depoimentos')} className="block w-full text-left py-2 text-sm font-semibold text-slate-700">
                Depoimentos
              </button>
              <button type="button" onClick={() => navigateHome('artigos')} className="block w-full text-left py-2 text-sm font-semibold text-slate-700">
                Artigos
              </button>
              <button type="button" onClick={() => navigateHome('faq')} className="block w-full text-left py-2 text-sm font-semibold text-slate-700">
                Dúvidas
              </button>
              <button type="button" onClick={() => navigateHome('contato-formulario')} className="block w-full text-left py-2 text-sm font-semibold text-slate-700">
                Fale Conosco
              </button>
            </div>
            <div className="pt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow"
              >
                <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {activeView.type === 'article' ? (
        <ArticlePageView
          article={articles.find((a) => a.id === activeView.id) || articles[0]}
          articles={articles}
          onNavigate={navigateArticle}
        />
      ) : activeView.type === 'specialty' ? (
        <SpecialtyInternalPage
          page={activeView.page}
          whatsappNumber={whatsappNumber}
          onBackHome={() => navigateHome()}
          onGoToContact={() => navigateHome('contato-formulario')}
        />
      ) : (
        <>
          {/* HERO SECTION */}
          <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 bg-blue-950 overflow-hidden">
            <div className="absolute inset-0 opacity-25">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-600/30 rounded-full filter blur-3xl"></div>
              <div className="absolute top-48 -left-24 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-3/5 text-center md:text-left">
                  <div className="inline-block bg-blue-950/60 border border-blue-800/70 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
                    <span className="text-amber-400 font-semibold text-xs sm:text-sm tracking-wide flex items-center gap-2 justify-center md:justify-start">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      Direito Médico e da Saúde · Atendimento em todo o Brasil
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                    A sua saúde{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-sky-400">
                      não pode esperar.
                    </span>
                  </h1>

                  <p className="text-base md:text-xl text-slate-300 mb-9 max-w-2xl leading-relaxed text-justify">
                    Advocacia especializada na defesa de beneficiários contra abusos de operadoras de planos de saúde.
                    Atuação técnica e ágil em negativas de cirurgias, exames, internações, medicamentos de alto custo e
                    reajustes abusivos, inclusive com pedidos de liminar de urgência.
                  </p>

                  {/* ÁREA DE BOTÕES DO HERO */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center md:justify-start items-stretch sm:items-center mb-8">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-7 py-4 rounded-xl font-extrabold text-base flex items-center justify-center gap-2.5 transition-all hover:shadow-[0_0_24px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 shadow-lg"
                    >
                      <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                      Falar com um Especialista no WhatsApp
                    </a>

                    <a
                      href="#contato-formulario"
                      className="border-2 border-white/35 hover:border-amber-400 bg-white/5 hover:bg-white/10 text-white hover:text-amber-300 px-7 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                    >
                      Enviar Relato para Triagem
                    </a>
                  </div>
                </div>

                <div className="md:w-2/5 relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700/50 group">
                    <img
                      src="/7854563567.jpg"
                      alt="Dr. Fábio Saraiva"
                      className="w-full h-auto object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                        <div className="bg-blue-600 p-2 rounded-full shrink-0">
                          <Award className="text-white" size={24} />
                        </div>
                        <div>
                          <p className="text-white font-bold">Dr. Fábio Saraiva</p>
                          <p className="text-slate-300 text-xs sm:text-sm">
                            Mais de 25 anos de experiência em Direito Médico e da Saúde.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAIXA DE DIFERENCIAIS (3 CARDS ABAIXO DO HERO) */}
          <section className="py-14 bg-white border-b border-slate-200">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                <div className="flex flex-col items-center text-center px-6 pt-4 md:pt-0">
                  <ShieldAlert className="text-blue-800 mb-3" size={38} />
                  <h2 className="text-xl font-extrabold text-slate-900 mb-2">Pedidos de Liminar em Urgência</h2>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Atuação técnica e ágil diante de recusas indevidas de tratamentos, cirurgias, internações e
                    medicamentos prescritos pelo médico assistente.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center px-6 pt-8 md:pt-0">
                  <User className="text-blue-800 mb-3" size={38} />
                  <h2 className="text-xl font-extrabold text-slate-900 mb-2">Atendimento Direto e Personalizado</h2>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Análise individual de cada contrato, laudo médico e negativa, com comunicação clara e sem juridiquês
                    em todas as etapas.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center px-6 pt-8 md:pt-0">
                  <Globe className="text-blue-800 mb-3" size={38} />
                  <h2 className="text-xl font-extrabold text-slate-900 mb-2">Atuação On-line em Todo o Brasil</h2>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Atendimento por WhatsApp e videoconferência, com condução de processos eletrônicos em São Paulo e em
                    todo o território nacional.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ÁREAS DE ESPECIALIDADE (6 CARDS FOCADOS EM SAÚDE) */}
          <section id="solucoes" className="py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">
                  Áreas de Especialidade
                </h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                  Atuação técnica nas principais demandas de Direito Médico e da Saúde.
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col justify-between">
                  <div>
                    <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-700">
                      <ShieldAlert size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">
                      Liminares de Urgência, Internação e UTI
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed text-justify">
                      Adoção de medidas judiciais urgentes contra negativas de internação hospitalar, cirurgias,
                      limitação de dias em UTI e exames de alta complexidade com indicação médica.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col justify-between">
                  <div>
                    <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-700">
                      <Home size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">Home Care e Tratamento Domiciliar</h4>
                    <p className="text-slate-600 text-sm leading-relaxed text-justify">
                      Atuação contra a recusa ou interrupção indevida de internação domiciliar (home care) e terapias
                      contínuas prescritas pelo médico assistente.
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col justify-between">
                  <div>
                    <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-700">
                      <Pill size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">
                      Medicamentos de Alto Custo
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed text-justify">
                      Ações e medidas para assegurar o fornecimento de medicamentos de alto custo prescrito no
                      tratamento de câncer, doenças autoimunes, neurológicas, degenerativas, doenças raras, genéticas,
                      entre outras.
                    </p>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col justify-between">
                  <div>
                    <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-700">
                      <FileWarning size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">Carência e Doença Preexistente</h4>
                    <p className="text-slate-600 text-sm leading-relaxed text-justify">
                      Análise do caso e adoção de medidas para reversão de recusas abusivas fundadas em prazos de
                      carência acima do limite legal (como urgência/emergência superior a 24 horas) ou alegação de
                      doença preexistente.
                    </p>
                  </div>
                </div>

                {/* Card 5 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col justify-between">
                  <div>
                    <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-700">
                      <Scale size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">
                      Reajuste Abusivo (Falso Coletivo e Faixa Etária)
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed text-justify">
                      Ações revisionais contra aumentos desproporcionais ou em planos empresariais com poucas vidas
                      (falsos coletivos), com análise técnica realizada por perito contábil especialista visando a
                      redução das mensalidades futuras e restituição de valores pagos a maior dos últimos 3 anos.
                    </p>
                  </div>
                </div>

                {/* Card 6 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col justify-between">
                  <div>
                    <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-blue-700">
                      <FileCheck size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">
                      Cobranças Hospitalares e Reversão de Negativas
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed text-justify">
                      Adoção de medidas para cancelamento de cobranças hospitalares indevidas decorrentes de negativas
                      pela operadora, incluindo exames, OPME (Órtese, Prótese, Materiais Especiais), entre outros,
                      descredenciamento indevido de hospitais e clínicas de referência sem comunicação prévia e
                      substituição e cancelamento unilateral do contrato.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FORMULÁRIO DE CONTATO */}
          <section id="contato-formulario" className="py-24 bg-white text-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full filter blur-3xl"></div>
              <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full filter blur-3xl"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
              <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-5/12 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 px-4 py-2 rounded-full mb-6 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
                    <Mail size={16} />
                    Atendimento Rápido e Sigiloso
                  </div>
                  <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                    Fale com um{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-sky-800">
                      especialista.
                    </span>
                  </h3>
                  <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed text-justify">
                    Preencha o formulário para enviar os detalhes da sua situação diretamente à equipe do escritório.
                    Avaliaremos o seu relato com rigor técnico e agilidade para orientar os próximos passos.
                  </p>

                  <div className="space-y-4 hidden lg:block">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg text-blue-800">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">Sigilo Profissional</h5>
                        <p className="text-slate-600 text-xs">
                          Seus dados e documentos são tratados com total confidencialidade.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg text-blue-800">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">Retorno Ágil pela Equipe</h5>
                        <p className="text-slate-600 text-xs">
                          Triagem técnica com retorno via WhatsApp ou e-mail informado.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-7/12 w-full">
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl relative min-h-[400px] flex flex-col justify-center">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500 to-transparent"></div>

                    {formSubmitted ? (
                      <div className="text-center py-10 px-4">
                        <div className="bg-emerald-50 border border-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                          <CheckCircle2 size={40} className="animate-pulse" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 mb-4">Relato Enviado com Sucesso!</h4>
                        <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto mb-8 text-justify">
                          Agradecemos o seu contato. Suas informações foram enviadas com sigilo diretamente à equipe do
                          escritório.
                          <br />
                          <br />
                          Realizaremos a triagem técnica do seu relato com agilidade e retornaremos através do WhatsApp
                          ou e-mail informados.
                        </p>
                        <div className="border-t border-slate-200 pt-6">
                          <p className="text-xs text-slate-500 mb-4">
                            Deseja falar com um especialista por mensagem agora mesmo?
                          </p>
                          <a
                            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                              `Olá! Sou ${clientName}. Enviei os detalhes do meu caso pelo formulário do site e gostaria de um retorno.`
                            )}`}
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
                        <div className="relative">
                          <label
                            htmlFor="client-name"
                            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                          >
                            Nome Completo:
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <label
                              htmlFor="client-email"
                              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                            >
                              E-mail de Contato:
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
                            <label
                              htmlFor="client-phone"
                              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                            >
                              WhatsApp / Telefone (com DDD):
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

                        <div className="relative">
                          <label
                            htmlFor="case-description"
                            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                          >
                            Conte resumidamente o seu caso (tipo de negativa, reajuste ou urgência):
                          </label>
                          <textarea
                            id="case-description"
                            rows={5}
                            className="w-full rounded-2xl bg-white border-slate-200 border p-4 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none shadow-sm text-sm leading-relaxed"
                            placeholder="Descreva aqui o tipo de negativa, reajuste ou situação de urgência..."
                            value={caseDescription}
                            onChange={(e) => setCaseDescription(e.target.value)}
                          ></textarea>
                        </div>

                        {formError && (
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1 font-semibold">
                            ⚠️ {formError}
                          </p>
                        )}

                        <div className="mt-5 flex justify-end">
                          <button
                            type="submit"
                            disabled={
                              isSubmitting || !caseDescription.trim() || !clientName.trim() || !clientEmail.trim()
                            }
                            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 px-8 py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg cursor-pointer"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="animate-spin" size={18} />
                                Enviando relato...
                              </>
                            ) : (
                              <>
                                <Send size={18} />
                                Enviar para Triagem
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

          {/* SOBRE O ESCRITÓRIO / DR. FÁBIO SARAIVA */}
          <section id="sobre" className="py-24 bg-white border-t border-slate-100">
            <div className="container mx-auto px-4 md:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 relative">
                  <div className="relative">
                    <img
                      src="https://i.ibb.co/s9PyNDNW/firefox-1f-HADh-BJWx.jpg"
                      alt="Escritório Saraiva & Advogados"
                      className="rounded-lg shadow-2xl w-4/5 ml-auto"
                    />
                    <img
                      src="https://i.ibb.co/HfW3qVCZ/Whats-App-Image-2026-06-01-at-20-46-27.jpg"
                      alt="Detalhes do Escritório Saraiva & Advogados"
                      className="rounded-lg shadow-xl absolute -bottom-12 -left-4 w-3/5 border-8 border-white"
                    />
                  </div>
                </div>

                <div className="lg:w-1/2 mt-16 lg:mt-0">
                  <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">O Escritório</h2>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
                    Para nós, cada caso exige rigor técnico e atenção individual.
                  </h3>
                  <p className="text-blue-800 font-bold text-base mb-6">
                    Advocacia especializada em Direito Médico e da Saúde.
                  </p>
                  <div className="space-y-4 text-slate-600 text-base md:text-lg leading-relaxed text-justify">
                    <p>
                      Com mais de 25 anos de sólida experiência jurídica, o escritório{' '}
                      <strong>Saraiva &amp; Advogados</strong> é liderado pelo <strong>Dr. Fábio Saraiva</strong>{' '}
                      (OAB/SP 184.971), membro efetivo das{' '}
                      <u>Comissões Especiais de Direito Médico e da Saúde</u>, <u>Defesa do Consumidor</u> e{' '}
                      <u>Direito do Seguro e Resseguro da OAB-SP</u>.
                    </p>
                    <p>
                      No Direito da Saúde, experiência e precisão probatória precisam caminhar juntas. Atuar diante das
                      grandes operadoras de saúde suplementar exige uma advocacia artesanal, em que cada relatório
                      médico, cláusula contratual e detalhe do prontuário fazem diferença.
                    </p>
                    <p>
                      Nossa atuação é pautada pela ética, transparência e assertividade técnica, assegurando orientação
                      jurídica segura para pacientes e famílias no momento em que mais precisam.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* COMO ATUAMOS (FLUXO DE 4 PASSOS) */}
          <section className="py-24 bg-blue-950 text-white">
            <div className="container mx-auto px-4 md:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-3">
                  Processo Simplificado
                </h2>
                <h3 className="text-3xl md:text-4xl font-extrabold mb-6">
                  Como atuamos na defesa dos seus direitos
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-blue-800/50"></div>

                {[
                  {
                    step: '01',
                    title: 'Contato Inicial',
                    desc: 'Você relata a situação pelo WhatsApp ou formulário de forma 100% sigilosa e envia os documentos básicos (negativa por escrito, relatório médico e dados do contrato).',
                  },
                  {
                    step: '02',
                    title: 'Triagem Técnica',
                    desc: 'Avaliamos os documentos com agilidade para verificar o enquadramento legal, as possibilidades jurídicas e o grau de urgência do seu caso.',
                  },
                  {
                    step: '03',
                    title: 'Medidas Judiciais e Liminar',
                    desc: 'Aprovada a contratação, elaboramos a medida cabível com fundamentação médica e jurisprudencial, inclusive com pedido de tutela de urgência (liminar) quando necessário.',
                  },
                  {
                    step: '04',
                    title: 'Acompanhamento Transparente',
                    desc: 'Você recebe atualizações claras sobre cada andamento do processo, em linguagem simples e sem juridiquês.',
                  },
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
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-xl font-extrabold text-base md:text-lg items-center justify-center gap-2.5 transition-all shadow-lg hover:-translate-y-1"
                >
                  <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                  Iniciar o Passo 1 pelo WhatsApp
                </a>
              </div>
            </div>
          </section>

          {/* ATUAÇÃO PRÁTICA E JURISPRUDÊNCIA */}
          <section id="atuacao" className="py-24 bg-slate-100 border-t border-slate-200">
            <div className="container mx-auto px-4 md:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">Atuação Prática</h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                  Decisões Judiciais em Direito da Saúde
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-4">
                  Exemplos reais de atuação do escritório na reversão de negativas e cobranças abusivas contra operadoras
                  de planos de saúde.
                </p>
                <p className="text-slate-500 text-xs italic max-w-2xl mx-auto bg-white/70 border border-slate-200/80 rounded-xl px-4 py-2.5">
                  Nota informativa: decisões ilustrativas de casos concretos com partes anonimizadas. Cada situação
                  possui particularidades clínicas e contratuais que exigem avaliação técnica individual.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {courtCases.slice(0, showAllCases ? courtCases.length : 3).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-6">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full">
                          {item.outcome}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">Caso Concreto Anonimizado</span>
                      </div>

                      <h4 className="text-slate-900 font-black text-lg mb-2 leading-snug">{item.parties}</h4>
                      <p className="text-xs text-blue-700 font-extrabold mb-4 flex items-center gap-1">{item.court}</p>

                      <div className="border-t border-slate-100 pt-4 mb-4">
                        <h5 className="text-xs font-black uppercase text-slate-400 mb-1">Discussão:</h5>
                        <p className="text-slate-700 font-semibold text-xs leading-relaxed text-justify mb-3">{item.issue}</p>
                        <h5 className="text-xs font-black uppercase text-slate-400 mb-1">Medida Concedida:</h5>
                        <p className="text-slate-600 text-xs leading-relaxed text-justify">{item.summary}</p>
                      </div>

                      <div className="mt-4 bg-slate-50 border-l-4 border-amber-500 rounded-r-xl p-4 font-mono text-[11px] text-slate-600 select-none relative max-h-[160px] overflow-y-auto">
                        <span className="absolute top-1 right-2 text-2xl font-black text-slate-200 pointer-events-none">
                          ”
                        </span>
                        <p className="leading-relaxed italic text-justify">"{item.excerpt}"</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-6">
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex bg-blue-950 hover:bg-amber-500 text-white hover:text-slate-950 py-3 rounded-xl font-bold text-xs items-center justify-center gap-2 transition-all"
                      >
                        <img
                          src="/whatsapp_PNG20.png"
                          alt="WhatsApp"
                          className="w-4 h-4 object-contain brightness-0 invert"
                        />
                        Entender seus direitos neste tema
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
                    {showAllCases ? 'Ver menos decisões' : `Ver mais decisões (${courtCases.length - 3})`}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* DEPOIMENTOS (AVALIAÇÕES NO GOOGLE) */}
          <section id="depoimentos" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 md:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-6 shadow-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-xs font-bold text-slate-700">Avaliações no Google</span>
                </div>
                <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">
                  Avaliações no Google
                </h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                  O que dizem os nossos clientes
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  <span className="text-lg font-black text-slate-950">5.0</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="text-amber-400 fill-amber-400 w-5 h-5" />
                    ))}
                  </div>
                  <span className="text-slate-500 text-sm">
                    Nota máxima 5.0 baseada em avaliações reais e verificadas no Google.
                  </span>
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
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            fill="#EA4335"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="text-amber-400 fill-amber-400 w-4 h-4" />
                        ))}
                      </div>
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                        Verificada
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed text-justify mb-6 whitespace-pre-line">
                      "Excelente trabalho! Gostaria de agradecer imensamente a toda a equipe do escritório pelo
                      profissionalismo e dedicação. Eles cuidaram de um processo meu delicado e o resultado foi um
                      verdadeiro sucesso. São profissionais extremamente experientes, ágeis e empáticos em cada etapa do
                      processo. Passaram muita segurança em um momento difícil. Recomendo de olhos fechados!"
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Avaliação Verificada</span>
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                    >
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
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            fill="#EA4335"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="text-amber-400 fill-amber-400 w-4 h-4" />
                        ))}
                      </div>
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                        Verificada
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed text-justify mb-6 whitespace-pre-line">
                      "Todo o trabalho do Dr. Fábio e sua equipe do escritório Saraiva &amp; Advogados é embasado no que
                      há de mais atual, sempre muito solícitos, resolutivos e empenhados em auxiliar e orientar técnica e
                      verdadeiramente em seus casos. Obrigada pelo trabalho!"
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Avaliação Verificada</span>
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                    >
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
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            fill="#EA4335"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="text-amber-400 fill-amber-400 w-4 h-4" />
                        ))}
                      </div>
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                        Verificada
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed text-justify mb-6 whitespace-pre-line">
                      "O Dr. Fábio Saraiva é um excelente profissional! Sempre muito atencioso, prestativo e disponível
                      para ajudar. Explica os assuntos de forma clara e objetiva, transmite segurança nas orientações e
                      responde com rapidez. Além do conhecimento técnico, destaco a prontidão e o comprometimento em
                      buscar as melhores soluções. Recomendo com confiança."
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Avaliação Verificada</span>
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                    >
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
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
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
                <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">
                  Artigos
                </h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                  Informativos e Orientações
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
                  Acompanhe as publicações do Dr. Fábio Saraiva com orientações e recomendações práticas para pacientes
                  e profissionais da área de saúde.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {articles.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigateArticle(item.id)}
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
                      <h4 className="font-extrabold text-slate-950 text-lg leading-snug mb-3 group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed text-justify">{item.excerpt}</p>
                    </div>
                    <span className="text-blue-700 font-bold text-sm flex items-center gap-1 group-hover:underline mt-4">
                      Ler artigo completo →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* REELS E PUBLICAÇÕES NO INSTAGRAM */}
          <InstagramFeedSection
            feedUrl={beholdFeedUrl}
            instagramHandle={instagramHandle}
            instagramUrl={instagramUrl}
            whatsappLink={whatsappLink}
          />

          {/* FAQ */}
          <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
              <div className="text-center mb-16">
                <h2 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-3">Dúvidas Frequentes</h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Perguntas Frequentes</h3>
              </div>
              <div className="space-y-4">
                {faqItems.map((faq) => (
                  <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </section>

          {/* CTA FINAL */}
          <section className="py-20 bg-blue-950 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                Você não precisa enfrentar uma negativa sozinho.
              </h2>
              <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Fale agora mesmo com um especialista em Direito Médico e da Saúde e entenda os seus direitos com
                segurança e sigilo.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex bg-amber-500 hover:bg-amber-400 text-slate-950 px-9 py-5 rounded-xl font-black text-lg md:text-xl items-center justify-center gap-3 transition-all hover:shadow-[0_0_24px_rgba(245,158,11,0.4)] hover:-translate-y-1"
              >
                <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-6 h-6 object-contain" />
                Falar com um Especialista no WhatsApp
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
                  alt="Saraiva & Advogados"
                  className="h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
              <p className="text-white font-extrabold text-lg mb-2">Saraiva &amp; Advogados</p>
              <p className="mb-4 text-sm leading-relaxed text-justify">
                Mais de 25 anos de experiência na defesa dos clientes na área do Direito Médico e da Saúde, atuando com
                ética, rigor técnico e transparência.
              </p>
              <p className="text-amber-400 font-bold tracking-wide text-xs">
                Dr. Fábio Saraiva — OAB/SP 184.971
              </p>
            </div>

            <div className="md:col-span-3">
              <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Links Rápidos</h5>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateHome('sobre')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    O Escritório
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateHome('solucoes')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Áreas de Atuação
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateSpecialty('defesa-medica')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Para Médicos e Clínicas
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateSpecialty('seguros')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Seguros em Geral
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateHome('atuacao')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Atuação Prática
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateHome('depoimentos')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Depoimentos
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateHome('artigos')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Artigos
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateHome('faq')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Dúvidas Frequentes
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contato &amp; Endereço</h5>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="text-amber-500 shrink-0 mt-1" size={18} />
                  <span>
                    Rua Afonso Celso, 1221, Cj. 16 — Vila Mariana, São Paulo/SP · CEP 04119-061
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-amber-500 shrink-0" size={18} />
                  <a href={whatsappLink} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
                    WhatsApp: (11) 96281-7392
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-amber-500 shrink-0" size={18} />
                  <a
                    href="mailto:contato@saraivaeadvogados.com.br"
                    className="hover:text-amber-400 transition-colors break-all"
                  >
                    contato@saraivaeadvogados.com.br
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Instagram className="text-amber-500 shrink-0" size={18} />
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-amber-400 transition-colors"
                  >
                    Instagram: {instagramHandle}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} Saraiva &amp; Advogados. Todos os direitos reservados.</p>
            <p className="text-slate-500">Dr. Fábio Saraiva · OAB/SP 184.971</p>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-6 right-6 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <img src="/WhatsApp_Logo.png" alt="WhatsApp" className="w-14 h-14 object-contain" />
      </a>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors outline-none"
      >
        <span className="font-bold text-slate-900 pr-8">{question}</span>
        <ChevronDown
          className={`text-blue-600 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      <div
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[520px] pb-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-slate-600 text-sm leading-relaxed text-justify border-t pt-4">{answer}</p>
      </div>
    </div>
  );
}

function renderFormattedText(text: string) {
  if (!text) return '';
  if (!text.includes('<b') && !text.includes('<strong') && !text.includes('**')) {
    return text;
  }
  const regex = /(?:<b>(.*?)<\/b>|<strong>(.*?)<\/strong>|\*\*(.*?)\*\*)/gi;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const boldText = match[1] ?? match[2] ?? match[3] ?? '';
    parts.push(
      <strong key={match.index} className="font-extrabold text-slate-900">
        {boldText}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

function ArticlePageView({
  article,
  articles,
  onNavigate,
}: {
  article: any;
  articles: any[];
  onNavigate: (id: number) => void;
}) {
  return (
    <div className="bg-slate-50 pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Artigo Principal */}
        <article className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-slate-100 mb-12">
          <div className="mb-6">
            <span className="inline-block bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
              Direito da Saúde • Informativo
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4">{article.title}</h1>
            <div className="flex items-center gap-3 text-slate-500 text-sm border-t border-slate-100 pt-4">
              <div className="w-8 h-8 rounded-full bg-blue-950 flex items-center justify-center text-white font-bold text-xs">
                FS
              </div>
              <div>
                <p className="font-bold text-slate-700">Por Dr. Fábio Saraiva</p>
                <p className="text-xs">Especialista em Direito Médico e da Saúde · OAB/SP 184.971</p>
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
              {renderFormattedText(article.intro)}
            </p>

            {article.sections && article.sections.length > 0 ? (
              <div className="space-y-10 pt-4 border-t border-slate-100">
                {article.sections.map((sec: any, sIdx: number) => (
                  <div key={sIdx} className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                      {renderFormattedText(sec.title)}
                    </h3>
                    {sec.image && (
                      <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100 my-4 max-h-[380px]">
                        <img src={sec.image} alt={sec.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    {sec.content && (
                      <p className="whitespace-pre-line text-slate-700 leading-relaxed">
                        {renderFormattedText(sec.content)}
                      </p>
                    )}
                    {sec.bullets && sec.bullets.length > 0 && (
                      <div className="space-y-3 my-4">
                        {sec.bullets.map((b: any, bIdx: number) => (
                          <div
                            key={bIdx}
                            className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100"
                          >
                            <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-full shrink-0">
                              <CheckCircle2 size={16} />
                            </div>
                            <div>
                              {b.title && (
                                <h4 className="font-extrabold text-slate-900 text-sm mb-1">
                                  {renderFormattedText(b.title)}
                                </h4>
                              )}
                              <p className="text-slate-600 text-sm leading-relaxed">{renderFormattedText(b.text)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 pt-4 border-t border-slate-100">
                  {renderFormattedText(article.subtitle)}
                </h3>

                {/* Listagem de Tópicos */}
                <div className="space-y-4 my-6">
                  {article.bullets.map((bullet: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100"
                    >
                      <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-full shrink-0">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        {bullet.title && (
                          <h4 className="font-extrabold text-slate-900 text-sm mb-1">
                            {renderFormattedText(bullet.title)}
                          </h4>
                        )}
                        <p className="text-slate-600 text-sm leading-relaxed">{renderFormattedText(bullet.text)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <p className="whitespace-pre-line text-slate-600 pt-4 border-t border-slate-100">
              {renderFormattedText(article.conclusion)}
            </p>
          </div>

          {/* Chamada para Ação (CTA) */}
          <div className="mt-12 bg-blue-950 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-blue-900">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h4 className="text-lg md:text-xl font-bold mb-6 text-slate-200 text-center">{article.ctaText}</h4>
              <a
                href={article.ctaLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-xl font-black text-base items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-1"
              >
                <img src="/whatsapp_PNG20.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                Falar com um Especialista no WhatsApp
              </a>
            </div>
          </div>
        </article>

        {/* Leia Também Section */}
        <div className="border-t border-slate-200 pt-12">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-8 text-center md:text-left">
            Leia também outros artigos do Dr. Fábio Saraiva
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles
              .filter((a) => a.id !== article.id)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="rounded-xl overflow-hidden mb-4 aspect-video">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded mb-3">
                      Direito da Saúde
                    </span>
                    <h4 className="font-extrabold text-slate-950 text-base leading-snug mb-3 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 text-xs line-clamp-3 mb-4 leading-relaxed text-justify">{item.excerpt}</p>
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
