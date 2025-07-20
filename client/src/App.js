import React, { useState } from 'react';
import {
  FluentProvider,
  webLightTheme,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
} from '@fluentui/react-components';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setShortenedUrl(null);

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
        setError(data.error);
      } else {
        setShortenedUrl(data);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className="App">
        <header className="App-header">
          <h1>URL Shortener</h1>
        </header>
        <main>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Enter URL to shorten"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="url-input"
            />
            <Button type="submit" appearance="primary">
              Shorten
            </Button>
          </form>
          {shortenedUrl && (
            <Card className="result-card">
              <CardHeader>
                <h3>Shortened URL</h3>
              </CardHeader>
              <CardBody>
                <p>
                  <strong>Original URL:</strong> {shortenedUrl.original_url}
                </p>
                <p>
                  <strong>Short URL:</strong>{' '}
                  <a
                    href={`/api/shorturl/${shortenedUrl.short_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {window.location.origin}/api/shorturl/{shortenedUrl.short_url}
                  </a>
                </p>
              </CardBody>
            </Card>
          )}
          {error && (
            <Card className="result-card error-card">
              <CardHeader>
                <h3>Error</h3>
              </CardHeader>
              <CardBody>
                <p>{error}</p>
              </CardBody>
            </Card>
          )}
        </main>
      </div>
    </FluentProvider>
  );
}

export default App;
