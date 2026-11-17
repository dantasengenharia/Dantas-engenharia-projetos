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
  const lead = { nome:"", cidade:"", servico:"", detalhes:"", horario:"" };
  let awaiting = "";

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
  function startLead() {
    Object.keys(lead).forEach(k => lead[k] = "");
    ask("nome","Será um prazer ajudar. Qual é o seu nome?");
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
    return `Olá! Gostaria de atendimento da Dantas Engenharia e Projetos.\n\nNome: ${lead.nome}\nCidade: ${lead.cidade}\nServiço/projeto: ${lead.servico}\nDetalhes: ${lead.detalhes || "Não informado"}\nMelhor horário: ${lead.horario || "Não informado"}`;
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
    if (!v || !awaiting) return;
    message(v,"user");
    lead[awaiting] = v;
    const current = awaiting;
    if (current === "nome") ask("cidade","Obrigado, "+v+"! Em qual cidade você precisa do atendimento?");
    else if (current === "cidade") ask("servico","Qual serviço ou projeto você deseja realizar?");
    else if (current === "servico") ask("detalhes","Conte mais alguns detalhes (medidas, finalidade ou situação atual). Se preferir, escreva 'não sei informar'.");
    else if (current === "detalhes") ask("horario","Qual o melhor horário para nossa equipe entrar em contato? (Opcional: pode escrever 'qualquer horário'.)");
    else { awaiting = ""; finish(); }
  }

  launch.addEventListener("click",()=>{panel.style.display="flex"; if(!chat.childElementCount) home();});
  panel.querySelector("#ana-close").addEventListener("click",()=>panel.style.display="none");
  form.addEventListener("submit",e=>{e.preventDefault();submit(input.value);input.value="";});
})();
