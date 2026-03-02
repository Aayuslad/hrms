import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import router from './config/router-config';
import { queryClient } from './lib/query-client';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            {/* <ReactQueryDevtools /> */}
            <Toaster position="bottom-right" />
        </QueryClientProvider>
    );
}

export default App;
