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
    cheonghak: {
      number: "01",
      type: "자연·경관 관광 자원",
      title: "청학배수지전망대",
      lead: "관광객이 모르는 영도의 마을과 항구 야경을 잇는 로컬 여행",
      description: "봉래산 자락의 조용한 마을길 끝에서 부산항과 영도의 풍경을 한눈에 만나는 전망 공간입니다. 붐비는 관광지를 벗어나 산책하듯 오를 수 있고, 해가 지면 항구의 불빛이 마을 풍경과 자연스럽게 이어집니다.",
      address: "부산광역시 영도구 와치로 36",
      time: "봄·가을 · 일몰 30분 전부터 야간",
      photoWord: "SUNSET",
      images: ["assets/images/report/cheonghak-01.jpg", "assets/images/report/cheonghak-02.jpg"],
      imageAlts: ["청학배수지전망대에서 바라본 부산항대교 야경", "야간 조명이 켜진 청학배수지전망대"],
      credit: "사진 출처: 한국관광공사 · 사진작가 Dodream",
      guide: { hours: "연중 상시 개방", closed: "별도 휴무 없음", fee: "무료", reservation: "예약 없이 이용", transport: "버스 하차 후 도보 이동", transit: "5·9·85·101번 버스 활용", parking: "전용 주차장 없음", tip: "일몰 30분 전에 도착하면 낮 풍경부터 항구 야경까지 함께 볼 수 있습니다.", duration: "추천 60–90분" },
      nearby: [
        { no: "01", name: "봉래산", text: "영도의 능선과 부산항을 함께 조망하는 산책 명소", distance: "차량 약 8분" },
        { no: "02", name: "조내기 고구마 역사공원", text: "영도 고구마의 이야기를 담은 작은 역사 공원", distance: "차량 약 7분" },
        { no: "03", name: "흰여울문화마을", text: "바다와 절벽길이 이어지는 영도의 대표 산책 코스", distance: "차량 약 12분" }
      ],
      tags: ["#영도야경", "#로컬산책", "#일몰명소"],
      score: "4.8",
      programs: [
        { no: "01", image: "assets/images/report/cheonghak-program-01.jpg", source: "사진: yakei.jp", title: "선셋 나이트 뷰 워크", text: "마을길을 따라 전망대에 올라 일몰에서 항구 야경으로 변하는 풍경을 감상하는 산책 코스입니다.", meta: ["매일", "일몰 30분 전", "약 60분"] },
        { no: "02", image: "assets/images/report/cheonghak-program-02.jpg", source: "사진: yakei.jp", title: "영도 야경 포토 산책", text: "전망대와 주변 골목의 촬영 포인트를 천천히 둘러보며 영도의 저녁 풍경을 기록합니다.", meta: ["주말", "18:00", "약 80분"] }
      ],
      reviews: [
        { author: "김**", date: "2026.08", stars: "★★★★★", title: "조용히 야경을 즐기기 좋은 곳", text: "관광객이 많은 전망대와 달리 동네 풍경을 함께 볼 수 있어 좋았어요. 일몰 전에 올라가니 부산항의 변화가 정말 아름다웠습니다." },
        { author: "박**", date: "2026.07", stars: "★★★★★", title: "산책 코스로 추천해요", text: "오르는 길도 어렵지 않고 사진 찍기 좋은 지점이 많았습니다. 밤에는 길이 어두울 수 있어 밝을 때 출발하는 것을 추천합니다." },
        { author: "이**", date: "2026.05", stars: "★★★★☆", title: "영도의 숨은 전망 포인트", text: "화려한 시설보다 마을과 항구의 분위기를 느끼고 싶은 사람에게 잘 맞는 장소였습니다." }
      ]
    },
    kkangkangee: {
      number: "02",
      type: "역사·문화 관광 자원",
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

  const renderPrograms = (programs) => programs.map((program) => `
    <article class="program-item">
      <div class="program-art has-image"><img src="${program.image}" alt="${program.title} 이미지"><span>PROGRAM ${program.no}</span><small>${program.source}</small></div>
      <div class="program-copy">
        <span>LOCAL EXPERIENCE</span>
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
    setModalText("[data-nearby-start]", data.title);
    const mainImage = resourceModal.querySelector("[data-modal-image-main]");
    const subImage = resourceModal.querySelector("[data-modal-image-sub]");
    mainImage.src = data.images[0];
    mainImage.alt = data.imageAlts[0];
    subImage.src = data.images[1];
    subImage.alt = data.imageAlts[1];
    resourceModal.querySelector("[data-modal-tags]").innerHTML = data.tags.map((tag) => `<b>${tag}</b>`).join("");
    resourceModal.querySelector("[data-modal-programs]").innerHTML = renderPrograms(data.programs);
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

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767 && body.classList.contains("menu-open")) {
      body.classList.remove("menu-open");
      if (menuButton) menuButton.setAttribute("aria-expanded", "false");
    }
  });
});
