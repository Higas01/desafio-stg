// import {
//   render,
//   screen,
//   fireEvent,
//   waitFor,
// } from '@testing-library/react';
// import {
//   AuthProvider,
//   useAuth,
// } from '@/contexts/AuthContext';
// import { supabase } from '@/services/supabase';
// import jest from 'jest-mock';

// // Mock do Supabase
// jest.mock('@/services/supabase', () => ({
//   supabase: {
//     auth: {
//       getSession: jest.fn(),
//       onAuthStateChange: jest.fn(() => ({
//         data: {
//           subscription: {
//             unsubscribe: jest.fn(),
//           },
//         },
//       })),
//       signInWithPassword: jest.fn(),
//       signUp: jest.fn(),
//       signOut: jest.fn(),
//     },
//     from: jest.fn(() => ({
//       select: jest.fn().mockReturnThis(),
//       eq: jest.fn().mockReturnThis(),
//       single: jest.fn(),
//       insert: jest.fn(),
//     })),
//   },
// }));

// // Mock do react-hot-toast
// jest.mock('react-hot-toast', () => ({
//   success: jest.fn(),
//   error: jest.fn(),
// }));

// // Componente de teste para usar o hook
// const TestComponent = () => {
//   const {
//     user,
//     loading,
//     signIn,
//     signUp,
//     signOut,
//   } = useAuth();

//   return (
//     <div>
//       <div data-testid="loading">
//         {loading ? 'Loading' : 'Not Loading'}
//       </div>
//       <div data-testid="user">
//         {user ? user.name : 'No User'}
//       </div>
//       <button
//         onClick={() =>
//           signIn('test@test.com', 'password')
//         }
//       >
//         Sign In
//       </button>
//       <button
//         onClick={() =>
//           signUp(
//             'test@test.com',
//             'password',
//             'Test User'
//           )
//         }
//       >
//         Sign Up
//       </button>
//       <button onClick={signOut}>Sign Out</button>
//     </div>
//   );
// };

// describe('AuthContext', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should render with initial loading state', () => {
//     render(
//       <AuthProvider>
//         <TestComponent />
//       </AuthProvider>
//     );

//     expect(
//       screen.getByTestId('loading')
//     ).toHaveTextContent('Loading');
//     expect(
//       screen.getByTestId('user')
//     ).toHaveTextContent('No User');
//   });

//   it('should handle sign in', async () => {
//     const mockSignIn = supabase.auth
//       .signInWithPassword as jest.Mock;
//     mockSignIn.mockResolvedValue({ error: null });

//     render(
//       <AuthProvider>
//         <TestComponent />
//       </AuthProvider>
//     );

//     const signInButton =
//       screen.getByText('Sign In');
//     fireEvent.click(signInButton);

//     await waitFor(() => {
//       expect(mockSignIn).toHaveBeenCalledWith({
//         email: 'test@test.com',
//         password: 'password',
//       });
//     });
//   });

//   it('should handle sign up', async () => {
//     const mockSignUp = supabase.auth
//       .signUp as jest.Mock;
//     mockSignUp.mockResolvedValue({ error: null });

//     render(
//       <AuthProvider>
//         <TestComponent />
//       </AuthProvider>
//     );

//     const signUpButton =
//       screen.getByText('Sign Up');
//     fireEvent.click(signUpButton);

//     await waitFor(() => {
//       expect(mockSignUp).toHaveBeenCalledWith({
//         email: 'test@test.com',
//         password: 'password',
//         options: {
//           data: {
//             name: 'Test User',
//           },
//         },
//       });
//     });
//   });

//   it('should handle sign out', async () => {
//     const mockSignOut = supabase.auth
//       .signOut as jest.Mock;
//     mockSignOut.mockResolvedValue({
//       error: null,
//     });

//     render(
//       <AuthProvider>
//         <TestComponent />
//       </AuthProvider>
//     );

//     const signOutButton =
//       screen.getByText('Sign Out');
//     fireEvent.click(signOutButton);

//     await waitFor(() => {
//       expect(mockSignOut).toHaveBeenCalled();
//     });
//   });
// });
