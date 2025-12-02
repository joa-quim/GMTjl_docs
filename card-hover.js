<script>
// JavaScript to handle card hover effects for cards with images
document.addEventListener('DOMContentLoaded', function() {
  // Find all cards
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const paragraphs = card.querySelectorAll('p');

    // If card has only one paragraph (with image)
    if (paragraphs.length === 1) {
      const p = paragraphs[0];
      const img = p.querySelector('img');

      if (img) {
        // Get all text nodes
        const textContent = Array.from(p.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent.trim())
          .filter(text => text.length > 0)
          .join(' ');

        if (textContent) {
          // Create overlay div for description
          const overlay = document.createElement('div');
          overlay.className = 'card-description-overlay';
          overlay.textContent = textContent;
          card.appendChild(overlay);

          // Remove text nodes completely
          Array.from(p.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
              node.remove();
            }
          });
        }
      }
    }
  });

  // Equalize heights of grid sections (documentation cards)
  function equalizeGridHeights() {
    const grids = document.querySelectorAll('.grid');

    grids.forEach(grid => {
      const sections = Array.from(grid.querySelectorAll(':scope > section, :scope > div'));

      if (sections.length === 0) return;

      // Reset heights
      sections.forEach(section => {
        section.style.height = 'auto';
      });

      // Group sections by row (based on offsetTop)
      const rows = new Map();
      sections.forEach(section => {
        const top = section.offsetTop;
        if (!rows.has(top)) {
          rows.set(top, []);
        }
        rows.get(top).push(section);
      });

      // Equalize heights within each row
      rows.forEach(rowSections => {
        const maxHeight = Math.max(...rowSections.map(s => s.offsetHeight));
        rowSections.forEach(section => {
          section.style.height = maxHeight + 'px';
        });
      });
    });
  }

  // Run on load and resize
  equalizeGridHeights();
  window.addEventListener('resize', equalizeGridHeights);
});
</script>
