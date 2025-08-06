// import {
//   render,
//   screen,
//   fireEvent,
// } from '@testing-library/react';
// import ProductCard from '@/components/ProductCard';
// import { CartProvider } from '@/contexts/CartContext';
// import { AuthProvider } from '@/contexts/AuthContext';
// import { Product } from '@/types';

// // Mock dos contextos
// jest.mock('@/contexts/AuthContext');
// jest.mock('@/contexts/CartContext');

// const mockProduct: Product = {
//   id: '1',
//   name: 'Test Product',
//   description: 'Test description',
//   price: 99.99,
//   image: 'https://example.com/image.jpg',
//   category: 'Test Category',
//   stock: 10,
//   createdAt: '2023-01-01T00:00:00Z',
//   updatedAt: '2023-01-01T00:00:00Z',
// };

// // Mock do react-hot-toast
// jest.mock('react-hot-toast', () => ({
//   success: jest.fn(),
//   error: jest.fn(),
// }));

// const Wrapper = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => (
//   <AuthProvider>
//     <CartProvider>{children}</CartProvider>
//   </AuthProvider>
// );

// describe('ProductCard', () => {
//   it('should render product information correctly', () => {
//     render(
//       <Wrapper>
//         <ProductCard product={mockProduct} />
//       </Wrapper>
//     );

//     expect(
//       screen.getByText('Test Product')
//     ).toBeInTheDocument();
//     expect(
//       screen.getByText('Test description')
//     ).toBeInTheDocument();
//     expect(
//       screen.getByText('Test Category')
//     ).toBeInTheDocument();
//     expect(
//       screen.getByText('Estoque: 10')
//     ).toBeInTheDocument();
//   });

//   it('should show out of stock when stock is 0', () => {
//     const outOfStockProduct = {
//       ...mockProduct,
//       stock: 0,
//     };

//     render(
//       <Wrapper>
//         <ProductCard
//           product={outOfStockProduct}
//         />
//       </Wrapper>
//     );

//     expect(
//       screen.getByText('Esgotado')
//     ).toBeInTheDocument();
//   });

//   it('should show low stock badge when stock is <= 5', () => {
//     const lowStockProduct = {
//       ...mockProduct,
//       stock: 3,
//     };

//     render(
//       <Wrapper>
//         <ProductCard product={lowStockProduct} />
//       </Wrapper>
//     );

//     expect(
//       screen.getByText('Últimas unidades')
//     ).toBeInTheDocument();
//   });

//   it('should allow quantity adjustment', () => {
//     render(
//       <Wrapper>
//         <ProductCard product={mockProduct} />
//       </Wrapper>
//     );

//     const incrementButton = screen.getByRole(
//       'button',
//       { name: /plus/i }
//     );
//     const decrementButton = screen.getByRole(
//       'button',
//       { name: /minus/i }
//     );

//     fireEvent.click(incrementButton);
//     expect(
//       screen.getByText('2')
//     ).toBeInTheDocument();

//     fireEvent.click(decrementButton);
//     expect(
//       screen.getByText('1')
//     ).toBeInTheDocument();
//   });

//   it('should not allow quantity below 1', () => {
//     render(
//       <Wrapper>
//         <ProductCard product={mockProduct} />
//       </Wrapper>
//     );

//     const decrementButton = screen.getByRole(
//       'button',
//       { name: /minus/i }
//     );

//     // Quantidade inicial é 1, decremento deve estar desabilitado
//     expect(decrementButton).toBeDisabled();
//   });

//   it('should not allow quantity above stock', () => {
//     const limitedStockProduct = {
//       ...mockProduct,
//       stock: 2,
//     };

//     render(
//       <Wrapper>
//         <ProductCard
//           product={limitedStockProduct}
//         />
//       </Wrapper>
//     );

//     const incrementButton = screen.getByRole(
//       'button',
//       { name: /plus/i }
//     );

//     // Incrementar para quantidade 2
//     fireEvent.click(incrementButton);
//     expect(
//       screen.getByText('2')
//     ).toBeInTheDocument();

//     // Incremento deve estar desabilitado agora
//     expect(incrementButton).toBeDisabled();
//   });
// });
