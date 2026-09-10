/*
   Transforma qualquer elemento ".video-slot[data-youtube]" em
   um player do YouTube incorporado — o vídeo fica de fato
   assistível dentro do site, não é só um link.
*/

(function () {
  /* Extrai o ID de 11 caracteres do YouTube de qualquer  formato comum de link. */
  function extractYouTubeId(raw) {
    if (!raw) return null;
    const value = raw.trim();

    /* Já é só o ID (11 caracteres alfanuméricos/-/_) */
    if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = value.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  function buildEmptyState(slot) {
    slot.innerHTML = `
      <div class="video-slot__empty">
        <span class="video-slot__empty-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14l11-7-11-7z" fill="currentColor"/>
          </svg>
        </span>
        <p>Espaço reservado para um vídeo do YouTube sobre este tema.</p>
        <code>data-youtube="cole o link aqui"</code>
      </div>
    `;
  }

  function buildPlayer(slot, videoId, title) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
    iframe.title = title || 'Vídeo incorporado do YouTube';
    iframe.loading = 'lazy';
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    slot.innerHTML = '';
    slot.appendChild(iframe);
  }

  function initVideoSlots() {
    document.querySelectorAll('.video-slot[data-youtube]').forEach((slot) => {
      const raw = slot.getAttribute('data-youtube');
      const videoId = extractYouTubeId(raw);
      const title = slot.getAttribute('data-video-title');

      if (videoId) {
        buildPlayer(slot, videoId, title);
      } else {
        buildEmptyState(slot);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initVideoSlots);
})();
