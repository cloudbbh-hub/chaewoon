document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "cardnews-editor-v3";
  const accents = ["#6c63ff", "#ff4d77", "#ff8a3d", "#f5cf38", "#2ecf93", "#21a7ff", "#7cdd4b", "#d95cff"];
  const backgrounds = ["assets/images/report/gwangalli-landscape.jpg", "assets/images/report/space307-home-02.jpg", "assets/images/report/kkangkangee-02.jpg", "assets/images/report/gwangalli-02.jpg"];
  const labels = { badge: "라벨", title: "제목", sub: "부제", tag: "카테고리", num: "큰 번호", head: "헤드라인", desc: "설명", quote: "인용문", by: "출처", rows: "비교 항목", cta1: "CTA 1", cta2: "CTA 2", hint: "안내 문구" };
  const defaults = {
    title: "AI 시대, 일하는 방식의 변화", handle: "@ply.studio", preset: "cine", accent: "#6c63ff", active: 0,
    slides: [
      { type: "cover", bg: backgrounds[0], scrim: 84, f: { badge: "WORK TREND 2026", title: "AI가 바꾸는\n*일의 방식*", sub: "더 적게 반복하고, 더 깊게 생각하는 팀의 새로운 업무법" } },
      { type: "content", bg: backgrounds[1], scrim: 88, f: { tag: "새로운 기준", num: "01", head: "도구보다 먼저\n*질문*을 설계하세요", desc: "좋은 결과는 긴 프롬프트가 아니라 선명한 목적에서 시작됩니다. 무엇을 바꾸고 싶은지 한 문장으로 정의하세요." } },
      { type: "content", bg: backgrounds[2], scrim: 90, f: { tag: "워크플로우", num: "02", head: "반복 업무는 맡기고\n*판단*에 집중하기", desc: "자료 정리와 초안은 AI에 맡기고, 사람은 맥락과 우선순위, 최종 결정에 시간을 씁니다." } },
      { type: "table", bg: backgrounds[3], scrim: 92, f: { title: "일하는 방식은\n이렇게 달라집니다", rows: "초안 작성 | 처음부터 쓰기 | AI와 빠르게 시작\n자료 정리 | 수동 분류 | 기준에 따라 자동 구조화\n검토 방식 | 마지막에 확인 | 과정마다 함께 점검" } },
      { type: "quote", bg: backgrounds[1], scrim: 82, f: { quote: "AI는 사람을 대신하는 도구가 아니라, *생각의 속도*를 높이는 동료입니다.", by: "PLY WORK LAB · 2026" } },
      { type: "closing", bg: backgrounds[0], scrim: 88, f: { badge: "LET'S GROW TOGETHER", head: "더 빠르게 만들고\n더 깊게 *연결하세요*", desc: "매주 새로운 AI 실무 인사이트를 카드뉴스로 전합니다.", cta1: "AI 커뮤니티 참여", cta2: "댓글 AIMAX", hint: "저장해두고 팀과 함께 나눠보세요" } }
    ]
  };
  let state;
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(defaults); } catch { state = structuredClone(defaults); }
  if (!Array.isArray(state.slides) || !state.slides.length) state = structuredClone(defaults);
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const esc = (value = "") => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  const markup = (value = "") => esc(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, '<span class="accent">$1</span>').replace(/\n/g, "<br>");
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(",");
  const save = () => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); $("#save-state").textContent = "저장됨"; };
  const toast = message => { const node = $("#toast"); node.textContent = message; node.classList.add("is-visible"); clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove("is-visible"), 2200); };
  const topLine = index => `<div class="card-top"><span class="card-brand"><i></i>${esc(state.handle)}</span><span class="card-count">${String(index + 1).padStart(2, "0")} / ${String(state.slides.length).padStart(2, "0")}</span></div>`;

  function cardHTML(slide, index) {
    const f = slide.f || {}; let body = "";
    if (slide.type === "cover") body = `<span class="card-badge">${markup(f.badge)}</span><h2>${markup(f.title)}</h2><p>${markup(f.sub)}</p>`;
    if (slide.type === "content") body = `<span class="card-badge">${markup(f.tag)}</span>${f.num ? `<div class="big-number">${markup(f.num)}</div>` : ""}<h2>${markup(f.head)}</h2><p>${markup(f.desc)}</p>`;
    if (slide.type === "quote") body = `<h2>${markup(f.quote)}</h2><div class="by">— ${markup(f.by)}</div>`;
    if (slide.type === "table") { const rows = String(f.rows || "").split("\n").map(row => row.split("|").map(v => v.trim())); body = `<h2>${markup(f.title)}</h2><table class="compare-table"><thead><tr><th>항목</th><th>기존</th><th>AI와 함께</th></tr></thead><tbody>${rows.map(row => `<tr>${[0,1,2].map(i => `<td>${markup(row[i] || "")}</td>`).join("")}</tr>`).join("")}</tbody></table>`; }
    if (slide.type === "closing") body = `<span class="card-badge">${markup(f.badge)}</span><h2>${markup(f.head)}</h2><p>${markup(f.desc)}</p><div class="cta-row"><b>${markup(f.cta1)}</b><strong>${markup(f.cta2)}</strong></div><small class="closing-hint">${markup(f.hint)}</small>`;
    return `${topLine(index)}${body}`;
  }
  function applyCard(node, slide, index) { const image = String(slide.bg || ""); const safeImage = image.startsWith("assets/") ? `/${image}` : image; node.className = `card ${slide.type}-card preset-${state.preset}`; node.style.setProperty("--bg", safeImage ? `url("${safeImage.replace(/"/g, "%22")}")` : "none"); node.style.setProperty("--scrim", (slide.scrim ?? 82) / 100); node.innerHTML = cardHTML(slide, index); }
  function renderFilmstrip() {
    $("#slide-list").innerHTML = state.slides.map((slide, index) => { const title = slide.f.title || slide.f.head || slide.f.quote || "새 카드"; return `<button class="slide-item ${index === state.active ? "is-active" : ""}" data-slide="${index}" type="button"><span class="slide-no">${String(index + 1).padStart(2,"0")}</span><span class="slide-thumb" style="background-image:url('${esc(slide.bg || "")}');background-size:cover"><b>${markup(title)}</b></span><span class="slide-info"><strong>${esc(title.replace(/\n/g," "))}</strong><small>${esc(slide.type)}</small></span></button>`; }).join("");
    $$("[data-slide]").forEach(button => button.addEventListener("click", () => { state.active = Number(button.dataset.slide); render(); }));
  }
  function renderFields() {
    const slide = state.slides[state.active]; $("#card-type-label").textContent = slide.type.toUpperCase();
    $("#field-editor").innerHTML = Object.entries(slide.f).map(([key, value]) => { const multiline = ["title","sub","head","desc","quote","rows","hint"].includes(key); return `<div class="field-group"><label for="field-${key}">${labels[key] || key}</label>${multiline ? `<textarea id="field-${key}" data-field="${key}" rows="${key === "rows" ? 5 : 2}">${esc(value)}</textarea>` : `<input id="field-${key}" data-field="${key}" value="${esc(value)}">`}</div>`; }).join("");
    $$('[data-field]').forEach(input => input.addEventListener("input", () => { slide.f[input.dataset.field] = input.value; markChanged(); applyCard($("#card-preview"), slide, state.active); renderFilmstrip(); }));
  }
  function renderSwatches() { $("#swatches").innerHTML = accents.map(color => `<button class="swatch ${color === state.accent ? "is-active" : ""}" type="button" data-color="${color}" style="background:${color}" aria-label="${color}"></button>`).join(""); $$("[data-color]").forEach(button => button.onclick = () => { state.accent = button.dataset.color; render(); }); }
  function render() {
    state.active = Math.max(0, Math.min(state.active, state.slides.length - 1)); document.documentElement.style.setProperty("--accent", state.accent); document.documentElement.style.setProperty("--accent-rgb", rgb(state.accent)); $("#deck-title").value = state.title; $("#handle").value = state.handle; $("#preset").value = state.preset; $("#slide-count").textContent = String(state.slides.length).padStart(2, "0"); $("#stage-index").textContent = `${String(state.active + 1).padStart(2,"0")} / ${String(state.slides.length).padStart(2,"0")}`; $("#scrim").value = state.slides[state.active].scrim ?? 82; $("#scrim-value").value = `${state.slides[state.active].scrim ?? 82}%`; renderFilmstrip(); renderFields(); applyCard($("#card-preview"), state.slides[state.active], state.active); renderSwatches(); save();
  }
  function markChanged() { $("#save-state").textContent = "저장 중…"; clearTimeout(markChanged.timer); markChanged.timer = setTimeout(save, 250); }
  function addSlide() { state.slides.splice(state.active + 1, 0, { type:"content", bg:backgrounds[(state.active + 1) % backgrounds.length], scrim:88, f:{ tag:"NEW POINT", num:String(state.active + 1).padStart(2,"0"), head:"새로운 *핵심 메시지*", desc:"이곳에 카드의 구체적인 설명을 입력하세요." }}); state.active += 1; render(); toast("새 카드를 추가했어요."); }
  function removeSlide() { if (state.slides.length === 1) return toast("카드는 최소 1장 필요해요."); state.slides.splice(state.active, 1); state.active = Math.max(0, state.active - 1); render(); toast("카드를 삭제했어요."); }
  function quickConvert(text) {
    const lines = text.split(/\n+/).map(v => v.replace(/^#+\s*|^\d+[.)]\s*/, "").trim()).filter(Boolean); if (!lines.length) return null; const title = lines.shift(); const chunks = lines.length ? lines : ["핵심 내용을 한 문장으로 정리했습니다.", "반복되는 업무를 줄이고 중요한 판단에 집중하세요.", "작은 변화부터 실행하면 새로운 흐름을 만들 수 있습니다."];
    const slides = [{type:"cover",bg:backgrounds[0],scrim:84,f:{badge:"AI SUMMARY",title:`${title.slice(0,34)}\n*한눈에 보기*`,sub:"긴 글에서 꼭 필요한 메시지만 골라 카드로 정리했어요."}}];
    chunks.slice(0,5).forEach((line,i) => slides.push({type:"content",bg:backgrounds[(i+1)%backgrounds.length],scrim:88,f:{tag:i?"KEY POINT":"시작하기",num:i?String(i).padStart(2,"0"):"",head:`${line.slice(0,25)}${line.length>25?"…":""}`,desc:line.slice(0,100)}}));
    slides.push({type:"closing",bg:backgrounds[0],scrim:88,f:{badge:"LET'S GROW TOGETHER",head:"좋은 인사이트를\n*함께 나눠요*",desc:"매주 새로운 AI 실무 인사이트를 카드뉴스로 전합니다.",cta1:"AI 커뮤니티 참여",cta2:"댓글 AIMAX",hint:"저장해두고 팀과 함께 나눠보세요"}}); return { ...state, title:title.slice(0,38), active:0, slides };
  }
  async function convertText() {
    const text = $("#source-text").value.trim(); if (!text) return toast("먼저 글을 붙여넣어 주세요."); const button = $("#convert-text"); button.disabled = true; button.innerHTML = "<span>✦</span> 내용을 구성하고 있어요…"; const server = $("#server-url").value.trim();
    try { if (server) { const response = await fetch(`${server.replace(/\/$/,"")}/convert`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text})}); if (!response.ok) throw new Error(); const deck = await response.json(); if (!deck.slides) throw new Error(); state = {...state,...deck,active:0}; } else { await new Promise(resolve => setTimeout(resolve, 700)); state = quickConvert(text); } render(); toast(`${state.slides.length}장의 카드로 구성했어요.`); }
    catch { state = quickConvert(text); render(); toast("빠른 변환으로 덱을 만들었어요."); }
    finally { button.disabled = false; button.innerHTML = '<span>✦</span> AI로 덱 구성하기 <kbd>⌘ ↵</kbd>'; }
  }
  function download(blob, name) { const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); }
  async function renderForExport(slide, index) { if (!window.html2canvas) throw new Error("내보내기 도구를 불러오지 못했어요."); await document.fonts.ready; const wrap = document.createElement("div"); wrap.style.cssText = "position:fixed;left:-12000px;top:0;width:1080px;height:1350px;z-index:-1"; const card = document.createElement("article"); wrap.appendChild(card); document.body.appendChild(wrap); applyCard(card,slide,index); card.style.width="1080px";card.style.height="1350px";card.style.fontSize="28px"; const canvas = await html2canvas(card,{width:1080,height:1350,useCORS:true,scale:1,backgroundColor:null}); wrap.remove(); return new Promise(resolve => canvas.toBlob(resolve,"image/png")); }
  async function exportCurrent() { try { toast("고해상도 PNG를 만들고 있어요…"); const blob=await renderForExport(state.slides[state.active],state.active); download(blob,`${String(state.active+1).padStart(2,"0")}.png`); toast("PNG를 저장했어요."); } catch(e){ toast(e.message); } }
  async function exportAll() { if(!window.JSZip) return toast("ZIP 도구를 불러오지 못했어요."); try{ const zip=new JSZip(); for(let i=0;i<state.slides.length;i++){toast(`${i+1}/${state.slides.length} 카드를 만들고 있어요…`);zip.file(`${String(i+1).padStart(2,"0")}.png`,await renderForExport(state.slides[i],i));}download(await zip.generateAsync({type:"blob"}),`${state.title || "cardnews"}.zip`);toast("전체 카드 ZIP을 저장했어요.");}catch{toast("내보내기 중 문제가 생겼어요.");} }
  function showPreview(){const grid=$("#preview-grid");grid.innerHTML="";state.slides.forEach((slide,index)=>{const card=document.createElement("article");applyCard(card,slide,index);grid.appendChild(card)});$("#preview-modal").hidden=false;document.body.style.overflow="hidden"}

  $$("[data-tab]").forEach(tab => tab.onclick = () => { $$("[data-tab]").forEach(v=>v.classList.toggle("is-active",v===tab)); $$("[data-panel]").forEach(v=>v.classList.toggle("is-active",v.dataset.panel===tab.dataset.tab)); });
  $("#add-slide").onclick = $("#new-slide").onclick = addSlide; $("#delete-slide").onclick=removeSlide; $("#preset").onchange=e=>{state.preset=e.target.value;location.hash=state.preset;render();toast("덱 스타일을 바꿨어요.")};
  $("#deck-title").oninput=e=>{state.title=e.target.value;markChanged()}; $("#handle").oninput=e=>{state.handle=e.target.value;applyCard($("#card-preview"),state.slides[state.active],state.active);markChanged()}; $("#scrim").oninput=e=>{state.slides[state.active].scrim=Number(e.target.value);$("#scrim-value").value=`${e.target.value}%`;applyCard($("#card-preview"),state.slides[state.active],state.active);markChanged()};
  $("#shuffle-bg").onclick=()=>{let next=backgrounds.indexOf(state.slides[state.active].bg)+1;state.slides[state.active].bg=backgrounds[next%backgrounds.length];render();toast("배경을 바꿨어요.")}; $("#upload-zone").onclick=()=>$("#bg-file").click(); $("#upload-zone").onkeydown=e=>{if(e.key==="Enter"||e.key===" ")$("#bg-file").click()};
  $("#bg-file").onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{state.slides[state.active].bg=reader.result;render();toast("이미지를 적용했어요.")};reader.readAsDataURL(file)}; $("#apply-url").onclick=()=>{const url=$("#bg-url").value.trim();if(!/^https:\/\//.test(url))return toast("https 이미지 주소를 입력해 주세요.");state.slides[state.active].bg=url;render();toast("이미지 주소를 적용했어요.")};
  $("#convert-text").onclick=convertText; $("#source-text").onkeydown=e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter")convertText()}; $("#export-current").onclick=exportCurrent; $("#export-all").onclick=exportAll; $("#export-json").onclick=()=>download(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),`${state.title||"cardnews"}.json`);
  $("#import-json").onclick=()=>$("#json-file").click(); $("#json-file").onchange=async e=>{try{const next=JSON.parse(await e.target.files[0].text());if(!Array.isArray(next.slides))throw new Error();state=next;state.active=0;render();toast("덱을 불러왔어요.")}catch{toast("올바른 덱 파일이 아니에요.")}}; $("#preview-toggle").onclick=showPreview; $("#close-preview").onclick=()=>{$("#preview-modal").hidden=true;document.body.style.overflow=""};
  $("#reset-deck").onclick=()=>{if(confirm("모든 편집 내용을 지우고 처음으로 돌아갈까요?")){state=structuredClone(defaults);localStorage.removeItem(STORAGE_KEY);render();toast("처음 상태로 돌아왔어요.")}};
  const hashPreset=location.hash.slice(1);if(["cine","mag","manga","pixel","doodle","blue"].includes(hashPreset))state.preset=hashPreset; render();
});
