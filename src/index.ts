import app from './app';

const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 nim8us DEMO API running on port ${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/health`);
  console.log(`💰 FTSO: http://localhost:${PORT}/v1/ftso/price`);
  console.log(`📊 Demo stats: http://localhost:${PORT}/demo/stats`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});
