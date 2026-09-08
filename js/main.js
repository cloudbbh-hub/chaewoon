document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = body.classList.toggle("menu-open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.querySelector(".sr-only").textContent = open ? "메뉴 닫기" : "메뉴 열기";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        body.classList.remove("menu-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const currentPage = body.dataset.page;
  const currentLink = document.querySelector(`[data-nav="${currentPage}"]`);
  if (currentLink) {
    currentLink.classList.add("is-current");
    currentLink.setAttribute("aria-current", "page");
  }

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const tableFilters = document.querySelectorAll("[data-filter]");
  const tableRows = [...document.querySelectorAll(".resource-table tbody tr")];
  const tableSearch = document.querySelector("[data-table-search]");
  const emptyState = document.querySelector(".empty-state");
  let selectedCategory = "all";

  const updateTable = () => {
    const query = tableSearch ? tableSearch.value.trim().toLowerCase() : "";
    let visible = 0;
    tableRows.forEach((row) => {
      const categoryMatches = selectedCategory === "all" || row.dataset.category === selectedCategory;
      const textMatches = !query || row.textContent.toLowerCase().includes(query);
      row.hidden = !(categoryMatches && textMatches);
      if (!row.hidden) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
  };

  tableFilters.forEach((button) => {
    button.addEventListener("click", () => {
      tableFilters.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      selectedCategory = button.dataset.filter;
      updateTable();
    });
  });
  if (tableSearch) tableSearch.addEventListener("input", updateTable);

  const resourceFilters = document.querySelectorAll("[data-resource-filter]");
  const resourceCards = [...document.querySelectorAll("[data-resource-category]")];
  const resourceSearch = document.querySelector("[data-resource-search]");
  const resourceEmpty = document.querySelector(".resource-empty");
  let selectedResourceCategory = "all";

  const updateResources = () => {
    const query = resourceSearch ? resourceSearch.value.trim().toLowerCase() : "";
    let visible = 0;
    resourceCards.forEach((card) => {
      const categoryMatches = selectedResourceCategory === "all" || card.dataset.resourceCategory === selectedResourceCategory;
      const textMatches = !query || card.textContent.toLowerCase().includes(query);
      card.hidden = !(categoryMatches && textMatches);
      if (!card.hidden) visible += 1;
    });
    if (resourceEmpty) resourceEmpty.hidden = visible !== 0;
  };

  resourceFilters.forEach((button) => {
    button.addEventListener("click", () => {
      resourceFilters.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      selectedResourceCategory = button.dataset.resourceFilter;
      updateResources();
    });
  });
  if (resourceSearch) resourceSearch.addEventListener("input", updateResources);

  const resourceData = {
    gwangalli: {
      number: "01",
      type: "자연·경관 관광 자원",
      locationLabel: "BUSAN · SUYEONG",
      title: "광안리해수욕장",
      lead: "낮의 푸른 바다부터 광안대교 야경까지 이어지는 부산의 도심 해변",
      description: "광안리해수욕장은 해변 정면으로 광안대교가 펼쳐지는 부산의 대표 해변입니다. 낮에는 백사장과 바다를 따라 산책하고, 저녁에는 다리 조명과 야경을 감상할 수 있습니다. 해변을 따라 오션뷰 카페와 레스토랑, 소품샵과 복합문화공간이 이어져 낮부터 밤까지 다양한 분위기를 즐길 수 있습니다.",
      address: "부산광역시 수영구 광안해변로 219",
      time: "사계절 · 일몰 전부터 야간",
      photoWord: "OCEAN",
      images: ["assets/images/report/gwangalli-landscape.jpg", "assets/images/report/gwangalli-02.jpg"],
      imageAlts: ["광안리해수욕장과 광안대교 전경", "광안대교 조명이 비친 광안리해수욕장 야경"],
      credit: "사진 출처: 부산광역시·부산관광공사, 부산광역시 수영구",
      guide: { hours: "해변 연중 상시 개방", closed: "해수욕장 운영 기간은 계절별 확인", fee: "무료", reservation: "예약 없이 이용", transport: "금련산역·광안역에서 도보", transit: "도시철도 2호선 이용", parking: "인근 공영·민영주차장 이용", tip: "일몰 전에 도착해 낮 풍경을 보고 야경까지 이어서 감상해 보세요. 토요일 드론쇼는 방문 전 공식 일정을 확인하는 것이 좋습니다.", duration: "추천 2–3시간" },
      nearby: [
        { no: "01", name: "광안리해변 테마거리", text: "바다와 광안대교를 따라 산책과 포토 스폿을 즐기는 해변 거리", distance: "도보 약 1분" },
        { no: "02", name: "민락수변공원", text: "바다 가까이에서 광안대교와 도심 야경을 감상하는 수변 공간", distance: "도보 약 15분" },
        { no: "03", name: "민락회타운", text: "싱싱한 해산물과 부산의 바다 식문화를 만나는 로컬 명소", distance: "도보 약 12분" }
      ],
      tags: ["#광안리해수욕장", "#광안대교야경", "#오션뷰카페", "#광안리소품샵"],
      score: "4.9",
      programNav: "가볼 만한 곳",
      programKicker: "CAFE & SHOP",
      programTitle: "가볼 만한 곳",
      programDescription: "해변 산책과 함께 들르기 좋은 카페·소품샵·복합문화공간",
      programLabel: "PLACE",
      programItemKicker: "GWANGALLI LOCAL SPOT",
      programs: [
        { no: "01", image: "assets/images/report/gwangalli-place-cafe.jpg", source: "사진: 트리플", title: "카페오뜨 광안비치점", text: "통창과 루프탑에서 광안리 바다와 광안대교를 바라보며 음료와 디저트를 즐길 수 있는 오션뷰 카페입니다.", meta: ["오션뷰 카페", "광안해변로 209", "해변 도보 약 2분"] },
        { no: "02", image: "assets/images/report/gwangalli-place-giftshop.jpg", source: "사진: 한국관광공사 TourAPI", title: "러브이즈기빙", text: "부산 여행을 기억할 문구, 액세서리와 아기자기한 리빙 아이템을 둘러볼 수 있는 광안리 로컬 소품샵입니다.", meta: ["소품샵", "광안로49번길 24", "해변 도보 약 5분"] },
        { no: "03", image: "assets/images/report/gwangalli-place-market.jpg", source: "사진: designboom", title: "밀락더마켓", text: "카페와 먹거리, 팝업스토어와 소품을 한 공간에서 만나는 광안리 해변 인근의 복합문화공간입니다.", meta: ["복합문화공간", "카페·팝업·소품", "민락수변로17번길 56"] }
      ],
      reviews: [
        { author: "김**", date: "2026.08", stars: "★★★★★", title: "낮과 밤이 모두 아름다운 해변", text: "일몰 전에 도착해 바다를 걷고 광안대교 조명이 켜지는 순간까지 봤어요. 해변 주변에 카페가 많아 쉬어가기에도 좋았습니다." },
        { author: "박**", date: "2026.07", stars: "★★★★★", title: "카페와 소품샵까지 함께 둘러봤어요", text: "해변 산책 후 오션뷰 카페와 소품샵을 이어서 방문하니 반나절 코스로 알찼습니다. 대중교통으로 접근하기도 편했어요." },
        { author: "이**", date: "2026.05", stars: "★★★★☆", title: "토요일 저녁 분위기가 특별해요", text: "드론쇼와 광안대교 야경이 인상적이었어요. 주말에는 사람이 많아 조금 일찍 도착하는 것을 추천합니다." }
      ]
    },
    kkangkangee: {
      number: "02",
      type: "역사·문화 관광 자원",
      locationLabel: "BUSAN · YEONGDO",
      title: "깡깡이마을",
      lead: "부산에서 100년 넘게 들린 소리",
      description: "수리조선소에서 녹슨 배의 표면을 망치로 두드리던 ‘깡깡’ 소리에서 이름을 얻은 마을입니다. 오래된 산업 현장과 주민의 삶, 공공예술이 골목마다 겹쳐져 영도만의 독특한 시간과 이야기를 만날 수 있습니다.",
      address: "부산광역시 영도구 대평북로 36, 대평동",
      time: "봄·가을 · 주말 낮 시간대",
      photoWord: "HISTORY",
      images: ["assets/images/report/kkangkangee-01.jpg", "assets/images/report/kkangkangee-02.jpg"],
      imageAlts: ["영도 깡깡이마을과 부산항 전경", "벽화가 그려진 깡깡이예술마을 건물"],
      credit: "사진 출처: 이번여행(IB Travel)",
      guide: { hours: "마을 상시 개방", closed: "안내센터·프로그램은 운영일 확인", fee: "마을 관람 무료", reservation: "투어 프로그램은 별도 예약", transport: "남포역에서 버스 이동", transit: "영도대교·대평동 방면", parking: "인근 공영주차장 이용", tip: "낮에는 골목과 벽화를 보고, 주말 운영 프로그램을 함께 예약하면 마을의 역사를 더 깊이 이해할 수 있습니다.", duration: "추천 90–120분" },
      nearby: [
        { no: "01", name: "영도대교", text: "영도와 원도심을 잇는 부산의 역사적인 다리", distance: "차량 약 5분" },
        { no: "02", name: "자갈치시장", text: "부산의 활기찬 항구 식문화를 만나는 전통시장", distance: "차량 약 7분" },
        { no: "03", name: "영도 웰컴센터", text: "영도의 여행 정보와 다리 풍경을 함께 보는 공간", distance: "차량 약 5분" }
      ],
      tags: ["#깡깡이예술마을", "#영도여행", "#부산로컬여행"],
      score: "4.7",
      programs: [
        { no: "01", image: "assets/images/report/kkangkangee-experience-01.jpg", source: "사진: 한국관광공사", title: "깡깡이 해상투어", text: "배를 타고 부산 남항과 수리조선소, 자갈치시장 일대의 항구 풍경을 둘러보는 체험입니다.", meta: ["주말", "13:00 · 14:00 · 15:00", "약 20분"] },
        { no: "02", image: "assets/images/report/kkangkangee-experience-02.jpg", source: "사진: 국제신문", title: "마을 스토리 투어", text: "해설을 들으며 수리조선소 골목, 공공예술 작품과 마을의 노동 역사를 살펴보는 도보 프로그램입니다.", meta: ["주말", "14:20", "약 60분"] }
      ],
      reviews: [
        { author: "김**", date: "2026.08", stars: "★★★★★", title: "예술 작품과 골목이 잘 어울려요", text: "배를 고치는 조선소와 예술 작품이 함께 있어 다른 벽화마을과는 분위기가 달랐어요. 부산의 진짜 항구 풍경을 만난 기분이었습니다." },
        { author: "정**", date: "2026.06", stars: "★★★★★", title: "해상투어를 꼭 추천합니다", text: "마을 해설을 듣고 둘러보니 평범해 보이던 골목과 선박마다 이야기가 새롭게 보였어요. 해상투어는 이동의 재미도 충분했습니다." },
        { author: "문**", date: "2026.04", stars: "★★★★☆", title: "천천히 산책하기 좋은 마을", text: "알록달록한 벽화와 바다가 사진 찍기 좋고, 조용해서 천천히 산책하기에도 좋았습니다." }
      ]
    },
    space307: {
      number: "03",
      type: "체험·레저 관광 자원",
      locationLabel: "BUSAN · YEONGDO",
      title: "영도공간 307",
      lead: "영도 바닷가 창고 안에 숨겨진 무료 디지털 놀이터",
      description: "해양 산업 공간의 분위기를 살린 창고형 실내 체험 시설입니다. 대형 디지털 스크린과 스포츠 콘텐츠를 무료로 경험할 수 있어 날씨와 계절에 상관없이 영도 여행에 활동적인 장면을 더합니다.",
      address: "부산광역시 영도구 해양로 307",
      time: "사계절 · 비나 미세먼지가 있는 날",
      photoWord: "PLAY",
      images: ["assets/images/report/space307-home-01.jpg", "assets/images/report/space307-home-02.jpg"],
      imageAlts: ["운동장 너머로 보이는 영도공간 307 건물 전경", "영도공간 307의 밝고 넓은 안내 공간"],
      credit: "사진 출처: 부산광역시 영도구 · 두인폴리캠",
      guide: { hours: "화–일 10:00–17:00", closed: "매주 월요일 휴관", fee: "무료", reservation: "영도구 홈페이지 사전 예약", transport: "동삼혁신지구 방면 버스", transit: "해양로 307 인근 하차", parking: "마린축구장 인근", tip: "예약 시간 10분 전에 도착하고 움직이기 편한 복장과 운동화를 준비하는 것이 좋습니다.", duration: "추천 60–90분" },
      nearby: [
        { no: "01", name: "국립해양박물관", text: "바다의 역사와 문화를 체험하는 영도의 대표 박물관", distance: "차량 약 4분" },
        { no: "02", name: "아미르공원", text: "바다를 따라 걷기 좋은 동삼혁신지구 수변 공원", distance: "차량 약 3분" },
        { no: "03", name: "태종대", text: "해안 절벽과 숲이 어우러진 부산의 자연 명소", distance: "차량 약 12분" }
      ],
      tags: ["#영도공간307", "#무료체험", "#실내데이트"],
      score: "4.6",
      programs: [
        { no: "01", image: "assets/images/report/space307-01.jpg", source: "사진: 부산광역시 어린이신문", title: "디지털 스포츠 챌린지", text: "대형 스크린을 활용해 클라이밍, 사격과 러닝을 게임처럼 즐기는 무료 스포츠 체험입니다.", meta: ["운영일 상시", "현장 참여", "약 40분"] },
        { no: "02", image: "assets/images/report/space307-program-02.jpg", source: "사진: 부산광역시 어린이신문", title: "스크린 플레이 라운드", text: "친구나 가족과 함께 디지털 스크린 게임과 노래 콘텐츠를 자유롭게 체험합니다.", meta: ["사계절", "무료", "약 30분"] }
      ],
      reviews: [
        { author: "최**", date: "2026.08", stars: "★★★★★", title: "비 오는 날 방문하기 좋아요", text: "무료인데도 체험 종류가 다양하고 공간이 넓어 충분히 즐겼습니다. 아이와 함께 온 가족에게 특히 좋을 것 같아요." },
        { author: "송**", date: "2026.07", stars: "★★★★☆", title: "활동적인 실내 여행지", text: "영도 여행 중 더위를 피해 들어갔는데 스크린 클라이밍이 생각보다 재미있었습니다." },
        { author: "한**", date: "2026.03", stars: "★★★★★", title: "친구들과 가볍게 즐기기 좋은 곳", text: "예약 부담 없이 여러 디지털 체험을 해볼 수 있어 여행 동선에 넣기 좋았습니다." }
      ]
    }
  };

  const resourceModal = document.querySelector("[data-resource-modal]");
  const modalScroll = document.querySelector("[data-modal-scroll]");
  const modalNavButtons = [...document.querySelectorAll("[data-modal-target]")];
  let lastFocusedElement = null;

  const renderPrograms = (programs, label = "PROGRAM", itemKicker = "LOCAL EXPERIENCE") => programs.map((program) => `
    <article class="program-item">
      <div class="program-art has-image"><img src="${program.image}" alt="${program.title} 이미지"><span>${label} ${program.no}</span><small>${program.source}</small></div>
      <div class="program-copy">
        <span>${itemKicker}</span>
        <h3>${program.title}</h3>
        <p>${program.text}</p>
        <div class="program-meta">${program.meta.map((item) => `<b>${item}</b>`).join("")}</div>
      </div>
    </article>`).join("");

  const renderReviews = (reviews) => reviews.map((review, index) => `
    <article class="review-item">
      <div class="review-author"><div class="review-avatar avatar-${(index % 4) + 1}" aria-hidden="true"><i></i><b></b></div><strong>${review.author}</strong><span>${review.date}</span></div>
      <div class="review-copy"><div><b>REVIEW ${String(index + 1).padStart(2, "0")} · ${review.title}</b><span>${review.stars}</span></div><p>${review.text}</p></div>
    </article>`).join("");

  const renderNearby = (places) => places.map((place) => `
    <article class="nearby-card"><span>COURSE ${place.no}</span><h3>${place.name}</h3><p>${place.text}</p><b>${place.distance}</b></article>`).join("");

  const setModalText = (selector, value) => {
    const node = resourceModal ? resourceModal.querySelector(selector) : null;
    if (node) node.textContent = value;
  };

  const openResourceModal = (key, trigger) => {
    const data = resourceData[key];
    if (!resourceModal || !data) return;
    lastFocusedElement = trigger;
    setModalText("[data-modal-number]", data.number);
    setModalText("[data-modal-type]", data.type);
    setModalText("[data-modal-location]", data.locationLabel || "BUSAN");
    setModalText("[data-modal-title]", data.title);
    setModalText("[data-modal-lead]", data.lead);
    setModalText("[data-modal-description]", data.description);
    setModalText("[data-modal-address]", data.address);
    setModalText("[data-modal-time]", data.time);
    setModalText("[data-modal-photo-word]", data.photoWord);
    setModalText("[data-modal-credit]", data.credit);
    setModalText("[data-review-score]", data.score);
    setModalText("[data-guide-address]", data.address);
    setModalText("[data-guide-hours]", data.guide.hours);
    setModalText("[data-guide-closed]", data.guide.closed);
    setModalText("[data-guide-fee]", data.guide.fee);
    setModalText("[data-guide-reservation]", data.guide.reservation);
    setModalText("[data-guide-transport]", data.guide.transport);
    setModalText("[data-guide-transit]", data.guide.transit);
    setModalText("[data-guide-parking]", data.guide.parking);
    setModalText("[data-guide-tip]", data.guide.tip);
    setModalText("[data-guide-duration]", data.guide.duration);
    setModalText("[data-modal-program-nav]", data.programNav || "체험 프로그램");
    setModalText("[data-modal-program-kicker]", data.programKicker || "EXPERIENCE");
    setModalText("[data-modal-program-title]", data.programTitle || "체험 프로그램");
    setModalText("[data-modal-program-description]", data.programDescription || "이 장소를 더 깊이 경험하는 방법");
    setModalText("[data-nearby-start]", data.title);
    const mainImage = resourceModal.querySelector("[data-modal-image-main]");
    const subImage = resourceModal.querySelector("[data-modal-image-sub]");
    mainImage.src = data.images[0];
    mainImage.alt = data.imageAlts[0];
    subImage.src = data.images[1];
    subImage.alt = data.imageAlts[1];
    resourceModal.querySelector("[data-modal-tags]").innerHTML = data.tags.map((tag) => `<b>${tag}</b>`).join("");
    resourceModal.querySelector("[data-modal-programs]").innerHTML = renderPrograms(data.programs, data.programLabel, data.programItemKicker);
    resourceModal.querySelector("[data-modal-reviews]").innerHTML = renderReviews(data.reviews);
    resourceModal.querySelector("[data-modal-nearby]").innerHTML = renderNearby(data.nearby);
    const mapFrame = resourceModal.querySelector("[data-modal-map]");
    const mapLink = resourceModal.querySelector("[data-map-link]");
    const copyButton = resourceModal.querySelector("[data-copy-address]");
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(data.address)}&output=embed`;
    mapFrame.title = `${data.title} 위치 지도`;
    mapLink.href = `https://map.kakao.com/link/search/${encodeURIComponent(data.title)}`;
    copyButton.dataset.copyValue = data.address;
    copyButton.textContent = "주소 복사";
    resourceModal.hidden = false;
    body.classList.add("modal-open");
    modalScroll.scrollTop = 0;
    modalNavButtons.forEach((button, index) => button.classList.toggle("is-active", index === 0));
    resourceModal.querySelector(".modal-close").focus();
  };

  const closeResourceModal = () => {
    if (!resourceModal || resourceModal.hidden) return;
    resourceModal.hidden = true;
    body.classList.remove("modal-open");
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  document.querySelectorAll("[data-resource-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => openResourceModal(trigger.dataset.resourceOpen, trigger));
  });
  document.querySelectorAll("[data-modal-close]").forEach((button) => button.addEventListener("click", closeResourceModal));
  const copyAddressButton = document.querySelector("[data-copy-address]");
  if (copyAddressButton) {
    copyAddressButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyAddressButton.dataset.copyValue || "");
        copyAddressButton.textContent = "복사 완료";
      } catch (error) {
        copyAddressButton.textContent = "주소를 선택해 복사해 주세요";
      }
    });
  }
  modalNavButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.modalTarget);
      if (!target || !modalScroll) return;
      modalNavButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      modalScroll.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    });
  });
  if (modalScroll) {
    modalScroll.addEventListener("scroll", () => {
      const sections = [...resourceModal.querySelectorAll("[data-modal-section]")];
      let activeSection = sections[0];
      sections.forEach((section) => {
        if (section.offsetTop <= modalScroll.scrollTop + 120) activeSection = section;
      });
      modalNavButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.modalTarget === activeSection.id));
    }, { passive: true });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && resourceModal && !resourceModal.hidden) closeResourceModal();
  });

  const contentFilters = document.querySelectorAll("[data-content-filter]");
  const contentCards = [...document.querySelectorAll("[data-content-type]")];
  const resultCount = document.querySelector("[data-result-count]");

  contentFilters.forEach((button) => {
    button.addEventListener("click", () => {
      contentFilters.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      const type = button.dataset.contentFilter;
      let visible = 0;
      contentCards.forEach((card) => {
        card.hidden = type !== "all" && card.dataset.contentType !== type;
        if (!card.hidden) visible += 1;
      });
      if (resultCount) resultCount.textContent = visible;
    });
  });

  const cardnewsSlides = Array.from({ length: 13 }, (_, index) => `assets/images/contents/location-cardnews/slide-${String(index + 1).padStart(2, "0")}.jpg`);
  const cardnewsModal = document.querySelector("[data-cardnews-modal]");
  const cardnewsImage = document.querySelector("[data-cardnews-image]");
  const cardnewsCounter = document.querySelector("[data-cardnews-counter]");
  const cardnewsThumbs = document.querySelector("[data-cardnews-thumbs]");
  const cardnewsOpen = document.querySelector("[data-cardnews-open]");
  let cardnewsIndex = 0;
  let cardnewsLastFocus = null;

  const updateCardnews = (nextIndex) => {
    if (!cardnewsModal || !cardnewsImage) return;
    cardnewsIndex = (nextIndex + cardnewsSlides.length) % cardnewsSlides.length;
    cardnewsImage.src = cardnewsSlides[cardnewsIndex];
    cardnewsImage.alt = `광안리 소품샵 카드뉴스 ${cardnewsIndex + 1}페이지`;
    if (cardnewsCounter) cardnewsCounter.textContent = `${String(cardnewsIndex + 1).padStart(2, "0")} / ${cardnewsSlides.length}`;
    cardnewsThumbs?.querySelectorAll("button").forEach((button, index) => {
      button.classList.toggle("is-active", index === cardnewsIndex);
      button.setAttribute("aria-current", index === cardnewsIndex ? "true" : "false");
    });
    const activeThumb = cardnewsThumbs?.querySelector(".is-active");
    activeThumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  if (cardnewsThumbs) {
    cardnewsThumbs.innerHTML = cardnewsSlides.map((slide, index) => `<button class="cardnews-thumb${index === 0 ? " is-active" : ""}" type="button" data-cardnews-index="${index}" aria-label="${index + 1}페이지 보기" aria-current="${index === 0 ? "true" : "false"}"><img src="${slide}" alt=""></button>`).join("");
    cardnewsThumbs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cardnews-index]");
      if (button) updateCardnews(Number(button.dataset.cardnewsIndex));
    });
  }

  const openCardnews = () => {
    if (!cardnewsModal) return;
    cardnewsLastFocus = document.activeElement;
    cardnewsModal.hidden = false;
    body.classList.add("modal-open");
    updateCardnews(0);
        cardnewsModal.querySelector(".cardnews-close")?.focus();
  };

  const closeCardnews = () => {
    if (!cardnewsModal || cardnewsModal.hidden) return;
    cardnewsModal.hidden = true;
    body.classList.remove("modal-open");
    cardnewsLastFocus?.focus();
  };

  cardnewsOpen?.addEventListener("click", openCardnews);
  document.querySelectorAll("[data-cardnews-close]").forEach((button) => button.addEventListener("click", closeCardnews));
  document.querySelector("[data-cardnews-prev]")?.addEventListener("click", () => updateCardnews(cardnewsIndex - 1));
  document.querySelector("[data-cardnews-next]")?.addEventListener("click", () => updateCardnews(cardnewsIndex + 1));
  document.addEventListener("keydown", (event) => {
    if (!cardnewsModal || cardnewsModal.hidden) return;
    if (event.key === "Escape") closeCardnews();
    if (event.key === "ArrowLeft") updateCardnews(cardnewsIndex - 1);
    if (event.key === "ArrowRight") updateCardnews(cardnewsIndex + 1);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767 && body.classList.contains("menu-open")) {
      body.classList.remove("menu-open");
      if (menuButton) menuButton.setAttribute("aria-expanded", "false");
    }
  });
});
