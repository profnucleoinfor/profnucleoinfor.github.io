const CONFIG = {
      dominiosPermitidos: [
        'docs.google.com',
        'drive.google.com'
      ],
      tempoMaximoCarregamento: 30000,
      parametrosSlides: {
        start: 'false',
        loop: 'false',
        delayms: '3000'
      }
    };
    function ajustarAlturaViewport() {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight}px`
      );
    }
    ajustarAlturaViewport();
    window.addEventListener(
      'resize',
      ajustarAlturaViewport
    );
    window.addEventListener(
      'orientationchange',
      () => {
        setTimeout(
          ajustarAlturaViewport,
          150
        );
        mostrarDicaRotacao();
      }
    );
    const params =
      new URLSearchParams(
        window.location.search
      );
    const rawUrl =
      (params.get('url') || '').trim();
    const title =
      (
        params.get('titulo') ||
        'Visualizador de Aula'
      ).trim();
    const viewer =
      document.getElementById(
        'viewer'
      );
    const pageTitle =
      document.getElementById(
        'pageTitle'
      );
    const externalLink =
      document.getElementById(
        'externalLink'
      );
    const loading =
      document.getElementById(
        'loading'
      );
    const loadingSpinner =
      document.getElementById(
        'loadingSpinner'
      );
    const loadingText =
      document.getElementById(
        'loadingText'
      );
    const loadingHint =
      document.getElementById(
        'loadingHint'
      );
    const loadingActions =
      document.getElementById(
        'loadingActions'
      );
    const loadingExternalLink =
      document.getElementById(
        'loadingExternalLink'
      );
    const fullscreenBtn =
      document.getElementById(
        'fullscreenBtn'
      );
    const portraitOverlay =
      document.getElementById(
        'portraitOverlay'
      );
    const rotateBtn =
      document.getElementById(
        'rotateBtn'
      );
    const backBtn =
      document.getElementById(
        'backBtn'
      );
    let iframe = null;
    let carregou = false;
    let timerCarregamento = null;
    let ehApresentacao = false;
    pageTitle.textContent =
      title;
    document.title =
      `${title} | NIC Formação Profissional`;
    function validarUrl(url) {
      try {
        const u =
          new URL(url);
        if (
          u.protocol !== 'https:'
        ) {
          return false;
        }
        return CONFIG
          .dominiosPermitidos
          .some(
            dominio =>
              u.hostname === dominio ||
              u.hostname.endsWith(
                '.' + dominio
              )
          );
      } catch {
        return false;
      }
    }
    function adicionarParametros(
      url,
      parametros
    ) {
      const u =
        new URL(url);
      for (
        const [
          chave,
          valor
        ]
        of Object.entries(parametros)
      ) {
        if (
          !u.searchParams.has(
            chave
          )
        ) {
          u.searchParams.set(
            chave,
            valor
          );
        }
      }
      return u.toString();
    }
    function converterSlides(url) {
      let m;
      m =
        url.match(
          /docs\.google\.com\/presentation\/d\/e\/([^/?#]+)\/(?:embed|pubembed)/
        );
      if (m) {
        ehApresentacao =
          true;
        return adicionarParametros(
          url,
          CONFIG.parametrosSlides
        );
      }
      m =
        url.match(
          /docs\.google\.com\/presentation\/d\/([^/?#]+)\/embed/
        );
      if (m) {
        ehApresentacao =
          true;
        return adicionarParametros(
          url,
          CONFIG.parametrosSlides
        );
      }
      m =
        url.match(
          /docs\.google\.com\/presentation\/d\/([^/?#]+)/
        );
      if (m) {
        ehApresentacao =
          true;
        const original =
          new URL(url);
        const novaUrl =
          new URL(
            `https://docs.google.com/presentation/d/${m[1]}/embed`
          );
        original.searchParams.forEach(
          (
            valor,
            chave
          ) => {
            novaUrl.searchParams.set(
              chave,
              valor
            );
          }
        );
        if (
          original.hash
        ) {
          novaUrl.hash =
            original.hash;
        }
        for (
          const [
            chave,
            valor
          ]
          of Object.entries(
            CONFIG.parametrosSlides
          )
        ) {
          if (
            !novaUrl.searchParams.has(
              chave
            )
          ) {
            novaUrl.searchParams.set(
              chave,
              valor
            );
          }
        }
        return novaUrl.toString();
      }
      return null;
    }
    function converterDocumentos(url) {
      const m =
        url.match(
          /docs\.google\.com\/document\/d\/([^/?#]+)/
        );
      if (!m) {
        return null;
      }
      return (
        `https://docs.google.com/document/d/${m[1]}/preview`
      );
    }
    function converterPlanilhas(url) {
      const m =
        url.match(
          /docs\.google\.com\/spreadsheets\/d\/([^/?#]+)/
        );
      if (!m) {
        return null;
      }
      return (
        `https://docs.google.com/spreadsheets/d/${m[1]}/htmlembed`
      );
    }
    function converterDrive(url) {
      const original =
        new URL(url);
      const m =
        original.pathname.match(
          /^\/file\/d\/([^/]+)/
        );
      if (m) {
        const destino =
          new URL(
            `https://drive.google.com/file/d/${m[1]}/preview`
          );
        original.searchParams.forEach(
          (
            valor,
            chave
          ) => {
            if (
              !destino.searchParams.has(
                chave
              )
            ) {
              destino.searchParams.set(
                chave,
                valor
              );
            }
          }
        );
        if (
          original.hash
        ) {
          destino.hash =
            original.hash;
        }
        return destino.toString();
      }
      const id =
        original.searchParams.get(
          'id'
        );
      if (
        id &&
        original.hostname ===
          'drive.google.com'
      ) {
        const destino =
          new URL(
            `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`
          );
        original.searchParams.forEach(
          (
            valor,
            chave
          ) => {
            if (
              chave !== 'id' &&
              !destino.searchParams.has(
                chave
              )
            ) {
              destino.searchParams.set(
                chave,
                valor
              );
            }
          }
        );
        if (
          original.hash
        ) {
          destino.hash =
            original.hash;
        }
        return destino.toString();
      }
      return null;
    }
    function converterUrl(url) {
      ehApresentacao =
        false;
      return (
        converterSlides(url) ||
        converterDocumentos(url) ||
        converterPlanilhas(url) ||
        converterDrive(url) ||
        url
      );
    }
    function mostrarDicaRotacao() {
      const existente =
        document.querySelector(
          '.rotate-hint'
        );
      if (
        existente
      ) {
        existente.remove();
      }
      const hint =
        document.createElement(
          'div'
        );
      hint.className =
        'rotate-hint';
      hint.textContent =
        '↻ Tela ajustada';
      viewer.appendChild(
        hint
      );
      setTimeout(
        () => {
          if (
            hint.isConnected
          ) {
            hint.remove();
          }
        },
        4500
      );
    }
    function ehMobile() {
      return window.matchMedia(
        '(max-width: 900px)'
      ).matches;
    }
    function estaRetrato() {
      return window.matchMedia(
        '(orientation: portrait)'
      ).matches;
    }
    function atualizarOrientacao() {
      portraitOverlay.hidden =
        !ehMobile() ||
        !estaRetrato() ||
        !ehApresentacao;
    }
    async function bloquearPaisagem() {
      try {
        if (
          screen.orientation &&
          screen.orientation.lock
        ) {
          await screen.orientation.lock(
            'landscape'
          );
        }
      } catch {
      }
    }
    async function liberarOrientacao() {
      try {
        if (
          screen.orientation &&
          screen.orientation.unlock
        ) {
          screen.orientation.unlock();
        }
      } catch {}
    }
    async function entrarTelaCheia() {
      const request =
        viewer.requestFullscreen ||
        viewer.webkitRequestFullscreen;
      if (!request) {
        return false;
      }
      try {
        await request.call(
          viewer
        );
        await bloquearPaisagem();
        return true;
      } catch {
        return false;
      }
    }
    async function alternarFullscreen() {
      const ativo =
        document.fullscreenElement ||
        document.webkitFullscreenElement;
      if (ativo) {
        const exit =
          document.exitFullscreen ||
          document.webkitExitFullscreen;
        if (exit) {
          try {
            await exit.call(
              document
            );
          } catch {}
        }
        return;
      }
      await entrarTelaCheia();
    }
    fullscreenBtn.addEventListener(
      'click',
      alternarFullscreen
    );
    rotateBtn.addEventListener(
      'click',
      async () => {
        const sucesso =
          await entrarTelaCheia();
        if (!sucesso) {
          portraitOverlay.hidden =
            false;
          alert(
            'Seu navegador não permitiu a rotação automática. Gire o celular manualmente.'
          );
        }
      }
    );
    function atualizarFullscreen() {
      const ativo =
        !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement
        );
      viewer.classList.toggle(
        'fullscreen-active',
        ativo
      );
      fullscreenBtn.textContent =
        ativo
          ? '⤡ Sair da tela cheia'
          : '⤢ Tela cheia';
      ajustarAlturaViewport();
      atualizarOrientacao();
    }
    document.addEventListener(
      'fullscreenchange',
      async () => {
        const ativo =
          !!document.fullscreenElement;
        atualizarFullscreen();
        if (ativo) {
          await bloquearPaisagem();
        } else {
          await liberarOrientacao();
        }
      }
    );
    document.addEventListener(
      'webkitfullscreenchange',
      atualizarFullscreen
    );
    window.addEventListener(
      'resize',
      atualizarOrientacao
    );
    window.addEventListener(
      'orientationchange',
      () => {
        setTimeout(
          atualizarOrientacao,
          200
        );
      }
    );
    backBtn.addEventListener(
      'click',
      () => {
        try {
          const referrer =
            document.referrer;
          if (
            referrer
          ) {
            const origem =
              new URL(
                referrer,
                location.href
              );
            if (
              origem.origin ===
              location.origin
            ) {
              history.back();
              return;
            }
          }
        } catch {}
        location.href =
          './dashboard.html';
      }
    );
    if (
      !(
        viewer.requestFullscreen ||
        viewer.webkitRequestFullscreen
      )
    ) {
      fullscreenBtn.hidden =
        true;
    }
    function esconderLoading() {
      if (
        carregou
      ) {
        return;
      }
      carregou =
        true;
      if (
        timerCarregamento
      ) {
        clearTimeout(
          timerCarregamento
        );
        timerCarregamento =
          null;
      }
      loading.hidden =
        true;
    }
    function mostrarAvisoCarregamento() {
      loading.classList.add(
        'slow'
      );
      loadingSpinner.style.display =
        'none';
      loadingText.textContent =
        'O material ainda está carregando...';
      loadingHint.textContent =
        'O Google Slides pode levar alguns segundos para concluir o carregamento. ' +
        'O conteúdo continuará sendo carregado normalmente.';
      loadingActions.hidden =
        false;
      loadingExternalLink.href =
        rawUrl;
    }
    function mostrarErro(
      tituloErro,
      mensagem
    ) {
      if (
        timerCarregamento
      ) {
        clearTimeout(
          timerCarregamento
        );
        timerCarregamento =
          null;
      }
      loading.hidden =
        true;
      portraitOverlay.hidden =
        true;
      viewer.replaceChildren();
      const box =
        document.createElement(
          'div'
        );
      box.className =
        'error';
      const content =
        document.createElement(
          'div'
        );
      content.className =
        'error-content';
      const strong =
        document.createElement(
          'strong'
        );
      strong.textContent =
        tituloErro;
      const p =
        document.createElement(
          'p'
        );
      p.textContent =
        mensagem;
      const actions =
        document.createElement(
          'div'
        );
      actions.className =
        'error-actions';
      if (
        rawUrl
      ) {
        const abrir =
          document.createElement(
            'a'
          );
        abrir.href =
          rawUrl;
        abrir.target =
          '_blank';
        abrir.rel =
          'noopener noreferrer';
        abrir.textContent =
          '↗ Abrir material diretamente';
        actions.appendChild(
          abrir
        );
      }
      content.append(
        strong,
        p,
        actions
      );
      box.appendChild(
        content
      );
      viewer.appendChild(
        box
      );
      fullscreenBtn.hidden =
        true;
    }
    if (
      !rawUrl
    ) {
      externalLink.hidden =
        true;
      fullscreenBtn.hidden =
        true;
      mostrarErro(
        'Conteúdo não encontrado',
        'Nenhuma aula foi informada.'
      );
    }
    else if (
      !validarUrl(rawUrl)
    ) {
      externalLink.hidden =
        true;
      fullscreenBtn.hidden =
        true;
      mostrarErro(
        'Conteúdo não permitido',
        'Somente arquivos HTTPS do Google Drive e Google Docs são aceitos.'
      );
    }
    else {
      externalLink.href =
        rawUrl;
      const urlConvertida =
        converterUrl(
          rawUrl
        );
      iframe =
        document.createElement(
          'iframe'
        );
      iframe.src =
        urlConvertida;
      iframe.title =
        title;
      iframe.allow =
        'fullscreen';
      iframe.referrerPolicy =
        'strict-origin-when-cross-origin';
      iframe.addEventListener(
        'load',
        () => {
          esconderLoading();
        },
        {
          once: true
        }
      );
      iframe.addEventListener(
        'error',
        () => {
          mostrarErro(
            'Não foi possível carregar o material',
            'Verifique sua conexão e tente abrir diretamente. Se o arquivo for restrito, altere o compartilhamento para "Qualquer pessoa com o link".'
          );
        }
      );
      viewer.appendChild(
        iframe
      );
      timerCarregamento =
        setTimeout(
          () => {
            if (
              !carregou
            ) {
              mostrarAvisoCarregamento();
            }
          },
          CONFIG.tempoMaximoCarregamento
        );
      atualizarOrientacao();
    }
