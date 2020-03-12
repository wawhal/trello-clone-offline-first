export const wsScheme = (url) => {
  const parts = url.split('//');
  return `${parts[0].replace('http', 'ws')}//${parts[1]}`;
};