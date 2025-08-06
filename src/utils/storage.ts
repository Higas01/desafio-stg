export const getCartFromStorage = () => {
  const storedCartJSON =
    localStorage.getItem('guest_cart');
  if (storedCartJSON) {
    return JSON.parse(storedCartJSON);
  }
  return null;
};
