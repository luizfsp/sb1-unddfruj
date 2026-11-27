import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  FileWarning,
  Instagram,
  MapPin,
  Pill,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

interface InstagramBioPageProps {
  whatsappNumber: string;
  instagramHandle: string;
  instagramUrl: string;
  onGoHome: () => void;
}

export function InstagramBioPage({
  whatsappNumber,
  instagramHandle,
  instagramUrl,
  onGoHome,
}: InstagramBioPageProps) {
  const bioActions = [
    {
      title: '1. Urgência / Cirurgia / Internação',
      subtitle: 'Negativas urgentes, UTI, exames e pedidos de liminar',
      icon: ShieldAlert,
      highlight: true,
      href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'URGÊNCIA: Olá! Vim pelo Instagram e preciso de orientação jurídica sobre urgência, cirurgia ou internação negada pelo plano de saúde.'
      )}`,
    },
    {
      title: '2. Medicamentos de Alto Custo',
      subtitle: 'Oncológicos, doenças autoimunes, neurológicas, raras e genéticas',
      icon: Pill,
      highlight: false,
      href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Olá! Vim pelo Instagram e preciso de orientação jurídica sobre negativa de medicamento de alto custo.'
      )}`,
    },
    {
      title: '3. Reajuste Abusivo',
      subtitle: 'Aumento aos 59 anos ou planos empresariais (falso coletivo)',
      icon: Scale,
      highlight: false,
      href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Olá! Vim pelo Instagram e gostaria de uma triagem técnica sobre reajuste abusivo no plano de saúde (faixa etária ou falso coletivo).'
      )}`,
    },
    {
      title: '4. Carência / Doença Preexistente',
      subtitle: 'Recusas por carência em urgência ou alegação de preexistência',
      icon: FileWarning,
      highlight: false,
      href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Olá! Vim pelo Instagram e tive uma negativa do plano de saúde sob alegação de carência ou doença preexistente.'
      )}`,
    },
  ];

  return (
    <div className="min-h-screen bg-blue-950 text-white relative overflow-hidden flex flex-col justify-between py-12 px-4">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 -left-24 w-80 h-80 bg-amber-500/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="w-full max-w-md mx-auto relative z-10 flex flex-col items-center">
        <img
          src="/Logo 2_Fundo Transparente.png"
          alt="Saraiva & Advogados"
          className="h-24 w-auto object-contain mb-4"
        />

        <div className="inline-flex items-center gap-2 bg-blue-900/70 border border-blue-800 rounded-full px-4 py-1.5 mb-3">
          <Award size={14} className="text-amber-400" />
          <span className="text-xs font-semibold text-amber-300 tracking-wide">
            Direito Médico e da Saúde · Todo o Brasil
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-center mb-1">
          Saraiva &amp; Advogados
        </h1>
        <p className="text-sm text-slate-300 text-center mb-8">
          Dr. Fábio Saraiva · OAB/SP 184.971 · Mais de 25 anos de experiência jurídica
        </p>

        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4 text-center">
          Selecione o assunto para falar no WhatsApp
        </p>

        <div className="w-full space-y-3.5 mb-8">
          {bioActions.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`w-full rounded-2xl p-4 flex items-center justify-between gap-4 transition-all hover:-translate-y-0.5 shadow-lg border ${
                  item.highlight
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/15 backdrop-blur-md'
                }`}
              >
                <div className="flex items-center gap-3.5 text-left">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      item.highlight
                        ? 'bg-slate-950/15 text-slate-950'
                        : 'bg-amber-500/15 text-amber-400'
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm leading-snug">
                      {item.title}
                    </div>
                    <div
                      className={`text-xs mt-0.5 leading-snug ${
                        item.highlight ? 'text-slate-900/80' : 'text-slate-300'
                      }`}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className={item.highlight ? 'text-slate-950 shrink-0' : 'text-amber-400 shrink-0'}
                />
              </a>
            );
          })}
        </div>

        <button
          onClick={onGoHome}
          className="w-full py-3.5 px-6 rounded-xl border border-white/25 hover:border-amber-400 hover:text-amber-300 text-sm font-bold text-slate-200 transition-colors flex items-center justify-center gap-2 mb-6"
        >
          Acessar o site completo
          <ArrowRight size={16} />
        </button>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-amber-400 transition-colors"
        >
          <Instagram size={15} />
          <span>{instagramHandle}</span>
        </a>
      </div>

      <footer className="w-full max-w-md mx-auto relative z-10 text-center pt-10 text-[11px] text-slate-400 space-y-1">
        <p className="inline-flex items-center gap-1 justify-center">
          <MapPin size={12} className="text-amber-400" />
          Vila Mariana, São Paulo/SP · Atendimento On-line Nacional
        </p>
        <p>© {new Date().getFullYear()} Saraiva &amp; Advogados. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

interface SpecialtyInternalPageProps {
  page: 'defesa-medica' | 'seguros';
  whatsappNumber: string;
  onBackHome: () => void;
  onGoToContact: () => void;
}

export function SpecialtyInternalPage({
  page,
  whatsappNumber,
  onBackHome,
  onGoToContact,
}: SpecialtyInternalPageProps) {
  const isMedicalDefense = page === 'defesa-medica';

  const content = isMedicalDefense
    ? {
        badge: 'Área Complementar · Direito Médico',
        title: 'Médicos e Clínicas',
        subtitle:
          'Atuação ética, técnica e sigilosa na defesa de profissionais e clínicas perante os órgãos de classe e em ações indenizatórias de responsabilidade civil por negligência, imprudência ou imperícia.',
        icon: Stethoscope,
        whatsappHref: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          'Olá! Gostaria de uma orientação jurídica voltada para Médicos e Clínicas.'
        )}`,
        highlights: [
          {
            title: 'Defesa perante Conselhos de Classe (CRM)',
            desc: 'Acompanhamento técnico em sindicâncias, processos ético-profissionais (PEP) e recursos administrativos com rigorosa análise de prontuário.',
          },
          {
            title: 'Ações Indenizatórias de Responsabilidade Civil',
            desc: 'Atuação em demandas judiciais envolvendo alegação de negligência, imprudência ou imperícia, com foco em perícia técnica e documentação clínica.',
          },
          {
            title: 'Consultoria Preventiva para Médicos e Clínicas',
            desc: 'Orientação jurídica sobre prontuários, termos de consentimento livre e esclarecido e conformidade com resoluções do CFM.',
          },
          {
            title: 'Análise Técnica Individualizada',
            desc: 'Triagem minuciosa dos fatos, laudos e documentos médicos para definir a estratégia jurídica adequada com total sigilo profissional.',
          },
        ],
        ctaTitle: 'Precisa de orientação jurídica para Médicos e Clínicas?',
        ctaText:
          'Fale com a equipe do escritório para uma triagem técnica sigilosa sobre o seu caso.',
      }
    : {
        badge: 'Área Complementar · Direito Securitário',
        title: 'Seguros em Geral',
        subtitle:
          'Atuação técnica contra negativas indevidas de indenização e descumprimento contratual por seguradoras, liderada pelo Dr. Fábio Saraiva, membro efetivo da Comissão Especial de Direito do Seguro e Resseguro da OAB-SP.',
        icon: ShieldCheck,
        whatsappHref: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          'Olá! Gostaria de uma orientação jurídica referente a Seguros em Geral (negativa de cobertura ou indenização).'
        )}`,
        highlights: [
          {
            title: 'Seguro de Vida e Acidentes Pessoais',
            desc: 'Atuação contra recusas abusivas de pagamento de capital segurado, cobertura de invalidez permanente ou alegação irregular de doença preexistente.',
          },
          {
            title: 'Seguro Automóvel e Patrimonial',
            desc: 'Medidas judiciais diante de negativas indevidas de indenização por sinistro, cobertura de terceiros, seguro residencial e empresarial.',
          },
          {
            title: 'Seguro Prestamista e Habitacional',
            desc: 'Revisão de negativas de quitação ou indenização em seguros vinculados a contratos bancários e financiamentos.',
          },
          {
            title: 'Análise de Apólices e Regulação de Sinistros',
            desc: 'Exame detalhado das condições gerais da apólice, cláusulas limitativas e cumprimento dos prazos regulatórios da SUSEP.',
          },
        ],
        ctaTitle: 'Teve uma indenização ou cobertura de seguro negada?',
        ctaText:
          'Envie o seu relato e a documentação da apólice para uma triagem técnica com nossa equipe especializada.',
      };

  const HeroIcon = content.icon;

  return (
    <div className="bg-slate-50 pt-36 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="mb-8">
          <button
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-blue-800 hover:text-amber-600 font-bold text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para a página inicial
          </button>
        </div>

        <div className="bg-blue-950 text-white rounded-3xl p-8 md:p-12 shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-sky-500/20 rounded-full filter blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-900/80 border border-blue-700/60 px-4 py-1.5 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider mb-5">
              <HeroIcon size={15} />
              {content.badge}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
              {content.title}
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed text-justify mb-8">
              {content.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={content.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-7 py-4 rounded-xl font-extrabold text-sm md:text-base inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg"
              >
                <img
                  src="/whatsapp_PNG20.png"
                  alt="WhatsApp"
                  className="w-5 h-5 object-contain"
                />
                Falar com um Especialista no WhatsApp
              </a>
              <button
                onClick={onGoToContact}
                className="border-2 border-white/30 hover:border-amber-400 text-white hover:text-amber-300 px-7 py-4 rounded-xl font-bold text-sm md:text-base inline-flex items-center justify-center gap-2 transition-all"
              >
                Enviar Relato para Triagem
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {content.highlights.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3.5">
                <div className="bg-blue-50 text-blue-800 p-2 rounded-xl shrink-0 mt-0.5">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 mb-2">
                    {item.title}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed text-justify">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-900 mb-2">
            Saraiva &amp; Advogados · Dr. Fábio Saraiva (OAB/SP 184.971)
          </p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
            {content.ctaTitle}
          </h3>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-7">
            {content.ctaText}
          </p>
          <a
            href={content.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex bg-blue-950 hover:bg-amber-500 text-white hover:text-slate-950 px-8 py-4 rounded-xl font-extrabold text-sm md:text-base items-center justify-center gap-2 transition-all"
          >
            <img
              src="/whatsapp_PNG20.png"
              alt="WhatsApp"
              className="w-5 h-5 object-contain"
            />
            Iniciar Atendimento pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
