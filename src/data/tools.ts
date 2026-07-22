import { AITool } from "../types";

export const AI_TOOLS_DATA: AITool[] = [
  // ✍️ REDAÇÃO & COPYWRITING (1-20)
  {
    id: "blog-post-generator",
    name: {
      "pt-BR": "Gerador de Artigos de Blog & SEO",
      "en": "Blog Post & SEO Article Generator",
      "es": "Generador de Artículos de Blog y SEO",
    },
    description: {
      "pt-BR": "Crie artigos completos otimizados para o Google com palavras-chave, subtítulos e conclusão.",
      "en": "Create full articles optimized for Google with keywords, subheadings, and key takeaways.",
      "es": "Crea artículos completos optimizados para Google con palabras clave y subtítulos.",
    },
    category: "Writing",
    iconName: "FileText",
    popular: true,
    inputs: [
      {
        id: "topic",
        label: { "pt-BR": "Tópico do Artigo", "en": "Article Topic", "es": "Tema del Artículo" },
        type: "text",
        placeholder: { "pt-BR": "Ex: Como usar Inteligência Artificial no Marketing em 2026", "en": "Ex: How to use AI in Marketing in 2026", "es": "Ej: Cómo usar IA en Marketing en 2026" },
      },
      {
        id: "keywords",
        label: { "pt-BR": "Palavras-Chave Foco", "en": "Target Keywords", "es": "Palabras Clave Objetivo" },
        type: "text",
        placeholder: { "pt-BR": "Ex: IA no marketing, ferramentas de ia, automação", "en": "Ex: AI marketing, AI tools, automation", "es": "Ej: IA marketing, herramientas ia" },
      },
      {
        id: "tone",
        label: { "pt-BR": "Tom de Voz", "en": "Tone of Voice", "es": "Tono de Voz" },
        type: "select",
        options: [
          { value: "professional", label: { "pt-BR": "Profissional & Persuasivo", "en": "Professional & Persuasive", "es": "Profesional y Persuasivo" } },
          { value: "conversational", label: { "pt-BR": "Informal & Descontraído", "en": "Conversational & Friendly", "es": "Informal y Amigable" } },
          { value: "authoritative", label: { "pt-BR": "Especialista & Técnico", "en": "Authoritative & Tech", "es": "Especialista y Técnico" } },
        ],
      },
    ],
    systemPrompt: "Write an authoritative, engaging, and comprehensive SEO blog article formatted in Clean Markdown with H1, H2, H3 headings, introduction, bullet points, and call to action.",
  },
  {
    id: "sales-letter-generator",
    name: {
      "pt-BR": "Gerador de Cartas de Vendas (VSL & Copy)",
      "en": "Sales Letter & VSL Copy Generator",
      "es": "Generador de Cartas de Ventas (VSL y Copy)",
    },
    description: {
      "pt-BR": "Escreva textos de vendas altamente persuasivos usando a estrutura AIDA ou PAS.",
      "en": "Write highly persuasive sales letters using AIDA or PAS framework.",
      "es": "Escribe textos de ventas altamente persuasivos usando AIDA o PAS.",
    },
    category: "Writing",
    iconName: "DollarSign",
    popular: true,
    inputs: [
      {
        id: "productName",
        label: { "pt-BR": "Nome do Produto/Serviço", "en": "Product/Service Name", "es": "Nombre del Producto/Servicio" },
        type: "text",
        placeholder: { "pt-BR": "Ex: Mentoria de Escala para SaaS", "en": "Ex: SaaS Scaling Mentorship", "es": "Ej: Mentoría de Escala para SaaS" },
      },
      {
        id: "targetAudience",
        label: { "pt-BR": "Público-Alvo", "en": "Target Audience", "es": "Público Objetivo" },
        type: "text",
        placeholder: { "pt-BR": "Ex: Empreendedores digitais e gestores de tráfego", "en": "Ex: Digital founders and media buyers", "es": "Ej: Emprendedores digitales" },
      },
      {
        id: "painPoint",
        label: { "pt-BR": "Maior Dor do Cliente", "en": "Main Customer Pain Point", "es": "Principal Dolor del Cliente" },
        type: "textarea",
        placeholder: { "pt-BR": "Ex: Falta de tempo e custo alto com funcionários", "en": "Ex: Lack of time and high staff costs", "es": "Ej: Falta de tiempo y alto costo de personal" },
      },
    ],
    systemPrompt: "Act as a world-class Copywriter like Gary Halbert or Eugene Schwartz. Write a compelling, high-converting Sales Letter focusing on hook, story, offer, urgency, and guarantee.",
  },
  {
    id: "email-sequence-generator",
    name: {
      "pt-BR": "Gerador de Sequência de E-mail de Vendas",
      "en": "Sales Email Sequence Generator",
      "es": "Generador de Secuencia de Email de Ventas",
    },
    description: {
      "pt-BR": "Crie sequências de 5 e-mails para nutrição, lançamento ou recuperação de carrinho.",
      "en": "Create 5-email nurture, launch, or abandoned cart sequence.",
      "es": "Crea secuencias de 5 emails para lanzamiento o carrito abandonado.",
    },
    category: "Writing",
    iconName: "Mail",
    popular: true,
    inputs: [
      {
        id: "offer",
        label: { "pt-BR": "Oferta Principal", "en": "Main Offer", "es": "Oferta Principal" },
        type: "text",
        placeholder: { "pt-BR": "Ex: Desconto de 50% na Anuidade", "en": "Ex: 50% Off Annual Plan", "es": "Ej: 50% de Descuento en Plan Anual" },
      },
      {
        id: "goal",
        label: { "pt-BR": "Objetivo da Sequência", "en": "Sequence Goal", "es": "Objetivo de la Secuencia" },
        type: "select",
        options: [
          { value: "onboarding", label: { "pt-BR": "Boas-vindas e Onboarding", "en": "Welcome & Onboarding", "es": "Bienvenida y Onboarding" } },
          { value: "launch", label: { "pt-BR": "Lançamento de Produto", "en": "Product Launch", "es": "Lanzamiento de Producto" } },
          { value: "cart_recovery", label: { "pt-BR": "Recuperação de Vendas / Carrinho", "en": "Cart Recovery", "es": "Recuperación de Carrito" } },
        ],
      },
    ],
    systemPrompt: "Generate a sequence of 5 strategic emails. For each email provide: Subject lines (A/B options), Preview text, Body copy, and Call to Action.",
  },
  {
    id: "landing-page-copy",
    name: {
      "pt-BR": "Gerador de Textos para Landing Page",
      "en": "Landing Page Copy Generator",
      "es": "Generador de Textos para Landing Page",
    },
    description: {
      "pt-BR": "Headline, Sub-headline, Benefícios, Depoimentos e Chamadas para Ação de alta conversão.",
      "en": "Headlines, sub-headlines, key benefits, testmonial prompts, and CTAs.",
      "es": "Titulares, subtítulos, beneficios clave y llamadas a la acción.",
    },
    category: "Writing",
    iconName: "Layout",
    inputs: [
      {
        id: "serviceName",
        label: { "pt-BR": "Nome do Negócio/SaaS", "en": "Business/SaaS Name", "es": "Nombre del Negocio/SaaS" },
        type: "text",
      },
      {
        id: "keyBenefit",
        label: { "pt-BR": "Benefício Principal", "en": "Key Value Proposition", "es": "Beneficio Principal" },
        type: "text",
      },
    ],
  },
  {
    id: "resume-builder-ai",
    name: {
      "pt-BR": "Criador de Currículos e Cartas de Apresentação",
      "en": "AI Resume & Cover Letter Generator",
      "es": "Generador de Currículums y Cartas de Presentación",
    },
    description: {
      "pt-BR": "Crie currículos impactantes otimizados para sistemas ATS e recrutadores.",
      "en": "Build ATS-friendly resumes and cover letters for top roles.",
      "es": "Crea currículums optimizados para sistemas ATS y reclutadores.",
    },
    category: "Writing",
    iconName: "UserCheck",
    inputs: [
      { id: "targetRole", label: { "pt-BR": "Cargo Desejado", "en": "Target Role", "es": "Puesto Deseado" }, type: "text" },
      { id: "experience", label: { "pt-BR": "Resumo de Experiências", "en": "Experience Summary", "es": "Resumen de Experiencia" }, type: "textarea" },
    ],
  },

  // 📣 TRÁFEGO PAGO & ANÚNCIOS (21-40)
  {
    id: "facebook-ads-generator",
    name: {
      "pt-BR": "Gerador de Anúncios Facebook & Instagram",
      "en": "Facebook & Instagram Ads Copy Generator",
      "es": "Generador de Anuncios para Facebook e Instagram",
    },
    description: {
      "pt-BR": "Crie 3 variações de texto para anúncios no Meta Ads com ganchos e CTAs.",
      "en": "Create 3 variations of Meta ad copy with strong hooks and CTAs.",
      "es": "Crea 3 variaciones de anuncios en Meta Ads con ganchos y CTAs.",
    },
    category: "Ads",
    iconName: "Megaphone",
    popular: true,
    inputs: [
      { id: "product", label: { "pt-BR": "O que você está vendendo?", "en": "What are you selling?", "es": "¿Qué estás vendiendo?" }, type: "text" },
      { id: "audience", label: { "pt-BR": "Público-Alvo", "en": "Target Audience", "es": "Público Objetivo" }, type: "text" },
    ],
    systemPrompt: "Generate 3 high-performing Facebook/Instagram Ad copies. Include Primary Text, Headline, Description, and CTA suggestion.",
  },
  {
    id: "google-ads-generator",
    name: {
      "pt-BR": "Gerador de Títulos e Descrições Google Ads",
      "en": "Google Ads Headline & Description Generator",
      "es": "Generador de Anuncios de Búsqueda de Google Ads",
    },
    description: {
      "pt-BR": "Crie 15 títulos e 4 descrições para Anúncios de Pesquisa Responsivos do Google.",
      "en": "Generate 15 headlines and 4 descriptions for Google RSA ads.",
      "es": "Crea 15 títulos y 4 descripciones para anuncios en Google Ads.",
    },
    category: "Ads",
    iconName: "Search",
    inputs: [
      { id: "brand", label: { "pt-BR": "Nome da Empresa", "en": "Company Name", "es": "Nombre de la Empresa" }, type: "text" },
      { id: "keywords", label: { "pt-BR": "Palavras-chave do Anúncio", "en": "Keywords", "es": "Palabras Clave" }, type: "text" },
    ],
  },
  {
    id: "youtube-script-generator",
    name: {
      "pt-BR": "Gerador de Scripts para YouTube & Shorts/Reels",
      "en": "YouTube & Shorts/Reels Script Generator",
      "es": "Generador de Guiones para YouTube y Shorts",
    },
    description: {
      "pt-BR": "Roteiros completos de vídeos com introdução impactante, cenas e narração.",
      "en": "Complete video scripts with hooks, visual scenes, and narration.",
      "es": "Guiones de vídeo completos con ganchos, escenas y narración.",
    },
    category: "Ads",
    iconName: "Video",
    popular: true,
    inputs: [
      { id: "videoTitle", label: { "pt-BR": "Tema do Vídeo", "en": "Video Topic", "es": "Tema del Vídeo" }, type: "text" },
      { id: "duration", label: { "pt-BR": "Formato", "en": "Format", "es": "Formato" }, type: "select", options: [
        { value: "shorts", label: { "pt-BR": "Shorts / Reels (60 seg)", "en": "Shorts / Reels (60s)", "es": "Shorts / Reels (60s)" } },
        { value: "youtube_long", label: { "pt-BR": "Vídeo Longo YouTube (5-10 min)", "en": "Long YouTube Video (5-10m)", "es": "Vídeo Largo YouTube (5-10 min)" } }
      ] },
    ],
  },
  {
    id: "instagram-hashtags-captions",
    name: {
      "pt-BR": "Gerador de Legendas & Hashtags para Instagram",
      "en": "Instagram Captions & Hashtags Crafter",
      "es": "Generador de Leyendas y Hashtags para Instagram",
    },
    description: {
      "pt-BR": "Legendas engajadoras com emojis e hashtags categorizadas por alcance.",
      "en": "Engaging Instagram captions with emojis and categorized hashtags.",
      "es": "Leyendas atractivas con emojis y hashtags categorizados.",
    },
    category: "Ads",
    iconName: "Instagram",
    inputs: [
      { id: "postConcept", label: { "pt-BR": "Conceito do Post / Foto", "en": "Post Concept / Image", "es": "Concepto de la Publicación" }, type: "text" },
    ],
  },

  // 💼 NEGÓCIOS & ESTRATÉGIA (41-60)
  {
    id: "business-plan-generator",
    name: {
      "pt-BR": "Gerador de Plano de Negócios Completo",
      "en": "Complete Business Plan Generator",
      "es": "Generador de Plan de Negocios Completo",
    },
    description: {
      "pt-BR": "Crie um plano executivo com análise de mercado, modelo de receita e estratégia de crescimento.",
      "en": "Generate executive summary, market research, revenue model, and growth strategy.",
      "es": "Crea un plan ejecutivo con análisis de mercado y modelo de ingresos.",
    },
    category: "Business",
    iconName: "Briefcase",
    popular: true,
    inputs: [
      { id: "businessName", label: { "pt-BR": "Nome ou Tipo do Negócio", "en": "Business Name or Niche", "es": "Nombre o Nicho del Negocio" }, type: "text" },
      { id: "monetization", label: { "pt-BR": "Modelo de Monetização", "en": "Monetization Model", "es": "Modelo de Monetización" }, type: "text", placeholder: { "pt-BR": "Ex: Assinatura SaaS, E-commerce, Serviços", "en": "Ex: SaaS Subscription, E-commerce", "es": "Ej: Suscripción SaaS, E-commerce" } },
    ],
  },
  {
    id: "proposal-contract-generator",
    name: {
      "pt-BR": "Gerador de Propostas Comerciais & Contratos",
      "en": "Commercial Proposal & Contract Generator",
      "es": "Generador de Propuestas Comerciales y Contratos",
    },
    description: {
      "pt-BR": "Elabore propostas de prestação de serviço irrecusáveis com prazos e valores.",
      "en": "Build high-converting service proposals and agreements.",
      "es": "Elabora propuestas de prestación de servicios y acuerdos.",
    },
    category: "Business",
    iconName: "FileCheck",
    inputs: [
      { id: "clientName", label: { "pt-BR": "Nome do Cliente", "en": "Client Name", "es": "Nombre del Cliente" }, type: "text" },
      { id: "deliverables", label: { "pt-BR": "Escopo de Entregas", "en": "Deliverables Scope", "es": "Alcance de Entregas" }, type: "textarea" },
      { id: "investment", label: { "pt-BR": "Valor do Investimento", "en": "Investment Price", "es": "Valor de la Inversión" }, type: "text" },
    ],
  },
  {
    id: "swot-analysis-ai",
    name: {
      "pt-BR": "Gerador de Análise SWOT (FOFA)",
      "en": "SWOT Analysis AI Generator",
      "es": "Generador de Análisis DAFO (SWOT)",
    },
    description: {
      "pt-BR": "Identifique Forças, Oportunidades, Fraquezas e Ameaças do seu empreendimento.",
      "en": "Identify Strengths, Weaknesses, Opportunities, and Threats.",
      "es": "Identifica Fortalezas, Oportunidades, Debilidades y Amenazas.",
    },
    category: "Business",
    iconName: "PieChart",
    inputs: [
      { id: "companyOverview", label: { "pt-BR": "Descrição da Empresa", "en": "Company Overview", "es": "Descripción de la Empresa" }, type: "textarea" },
    ],
  },
  {
    id: "business-name-slogan",
    name: {
      "pt-BR": "Gerador de Nomes de Empresas e Slogans",
      "en": "Business Name & Slogan Generator",
      "es": "Generador de Nombres de Empresas y Slogans",
    },
    description: {
      "pt-BR": "Sugestões de marcas marcantes e slogans memoráveis.",
      "en": "Catchy business name ideas and memorable slogans.",
      "es": "Sugerencias de marcas llamativas y slogans memorables.",
    },
    category: "Business",
    iconName: "Sparkles",
    inputs: [
      { id: "niche", label: { "pt-BR": "Nicho de Atuação", "en": "Industry / Niche", "es": "Nicho de Mercado" }, type: "text" },
    ],
  },

  // 🛠️ UTILITÁRIOS & PROMPTS (61-80)
  {
    id: "ai-prompt-engineer",
    name: {
      "pt-BR": "Gerador de Prompts Profissionais de IA",
      "en": "Master AI Prompt Engineer",
      "es": "Ingeniero de Prompts de IA Profesional",
    },
    description: {
      "pt-BR": "Transforme ideias simples em super prompts perfeitos para ChatGPT, Midjourney e Gemini.",
      "en": "Turn simple ideas into super prompts for Midjourney, ChatGPT, and Gemini.",
      "es": "Transforma ideas simples en súper prompts para Midjourney y ChatGPT.",
    },
    category: "Utilities",
    iconName: "Code",
    popular: true,
    inputs: [
      { id: "rawIdea", label: { "pt-BR": "Sua Ideia Inicial", "en": "Your Initial Idea", "es": "Tu Idea Inicial" }, type: "textarea" },
      { id: "targetTool", label: { "pt-BR": "Destino do Prompt", "en": "Target AI Tool", "es": "Herramienta Destino" }, type: "select", options: [
        { value: "midjourney", label: { "pt-BR": "Midjourney / DALL-E (Imagem)", "en": "Midjourney / DALL-E (Image)", "es": "Midjourney / DALL-E" } },
        { value: "chatgpt", label: { "pt-BR": "ChatGPT / Claude / Gemini (Texto)", "en": "ChatGPT / Claude / Gemini (Text)", "es": "ChatGPT / Claude / Gemini" } },
      ] },
    ],
  },
  {
    id: "ai-translator-pro",
    name: {
      "pt-BR": "Tradutor Poliglota Profissional com Contexto",
      "en": "Contextual AI Business Translator",
      "es": "Traductor Comercial con Contexto de IA",
    },
    description: {
      "pt-BR": "Traduções corporativas e de marketing que preservam o tom comercial e cultural.",
      "en": "Business translations preserving nuance, tone, and idiom.",
      "es": "Traducciones corporativas que preservan el tono comercial.",
    },
    category: "Utilities",
    iconName: "Globe",
    inputs: [
      { id: "sourceText", label: { "pt-BR": "Texto Original", "en": "Original Text", "es": "Texto Original" }, type: "textarea" },
      { id: "targetLanguage", label: { "pt-BR": "Idioma Destino", "en": "Target Language", "es": "Idioma Destino" }, type: "select", options: [
        { value: "English", label: { "pt-BR": "Inglês (EUA/UK)", "en": "English (US/UK)", "es": "Inglés (EEUU/UK)" } },
        { value: "Portuguese", label: { "pt-BR": "Português (Brasil)", "en": "Portuguese (Brazil)", "es": "Portugués (Brasil)" } },
        { value: "Spanish", label: { "pt-BR": "Espanhol (LatAm/Espanha)", "en": "Spanish (LatAm/Spain)", "es": "Español" } },
        { value: "German", label: { "pt-BR": "Alemão", "en": "German", "es": "Alemán" } },
        { value: "French", label: { "pt-BR": "Francês", "en": "French", "es": "Francés" } },
      ] },
    ],
  },
  {
    id: "roi-pricing-calculator",
    name: {
      "pt-BR": "Calculadora de Preço de Venda & Margem de Lucro",
      "en": "ROI & Product Pricing Calculator AI",
      "es": "Calculadora de Precios y Margen de Beneficio",
    },
    description: {
      "pt-BR": "Descubra o preço de venda ideal considerando custos, impostos e margem de lucro.",
      "en": "Calculate target retail price based on COGS, taxes, and desired profit.",
      "es": "Calcula el precio de venta ideal según costes y margen de beneficio.",
    },
    category: "Utilities",
    iconName: "Calculator",
    inputs: [
      { id: "cost", label: { "pt-BR": "Custo Unitário do Produto/Serviço", "en": "Unit Product/Service Cost", "es": "Costo Unitario del Producto" }, type: "number" },
      { id: "desiredMargin", label: { "pt-BR": "Margem de Lucro Desejada (%)", "en": "Desired Profit Margin (%)", "es": "Margen de Beneficio Deseado (%)" }, type: "number" },
    ],
  },

  // 🤖 MENTORES & ASSISTENTES (81-100+)
  {
    id: "ai-cmo-marketing-advisor",
    name: {
      "pt-BR": "Diretor de Marketing IA (CMO Virtual)",
      "en": "Virtual Chief Marketing Officer (CMO AI)",
      "es": "Director de Marketing de IA (CMO Virtual)",
    },
    description: {
      "pt-BR": "Consultoria estratégica para lançamentos, crescimento, aquisição e retenção de clientes.",
      "en": "Strategic advisory for growth, funnel optimization, and customer acquisition.",
      "es": "Consultoría estratégica para lanzamientos y adquisición de clientes.",
    },
    category: "Assistants",
    iconName: "TrendingUp",
    popular: true,
    inputs: [
      { id: "question", label: { "pt-BR": "Sua Dúvida ou Desafio de Marketing", "en": "Marketing Question or Challenge", "es": "Tu Pregunta o Desafío de Marketing" }, type: "textarea" },
    ],
    systemPrompt: "You are a world-famous Chief Marketing Officer (CMO). Provide high-level growth strategy, CAC/LTV benchmarks, funnel architecture, and concrete campaign steps.",
  },
  {
    id: "ai-legal-contract-advisor",
    name: {
      "pt-BR": "Assistente de Análise Legal e Cláusulas",
      "en": "Legal Contract & Risk Advisor AI",
      "es": "Asistente de Análisis Legal y Cláusulas",
    },
    description: {
      "pt-BR": "Análise preventiva de contratos, termos de uso e cláusulas de confidencialidade (NDA).",
      "en": "Review contract clauses, NDAs, and term risk identification.",
      "es": "Análisis preventivo de contratos, términos de uso y cláusulas NDA.",
    },
    category: "Assistants",
    iconName: "ShieldCheck",
    inputs: [
      { id: "contractText", label: { "pt-BR": "Texto ou Cláusula do Contrato", "en": "Contract Clause or Text", "es": "Texto o Cláusula del Contrato" }, type: "textarea" },
    ],
  },
];
