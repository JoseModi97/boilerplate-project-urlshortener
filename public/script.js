document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shorten-form');
  const urlInput = document.getElementById('url-input');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = urlInput.value;
    resultDiv.innerHTML = '';

    try {
      const response = await fetch('/api/shorturl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.error) {
        resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
      } else {
        resultDiv.innerHTML = `
          <p><strong>Original URL:</strong> ${data.original_url}</p>
          <p>
            <strong>Short URL:</strong>
            <a href="/api/shorturl/${data.short_url}" target="_blank">
              ${window.location.origin}/api/shorturl/${data.short_url}
            </a>
          </p>
        `;
      }
    } catch (err) {
      resultDiv.innerHTML = `<p>An error occurred. Please try again.</p>`;
    }
  });
});
