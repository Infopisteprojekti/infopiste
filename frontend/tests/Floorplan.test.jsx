import { render } from '@testing-library/react';
import Floorplan from '../src/components/Floorplan';
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
});
