import { render, screen } from '@testing-library/react';
import App from '../src/App.jsx';
import { beforeEach, describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('App', () => {
    let container;

    beforeEach(() => {
        container = render(<App />).container;
    });

    test('button to pdfs page works', async () => {
        const user = userEvent.setup();
        const button = screen.getByRole('button', {name: /pdfs/i});
        const room = container.querySelector('[data-room-id=\'A346\']');

        expect(room).toBeInTheDocument();

        await user.click(button);

        expect(room).not.toBeInTheDocument();
    });
});