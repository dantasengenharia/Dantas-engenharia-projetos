/* ANA - Assistente Comercial da Dantas Engenharia e Projetos
   Versao gratuita, sem API, sem servidor e sem coleta automatica de dados.
   Instalar em: assets/ana-widget.js
*/
(() => {
  if (window.__ANA_DANTAS_LOADED__) return;
  window.__ANA_DANTAS_LOADED__ = true;

  const WHATSAPP = [
    { label: "WhatsApp principal", number: "5515991442825" },
    { label: "WhatsApp alternativo", number: "5515997730175" }
  ];

  const style = document.createElement("style");
  style.textContent = `
    #ana-launch{position:fixed;right:22px;bottom:120px;z-index:99999;border:0;border-radius:999px;
      padding:14px 20px;background:#d6ad55;color:#101010;font:700 15px Arial;cursor:pointer;
      box-shadow:0 5px 22px #0005}
    #ana-panel{position:fixed;right:22px;bottom:150px;z-index:99999;width:min(360px,calc(100vw - 28px));
      height:min(540px,calc(100vh - 115px));display:none;flex-direction:column;overflow:hidden;
      border:1px solid #b99142;border-radius:16px;background:#111;color:#f5f1e8;
      box-shadow:0 10px 35px #0008;font:14px Arial,sans-serif}
    #ana-head{padding:15px;background:#1b1b1b;border-bottom:1px solid #b99142;display:flex;
      justify-content:space-between;align-items:center}
    #ana-head strong{color:#e0bb69;font-size:17px}
    #ana-close{border:0;background:transparent;color:#fff;font-size:22px;cursor:pointer}
    #ana-chat{padding:14px;overflow:auto;flex:1}
    .ana-msg{padding:11px 12px;margin:0 0 10px;border-radius:12px;line-height:1.45;white-space:pre-wrap}
    .ana-bot{background:#242424;border:1px solid #383838}
    .ana-user{background:#5b4722;color:#fff;margin-left:28px}
    #ana-options{padding:10px 12px 14px;border-top:1px solid #333;display:grid;gap:8px}
    .ana-option{border:1px solid #b99142;border-radius:9px;padding:10px;background:#191919;
      color:#f4d58f;text-align:left;cursor:pointer;font-weight:600}
    .ana-option:hover{background:#302615}
    #ana-entry{display:flex;gap:7px;padding:0 12px 12px}
    #ana-input{min-width:0;flex:1;border:1px solid #666;border-radius:8px;padding:10px;background:#222;color:#fff}
    #ana-send{border:0;border-radius:8px;padding:0 14px;background:#d6ad55;color:#111;font-weight:700}
  @media (min-width: 768px) {
      #ana-panel {
        width: min(650px, calc(100vw - 60px));
        height: min(750px, calc(100vh - 80px));
        right: 30px;
        bottom: 30px;
      }
      #ana-input {
        min-height: 48px;
        font-size: 16px;
      }
      #ana-send {
        min-height: 48px;
      }
    }
  `;
  document.head.appendChild(style);

  const launch = document.createElement("button");
  launch.id = "ana-launch";
  launch.type = "button";
  launch.textContent = "Fale com a ANA";
  const panel = document.createElement("section");
  panel.id = "ana-panel";
  panel.innerHTML = `
    <div id="ana-head"><strong>ANA | Dantas Engenharia</strong>
      <button id="ana-close" type="button" aria-label="Fechar">×</button></div>
    <div id="ana-chat" aria-live="polite"></div>
    <div id="ana-options"></div>
    <form id="ana-entry"><input id="ana-input" autocomplete="off" placeholder="Digite sua resposta..." />
      <button id="ana-send" type="submit">Enviar</button></form>`;
  document.body.append(launch, panel);

  const chat = panel.querySelector("#ana-chat");
  const options = panel.querySelector("#ana-options");
  const form = panel.querySelector("#ana-entry");
  const input = panel.querySelector("#ana-input");
  const lead = {
  nome: "",
  cidade: "",
  servico: "",
  detalhes: "",
  horario: "",
  terreno: "",
  metragem: "",
  tipoReforma: ""
};
  let awaiting = "";
let lastQuestion = "";
  function message(text, who="bot") {
    const el = document.createElement("div");
    el.className = "ana-msg " + (who === "user" ? "ana-user" : "ana-bot");
    el.textContent = text;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
  }
  function buttons(items) {
    options.replaceChildren();
    items.forEach(item => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "ana-option"; b.textContent = item.label;
      b.addEventListener("click", item.action);
      options.appendChild(b);
    });
  }
  function ask(field, prompt) {
    awaiting = field;
    lastQuestion = field;
     message(prompt);
    options.replaceChildren();
    input.value = "";
    input.placeholder = "Digite aqui...";
    input.focus();
  }
  function home() {
    awaiting = "";
    input.placeholder = "Digite sua resposta...";
    message("Olá! Sou a ANA, assistente comercial da Dantas Engenharia e Projetos. Como posso ajudar?");
    buttons([
     {label:"Solicitar orçamento", action:()=>startLead()},
  {label:"Ver nossos serviços", action:()=>services()},
  {label:"Falar com a equipe", action:()=>whatsapp("Olá! Gostaria de falar com a equipe da Dantas Engenharia e Projetos.")}
]);
  }
 function startLead(servicoInicial = "") {
  Object.keys(lead).forEach(k => lead[k] = "");
  lead.servico = servicoInicial;

  if (servicoInicial) {
    ask("nome", "Vamos começar seu atendimento sobre " + servicoInicial + ". Qual é o seu nome?");
  } else {
    ask("nome", "Será um prazer ajudar. Qual é o seu nome?");
  }
}
  function services() {
    message("Podemos orientar seu primeiro contato sobre projetos e serviços de engenharia. Para confirmar se atendemos sua necessidade, conte um pouco sobre o que você procura.");
    buttons([
      {label:"Quero explicar meu projeto", action:()=>startLead()},
      {label:"Falar com a equipe", action:()=>whatsapp("Olá! Gostaria de informações sobre os serviços da Dantas Engenharia e Projetos.")},
      {label:"Voltar ao início", action:home}
    ]);
  }
 function makeText() {
  return `Olá! Gostaria de atendimento da Dantas Engenharia e Projetos.

Nome: ${lead.nome}
Cidade: ${lead.cidade}
Serviço/projeto: ${lead.servico}
Possui terreno: ${lead.terreno || "Não informado"}
Tipo de reforma: ${lead.tipoReforma || "Não informado"}
Metragem: ${lead.metragem || "Não informado"}
Detalhes: ${lead.detalhes || "Não informado"}
Melhor horário: ${lead.horario || "Não informado"}`;
}
  function whatsapp(text) {
    message("Escolha por qual WhatsApp deseja continuar. A mensagem só será enviada quando você confirmar no WhatsApp.");
    buttons(WHATSAPP.map(w => ({
      label:w.label,
      action:()=>window.open("https://wa.me/"+w.number+"?text="+encodeURIComponent(text),"_blank","noopener")
    })).concat([{label:"Voltar ao início",action:home}]));
  }
  function finish() {
    const text = makeText();
    message("Obrigado pelas informações! Você pode continuar pelo WhatsApp e enviar seu pedido à nossa equipe.");
    buttons(WHATSAPP.map(w => ({
      label:w.label,
      action:()=>window.open("https://wa.me/"+w.number+"?text="+encodeURIComponent(text),"_blank","noopener")
    })).concat([{label:"Recomeçar",action:home}]));
  }
 function submit(value) {
  const v = value.trim();
  if (!v) return;

  message(v, "user");

  if (!awaiting) {
    const q = v.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    options.replaceChildren();

let answer = "";

    if (/^(oi|ola|opa|e ai)[!,. ]*$/.test(q)) {
      answer = "Olá! Seja muito bem-vindo(a) à Dantas Engenharia e Projetos! 😊 Como posso ajudar você hoje?";
    }
    else if (q.includes("bom dia")) {
      answer = "Bom dia! Que bom receber você! 😊 Como posso ajudar?";
    }
    else if (q.includes("boa tarde")) {
      answer = "Boa tarde! É um prazer receber você! Como posso ajudar?";
    }
    else if (q.includes("boa noite")) {
      answer = "Boa noite! Seja muito bem-vindo(a)! Como posso ajudar?";
    }
    else if (q.includes("tudo bem") || q.includes("tudo bom")) {
      answer = "Tudo ótimo por aqui! E você? 😊";
    }
    else if (q.includes("horario") || q.includes("funcionamento") || q.includes("abre") || q.includes("fecha")) {
      answer = "Nosso horário de atendimento é das 08:00 às 12:00 e das 13:00 às 18:00.";
    }
    
    else if (q.includes("servico") || q.includes("trabalha") || q.includes("oferece")) {
      answer = "A Dantas Engenharia e Projetos atua na área de engenharia e projetos. Conte qual serviço você procura para que eu possa orientar você corretamente.";
    }
    else if (q.includes("sugest") || q.includes("projeto") || q.includes("construir") || q.includes("obra")) {
      answer = "Será um prazer ajudar! Você pretende realizar um projeto residencial, comercial, rural ou outro tipo de obra? Conte um pouco sobre sua ideia.";
    }
    else if (q.includes("orcamento") || q.includes("preco") || q.includes("valor")) {
      message("Posso iniciar seu atendimento para orçamento!");
      startLead();
      return;
    }
    else if (q.includes("equipe") || q.includes("atendente") || q.includes("humano")) {
      answer = "Claro! Você pode falar diretamente com nossa equipe pelos nossos canais de WhatsApp.";
      buttons(WHATSAPP.map(w => ({
        label: w.label,
        action: () => window.open("https://wa.me/" + w.number, "_blank", "noopener")
      })));
    }
    else {
      answer = "Entendi! Pode me contar um pouco mais sobre o que você precisa? Vou ajudar você a encontrar o melhor caminho para seu projeto.";
    }

    if (answer) message(answer);
    return;
  }

 lead[awaiting] = v;
  const current = awaiting;

  if (current === "nome") {
    ask("cidade", "Obrigado, " + v + "! Em qual cidade você precisa do atendimento?");
  }
  else if (current === "cidade") {
    const servico = (lead.servico || "").toLowerCase();

    if (servico.includes("construção")) {
      ask("terreno", "Você já possui um terreno para construir? Responda sim, não ou ainda estou procurando.");
    }
    else if (servico.includes("reforma")) {
      ask("tipoReforma", "Qual tipo de reforma pretende realizar? Conte quais ambientes ou partes do imóvel deseja reformar.");
    }
    else if (servico.includes("ampliação")) {
      ask("metragem", "Qual é a área atual do imóvel e quanto pretende ampliar? Se não souber, pode informar uma estimativa.");
    }
    else {
      ask("servico", "Qual serviço ou projeto residencial você deseja realizar?");
    }
  }
  else if (current === "servico") {
    ask("detalhes", "Conte mais detalhes sobre sua ideia, medidas ou finalidade do projeto.");
  }
 else if (current === "terreno") {
  const resposta = v.toLowerCase();

  if (resposta.includes("sim")) {
    ask("metragem", "Excelente! Qual é a metragem aproximada do terreno?");
  }
  else if (resposta.includes("não") || resposta.includes("nao")) {
    ask("detalhes", "Sem problemas! Você já tem uma região ou cidade em mente para construir?");
  }
  else if (resposta.includes("procurando")) {
    ask("detalhes", "Entendi! Podemos ajudar você a planejar sua construção. Em qual cidade pretende construir?");
  }
  else {
    ask("terreno", "Por favor, responda se já possui terreno, não possui ou ainda está procurando.");
  }
}
  else if (current === "tipoReforma" || current === "metragem") {
    ask("detalhes", "Há mais alguma informação importante sobre o imóvel ou o projeto?");
  }
  else if (current === "detalhes") {
    ask("horario", "Qual o melhor horário para nossa equipe entrar em contato? Pode escrever 'qualquer horário'.");
  }
  else {
    awaiting = "";
    finish();
  }

}

window.iniciarAnaResidencial = (servico) => {
  panel.style.display = "flex";
  if (!chat.childElementCount) {
    home();
  }
  startLead(servico);
};
   launch.addEventListener("click",()=>{panel.style.display="flex"; if(!chat.childElementCount) home();});
  panel.querySelector("#ana-close").addEventListener("click",()=>panel.style.display="none");
  form.addEventListener("submit",e=>{e.preventDefault();submit(input.value);input.value="";});
})();

