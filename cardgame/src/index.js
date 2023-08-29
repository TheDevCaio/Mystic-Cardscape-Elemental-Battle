import React from 'react';
import { createRoot } from 'react-dom/client';
import Game from '../src/components/Game/Game'

const root = createRoot(document.getElementById('root'));
root.render(<Game />);