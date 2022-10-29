// Initialize menu history-tidiness enhancement.
document.addEventListener('DOMContentLoaded', () => {
  const closeButtons = document.querySelectorAll('[href="#close-menu"]');
  for (const closeButton of closeButtons) {
    closeButton.addEventListener('click', (event) => {
      document.activeElement.blur()
      event.preventDefault();
    });
  }
});

// Initialize overlay card behavior.
document.addEventListener('DOMContentLoaded', () => {
  function close(e) {
    if (location.hash === '') return;

    location = '#-';
    history.replaceState(null, '', '/');
    e.preventDefault();
    e.stopPropagation();
  }

  for (const card of document.querySelectorAll('.card')) {
    card.addEventListener('keydown', e => {
      if (e.key === 'Escape') close(e);
    });
    card.querySelector('[href="#-"].close-button').addEventListener('click', close);
    // This handles mousedown on the overlay.
    card.querySelector('.card [href="#-"]:not(.close-button)').addEventListener('mousedown', close);
  }

  const rootTitle = document.title;
  window.addEventListener('hashchange', () => {
    if (!location.hash) {
      document.title = rootTitle;
      return;
    }

    const element = document.querySelector(location.hash);
    if (element && element.classList.contains('card')) {
      const cardTitle = element.dataset.title;
      if (cardTitle) {
        document.title = `${rootTitle} - ${cardTitle}`
      }
    }
  });
});

// Initialize menu icon background behavior.
document.addEventListener('DOMContentLoaded', () => {
  /* Collect screen-space bounding boxes for elements of interest and pass them to CSS.
      This is used to position corresponding solid color background images,
      visible through the social and hamburger icon clip areas.
  */
  const hero = document.getElementById('hero');
  const memoir = document.getElementById('memoir');
  const contact = document.getElementById('contact');
  const html = document.documentElement;
  function setIconBackgroundPositions() {
    const heroBounds = hero.getBoundingClientRect();
    html.style.setProperty('--hero-position', `${heroBounds.x}px ${heroBounds.y}px`);
    html.style.setProperty('--hero-size', `${heroBounds.width}px ${heroBounds.height}px`);
    const memoirBounds = memoir.getBoundingClientRect();
    html.style.setProperty('--memoir-position', `${memoirBounds.x}px ${memoirBounds.y}px`);
    html.style.setProperty('--memoir-size', `var(--section-content-edge) ${memoirBounds.height}px`);
    const contactBounds = contact.getBoundingClientRect();
    html.style.setProperty('--contact-position', `${contactBounds.x}px ${contactBounds.y}px`);
    html.style.setProperty('--contact-size', `${contactBounds.width}px ${contactBounds.height}px`);
  }

  setIconBackgroundPositions();

  document.addEventListener('scroll',
    () => {
      setIconBackgroundPositions();
    },
    { passive: true }
  );
  
  window.addEventListener('resize',
    () => {
      setIconBackgroundPositions();
    },
    { passive: true }
  );
});

// Initialize horizontal scrolling behavior.
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider');
  for (const slider of sliders) {
    const leftButton = slider.querySelector('button:first-of-type');
    const rightButton = slider.querySelector('button:last-of-type');
    const scrollContainer = slider.querySelector(':is(ul, ol)');

    function scrollTo(scrollLeft) {
      setButtonStatus(scrollLeft);
      scrollContainer.scrollLeft = scrollLeft;
    }
    scrollTo(0);

    function setButtonStatus(scrollLeft = scrollContainer.scrollLeft) {
      const rightEdge = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      leftButton.disabled = scrollLeft < 20;
      rightButton.disabled = scrollLeft > rightEdge - 20;
    }

    leftButton.addEventListener('click', () =>
      scrollTo(scrollContainer.scrollLeft - scrollContainer.clientWidth)
    );
    rightButton.addEventListener('click', () =>
      scrollTo(scrollContainer.scrollLeft + scrollContainer.clientWidth)
    );
    scrollContainer.addEventListener(
      'scroll',
      debounce(setButtonStatus),
      { passive: true }
    );

    // Maintain scroll snapping.
    window.addEventListener('resize', () => {
      scrollContainer.style.scrollBehavior = "auto";
      scrollTo(scrollContainer.scrollLeft);
      scrollContainer.style.scrollBehavior = null;
    },
    { passive: true });
  }

  // This prevents the scroll handler from firing until scrolling has stopped.
  function debounce(func) {
    let request;

    return (...params) => {
      window.cancelAnimationFrame(request);

      // Allow two full "rest" frames to pass before executing the function.
      request = window.requestAnimationFrame(() => {
        request = window.requestAnimationFrame(() => {
          request = window.requestAnimationFrame(() => {
            func.apply(params);
          });
        });
      });
    }
  }
});

// Initialize form handling.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    button.disabled = true;

    const data = new URLSearchParams();
    for (const pair of new FormData(form)) {
      data.append(pair[0], pair[1]);
    }

    fetch(form.action, {
      method: form.method,
      body: data
    }).then((response) => {
      if (response.ok) showSuccess();
      else showFailure();
    }).catch(() => {
      showFailure();
    });

    function showSuccess() {
      button.disabled = false;
      form.reset();
      window.location.href = "#contact-success";
    }

    function showFailure() {
      button.disabled = false;
      window.location.href = "#contact-failure";
    }
  });
});

// Initialize media section behavior.
document.addEventListener('DOMContentLoaded', () => {
  const mediaSection = document.getElementById('media');
  const list = mediaSection.querySelector('ul');
  const figures = mediaSection.querySelector('.figures');

  // Attach behavior to thumbnail links.
  for (const link of list.querySelectorAll('a')) {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      updateMediaSelection(hash);
      if (window.location.hash.startsWith("#media")) {
        window.history.replaceState(null, '', hash);
      } else {
        window.location = hash;
        preventAnchorScrolling();
      }
      event.preventDefault();
    });
  }

  function preventAnchorScrolling() {
    const scrollY = window.scrollY;
    document.documentElement.style.scrollBehavior = "auto";
    window.requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
      
      window.requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = null;
      });
    });
  }

  function updateMediaSelection(hash) {
    // Add style indicators.
    for (const current of mediaSection.querySelectorAll('.current')) {
      current.classList.remove('current');
    }
    const link = list.querySelector(`a[href="${hash}"]`) || list.querySelector(`a`);
    const figure = figures.querySelector(`figure${hash}`) || figures.querySelector(`figure`);
    link.classList.add('current');
    figure.classList.add('current');
    figures.classList.add('has-current');

    for (const iframe of figures.querySelectorAll('figure:not(.current) iframe')) {
      iframe.contentWindow.postMessage(JSON.stringify(
        { event: 'command', func: 'pauseVideo' }), '*');
    }

    setScrollPositions(link, figure);

    // Load iframe content.
    const iframe = figure.querySelector('iframe');
    if (iframe) {
      if (iframe.hasAttribute('data-src')) {
        const figure = iframe.parentElement;
        figure.removeChild(iframe);
        const src = new URL(iframe.getAttribute('data-src'));
        iframe.removeAttribute('data-src');
        src.searchParams.append('enablejsapi', 1);
        iframe.setAttribute('src', src);
        figure.insertBefore(iframe, figure.firstChild);
      }
    }
  }

  function setScrollPositions(link = list.querySelector('.current'), figure = figures.querySelector('.current')) {
    const linkRect = link.getBoundingClientRect();
    const listRect = list.getBoundingClientRect()
    const linkLeft = linkRect.left - listRect.left;
    const linkRight = linkRect.right - listRect.right;
    if (linkLeft < 0) list.scrollTo(list.scrollLeft + linkLeft, 0);
    if (linkRight > 0) list.scrollTo(list.scrollLeft + linkRight, 0);

    const figureLeft = figure.getBoundingClientRect().left - figures.getBoundingClientRect().left;
    figures.scrollTo(figures.scrollLeft + figureLeft, 0);
  }

  // Select the current (or first) item on load.
  updateMediaSelection(window.location.hash);

  window.addEventListener('popstate', () => { 
    const hash = window.location.hash;
    if (hash.startsWith("#media-")) {
      updateMediaSelection(hash);
    }
  });

  // Maintain scroll position.
  window.addEventListener('resize', () => {
    setScrollPositions();
  },
  { passive: true });
});
