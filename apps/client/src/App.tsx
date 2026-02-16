import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { queryClient } from './lib/query-client';
import router from './config/router-config';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster position="bottom-right" />
        </QueryClientProvider>
    );
}

export default App;
