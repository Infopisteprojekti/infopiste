import { render, screen } from '@testing-library/react';
import Floorplan from '../src/Floorplan';
import '../src/css/Floorplan.css';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('Floorplan', () => {
    let container;

    beforeEach(() => {
        container = render(<Floorplan />).container;
    });

    test('floorplan is rendered correctly', () => {
        const room = container.querySelector('[data-room-id=\'A346\']');
        expect(room).toBeInTheDocument();
    });

    test('room status is shown when room is clicked', async () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });
        const user = userEvent.setup();

        const room = container.querySelector('[data-room-id=\'A346\']');

        await user.click(room);

        expect(alertMock).toBeCalled();
        alertMock.mockRestore();
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
